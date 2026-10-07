import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";
import PptxGenJS from "pptxgenjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const native = args.includes("--native");
const name = args.find((a) => !a.startsWith("--")) || "proposta";
const out = name === "index" ? join(root, "export") : join(root, "export", name);
const file = join(out, name === "index" ? "apresentacao-viva-mais.pptx" : `${name}-viva-mais.pptx`);

const FLATTEN = {
  proposta: [".phone"],
  index: [".phone", ".laptop", ".ai-card .ban", ".nr-art", ".dn-chat", ".dn-call", ".dn-files", ".dn-signal", ".dn-case"],
};

const EDIT = {
  proposta: {
    roots: [".p-cover .client", ".pcard .price", ".ctable tr.vida td:not(.lbl)", ".ctable tr.mrr td"],
    lines: [{ sel: ".p-cover .client", badge: ".k", sep: ".sep" }],
  },
};

const FONTS = {
  "Space Grotesk": { 500: "SpaceGrotesk-Medium", 700: "SpaceGrotesk-Bold" },
  "DM Sans": { 400: "DMSans-Regular", 500: "DMSans-Medium", 700: "DMSans-Bold" },
};

function metrics(font) {
  const buf = readFileSync(join(root, "assets/brand/fonts", `${font}.ttf`));
  const tables = {};
  for (let i = 0, n = buf.readUInt16BE(4); i < n; i++) {
    const at = 12 + i * 16;
    tables[buf.toString("ascii", at, at + 4)] = buf.readUInt32BE(at + 8);
  }
  const upm = buf.readUInt16BE(tables.head + 18);
  const asc = buf.readInt16BE(tables.hhea + 4);
  const desc = -buf.readInt16BE(tables.hhea + 6);
  return (asc + desc) / upm;
}

const LINE = {};
for (const [family, weights] of Object.entries(FONTS)) {
  for (const [w, f] of Object.entries(weights)) LINE[`${family}/${w}`] = metrics(f);
}
const lineOf = (family, weight) => {
  const ws = Object.keys(FONTS[family]).map(Number);
  const w = ws.reduce((a, b) => (Math.abs(b - weight) < Math.abs(a - weight) ? b : a));
  return LINE[`${family}/${w}`];
};

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const system = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (existsSync(system)) return system;
  const cache = join(homedir(), ".cache/puppeteer/chrome");
  for (const version of readdirSync(cache).sort().reverse()) {
    const bin = join(cache, version, "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing");
    if (existsSync(bin)) return bin;
  }
  throw new Error("Chrome not found. Set CHROME=/path/to/chrome");
}

const SNAP_CSS = `
html, body { background: transparent !important; }
body.pp-solo, body.pp-solo * { visibility: hidden !important; }
body.pp-solo .pp-on, body.pp-solo .pp-on * { visibility: visible !important; }
body.pp-solo .pp-on.pp-box * { visibility: hidden !important; }
body.pp-solo svg defs, body.pp-solo svg defs * { visibility: visible !important; }
body.pp-flat [data-pp-edit], body.pp-flat [data-pp-edit] * { visibility: hidden !important; }
body.pp-solo .pp-on.pp-box { color: transparent !important; -webkit-text-fill-color: transparent !important; }
`;

