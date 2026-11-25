import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { transformSync } from "esbuild";
import puppeteer from "puppeteer-core";
import { findChrome } from "../../tools/chrome.mjs";

const root = fileURLToPath(new URL("../..", import.meta.url));
const PAPER = "https://app.paper.design/file-assets/";
const PAPER_DIR = "assets/posts/paper";

const KNOWN = {
  "3KMVCKRXWA1NGEPFGHAH7J41CR": "assets/posts/ui-photos/maos-inicio.jpg",
  "4CCMH86631VSZM8F9T7E85JNQQ": "assets/posts/ui-photos/mao-pos-consulta.jpg",
  "5D6A7Q98A6CE4BBPPQ3JMGX2XG": "assets/posts/ui-photos/maos-idosas-receita.jpg",
  "2RXYH8KN1VHR2Y0XYAY7Y87XKD": "assets/posts/ui-photos/jovem-viva.jpg",
  "6FK8JZ1ESPY5Y9F8KDV0HXWPD4": "assets/posts/ui-photos/medica-perfil.jpg",
  "20CCXBVV4FRTCXHPXJAM20E7PH": "assets/posts/ui-photos/noite-fila.jpg",
  "14KDQ8BJ4FR84NSWV63M00F6M1": "assets/posts/ui-photos/rua-analise.jpg",
  "01M7KFBC6GXFK0E04KNE68CC9W": "assets/posts/photos/retrato-01.jpg",
  "01M7KFBC6XE6KS5410TPCB3P8M": "assets/posts/photos/retrato-02.jpg",
  "01M7KFBC708RTYY87K4WESAV7M": "assets/posts/photos/retrato-03.jpg",
  "01M7KFBC71SJJZ0QRGH1CQQTNK": "assets/posts/photos/retrato-04.jpg",
  "01M7KPPAPDCYJ3YSKZDCYRK5G7": "assets/posts/photos/maos-01.jpg",
  "01M7KPPAPERFHVWYQEX5YVJDN3": "assets/posts/photos/maos-02.jpg",
  "01M7KPPAPEVPFA6ZZYB34YF6EN": "assets/posts/photos/maos-03.jpg",
  "01M7KPPAPFPMQJZCFVV7AWNC6T": "assets/posts/photos/maos-04.jpg",
  "01M7KPPAPFTS0S8KA0YBQ2ZTN3": "assets/posts/photos/maos-05.jpg",
  "01M7KPPAPFAJ4V867GBQC7FJVW": "assets/posts/photos/maos-06.jpg",
  "01M7KPPAPFWM576R7KMAFNF4G4": "assets/posts/photos/maos-07.jpg",
  "01M7KPPAPGBFD6XH773ACW5P1C": "assets/posts/photos/maos-08.jpg",
  "015K5RD5DGKZD1KH53BTPJGDZJ": "assets/posts/photos/sofa-plantao.webp",
  "4C9FH7226QBRYS8WSAQ485ZHG5": "assets/posts/photos/story-fila.webp",
  "1F9BGW9ET6BMG8E8MSFH9SWNDR": "assets/posts/photos/avatar-julia.webp",
  "0FBVCM0AWTPM69EHG1929P478M": "assets/posts/patterns/cruzes.svg",
};

const UNITLESS = new Set(["opacity", "fontWeight", "zIndex", "flexGrow", "flexShrink", "lineHeight", "order"]);
const DROP = new Set(["boxSizing", "fontSynthesis", "MozOsxFontSmoothing", "WebkitFontSmoothing", "overflowWrap"]);

function cssValue(key, value) {
  return typeof value === "number" && !UNITLESS.has(key) ? `${value}px` : String(value);
}

