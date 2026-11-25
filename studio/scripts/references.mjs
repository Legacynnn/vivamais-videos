import { copyFileSync, createReadStream, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { watchFile } from "./live.mjs";
import { basename, extname, join, normalize } from "node:path";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../..", import.meta.url));
const dir = join(root, "references");
const mediaDir = join(dir, "media");
const indexFile = join(dir, "index.json");

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};
const EXT = Object.fromEntries(Object.entries(MIME).filter(([ext]) => ext !== ".jpeg").map(([ext, type]) => [type, ext]));
const MAX_VIDEO_BYTES = 300 * 1024 * 1024;
const SAFE_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;
const MAX_BYTES = 25 * 1024 * 1024;
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export function readIndex() {
  if (!existsSync(indexFile)) return [];
  return JSON.parse(readFileSync(indexFile, "utf8"));
}

let lastWritten;

function writeIndex(items) {
  mkdirSync(dir, { recursive: true });
  lastWritten = `${JSON.stringify(items, null, 2)}\n`;
  writeFileSync(indexFile, lastWritten);
}

export function listReferences() {
  return readIndex().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function newId() {
  return `${Date.now().toString(36)}-${randomBytes(3).toString("hex")}`;
}

function cleanTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean))];
}

function saveMedia(id, ext, buffer, index) {
  mkdirSync(mediaDir, { recursive: true });
  const name = `${id}${index === undefined ? "" : `-${index + 1}`}${ext}`;
  writeFileSync(join(mediaDir, name), buffer);
  return `references/media/${name}`;
}

function decodeDataUrl(data) {
  const match = /^data:([\w.+/-]+);base64,(.+)$/s.exec(data);
  if (!match || !EXT[match[1]]) throw new Error("arquivo inválido: use imagem ou vídeo (mp4, webm, mov)");
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length > (match[1].startsWith("video/") ? MAX_VIDEO_BYTES : MAX_BYTES)) throw new Error("arquivo grande demais");
  return { ext: EXT[match[1]], buffer };
}

function meta(html, prop) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const key = /(?:property|name)\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase();
    if (key !== prop) continue;
    const value = /content\s*=\s*"([^"]*)"|content\s*=\s*'([^']*)'/i.exec(tag);
    const text = value?.[1] ?? value?.[2];
    if (text) return text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  }
  return undefined;
}

async function fetchTimeout(url, ms, init) {
  return fetch(url, { ...init, signal: AbortSignal.timeout(ms), headers: { "User-Agent": UA, "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8", ...init?.headers } });
}

async function scrapeLink(url) {
  const out = {};
  try {
    const res = await fetchTimeout(url, 8000);
    if (!res.ok) return out;
    const html = (await res.text()).slice(0, 600000);
    out.title = meta(html, "og:title") ?? /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim();
    const image = meta(html, "og:image") ?? meta(html, "twitter:image");
    if (image) {
      const img = await fetchTimeout(new URL(image, url).href, 10000);
      const type = (img.headers.get("content-type") ?? "").split(";")[0].trim();
      if (img.ok && EXT[type]) {
        const buffer = Buffer.from(await img.arrayBuffer());
        if (buffer.length <= MAX_BYTES) out.image = { ext: EXT[type], buffer };
      }
    }
  } catch {
    return out;
  }
  return out;
}

const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
};

function instagramCode(url) {
  return /instagram\.com\/(?:[\w.]+\/)?(?:p|reel|tv)\/([\w-]+)/.exec(url)?.[1];
}

function findMedia(node, code) {
  if (Array.isArray(node)) {
    for (const child of node) {
      const hit = findMedia(child, code);
      if (hit) return hit;
    }
  } else if (node && typeof node === "object") {
    if (node.code === code && (node.image_versions2 || node.carousel_media)) return node;
    for (const child of Object.values(node)) {
      const hit = findMedia(child, code);
      if (hit) return hit;
    }
  }
  return undefined;
}

function bestUrl(media) {
  const pick = (list) => list.reduce((a, b) => ((b.width ?? 0) > (a.width ?? 0) ? b : a)).url;
  if (media.video_versions?.length) return pick(media.video_versions);
  return pick(media.image_versions2.candidates);
}

// Logged-out instagram only ships post JSON when the request looks like a real browser navigation.
async function scrapeInstagram(code) {
  const res = await fetch(`https://www.instagram.com/p/${code}/`, { headers: BROWSER_HEADERS, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`instagram respondeu ${res.status}`);
  const html = await res.text();
  let post;
  for (const match of html.matchAll(/<script type="application\/json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      post = findMedia(JSON.parse(match[1]), code);
    } catch {
      continue;
    }
    if (post) break;
  }
  if (!post) throw new Error("não achei a mídia do post (privado ou instagram bloqueou)");
  const items = post.carousel_media?.length ? post.carousel_media : [post];
  const media = [];
  for (const item of items) {
    const file = await fetchTimeout(bestUrl(item), 60000);
    const type = (file.headers.get("content-type") ?? "").split(";")[0].trim();
    if (!file.ok || !EXT[type]) throw new Error(`mídia do instagram falhou (${file.status})`);
    media.push({ ext: EXT[type], buffer: Buffer.from(await file.arrayBuffer()) });
  }
  return {
    media,
    user: post.user?.username,
    date: post.taken_at ? new Date(post.taken_at * 1000).toISOString().slice(0, 10) : undefined,
    caption: post.caption?.text?.trim() ?? "",
  };
}

function sourceOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").split(".").slice(-2, -1)[0];
  } catch {
    return undefined;
  }
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