function extract(flatten, edit) {
  const cvs = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const cache = new Map();
  const rgba = (c) => {
    if (!c) return null;
    if (cache.has(c)) return cache.get(c);
    cvs.clearRect(0, 0, 1, 1);
    cvs.fillStyle = "rgba(0,0,0,0)";
    cvs.fillStyle = c;
    cvs.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = cvs.getImageData(0, 0, 1, 1).data;
    const v = { r, g, b, a: a / 255 };
    cache.set(c, v);
    return v;
  };
  const px = (v) => parseFloat(v) || 0;
  const REPLACED = new Set(["IMG", "svg", "CANVAS", "VIDEO", "PICTURE", "IFRAME"]);
  const isReplaced = (el) => REPLACED.has(el.tagName);
  const hasPseudo = (el) =>
    ["::before", "::after"].some((p) => {
      const s = getComputedStyle(el, p);
      return s.content !== "none" && s.content !== "normal" && s.display !== "none";
    });
  const complexTransform = (cs) => {
    if (cs.transform === "none") return false;
    const m = cs.transform.match(/matrix\(([^)]+)\)/);
    if (!m) return true;
    const [a, b, c, d] = m[1].split(",").map(Number);
    return Math.abs(a - 1) > 0.001 || Math.abs(b) > 0.001 || Math.abs(c) > 0.001 || Math.abs(d - 1) > 0.001;
  };
  const inter = (a, b) => {
    const x = Math.max(a.x, b.x);
    const y = Math.max(a.y, b.y);
    const r = Math.min(a.x + a.w, b.x + b.w);
    const btm = Math.min(a.y + a.h, b.y + b.h);
    return { x, y, w: Math.max(0, r - x), h: Math.max(0, btm - y) };
  };
  const inside = (a, b) => a.x >= b.x - 0.5 && a.y >= b.y - 0.5 && a.x + a.w <= b.x + b.w + 0.5 && a.y + a.h <= b.y + b.h + 0.5;
  const shadowReach = (cs) => {
    if (cs.boxShadow === "none") return 2;
    let reach = 2;
    for (const part of cs.boxShadow.split(/,(?![^(]*\))/)) {
      const nums = part.replace(/rgba?\([^)]*\)/, "").match(/-?[\d.]+px/g)?.map(parseFloat) || [];
      const [x = 0, y = 0, blur = 0, spread = 0] = nums;
      reach = Math.max(reach, Math.abs(x) + blur + spread, Math.abs(y) + blur + spread);
    }
    return Math.ceil(reach) + 2;
  };
  const shadowOf = (cs) => {
    if (cs.boxShadow === "none" || cs.boxShadow.includes("inset")) return null;
    const first = cs.boxShadow.split(/,(?![^(]*\))/)[0];
    const color = rgba(first.match(/rgba?\([^)]*\)|#[0-9a-f]+/i)?.[0]);
    const nums = first.replace(/rgba?\([^)]*\)/, "").match(/-?[\d.]+px/g)?.map(parseFloat) || [];
    const [x = 0, y = 0, blur = 0] = nums;
    if (!color || color.a === 0) return null;
    return { color, x, y, blur };
  };
  const family = (cs) => (cs.fontFamily.includes("Space Grotesk") ? "Space Grotesk" : "DM Sans");
  const textColor = (cs) => {
    const fill = rgba(cs.webkitTextFillColor);
    if (fill && fill.a > 0) return fill;
    if (cs.backgroundClip === "text" || cs.webkitBackgroundClip === "text") {
      const stop = cs.backgroundImage.match(/rgba?\([^)]*\)/)?.[0];
      if (stop) return rgba(stop);
    }
    return rgba(cs.color);
  };
  const blend = (c, el) => {
    if (c.a >= 0.99) return c;
    for (let p = el; p; p = p.parentElement) {
      const ps = getComputedStyle(p);
      if (ps.backgroundImage !== "none") return c;
      const bg = rgba(ps.backgroundColor);
      if (bg.a >= 0.99) {
        const mix = (k) => Math.round(c[k] * c.a + bg[k] * (1 - c.a));
        return { r: mix("r"), g: mix("g"), b: mix("b"), a: 1 };
      }
      if (bg.a > 0) return c;
    }
    return c;
  };
  const lineHeight = (cs) => (cs.lineHeight === "normal" ? px(cs.fontSize) * 1.3 : px(cs.lineHeight));

  const isTextBlock = (el) => {
    if (!el.textContent.trim()) return false;
    for (const d of el.querySelectorAll("*")) {
      if (d.tagName === "BR") continue;
      if (isReplaced(d) || d.closest("svg")) return false;
      const cs = getComputedStyle(d);
      if (cs.display !== "inline" || hasPseudo(d) || cs.backgroundImage !== "none") return false;
      if (px(cs.paddingLeft) + px(cs.paddingRight) > 6 && rgba(cs.backgroundColor).a > 0) return false;
    }
    return true;
  };

  const runsOf = (nodes, root, opacity) => {
    const runs = [];
    let brk = false;
    const walk = (node) => {
      if (node.nodeType === 3) {
        const el = node.parentElement;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        let text = node.data;
        if (!/pre/.test(cs.whiteSpace)) text = text.replace(/[\t\n\r ]+/g, " ");
        if (!text) return;
        if (cs.textTransform === "uppercase") text = text.toUpperCase();
        if (cs.textTransform === "lowercase") text = text.toLowerCase();
        let op = opacity;
        for (let p = el; p && p !== root; p = p.parentElement) op *= +getComputedStyle(p).opacity;
        const color = blend(textColor(cs), el);
        let hl = null;
        for (let p = el; p && p !== root; p = p.parentElement) {
          const bg = rgba(getComputedStyle(p).backgroundColor);
          if (bg.a > 0) {
            hl = bg;
            break;
          }
        }
        const link = el.closest("a[href]");
        runs.push({
          text,
          family: family(cs),
          weight: +cs.fontWeight,
          italic: cs.fontStyle === "italic",
          size: px(cs.fontSize),
          color: { ...color, a: color.a * op },
          letter: cs.letterSpacing === "normal" ? 0 : px(cs.letterSpacing),
          strike: cs.textDecorationLine.includes("line-through"),
          underline: cs.textDecorationLine.includes("underline"),
          highlight: hl,
          href: link && !link.href.startsWith("file:") ? link.href : null,
          br: brk,
        });
        brk = false;
      } else if (node.nodeType === 1) {
        if (node.tagName === "BR") {
          brk = true;
          return;
        }
        if (getComputedStyle(node).display === "none") return;
        node.childNodes.forEach(walk);
      }
    };
    nodes.forEach(walk);
    let atStart = true;
    for (let i = 0; i < runs.length; i++) {
      if (runs[i].br) atStart = true;
      if (atStart) runs[i].text = runs[i].text.replace(/^ +/, "");
      if (i > 0 && !runs[i].br && runs[i - 1].text.endsWith(" ")) runs[i].text = runs[i].text.replace(/^ +/, "");
      if (runs[i].text) atStart = false;
      const next = runs[i + 1];
      if (!next || next.br) runs[i].text = runs[i].text.replace(/ +$/, "");
    }
    return runs.filter((r) => r.text || r.br);
  };

  const slides = [...document.querySelectorAll(".slide")];
  let uid = 0;
  return slides.map((slide) => {
    const sr = slide.getBoundingClientRect();
    const frame = { x: 0, y: 0, w: sr.width, h: sr.height };
    const rel = (r) => ({ x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height });
    const items = [];
    const snap = (el, mode, r, clip, z, cs) => {
      const id = `pp${uid++}`;
      el.dataset.pp = id;
      const reach = shadowReach(cs);
      const box = inter({ x: r.x - reach, y: r.y - reach, w: r.w + reach * 2, h: r.h + reach * 2 }, clip);
      if (box.w < 1 || box.h < 1) return;
      items.push({ kind: "snap", id, mode, box, z });
    };
    const textItem = (runs, box, align, lh, z, multi) => {
      if (!runs.some((r) => r.text.trim())) return;
      items.push({ kind: "text", runs, box, align, lh, multi, z });
    };

    const lineBox = (node, lh) => {
      const range = document.createRange();
      range.selectNodeContents(node);
      const rects = [...range.getClientRects()].filter((q) => q.width > 0 && q.height > 0).sort((a, b) => a.top - b.top);
      if (!rects.length) return null;
      const lines = [];
      for (const q of rects) {
        const mid = q.top + q.height / 2;
        const line = lines.find((l) => Math.abs(l.mid - mid) < lh / 2);
        if (line) line.rects.push(q);
        else lines.push({ mid, rects: [q] });
      }
      const centre = (l) => {
        const tall = l.rects.reduce((a, b) => (b.height > a.height ? b : a));
        return tall.top + tall.height / 2;
      };
      const left = Math.min(...rects.map((q) => q.left));
      const right = Math.max(...rects.map((q) => q.right));
      const top = centre(lines[0]) - lh / 2;
      const bottom = centre(lines[lines.length - 1]) + lh / 2;
      return { x: left - sr.left, y: top - sr.top, w: right - left, h: bottom - top, lines: lines.length };
    };
    const visit = (el, opacity, clip, z, shallow) => {
      const cs = getComputedStyle(el);
      if (cs.display === "none") return;
      const op = opacity * +cs.opacity;
      if (op < 0.01) return;
      if (z === null && cs.position !== "static" && cs.zIndex !== "auto") z = +cs.zIndex;
      const zz = z ?? 0;
      const r = rel(el.getBoundingClientRect());
      const painted = cs.visibility !== "hidden";

      if (painted && (el.matches(flatten) || isReplaced(el) || complexTransform(cs))) {
        snap(el, "tree", r, clip, zz, cs);
        return;
      }

      if (painted && el !== slide) {
        const radii = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"].map((k) => px(cs[k]));
        const sides = ["Top", "Right", "Bottom", "Left"].map((s) => ({ w: px(cs[`border${s}Width`]), c: rgba(cs[`border${s}Color`]), style: cs[`border${s}Style`] }));
        const visibleSides = sides.filter((s) => s.w > 0 && s.style !== "none" && s.c.a > 0);
        const uniform = visibleSides.length === 4 && visibleSides.every((s) => s.w === sides[0].w && s.c.r === sides[0].c.r && s.c.g === sides[0].c.g && s.c.b === sides[0].c.b);
        const bg = rgba(cs.backgroundColor);
        const complex =
          cs.backgroundImage !== "none" ||
          hasPseudo(el) ||
          cs.filter !== "none" ||
          cs.backdropFilter !== "none" ||
          cs.clipPath !== "none" ||
          (cs.webkitMaskImage && cs.webkitMaskImage !== "none") ||
          new Set(radii).size > 1 ||
          (visibleSides.length && !uniform && new Set(radii).size === 1 && radii[0] > 0);
        const paints = bg.a > 0 || visibleSides.length > 0;
        if (complex || (paints && !inside(r, clip))) {
          snap(el, "box", r, clip, zz, cs);
        } else if (paints) {
          const radius = Math.min(radii[0], r.w / 2, r.h / 2);
          if (bg.a > 0 || uniform) {
            items.push({
              kind: "shape",
              box: r,
              fill: bg.a > 0 ? { ...bg, a: bg.a * op } : null,
              line: uniform ? { w: sides[0].w, c: { ...sides[0].c, a: sides[0].c.a * op } } : null,
              radius,
              shadow: shadowOf(cs),
              z: zz,
            });
          }
          if (!uniform) {
            visibleSides.forEach((s) => {
              const i = sides.indexOf(s);
              const b = [
                { x: r.x, y: r.y, w: r.w, h: s.w },
                { x: r.x + r.w - s.w, y: r.y, w: s.w, h: r.h },
                { x: r.x, y: r.y + r.h - s.w, w: r.w, h: s.w },
                { x: r.x, y: r.y, w: s.w, h: r.h },
              ][i];
              items.push({ kind: "shape", box: b, fill: { ...s.c, a: s.c.a * op }, line: null, radius: 0, shadow: null, z: zz });
            });
          }
        }
      }

      if (shallow) return;
      const childClip = cs.overflow !== "visible" && el !== slide ? inter(clip, r) : clip;

      if (painted && isTextBlock(el) && cs.display !== "inline") {
        const pl = px(cs.paddingLeft) + px(cs.borderLeftWidth);
        const pr = px(cs.paddingRight) + px(cs.borderRightWidth);
        const pt = px(cs.paddingTop) + px(cs.borderTopWidth);
        const pb = px(cs.paddingBottom) + px(cs.borderBottomWidth);
        const lh = lineHeight(cs);
        const tb = lineBox(el, lh);
        if (!tb) return;
        const content = { x: r.x + pl, w: r.w - pl - pr };
        const box = tb.lines > 1 ? { ...content, y: tb.y, h: tb.h } : tb;
        const align = { center: "center", right: "right", end: "right" }[cs.textAlign] || "left";
        textItem(runsOf([...el.childNodes], el, op), box, align, lh, zz, tb.lines > 1);
        return;
      }

      for (const node of el.childNodes) {
        if (node.nodeType === 3 && node.data.trim()) {
          if (!painted) continue;
          const lh = lineHeight(cs);
          const tb = lineBox(node, lh);
          if (!tb) continue;
          textItem(runsOf([node], el, op), tb, "left", lh, zz, tb.lines > 1);
        } else if (node.nodeType === 1) {
          visit(node, op, childClip, z);
        }
      }
    };

    const cs = getComputedStyle(slide);
    const plainBg = cs.backgroundImage === "none" && !hasPseudo(slide);
    slide.dataset.pp = `pp${uid++}`;
    if (!edit) {
      visit(slide, 1, frame, null);
      const bg = plainBg ? { color: rgba(cs.backgroundColor) } : { id: slide.dataset.pp, box: frame };
      return { bg, items, offset: { x: sr.left + scrollX, y: sr.top + scrollY } };
    }
    const found = [...slide.querySelectorAll(edit.roots.join(","))];
    const roots = found.filter((r) => !found.some((o) => o !== r && o.contains(r)));
    for (const root of roots) {
      root.dataset.ppEdit = "";
      const line = edit.lines.find((l) => root.matches(l.sel));
      if (!line) {
        visit(root, 1, frame, null);
        continue;
      }
      visit(root, 1, frame, null, true);
      const badge = root.querySelector(line.badge);
      if (badge) visit(badge, 1, frame, null);
      const parts = [...root.children].filter((c) => c !== badge);
      const runs = [];
      for (const c of parts) {
        if (c.matches(line.sep)) {
          if (runs.length) runs.push({ ...runs[runs.length - 1], text: "  •  ", color: rgba(getComputedStyle(c).backgroundColor), highlight: null, br: false });
        } else {
          runs.push(...runsOf([...c.childNodes], c, 1));
        }
      }
      const first = parts.find((c) => !c.matches(line.sep));
      const lh = lineHeight(getComputedStyle(first));
      const tb = lineBox(first, lh);
      const rr = rel(root.getBoundingClientRect());
      textItem(runs, { ...tb, w: rr.x + rr.w - tb.x }, "left", lh, 0, false);
    }
    const bg = { id: slide.dataset.pp, box: frame, flat: true };
    return { bg, items, offset: { x: sr.left + scrollX, y: sr.top + scrollY } };
  });
}