function kebab(key) {
  return key.replace(/^(Webkit|Moz)/, (m) => `-${m.toLowerCase()}`).replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function toCss(style = {}) {
  return Object.entries(style)
    .map(([k, v]) => `${kebab(k)}:${cssValue(k, v)}`)
    .join(";");
}

const SVG_CAMEL = new Set([
  "viewBox",
  "preserveAspectRatio",
  "gradientUnits",
  "gradientTransform",
  "patternUnits",
  "patternContentUnits",
  "patternTransform",
  "stdDeviation",
  "clipPathUnits",
  "maskUnits",
  "maskContentUnits",
  "filterUnits",
  "primitiveUnits",
  "spreadMethod",
  "textLength",
  "lengthAdjust",
  "markerWidth",
  "markerHeight",
  "refX",
  "refY",
]);

function h(type, props, ...children) {
  return { type, props: props ?? {}, children: children.flat(Infinity).filter((c) => c !== null && c !== undefined && c !== false) };
}

function parseJsx(source) {
  const body = source.trim().replace(/^\(/, "").replace(/\)\s*;?\s*$/, "");
  const { code } = transformSync(`const __root = (${body});`, { loader: "jsx", jsxFactory: "h", jsxFragment: "F" });
  return new Function("h", "F", `${code}\nreturn __root;`)(h, "fragment");
}

function serialize(node) {
  if (typeof node === "string" || typeof node === "number") return String(node).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const { style, id, children: _c, ...attrs } = node.props;
  const attrText = Object.entries(attrs)
    .map(([k, v]) => {
      const name = k === "className" ? "class" : SVG_CAMEL.has(k) ? k : k === "xlinkHref" ? "xlink:href" : k === "xmlnsXlink" ? "xmlns:xlink" : k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      return `${name}="${String(v).replace(/"/g, "&quot;")}"`;
    })
    .join(" ");
  const styleText = style ? ` style="${toCss(style).replace(/"/g, "'")}"` : "";
  const idText = id ? ` data-pid="${id}"` : "";
  if (node.type === "br") return "<br>";
  const svgAttrs = node.type === "svg" && !attrs.xmlns ? ' xmlns="http://www.w3.org/2000/svg"' : "";
  return `<${node.type}${svgAttrs}${attrText ? ` ${attrText}` : ""}${styleText}${idText}>${node.children.map(serialize).join("")}</${node.type}>`;
}

function svgMarkup(node) {
  const clean = structuredClone(node);
  const strip = (n) => {
    if (typeof n !== "object") return;
    delete n.props.id;
    if (n.type === "svg" && n.props.style) {
      const { position, left, top, display, flexShrink, opacity, rotate, transformOrigin, ...rest } = n.props.style;
      n.props.style = Object.keys(rest).length ? rest : undefined;
    }
    n.children.forEach(strip);
  };
  strip(clean);
  return serialize(clean).replace(/ style="([^"]*)"/g, (m, css) => (css ? m : ""));
}

const downloads = new Map();

function localAsset(url) {
  if (!url.startsWith(PAPER)) return url;
  const file = url.slice(PAPER.length).split("/").pop();
  const [asset, ext] = file.split(".");
  if (KNOWN[asset]) return KNOWN[asset];
  if (downloads.has(asset)) return downloads.get(asset);
  mkdirSync(join(root, PAPER_DIR), { recursive: true });
  const tmp = join(root, PAPER_DIR, `${asset}.${ext}`);
  if (!existsSync(tmp)) execFileSync("curl", ["-sSf", "-o", tmp, url]);
  let path = `${PAPER_DIR}/${asset}.${ext}`;
  if (ext === "png" && statSync(tmp).size > 300_000) {
    const jpg = join(root, PAPER_DIR, `${asset}.jpg`);
    const hasAlpha = execFileSync("sips", ["-g", "hasAlpha", tmp]).toString().includes("yes");
    if (!hasAlpha) {
      execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "86", tmp, "--out", jpg]);
      path = `${PAPER_DIR}/${asset}.jpg`;
    }
  }
  downloads.set(asset, path);
  return path;
}

function rewriteUrls(style) {
  if (!style) return style;
  const out = {};
  for (const [k, v] of Object.entries(style)) {
    out[k] = typeof v === "string" ? v.replace(/url\((https:[^)]+)\)/g, (_m, u) => `url(${localAsset(u)})`) : v;
  }
  return out;
}

function onlyUrl(bg) {
  const m = /^url\((https:[^)]+)\)$/.exec(bg ?? "");
  return m ? m[1] : null;
}

function isTextNode(node) {
  return node.type === "div" && node.children.length > 0 && node.children.every((c) => typeof c === "string" || typeof c === "number" || c.type === "br" || (c.type === "span" && c.children.every((g) => typeof g === "string" || g.type === "br")));
}

function plain(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (node.type === "br") return "\n";
  return node.children.map(plain).join("");
}

function fontOf(family = "") {
  if (/Space Grotesk/i.test(family)) return "display";
  if (/Mono/i.test(family)) return "mono";
  return "body";
}

