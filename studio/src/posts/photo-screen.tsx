import photoScreens from "../../../assets/posts/photo-screens.json";
import { assetUrl, screenUrl } from "./library";
import type { ImageLayer, ScreenLayer } from "./model";

type Meta = { size: [number, number]; quad: [number, number][]; radius: number; mask: string; v?: number };

const META = photoScreens as unknown as Record<string, Meta>;

export const SCREEN_PHOTOS = Object.keys(META);

export function photoHasScreen(src: string): boolean {
  return src in META;
}

const SW = 1206;
const SH = 2622;

function adj(m: number[]) {
  return [
    m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3],
  ];
}

function mul(a: number[], b: number[]) {
  const c = Array(9).fill(0);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) c[3 * i + j] += a[3 * i + k] * b[3 * k + j];
  return c;
}

function mulv(m: number[], v: number[]) {
  return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
}

function basis(p: [number, number][]) {
  const m = [p[0][0], p[1][0], p[2][0], p[0][1], p[1][1], p[2][1], 1, 1, 1];
  const v = mulv(adj(m), [p[3][0], p[3][1], 1]);
  return mul(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
}

function matrix3d(from: [number, number][], to: [number, number][]) {
  const t = mul(basis(to), adj(basis(from)));
  const n = t.map((x) => x / t[8]);
  return `matrix3d(${[n[0], n[3], 0, n[6], n[1], n[4], 0, n[7], 0, 0, 1, 0, n[2], n[5], 0, n[8]].join(",")})`;
}

function percent(position: string | undefined): [number, number] {
  const parts = (position ?? "50% 50%").trim().split(/\s+/);
  const read = (v: string | undefined) => (v && v.endsWith("%") ? parseFloat(v) / 100 : 0.5);
  return [read(parts[0]), read(parts[1] ?? parts[0])];
}

export function PhotoScreen({
  layer,
  photo,
  box,
}: {
  layer: ScreenLayer;
  photo: ImageLayer;
  box: { x: number; y: number; w: number; h: number; rotate?: number };
}) {
  const meta = META[photo.src];
  const src = screenUrl(layer.screen);
  if (!meta || !src) return null;
  const [iw, ih] = meta.size;
  const s = Math.max(box.w / iw, box.h / ih);
  const [px, py] = percent(photo.position);
  const dx = (box.w - iw * s) * px;
  const dy = (box.h - ih * s) * py;
  const quad = meta.quad.map(([x, y]) => [dx + x * s, dy + y * s] as [number, number]);
  const transform = matrix3d(
    [
      [0, 0],
      [SW, 0],
      [SW, SH],
      [0, SH],
    ],
    quad,
  );
  const mask = `url("${assetUrl(meta.mask)}${meta.v ? `?v=${meta.v}` : ""}")`;
  const maskPosition = `${dx}px ${dy}px`;
  const maskSize = `${iw * s}px ${ih * s}px`;
  return (
    <div
      className="pointer-events-none absolute overflow-hidden"
      style={{
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        rotate: box.rotate ? `${box.rotate}deg` : undefined,
        transformOrigin: "0 0",
        opacity: layer.opacity,
        maskImage: mask,
        WebkitMaskImage: mask,
        maskSize,
        WebkitMaskSize: maskSize,
        maskPosition,
        WebkitMaskPosition: maskPosition,
        maskRepeat: "no-repeat",
        maskMode: "alpha",
        WebkitMaskRepeat: "no-repeat",
      }}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className="absolute top-0 left-0 block max-w-none"
        style={{ width: SW, height: SH, transformOrigin: "0 0", transform }}
      />
    </div>
  );
}

export function quadBounds(photo: ImageLayer, box: { x: number; y: number; w: number; h: number }) {
  const meta = META[photo.src];
  if (!meta) return null;
  const [iw, ih] = meta.size;
  const s = Math.max(box.w / iw, box.h / ih);
  const [px, py] = percent(photo.position);
  const dx = (box.w - iw * s) * px;
  const dy = (box.h - ih * s) * py;
  const xs = meta.quad.map(([x]) => box.x + dx + x * s);
  const ys = meta.quad.map(([, y]) => box.y + dy + y * s);
  return { left: Math.min(...xs), top: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
}