const hex = (c) => [c.r, c.g, c.b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
const transp = (c) => Math.round((1 - c.a) * 100);
const IN = (v) => v / 144;
const PT = (v) => v * 0.5;

function runOptions(r) {
  const o = {
    fontFace: r.weight >= 450 && r.weight < 650 ? `${r.family} Medium` : r.family,
    fontSize: Math.round(PT(r.size) * 10) / 10,
    bold: r.weight >= 650,
    italic: r.italic,
    color: hex(r.color),
  };
  if (r.color.a < 0.99) o.transparency = transp(r.color);
  if (r.letter) o.charSpacing = Math.round(PT(r.letter) * 100) / 100;
  if (r.strike) o.strike = "sngStrike";
  if (r.underline) o.underline = { style: "sng" };
  if (r.highlight) o.highlight = hex(r.highlight);
  if (r.href) o.hyperlink = { url: r.href };
  if (r.br) o.softBreakBefore = true;
  return o;
}

function addText(slide, it) {
  const first = it.runs.find((r) => r.text.trim()) || it.runs[0];
  const natural = lineOf(first.family, first.weight) * first.size;
  const lh = it.lh;
  const slackW = it.multi ? it.box.w * 0.04 + 6 : it.box.w * 0.12 + 10;
  let x = it.box.x;
  if (it.align === "center") x -= slackW / 2;
  if (it.align === "right") x -= slackW;
  const frame = it.multi
    ? { y: it.box.y - (lh - natural) / 2, h: it.box.h + lh * 0.25, valign: "top", lineSpacingMultiple: Math.round((lh / natural) * 100) / 100 }
    : { y: it.box.y, h: lh, valign: "middle" };
  slide.addText(
    it.runs.map((r) => ({ text: r.text, options: runOptions(r) })),
    {
      ...frame,
      x: IN(x),
      y: IN(frame.y),
      w: IN(it.box.w + slackW),
      h: IN(frame.h),
      margin: 0,
      align: it.align,
      paraSpaceBefore: 0,
      paraSpaceAfter: 0,
      fit: "none",
      wrap: true,
      isTextBox: true,
    },
  );
}

function addShape(pres, slide, it) {
  const lw = it.line ? it.line.w : 0;
  const b = { x: it.box.x + lw / 2, y: it.box.y + lw / 2, w: it.box.w - lw, h: it.box.h - lw };
  const o = {
    x: IN(b.x),
    y: IN(b.y),
    w: IN(Math.max(b.w, 0.5)),
    h: IN(Math.max(b.h, 0.5)),
    fill: it.fill ? { color: hex(it.fill), transparency: transp(it.fill) } : { type: "none" },
    line: it.line ? { color: hex(it.line.c), width: PT(it.line.w), transparency: transp(it.line.c) } : { type: "none" },
  };
  if (it.shadow) {
    o.shadow = {
      type: "outer",
      color: hex(it.shadow.color),
      opacity: Math.round(it.shadow.color.a * 100) / 100,
      blur: Math.round(PT(it.shadow.blur)),
      offset: Math.round(PT(Math.hypot(it.shadow.x, it.shadow.y))),
      angle: Math.round(((Math.atan2(it.shadow.y, it.shadow.x) * 180) / Math.PI + 360) % 360),
    };
  }
  const radius = Math.max(0, it.radius - lw / 2);
  if (radius > 0.5) {
    o.rectRadius = IN(radius);
    slide.addShape(pres.ShapeType.roundRect, o);
  } else {
    slide.addShape(pres.ShapeType.rect, o);
  }
}

const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true, args: ["--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
await page.goto(`${pathToFileURL(join(root, `${name}.html`)).href}?print&modelo`, { waitUntil: "networkidle0" });
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
});
await page.addStyleTag({ content: SNAP_CSS });