function px(v) {
  if (v === undefined) return undefined;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : undefined;
}

function em(v) {
  if (v === undefined) return undefined;
  const s = String(v);
  const n = parseFloat(s);
  if (!Number.isFinite(n)) return undefined;
  return s.endsWith("px") ? undefined : n;
}

function hasPhone(node) {
  if (typeof node !== "object") return null;
  const bg = node.props.style?.backgroundImage ?? "";
  if (bg.includes("#3A3746")) return node;
  for (const c of node.children) {
    const hit = hasPhone(c);
    if (hit) return hit;
  }
  return null;
}

function hasText(node) {
  if (typeof node !== "object") return false;
  if (isTextNode(node)) return true;
  return node.children.some(hasText);
}

function phoneImage(phone) {
  let found = null;
  const visit = (n) => {
    if (typeof n !== "object" || found) return;
    const url = onlyUrl(n.props.style?.backgroundImage);
    if (url) found = url;
    n.children.forEach(visit);
  };
  visit(phone);
  return found;
}

let counter = 0;
const nextId = () => `p${(counter++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;

const POSITION_KEYS = new Set(["position", "left", "top", "right", "bottom", "rotate", "transformOrigin"]);

function restStyle(style = {}, drop = []) {
  const out = {};
  for (const [k, v] of Object.entries(style)) {
    if (DROP.has(k) || drop.includes(k)) continue;
    out[k] = v;
  }
  return Object.keys(out).length ? rewriteUrls(out) : undefined;
}

const TEXT_KEYS = ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color", "textAlign", "whiteSpace"];

function textLayer(node, names, base) {
  const s = node.props.style ?? {};
  const runs = node.children.some((c) => typeof c === "object" && c.type === "span")
    ? node.children.map((c) => (typeof c === "object" && c.type === "span" ? { text: plain(c), style: restStyle(c.props.style) } : { text: plain(c) }))
    : undefined;
  return {
    ...base,
    type: "text",
    name: names[node.props.id] ?? base.name ?? "Texto",
    text: plain(node),
    ...(runs ? { runs } : {}),
    font: fontOf(s.fontFamily),
    size: px(s.fontSize) ?? 16,
    ...(s.fontWeight ? { weight: Number(s.fontWeight) } : {}),
    color: s.color ?? "#17151E",
    ...(px(s.lineHeight) ? { leading: px(s.lineHeight) } : {}),
    ...(em(s.letterSpacing) !== undefined ? { tracking: em(s.letterSpacing) } : { tracking: 0 }),
    ...(s.textAlign ? { align: s.textAlign } : {}),
  };
}

function nested(node, names) {
  if (typeof node !== "object") return null;
  const s = node.props.style ?? {};
  const name = names[node.props.id];
  const base = { id: nextId(), x: 0, y: 0 };
  if (node.type === "svg") return { ...base, type: "svg", name: name ?? "Vetor", markup: svgMarkup(node), style: restStyle(s, []) , w: px(node.props.width), h: px(node.props.height) };
  if (isTextNode(node)) return { ...textLayer(node, names, base), style: restStyle(s, TEXT_KEYS) };
  if (!node.children.length) {
    const url = onlyUrl(s.backgroundImage);
    const w = px(s.width);
    const hgt = px(s.height);
    if (url && !s.backgroundColor && w && hgt && hgt <= 48 && w / hgt > 3.5 && w / hgt < 6.5 && s.backgroundSize === "contain") {
      return { ...base, type: "logo", name: name ?? "Logo", variant: "lockupColor", h: hgt, style: restStyle(s, ["backgroundImage", "backgroundSize", "backgroundPosition", "backgroundRepeat", "width"]) };
    }
    if (url && !s.backgroundColor) {
      return {
        ...base,
        type: "image",
        name: name ?? "Imagem",
        src: localAsset(url),
        fit: s.backgroundSize === "contain" ? "contain" : "cover",
        position: s.backgroundPosition,
        style: restStyle(s, ["backgroundImage", "backgroundSize", "backgroundPosition", "backgroundRepeat"]),
      };
    }
    return { ...base, type: "rect", name: name ?? "Forma", style: restStyle(s) };
  }
  return { ...base, type: "group", name: name ?? "Grupo", style: restStyle(s), children: node.children.map((c) => nested(c, names)).filter(Boolean) };
}

function topLevel(node, box, frame, names, isLight) {
  const s = node.props.style ?? {};
  const name = names[node.props.id];
  const full = Math.abs(box.x) < 1 && Math.abs(box.y) < 1 && Math.abs(box.w - frame.width) < 2 && Math.abs(box.h - frame.height) < 2;
  const cy = (box.y + box.h / 2) / frame.height;
  const anchor = cy < 0.42 ? "top" : cy > 0.62 ? "bottom" : "center";
  const base = {
    id: nextId(),
    x: Math.round(box.x),
    y: Math.round(box.y),
    ...(px(s.rotate) ? { rotate: px(s.rotate) } : {}),
    ...(s.opacity !== undefined && Number(s.opacity) !== 1 ? { opacity: Number(s.opacity) } : {}),
    ...(full ? { fill: true } : { anchor }),
  };
  const drop = [...POSITION_KEYS, "opacity"];

  if (node.type === "svg") {
    return { ...base, type: "svg", name: name ?? "Vetor", markup: svgMarkup(node), w: Math.round(box.w), h: Math.round(box.h) };
  }

  const phone = hasPhone(node);
  if (phone && !hasText(node)) {
    const url = phoneImage(phone);
    return {
      ...base,
      type: "phone",
      name: name ?? "Celular",
      slot: "Tela",
      screen: "",
      ...(url ? { image: localAsset(url) } : {}),
      w: Math.round(px(phone.props.style?.width) ?? box.w),
    };
  }

  if (isTextNode(node)) {
    return { ...textLayer(node, names, { ...base, w: Math.ceil(box.w) + 2 }), slot: name ?? "Texto", style: restStyle(s, [...drop, ...TEXT_KEYS, "width", "height"]) };
  }

  if (!node.children.length) {
    const url = onlyUrl(s.backgroundImage);
    const w = Math.round(box.w);
    const hgt = Math.round(box.h);
    if (url && !s.backgroundColor) {
      const ratio = w / Math.max(hgt, 1);
      if (hgt <= 48 && ratio > 3.5 && ratio < 6.5 && s.backgroundSize === "contain") {
        return { ...base, type: "logo", name: name ?? "Logo", variant: isLight ? "lockupColor" : "lockupWhite", h: hgt };
      }
      return {
        ...base,
        type: "image",
        name: name ?? "Imagem",
        ...(full && !url.endsWith(".svg") ? { slot: "Foto" } : {}),
        src: localAsset(url),
        fit: s.backgroundSize === "contain" ? "contain" : "cover",
        position: s.backgroundPosition ?? "50% 50%",
        w,
        h: hgt,
        style: restStyle(s, [...drop, "backgroundImage", "backgroundSize", "backgroundPosition", "backgroundRepeat", "width", "height"]),
      };
    }
    return { ...base, type: "rect", name: name ?? "Forma", w, h: hgt, style: restStyle(s, [...drop, "width", "height"]) };
  }

  return {
    ...base,
    type: "group",
    name: name ?? "Grupo",
    ...(s.width ? { w: Math.round(box.w) } : {}),
    ...(s.height ? { h: Math.round(box.h) } : {}),
    style: restStyle(s, [...drop, "width", "height"]),
    children: node.children.map((c) => nested(c, names)).filter(Boolean),
  };
}

function parseNames(text) {
  const names = {};
  for (const m of text.matchAll(/(?:Frame|Text|SVG|Image|Rectangle|Ellipse|Group)\s+"([^"]+)"\s+\(([A-Z0-9]+-\d+)\)/g)) names[m[2]] = m[1];
  return names;
}

function luminance(color = "") {
  const m = /#([0-9a-f]{6})/i.exec(color);
  if (!m) return 0;
  const n = parseInt(m[1], 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
}

async function measure(browser, tree, width, height) {
  const page = await browser.newPage();
  await page.setViewport({ width: Math.max(width, 400), height: Math.max(height, 400) });
  const fonts = ["DMSans-Regular:400", "DMSans-Medium:500", "DMSans-Bold:700"].map((f) => {
    const [file, w] = f.split(":");
    return `@font-face{font-family:"DM Sans";font-weight:${w};src:url("file://${root}brand/fonts/${file}.ttf")}`;
  });
  fonts.push(`@font-face{font-family:"Space Grotesk";font-weight:400 500;src:url("file://${root}brand/fonts/SpaceGrotesk-Medium.ttf")}`);
  fonts.push(`@font-face{font-family:"Space Grotesk";font-weight:600 700;src:url("file://${root}brand/fonts/SpaceGrotesk-Bold.ttf")}`);
  const html = `<!doctype html><html><head><style>${fonts.join("")}body{margin:0}</style></head><body>${serialize(tree)}</body></html>`;
  const file = join(root, ".cache", `paper-measure-${process.pid}.html`);
  mkdirSync(join(root, ".cache"), { recursive: true });
  writeFileSync(file, html);
  await page.goto(`file://${file}`);
  await page.evaluate(() => document.fonts.ready);
  const boxes = await page.evaluate(() => {
    const rootEl = document.body.firstElementChild;
    const origin = rootEl.getBoundingClientRect();
    return [...rootEl.children].map((el) => {
      if (!(el instanceof SVGElement)) return { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
      const saved = el.style.rotate;
      el.style.rotate = "none";
      const r = el.getBoundingClientRect();
      el.style.rotate = saved;
      return { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height };
    });
  });
  await page.close();
  return boxes;
}

