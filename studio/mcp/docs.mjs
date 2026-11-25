import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { FORMATS, FORMAT_BY_ID } from "../src/posts/formats.ts";
import { listPosts, readPost, writePost } from "../scripts/posts.mjs";

export const root = fileURLToPath(new URL("../..", import.meta.url));
const SAFE_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;

export const STYLES = ["Foto com UI", "Foto editorial", "Mockup de celular", "Gráfico", "Conteúdo", "Marca"];
export const TOPICS = ["Plantão", "Pergunte à Viva", "Médicos", "Documentos e receita", "Empresas", "Saúde", "Datas", "Institucional"];
export const LOGO_VARIANTS = ["lockupWhite", "lockupViolet", "lockupColor", "symbolWhite", "symbolColor", "symbolViolet", "wordmarkWhite", "wordmarkPurple", "wordmarkViolet", "appIcon"];
const CHIP_VARIANTS = ["pill", "date", "person", "stat", "bubble", "cta"];
const PLACE_KEYS = ["x", "y", "w", "h", "rotate", "hidden"];

export { FORMATS, FORMAT_BY_ID, listPosts, readPost };

export function tokens() {
  return JSON.parse(readFileSync(join(root, "brand/tokens.json"), "utf8"));
}

export function uid(prefix = "l") {
  return `${prefix}${Math.random().toString(36).slice(2, 8)}`;
}

export function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function parseRef(ref) {
  const clean = String(ref).trim().replace(/^vm:/, "").replace(/^\/+|\/+$/g, "");
  const [doc, frame, layer] = clean.split("/");
  if (!doc) throw new Error(`referência vazia: ${ref}`);
  return { doc, frame, layer };
}

export function walk(layers, fn, path = []) {
  for (const layer of layers) {
    fn(layer, path);
    if (layer.type === "group") walk(layer.children ?? [], fn, [...path, layer]);
  }
}

export function locate(ref) {
  const { doc: docId, frame: frameId, layer: layerId } = parseRef(ref);
  const doc = readPost(docId);
  if (!frameId) return { doc };
  const frameIndex = doc.frames.findIndex((f) => f.id === frameId || f.name === frameId);
  if (frameIndex < 0) throw new Error(`quadro ${frameId} não existe em ${doc.id}; quadros: ${doc.frames.map((f) => `${f.id} (${f.name})`).join(", ")}`);
  const frame = doc.frames[frameIndex];
  if (!layerId) return { doc, frame, frameIndex };
  let hit;
  walk(frame.layers, (l, path) => {
    if (!hit && l.id === layerId) hit = { layer: l, parents: path };
  });
  if (!hit) throw new Error(`camada ${layerId} não existe no quadro ${frame.name}`);
  const siblings = hit.parents.length ? hit.parents.at(-1).children : frame.layers;
  return { doc, frame, frameIndex, layer: hit.layer, parents: hit.parents, siblings };
}

function describe(l) {
  const bits = [l.type, JSON.stringify(l.name), `id=${l.id}`, `x=${Math.round(l.x)} y=${Math.round(l.y)}`];
  if (l.w !== undefined) bits.push(`w=${Math.round(l.w)}`);
  if (l.h !== undefined) bits.push(`h=${Math.round(l.h)}`);
  if (l.slot) bits.push(`slot=${l.slot}`);
  if (l.text) bits.push(`text=${JSON.stringify(l.text.length > 80 ? `${l.text.slice(0, 80)}…` : l.text)}`);
  if (l.title) bits.push(`title=${JSON.stringify(l.title)}`);
  if (l.variant) bits.push(`variant=${l.variant}`);
  if (l.screen) bits.push(`screen=${l.screen}`);
  if (l.src) bits.push(`src=${l.src}`);
  if (l.hidden) bits.push("hidden");
  return bits.join(" ");
}

export function tree(layers, depth = 1) {
  return layers.flatMap((l) => [`${"  ".repeat(depth)}${describe(l)}`, ...(l.type === "group" ? tree(l.children ?? [], depth + 1) : [])]);
}