export async function createItem(body) {
  const id = newId();
  const item = {
    id,
    kind: body.kind === "post" ? "post" : body.data || body.fromFile ? "image" : "link",
    title: String(body.title ?? "").trim(),
    note: String(body.note ?? ""),
    tags: cleanTags(body.tags),
    createdAt: new Date().toISOString(),
  };
  const media = Array.isArray(body.media) ? body.media.filter((m) => typeof m === "string") : [];
  if (media.length) item.kind = media.length > 1 ? "carousel" : media[0].startsWith("data:video/") ? "video" : "image";
  else if (body.kind === "link" || (!body.data && !body.fromFile)) item.kind = "link";
  if (body.source) item.source = String(body.source);

  if (media.length) {
    item.media = media.map((m, i) => {
      const { ext, buffer } = decodeDataUrl(m);
      return saveMedia(id, ext, buffer, i);
    });
    item.src = item.media[0];
  } else if (body.data) {
    const { ext, buffer } = decodeDataUrl(body.data);
    item.src = saveMedia(id, ext, buffer);
  } else if (body.fromFile) {
    const rel = normalize(String(body.fromFile)).replace(/^[/\\]+/, "");
    const abs = join(root, rel);
    const allowed = join(root, "posts", "export");
    if (!abs.startsWith(allowed) || !MIME[extname(abs)] || !existsSync(abs) || !statSync(abs).isFile()) throw new Error("arquivo inválido");
    mkdirSync(mediaDir, { recursive: true });
    item.src = `references/media/${id}${extname(abs)}`;
    copyFileSync(abs, join(root, item.src));
    item.title ||= basename(abs, extname(abs));
  }

  if (!item.src && !body.url) throw new Error("envie uma imagem, um vídeo ou um link");

  if (body.url) {
    let parsed;
    try {
      parsed = new URL(String(body.url));
      if (!/^https?:$/.test(parsed.protocol)) throw new Error();
    } catch {
      throw new Error("link inválido");
    }
    item.url = parsed.href;
    item.source ??= sourceOf(item.url);
    const code = item.kind === "link" ? instagramCode(item.url) : undefined;
    if (code) {
      const found = await scrapeInstagram(code);
      item.url = `https://www.instagram.com/p/${code}/`;
      item.source = "instagram";
      item.media = found.media.map((m, i) => saveMedia(id, m.ext, m.buffer, i));
      item.src = item.media[0];
      item.kind = item.media.length > 1 ? "carousel" : found.media[0].ext === ".mp4" ? "video" : "image";
      item.title ||= [found.user && `@${found.user}`, found.date].filter(Boolean).join(" · ");
      if (found.caption) item.note = item.note ? `${item.note}\n\nLegenda${found.user ? ` (@${found.user})` : ""}: ${found.caption}` : found.caption;
    } else if (item.kind === "link") {
      const found = await scrapeLink(item.url);
      if (found.image) item.src = saveMedia(id, found.image.ext, found.image.buffer);
      item.title ||= found.title ?? parsed.hostname.replace(/^www\./, "");
    }
  }
  item.title ||= "Sem título";

  writeIndex([item, ...readIndex()]);
  return item;
}

export function updateItem(id, body) {
  const items = readIndex();
  const item = items.find((i) => i.id === id);
  if (!item) throw new Error("referência não encontrada");
  if (typeof body.title === "string") item.title = body.title.trim() || item.title;
  if (typeof body.note === "string") item.note = body.note;
  if (body.tags) item.tags = cleanTags(body.tags);
  if (typeof body.url === "string") {
    const url = body.url.trim();
    if (!url) delete item.url;
    else if (/^https?:\/\//.test(url)) {
      item.url = url;
      item.source = sourceOf(url);
    }
  }
  writeIndex(items);
  return item;
}

export function removeItem(id) {
  const items = readIndex();
  const item = items.find((i) => i.id === id);
  if (item) removeMedia(item);
  writeIndex(items.filter((i) => i.id !== id));
}

function removeMedia(item) {
  for (const src of new Set([item.src, ...(item.media ?? [])])) {
    if (src?.startsWith("references/media/")) rmSync(join(root, src), { force: true });
  }
}

export function referencesApi() {
  return {
    name: "studio-references-api",
    configureServer(server) {
      watchFile(server, indexFile, "studio:references", (text) => {
        if (text === lastWritten) return undefined;
        lastWritten = text;
        return { items: listReferences() };
      });
      server.middlewares.use("/references-media", (req, res, next) => {
        const file = normalize(join(mediaDir, decodeURIComponent((req.url ?? "/").split("?")[0])));
        if (!file.startsWith(`${mediaDir}/`) || !existsSync(file) || !statSync(file).isFile()) return next();
        const size = statSync(file).size;
        res.setHeader("Content-Type", MIME[extname(file)] ?? "application/octet-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Accept-Ranges", "bytes");
        const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? "");
        if (range) {
          const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
          const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
          res.statusCode = 206;
          res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
          res.setHeader("Content-Length", end - start + 1);
          return createReadStream(file, { start, end }).pipe(res);
        }
        res.setHeader("Content-Length", size);
        createReadStream(file).pipe(res);
      });
      server.middlewares.use("/api/references", async (req, res) => {
        const send = (status, body) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };
        try {
          const [id] = (req.url ?? "/").split("?")[0].split("/").filter(Boolean);
          if (id && !SAFE_ID.test(id)) return send(400, { error: "id inválido" });
          if (!id && req.method === "GET") return send(200, listReferences());
          if (!id && req.method === "POST") return send(200, await createItem(await readBody(req)));
          if (id && req.method === "PUT") return send(200, updateItem(id, await readBody(req)));
          if (id && req.method === "DELETE") {
            removeItem(id);
            return send(200, { ok: true });
          }
          send(404, { error: "rota desconhecida" });
        } catch (error) {
          send(500, { error: error instanceof Error ? error.message : String(error) });
        }
      });
    },
  };
}