const deck = await page.evaluate(extract, FLATTEN[name].join(","), native ? null : EDIT[name] || null);

async function shoot(id, mode, box, offset, jpeg) {
  await page.evaluate(
    (id, mode) => {
      const el = document.querySelector(`[data-pp="${id}"]`);
      if (mode === "flat") return document.body.classList.add("pp-flat");
      document.body.classList.add("pp-solo");
      el.classList.add("pp-on");
      if (mode === "box") el.classList.add("pp-box");
    },
    id,
    mode,
  );
  const buf = await page.screenshot({
    clip: { x: offset.x + box.x, y: offset.y + box.y, width: box.w, height: box.h },
    omitBackground: !jpeg,
    captureBeyondViewport: true,
    type: jpeg ? "jpeg" : "png",
    ...(jpeg ? { quality: 88 } : {}),
  });
  await page.evaluate((id) => {
    document.body.classList.remove("pp-solo", "pp-flat");
    document.querySelector(`[data-pp="${id}"]`).classList.remove("pp-on", "pp-box");
  }, id);
  return `image/${jpeg ? "jpeg" : "png"};base64,${Buffer.from(buf).toString("base64")}`;
}

const pres = new PptxGenJS();
pres.layout = "LAYOUT_WIDE";
pres.title = name === "index" ? "Apresentação Viva Mais" : "Proposta Viva Mais";
pres.company = "Viva Mais";

for (const [n, s] of deck.entries()) {
  const slide = pres.addSlide();
  if (s.bg.color) slide.background = { color: hex(s.bg.color) };
  else slide.background = { data: await shoot(s.bg.id, s.bg.flat ? "flat" : "box", s.bg.box, s.offset, true) };
  const items = s.items.map((it, i) => ({ ...it, i })).sort((a, b) => a.z - b.z || a.i - b.i);
  for (const it of items) {
    if (it.kind === "shape") addShape(pres, slide, it);
    else if (it.kind === "text") addText(slide, it);
    else slide.addImage({ data: await shoot(it.id, it.mode, it.box, s.offset), x: IN(it.box.x), y: IN(it.box.y), w: IN(it.box.w), h: IN(it.box.h) });
  }
  const count = (k) => s.items.filter((it) => it.kind === k).length;
  console.log(`slide ${n + 1}: ${count("text")} text, ${count("shape")} shapes, ${count("snap")} images`);
}

await browser.close();
mkdirSync(out, { recursive: true });
await pres.writeFile({ fileName: file });
console.log(file);
