import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname } from "node:path";

const APP = process.env.APP_URL || "http://localhost:8095";
const root = new URL("../", import.meta.url);
const assetDir = new URL("assets/ui/", root);
mkdirSync(assetDir, { recursive: true });

export const VW = 402;
export const VH = 874;

export async function localize(ref, base = APP) {
  if (!ref || ref.startsWith("data:") || ref.startsWith("#") || ref.startsWith("assets/")) return ref;
  const abs = new URL(ref.replace(/&amp;/g, "&"), base);
  const guess = extname(abs.pathname) || (abs.searchParams.get("unstable_path") ? extname(decodeURIComponent(abs.searchParams.get("unstable_path"))) : "") || ".bin";
  const name = `${createHash("sha1").update(abs.href).digest("hex").slice(0, 12)}${guess}`;
  const file = new URL(name, assetDir);
  if (!existsSync(file)) {
    const res = await fetch(abs);
    if (!res.ok) {
      process.stderr.write(`asset miss ${abs.href} ${res.status}\n`);
      return ref;
    }
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return `assets/ui/${name}`;
}

const px = (value, unit) => (unit === "rem" || unit === "em" ? Number(value) * 16 : Number(value));

function mediaMatches(params, vp) {
  const clauses = params.split(/\s+and\s+/i).map((c) => c.trim());
  let known = true;
  const ok = clauses.every((c) => {
    let m;
    if ((m = c.match(/^\(\s*(min|max)-(width|height)\s*:\s*([\d.]+)(px|rem|em)\s*\)$/))) {
      const actual = m[2] === "width" ? vp.width : vp.height;
      const target = px(m[3], m[4]);
      return m[1] === "min" ? actual >= target : actual <= target;
    }
    if ((m = c.match(/^\(\s*(width|height)\s*(>=|<=|<|>)\s*([\d.]+)(px|rem|em)\s*\)$/))) {
      const actual = m[1] === "width" ? vp.width : vp.height;
      const target = px(m[3], m[4]);
      return m[2] === ">=" ? actual >= target : m[2] === "<=" ? actual <= target : m[2] === "<" ? actual < target : actual > target;
    }
    if (/^\(\s*hover\s*:\s*hover\s*\)$/.test(c) || /^\(\s*pointer\s*:\s*fine\s*\)$/.test(c)) return false;
    if (/^\(\s*hover\s*:\s*none\s*\)$/.test(c) || /^\(\s*pointer\s*:\s*coarse\s*\)$/.test(c)) return true;
    if (/^print$/.test(c)) return false;
    if (/^(screen|all)$/.test(c)) return true;
    if (/prefers-color-scheme:\s*dark|prefers-reduced-motion:\s*reduce|forced-colors|prefers-contrast/.test(c)) return false;
    known = false;
    return true;
  });
  return { ok, known };
}

const scopeSelector = (scope) =>
  selectorParser((selectors) => {
    selectors.each((selector) => {
      selector.walkIds((node) => {
        node.replaceWith(selectorParser.attribute({ attribute: "data-id", operator: "=", value: `"${node.value}"`, raws: {} }));
      });
      let rooted = false;
      selector.walk((node) => {
        const isRoot = (node.type === "tag" && node.value.toLowerCase() === "html") || (node.type === "pseudo" && node.value === ":root");
        const isBody = node.type === "tag" && node.value.toLowerCase() === "body";
        if ((isRoot || isBody) && node.parent === selector) {
          const replacement = selectorParser.pseudo({ value: ":where" });
          const inner = selectorParser.selector();
          inner.append(selectorParser.className({ value: isRoot ? scope : `${scope}-body` }));
          replacement.append(inner);
          node.replaceWith(replacement);
          rooted = true;
        }
      });
      if (rooted) return;
      const where = selectorParser.pseudo({ value: ":where" });
      const inner = selectorParser.selector();
      inner.append(selectorParser.className({ value: scope }));
      where.append(inner);
      selector.prepend(selectorParser.combinator({ value: " " }));
      selector.prepend(where);
    });
  });

export async function buildCss({ scope = "vm-ph", out = "vm-ui-phone.css" } = {}) {
  const raw = JSON.parse(readFileSync(new URL("capture/css/raw.json", root), "utf8"));
  const vp = { width: VW, height: VH };
  const parts = [];
  for (const [id, rules] of raw) {
    if (/Reanimated|expo-image-styles/.test(id)) continue;
    const ast = postcss.parse(rules.join("\n"));
    for (let pass = 0; pass < 2; pass++) {
      ast.walkAtRules("media", (rule) => {
        const alternatives = rule.params.split(",").map((p) => mediaMatches(p.trim(), vp));
        if (alternatives.some((a) => !a.known)) return;
        if (alternatives.some((a) => a.ok)) rule.replaceWith(rule.nodes || []);
        else rule.remove();
      });
    }
    ast.walkAtRules("keyframes", (rule) => rule.remove());
    const urls = new Set();
    ast.walkDecls((decl) => {
      if (/^(animation|transition)(-|$)/.test(decl.prop)) {
        decl.remove();
        return;
      }
      decl.value = decl.value
        .replace(/(-?[\d.]+)(?:d|s|l)?vh\b/g, (_, n) => `${(Number(n) * VH) / 100}px`)
        .replace(/(-?[\d.]+)(?:d|s|l)?vw\b/g, (_, n) => `${(Number(n) * VW) / 100}px`);
      for (const m of decl.value.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) urls.add(m[2]);
    });
    const mapped = new Map();
    for (const u of urls) mapped.set(u, await localize(u));
    ast.walkDecls((decl) => {
      decl.value = decl.value.replace(/url\((['"]?)([^'")]+)\1\)/g, (all, _q, u) => (mapped.has(u) ? `url("${mapped.get(u)}")` : all));
    });
    ast.walkAtRules("font-face", (rule) => rule.append({ prop: "font-display", value: "block" }));
    const scoper = scopeSelector(scope);
    ast.walkRules((rule) => {
      let p = rule.parent;
      while (p) {
        if (p.type === "atrule" && /keyframes|font-face|property/.test(p.name)) return;
        p = p.parent;
      }
      rule.selector = scoper.processSync(rule.selector);
    });
    parts.push(`/* ${id} */\n${ast.toString()}`);
  }
  const body = parts.join("\n").replace(/,\s*"(Apple Color Emoji|Segoe UI Emoji|Segoe UI Symbol|Noto Color Emoji|SFMono-Regular)"/g, "");
  const css = `${body}
.${scope}{position:relative;display:block;width:${VW}px;height:${VH}px;overflow:hidden;transform:translateZ(0);text-align:left;background:#fafafe}
.${scope}-body{position:relative;display:flex;flex-direction:column;width:${VW}px;height:${VH}px;margin:0;overflow:hidden}
.${scope} [data-id="root"]{display:flex;flex:1;height:100%}
`;
  writeFileSync(new URL(out, root), css);
  process.stdout.write(`${out} ${(css.length / 1024).toFixed(0)}KB\n`);
}

const SCRUB_STYLE = /(^|;)\s*(animation[\w-]*\s*:[^;]*|transition[\w-]*\s*:[^;]*|visibility\s*:\s*initial)/g;

function stripHidden(html) {
  const re = /<(div|span)\b[^>]*style="[^"]*display:\s*none[^"]*"[^>]*>/g;
  let out = "";
  let i = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m.index < i) continue;
    const tag = m[1];
    const tre = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, "g");
    tre.lastIndex = re.lastIndex;
    let depth = 1;
    let p = re.lastIndex;
    let t;
    while (depth && (t = tre.exec(html))) {
      depth += t[0][1] === "/" ? -1 : 1;
      p = tre.lastIndex;
    }
    out += html.slice(i, m.index);
    i = p;
    re.lastIndex = p;
  }
  return out + html.slice(i);
}

export async function buildState(name, prefix = name) {
  const data = JSON.parse(readFileSync(new URL(`capture/states/${name}.json`, root), "utf8"));
  let html = stripHidden(data.html).replace(/,\s*&quot;(Apple Color Emoji|Segoe UI Emoji|Segoe UI Symbol|Noto Color Emoji|SFMono-Regular)&quot;/g, "");
  const refs = new Set([...html.matchAll(/\ssrc="([^"]+)"/g)].map((m) => m[1]).filter((r) => !r.startsWith("data:")));
  for (const ref of refs) {
    const local = await localize(ref);
    html = html.split(`src="${ref}"`).join(`src="${local}"`);
  }
  const bg = new Set([...html.matchAll(/url\(&quot;([^&]+)&quot;\)/g)].map((m) => m[1]).filter((r) => !r.startsWith("data:")));
  for (const ref of bg) html = html.split(`url(&quot;${ref}&quot;)`).join(`url(&quot;${await localize(ref)}&quot;)`);
  html = html.replace(/\sstyle="([^"]*)"/g, (all, s) => {
    const clean = s.replace(SCRUB_STYLE, "").replace(/^;+/, "").trim();
    return clean ? ` style="${clean}"` : "";
  });
  const refd = new Set([...html.matchAll(/url\((?:&quot;|'|")?#([^)&'"]+)/g), ...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]));
  const pid = (id) => `${prefix}-${id}`.replace(/[^\w-]/g, "_");
  html = html.replace(/\sid="([^"]+)"/g, (_, id) => (refd.has(id) ? ` id="${pid(id)}"` : ` data-id="${id}"`));
  html = html.replace(/url\((&quot;|'|")?#([^)&'"]+)(&quot;|'|")?\)/g, (all, q1, id) => (refd.has(id) ? `url(#${pid(id)})` : all));
  html = html.replace(/href="#([^"]+)"/g, (all, id) => (refd.has(id) ? `href="#${pid(id)}"` : all));
  html = html.replace(/\s(aria-controls|aria-labelledby|aria-describedby|for)="[^"]*"/g, "");
  html = html.replace(/<br\s*\/?>/g, " ");
  html = html.replace(/<img\b[^>]*data-vm-video[^>]*>/g, (tag) => (/src="data:/.test(tag) ? tag : tag.replace(/src="[^"]*"/, 'src="assets/app/plantao-hero.jpg"')));
  html = html.replace(/<(div|span|img|input|textarea)\b/g, "<$1 data-layout-allow-overlap");
  return { ...data, html };
}

if (import.meta.url === `file://${process.argv[1]}`) await buildCss();
