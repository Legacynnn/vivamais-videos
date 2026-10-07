import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname } from "node:path";

const APP = process.env.APP_URL || "http://127.0.0.1:3457";
const root = new URL("../", import.meta.url);
const assetDir = new URL("assets/ui/", root);
mkdirSync(assetDir, { recursive: true });

export async function localize(ref, base = APP) {
  if (!ref || ref.startsWith("data:") || ref.startsWith("#")) return ref;
  let abs = new URL(ref, base);
  if (abs.pathname === "/_next/image") abs = new URL(abs.searchParams.get("url"), APP);
  const ext = extname(abs.pathname) || ".bin";
  const name = `${createHash("sha1").update(abs.href).digest("hex").slice(0, 12)}${ext}`;
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
    if ((m = c.match(/^\(\s*(width|height)\s*(>=|<=|<|>)\s*([\d.]+)(px|rem|em)\s*\)$/))) {
      const actual = m[1] === "width" ? vp.width : vp.height;
      const target = px(m[3], m[4]);
      return m[2] === ">=" ? actual >= target : m[2] === "<=" ? actual <= target : m[2] === "<" ? actual < target : actual > target;
    }
    if ((m = c.match(/^\(\s*(min|max)-(width|height)\s*:\s*([\d.]+)(px|rem|em)\s*\)$/))) {
      const actual = m[2] === "width" ? vp.width : vp.height;
      const target = px(m[3], m[4]);
      return m[1] === "min" ? actual >= target : actual <= target;
    }
    if (/^\(\s*hover\s*:\s*hover\s*\)$/.test(c)) return vp.hover;
    if (/^\(\s*hover\s*:\s*none\s*\)$/.test(c)) return !vp.hover;
    if (/^\(\s*pointer\s*:\s*coarse\s*\)$/.test(c)) return !vp.hover;
    if (/^\(\s*pointer\s*:\s*fine\s*\)$/.test(c)) return vp.hover;
    if (/^print$/.test(c)) return false;
    if (/^(screen|all)$/.test(c)) return true;
    if (/forced-colors|prefers-color-scheme:\s*dark|prefers-contrast|prefers-reduced-motion\s*\)|prefers-reduced-motion:\s*reduce/.test(c)) return false;
    if (/prefers-reduced-motion:\s*no-preference|prefers-color-scheme:\s*light/.test(c)) return true;
    known = false;
    return true;
  });
  return { ok, known };
}

const scopeSelector = (scope) =>
  selectorParser((selectors) => {
    selectors.each((selector) => {
      let rooted = false;
      selector.walk((node) => {
        const isRoot =
          (node.type === "tag" && node.value.toLowerCase() === "html") ||
          (node.type === "pseudo" && (node.value === ":root" || node.value === ":host"));
        const isBody = node.type === "tag" && node.value.toLowerCase() === "body";
        if (isRoot || isBody) {
          if (node.parent !== selector) return;
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

export async function buildCss({ scope, width, height, hover = false, out }) {
  const raw = JSON.parse(readFileSync(new URL("capture/css/raw.json", root), "utf8"));
  const sheets = raw.filter(([, css]) => !/nextjs|__next|data-nextjs/i.test(css.slice(0, 4000)) || css.length > 100000);
  const vp = { width, height, hover };
  const parts = [];
  for (const [href, css] of sheets) {
    const ast = postcss.parse(css);
    ast.walkAtRules("media", (rule) => {
      const alternatives = rule.params.split(",").map((p) => mediaMatches(p.trim(), vp));
      if (alternatives.some((a) => !a.known)) return;
      if (alternatives.some((a) => a.ok)) rule.replaceWith(rule.nodes || []);
      else rule.remove();
    });
    ast.walkAtRules("media", (rule) => {
      const alternatives = rule.params.split(",").map((p) => mediaMatches(p.trim(), vp));
      if (alternatives.some((a) => !a.known)) return;
      if (alternatives.some((a) => a.ok)) rule.replaceWith(rule.nodes || []);
      else rule.remove();
    });
    const urls = new Set();
    ast.walkDecls((decl) => {
      if (/^(animation|transition)(-|$)/.test(decl.prop)) {
        decl.remove();
        return;
      }
      decl.value = decl.value
        .replace(/(-?[\d.]+)(?:d|s|l)?vh\b/g, (_, n) => `${(Number(n) * height) / 100}px`)
        .replace(/(-?[\d.]+)(?:d|s|l)?vw\b/g, (_, n) => `${(Number(n) * width) / 100}px`);
      for (const m of decl.value.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) urls.add(m[2]);
    });
    const base = href.startsWith("/") ? `${APP}${href}` : APP;
    const mapped = new Map();
    for (const u of urls) {
      if (u.startsWith("/__nextjs")) continue;
      mapped.set(u, await localize(u, base));
    }
    ast.walkDecls((decl) => {
      decl.value = decl.value.replace(/url\((['"]?)([^'")]+)\1\)/g, (all, _q, u) =>
        mapped.has(u) ? `url("${mapped.get(u)}")` : all
      );
    });
    ast.walkAtRules("font-face", (rule) => {
      let drop = false;
      rule.walkDecls("src", (d) => {
        if (d.value.includes("__nextjs")) drop = true;
      });
      rule.walkDecls("unicode-range", (d) => {
        if (/U\+0?900/i.test(d.value)) drop = true;
      });
      if (drop) rule.remove();
      else rule.append({ prop: "font-display", value: "block" });
    });
    const scoper = scopeSelector(scope);
    ast.walkRules((rule) => {
      let p = rule.parent;
      while (p) {
        if (p.type === "atrule" && /keyframes|font-face|property/.test(p.name)) return;
        p = p.parent;
      }
      rule.selector = scoper.processSync(rule.selector);
    });
    parts.push(ast.toString());
  }
  const locals = ["Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "SFMono-Regular", "Noto Color Emoji"]
    .map((f) => `@font-face{font-family:"${f}";src:local("${f}")}`)
    .join("\n");
  const css = `${locals}
${parts.join("\n")}
.${scope}{position:relative;display:block;width:${width}px;height:${height}px;overflow:hidden;transform:translateZ(0);text-align:left}
.${scope}-body{position:relative;display:block;width:${width}px;min-height:${height}px}
`;
  writeFileSync(new URL(out, root), css);
  process.stdout.write(`${out} ${(css.length / 1024).toFixed(0)}KB\n`);
}

export async function buildState(name, { scope }) {
  const data = JSON.parse(readFileSync(new URL(`capture/states/${name}.json`, root), "utf8"));
  let html = data.html.replace(/\s(srcset|imagesrcset|data-nimg|decoding|loading|fetchpriority)="[^"]*"/g, "");
  const refs = new Set([...html.matchAll(/\ssrc="([^"]+)"/g)].map((m) => m[1]));
  for (const ref of refs) {
    const local = await localize(ref.replace(/&amp;/g, "&"));
    html = html.split(`src="${ref}"`).join(`src="${local}"`);
  }
  html = html.replace(/\sid="([^"]+)"/g, (_, id) => ` data-id="${id}"`);
  html = html.replace(/\s(for|aria-controls|aria-labelledby|aria-describedby)="[^"]*"/g, "");
  html = html.replace(/<br\s*\/?>/g, " ");
  return { ...data, html, scope };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await buildCss({ scope: "vm-ui", width: 1440, height: 900, out: "vm-ui-desktop.css" });
  await buildCss({ scope: "vm-tab", width: 1180, height: 820, out: "vm-ui-tablet.css" });
}