export async function importFrame(browser, jsx, namesText = "") {
  const tree = parseJsx(jsx);
  const names = parseNames(namesText);
  const s = tree.props.style ?? {};
  const width = px(s.width) ?? 1080;
  const height = px(s.height) ?? 1350;
  const boxes = await measure(browser, tree, width, height);
  const isLight = luminance(s.backgroundColor) > 0.6 || (!s.backgroundColor && onlyUrl(s.backgroundImage) !== null);
  const layers = [];
  const rootUrl = onlyUrl(s.backgroundImage);
  if (rootUrl) {
    layers.push({
      id: nextId(),
      type: "image",
      name: "Foto",
      slot: "Foto",
      fill: true,
      x: 0,
      y: 0,
      src: localAsset(rootUrl),
      fit: "cover",
      position: s.backgroundPosition ?? "50% 50%",
    });
  }
  tree.children.forEach((child, i) => {
    if (typeof child === "object") layers.push(topLevel(child, boxes[i], { width, height }, names, isLight));
  });
  const background = s.backgroundColor ?? (rootUrl ? "#0D0C12" : s.backgroundImage && !rootUrl ? rewriteUrls({ b: s.backgroundImage }).b : "#FFFFFF");
  return { width, height, background, layers, name: names[tree.props.id] };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      id: { type: "string" },
      name: { type: "string" },
      kind: { type: "string", default: "post" },
      format: { type: "string" },
      names: { type: "string" },
      family: { type: "string" },
      source: { type: "string" },
    },
  });
  if (!values.id || !positionals.length) {
    console.error("uso: node studio/scripts/paper-import.mjs --id <id> --name <nome> --kind post|sequence|cover --format <fmt> [--names tree.txt] frame1.jsx[:Nome] frame2.jsx[:Nome] ...");
    process.exit(1);
  }
  const namesText = values.names ? readFileSync(values.names, "utf8") : "";
  const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true, args: ["--disable-gpu-vsync", "--disable-frame-rate-limit", "--allow-file-access-from-files"] });
  const frames = [];
  let size;
  for (const arg of positionals) {
    const [file, label] = arg.split(":");
    const f = await importFrame(browser, readFileSync(file, "utf8"), namesText);
    size ??= { width: f.width, height: f.height };
    frames.push({ id: nextId(), name: label ?? f.name ?? `Tela ${frames.length + 1}`, background: f.background, layers: f.layers });
  }
  await browser.close();
  const format = values.format ?? (size.height > 1600 ? "story" : size.width > size.height * 2 ? "panorama" : size.width === size.height ? "square" : "feed");
  const doc = {
    id: values.id,
    name: values.name ?? values.id,
    kind: values.kind,
    format,
    base: size,
    frames,
    ...(values.family ? { family: values.family } : {}),
    ...(values.source ? { source: values.source } : {}),
    updatedAt: new Date().toISOString(),
  };
  mkdirSync(join(root, "posts"), { recursive: true });
  writeFileSync(join(root, "posts", `${values.id}.json`), `${JSON.stringify(doc, null, 2)}\n`);
  console.log(`posts/${values.id}.json · ${frames.length} tela(s) · ${frames.reduce((n, f) => n + f.layers.length, 0)} camadas`);
}