export function outline(doc) {
  const head = `${doc.name} · id=${doc.id} · ${doc.kind}/${doc.format} · base ${doc.base.width}×${doc.base.height}${doc.style ? ` · estilo ${doc.style}` : ""}${doc.topics?.length ? ` · temas ${doc.topics.join(", ")}` : ""}`;
  const frames = doc.frames.flatMap((f, i) => [`quadro ${i + 1} ${JSON.stringify(f.name)} id=${f.id} ref=vm:${doc.id}/${f.id} fundo=${f.background.slice(0, 80)}`, ...tree(f.layers)]);
  const overrides = Object.keys(doc.overrides ?? {});
  return [head, ...frames, ...(overrides.length ? [`ajustes por formato: ${overrides.join(", ")}`] : [])].join("\n");
}

const shotsDir = join(root, "screens/dist/shots");

export function screenIds() {
  if (!existsSync(shotsDir)) return [];
  return readdirSync(shotsDir)
    .filter((f) => f.endsWith(".png") && !f.startsWith("kit-"))
    .map((f) => f.slice(0, -4));
}

function fileExists(path) {
  if (/^(https?:|data:|\/)/.test(path)) return true;
  return existsSync(join(root, path));
}

export function validate(doc) {
  const errors = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`);
  if (!SAFE_ID.test(doc.id ?? "")) err("doc", `id inválido ${doc.id}`);
  if (typeof doc.name !== "string" || !doc.name.trim()) err("doc", "name obrigatório");
  const format = FORMAT_BY_ID[doc.format];
  if (!format) err("doc", `format desconhecido ${doc.format}; use ${FORMATS.map((f) => f.id).join(", ")}`);
  else if (format.kind !== doc.kind) err("doc", `kind ${doc.kind} não combina com format ${doc.format} (esperado ${format.kind})`);
  if (!(doc.base?.width > 0 && doc.base?.height > 0)) err("doc", "base {width,height} obrigatório");
  if (doc.style !== undefined && !STYLES.includes(doc.style)) err("doc", `style desconhecido ${doc.style}; use ${STYLES.join(", ")}`);
  if (!Array.isArray(doc.frames) || !doc.frames.length) err("doc", "precisa de ao menos um quadro");
  const screens = new Set(screenIds());
  const frameIds = new Set();
  for (const frame of doc.frames ?? []) {
    const fw = `quadro ${frame.name ?? frame.id}`;
    if (!frame.id || frameIds.has(frame.id)) err(fw, `id de quadro ausente ou repetido ${frame.id}`);
    frameIds.add(frame.id);
    if (typeof frame.background !== "string") err(fw, "background (css) obrigatório");
    if (!Array.isArray(frame.layers)) {
      err(fw, "layers precisa ser lista");
      continue;
    }
    const ids = new Set();
    walk(frame.layers, (l) => {
      const w = `${fw} › ${l.name ?? l.id}`;
      if (!l.id || ids.has(l.id)) err(w, `id de camada ausente ou repetido ${l.id}`);
      ids.add(l.id);
      if (typeof l.name !== "string") err(w, "name obrigatório");
      if (typeof l.x !== "number" || typeof l.y !== "number") err(w, "x e y numéricos obrigatórios");
      for (const k of ["w", "h", "rotate", "opacity", "scale", "blur", "backdropBlur"]) if (l[k] !== undefined && typeof l[k] !== "number") err(w, `${k} precisa ser número`);
      if (l.anchor !== undefined && !["top", "center", "bottom"].includes(l.anchor)) err(w, "anchor: top, center ou bottom");
      if (l.style !== undefined && (typeof l.style !== "object" || Array.isArray(l.style))) err(w, "style precisa ser objeto css");
      switch (l.type) {
        case "rect":
          break;
        case "image":
          if (typeof l.src !== "string") err(w, "src obrigatório");
          else if (!fileExists(l.src)) err(w, `arquivo não existe ${l.src}`);
          if (l.screen && !screens.has(l.screen)) err(w, `tela desconhecida ${l.screen}`);
          break;
        case "text":
          if (typeof l.text !== "string") err(w, "text obrigatório");
          if (!["display", "body", "mono"].includes(l.font)) err(w, "font: display, body ou mono");
          if (typeof l.size !== "number") err(w, "size obrigatório");
          if (typeof l.color !== "string") err(w, "color obrigatório");
          if (l.runs !== undefined && (!Array.isArray(l.runs) || l.runs.some((r) => typeof r.text !== "string"))) err(w, "runs: lista de {text, style?}");
          break;
        case "phone":
          if (!screens.has(l.screen)) err(w, `tela desconhecida ${l.screen}`);
          if (l.image && !fileExists(l.image)) err(w, `arquivo não existe ${l.image}`);
          break;
        case "chip":
          if (!CHIP_VARIANTS.includes(l.variant)) err(w, `variant: ${CHIP_VARIANTS.join(", ")}`);
          if (typeof l.title !== "string") err(w, "title obrigatório");
          if (l.badge && !fileExists(l.badge)) err(w, `arquivo não existe ${l.badge}`);
          break;
        case "logo":
          if (!LOGO_VARIANTS.includes(l.variant)) err(w, `variant: ${LOGO_VARIANTS.join(", ")}`);
          break;
        case "svg":
          if (typeof l.markup !== "string") err(w, "markup obrigatório");
          break;
        case "group":
          if (!Array.isArray(l.children)) err(w, "children obrigatório");
          break;
        case "screen":
          if (!screens.has(l.screen)) err(w, `tela desconhecida ${l.screen}`);
          break;
        default:
          err(w, `type desconhecido ${l.type}; use rect, image, text, phone, chip, logo, svg, group, screen`);
      }
    });
    walk(frame.layers, (l) => {
      if (l.type === "screen" && !ids.has(l.photo)) err(`${fw} › ${l.name}`, `photo aponta para camada inexistente ${l.photo}`);
    });
  }
  return errors;
}

export function save(doc) {
  const next = { ...doc, updatedAt: new Date().toISOString() };
  const errors = validate(next);
  if (errors.length) throw new Error(`documento inválido, nada foi salvo:\n- ${errors.join("\n- ")}`);
  writePost(next);
  return next;
}

export function mergePatch(target, patch) {
  const out = { ...target };
  for (const [k, v] of Object.entries(patch)) {
    if (v === null) delete out[k];
    else if (k === "style" && v && typeof v === "object" && !Array.isArray(v)) out.style = mergePatch(out.style ?? {}, v);
    else out[k] = v;
  }
  return out;
}

export function mapLayers(layers, fn) {
  const out = [];
  for (const layer of layers) {
    const next = fn(layer);
    if (!next) continue;
    out.push(next.type === "group" ? { ...next, children: mapLayers(next.children ?? [], fn) } : next);
  }
  return out;
}

export function withIds(layer) {
  const copy = structuredClone(layer);
  walk([copy], (l) => {
    l.id = uid();
  });
  return copy;
}

export function cloneFrame(frame) {
  const ids = new Map();
  const copy = structuredClone(frame);
  walk(copy.layers, (l) => {
    const next = uid();
    ids.set(l.id, next);
    l.id = next;
  });
  walk(copy.layers, (l) => {
    if (l.type === "screen") l.photo = ids.get(l.photo) ?? l.photo;
  });
  return { ...copy, id: uid("f") };
}

export function blankFrame(base, name) {
  const { width, height } = base;
  const pad = Math.round(Math.min(width, height) * 0.074);
  const size = Math.round(Math.min(width, height) * 0.09);
  return {
    id: uid("f"),
    name,
    background: tokens().gradient.aurora,
    layers: [
      { id: uid(), type: "logo", name: "Logo", variant: "lockupWhite", x: pad, y: pad, h: Math.max(28, Math.round(size * 0.4)), anchor: "top" },
      { id: uid(), type: "text", name: "Título", slot: "Título", text: "Escreva o título aqui.", font: "display", size, color: "#FFFFFF", x: pad, y: height - pad - size * 2, w: Math.min(width - pad * 2, 900), anchor: "bottom" },
    ],
  };
}

export { PLACE_KEYS };
