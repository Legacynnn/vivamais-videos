import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
from scipy.spatial import ConvexHull

ROOT = Path(__file__).resolve().parent.parent
OUT_JSON = ROOT / "assets/posts/photo-screens.json"
MASK_DIR = ROOT / "assets/posts/screens"


def screen_component(rgb):
    mx = rgb.max(axis=2).astype(float)
    mn = rgb.min(axis=2).astype(float)
    sat = (mx - mn) / np.maximum(mx, 1)
    candidate = (mx > 222) & (sat < 0.11)
    candidate = ndimage.binary_opening(candidate, iterations=1)
    labels, n = ndimage.label(candidate)
    best, best_area = None, 0
    for i, sl in enumerate(ndimage.find_objects(labels), start=1):
        h = sl[0].stop - sl[0].start
        w = sl[1].stop - sl[1].start
        comp = labels[sl] == i
        area = comp.sum()
        if w < 30 or h < 60:
            continue
        if sl[0].start == 0 or sl[1].start == 0 or sl[0].stop >= rgb.shape[0] or sl[1].stop >= rgb.shape[1]:
            continue
        if not 1.4 < h / w < 2.8:
            continue
        if area / (w * h) < 0.55:
            continue
        if area > best_area:
            best, best_area = labels == i, area
    if best is None:
        return None
    ref = np.median(rgb[best].astype(float), axis=0)
    close = np.linalg.norm(rgb.astype(float) - ref, axis=2) < 42
    grown, _ = ndimage.label(close)
    keep = np.unique(grown[best])
    return np.isin(grown, keep[keep > 0])


def fit_line(points):
    c = points.mean(axis=0)
    _, _, vt = np.linalg.svd(points - c)
    return c, vt[0]


def intersect(l1, l2):
    (p, d), (q, e) = l1, l2
    a = np.array([d, -e]).T
    t = np.linalg.lstsq(a, q - p, rcond=None)[0]
    return p + t[0] * d


def min_rect(points):
    hull = points[ConvexHull(points).vertices]
    best = None
    for i in range(len(hull)):
        e = hull[(i + 1) % len(hull)] - hull[i]
        u = e / np.linalg.norm(e)
        v = np.array([-u[1], u[0]])
        a, b = hull @ u, hull @ v
        area = (a.max() - a.min()) * (b.max() - b.min())
        if best is None or area < best[0]:
            best = (area, u, v, a.min(), a.max(), b.min(), b.max())
    _, u, v, a0, a1, b0, b1 = best
    rect = np.array([a0 * u + b0 * v, a1 * u + b0 * v, a1 * u + b1 * v, a0 * u + b1 * v])
    c = rect.mean(axis=0)
    order = np.argsort(np.arctan2(rect[:, 1] - c[1], rect[:, 0] - c[0]))
    rect = rect[order]
    start = np.argmin(rect.sum(axis=1))
    return np.roll(rect, -start, axis=0)


def corners(mask, cover):
    filled = ndimage.binary_fill_holes(ndimage.binary_closing(mask, iterations=3))
    edge = filled & ~ndimage.binary_erosion(filled)
    ys, xs = np.nonzero(edge)
    pts = np.stack([xs, ys], axis=1).astype(float)
    rough = list(min_rect(pts))
    size = np.linalg.norm(rough[2] - rough[0])
    lines = []
    for a, b in zip(rough, rough[1:] + rough[:1]):
        d = b - a
        length = np.linalg.norm(d)
        u = d / length
        rel = pts - a
        t = rel @ u
        dist = np.abs(rel @ np.array([-u[1], u[0]]))
        sel = pts[(t > 0.2 * length) & (t < 0.8 * length) & (dist < 0.02 * size)]
        lines.append(fit_line(sel) if len(sel) > 10 else (a, u))
    center = pts.mean(axis=0)
    cy, cx = np.nonzero(cover)
    cover_pts = np.stack([cx, cy], axis=1).astype(float)
    pushed = []
    for c, u in lines:
        n = np.array([-u[1], u[0]])
        if (center - c) @ n > 0:
            n = -n
        reach = (cover_pts - c) @ n
        pushed.append((c + n * (reach.max() + 1.0), u))
    lines = pushed
    quad = [intersect(lines[i - 1], lines[i]) for i in range(4)]
    near = [pts[np.argmin(np.linalg.norm(pts - q, axis=1))] for q in quad]
    radius = float(np.mean([np.linalg.norm(quad[i] - near[i]) for i in range(4)]) * 2.4)
    return np.array(quad), radius


def uncovered(mask, quad):
    h, w = mask.shape
    poly = Image.new("L", (w, h), 0)
    ImageDraw.Draw(poly).polygon([tuple(p) for p in quad], fill=255)
    inside = np.asarray(poly) > 0
    return int((mask & ~inside).sum())


def main(paths):
    data = json.loads(OUT_JSON.read_text()) if OUT_JSON.exists() else {}
    MASK_DIR.mkdir(parents=True, exist_ok=True)
    for rel in paths:
        img = Image.open(ROOT / rel).convert("RGB")
        rgb = np.asarray(img)
        mask = screen_component(rgb)
        if mask is None:
            print(f"{rel}: nenhuma tela encontrada")
            continue
        grown = ndimage.binary_dilation(mask, iterations=3)
        quad, radius = corners(mask, grown)
        leak = uncovered(grown, quad)
        if leak:
            raise SystemExit(f"{rel}: {leak} pixels da tela ficariam fora da projeção")
        alpha = Image.fromarray((grown * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
        mask_img = Image.new("RGBA", alpha.size, (255, 255, 255, 0))
        mask_img.putalpha(alpha)
        mask_path = MASK_DIR / f"{Path(rel).stem}.png"
        mask_img.save(mask_path, optimize=True)
        data[rel] = {
            "size": [img.width, img.height],
            "quad": [[round(float(x), 1), round(float(y), 1)] for x, y in quad],
            "radius": round(radius, 1),
            "mask": str(mask_path.relative_to(ROOT)),
            "v": int(mask_path.stat().st_mtime),
        }
        preview = img.copy()
        ImageDraw.Draw(preview).polygon([tuple(p) for p in quad], outline=(255, 0, 80), width=3)
        if len(sys.argv) > 1 and sys.argv[1] == "--preview":
            preview.save(ROOT / ".cache" / f"screen-{Path(rel).stem}.jpg")
        print(f"{rel}: {data[rel]['quad']} r={data[rel]['radius']}")
    OUT_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    main(args or [str(p.relative_to(ROOT)) for p in sorted((ROOT / "assets/posts/photos").glob("maos-*.jpg"))])
