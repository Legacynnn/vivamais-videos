import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { PNG } from "pngjs";
import { findChrome } from "../../tools/chrome.mjs";
import { watchJsonDir } from "./live.mjs";

const root = fileURLToPath(new URL("../..", import.meta.url));
export const postsDir = join(root, "posts");
export const exportDir = join(postsDir, "export");

const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
const SAFE_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;

function docPath(id) {
  if (!SAFE_ID.test(id)) throw new Error(`id inválido: ${id}`);
  return join(postsDir, `${id}.json`);
}

export function listPosts() {
  if (!existsSync(postsDir)) return [];
  return readdirSync(postsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(postsDir, f), "utf8")));
}

export function readPost(id) {
  return JSON.parse(readFileSync(docPath(id), "utf8"));
}

const written = new Map();

export function writePost(doc) {
  mkdirSync(postsDir, { recursive: true });
  const text = `${JSON.stringify(doc, null, 2)}\n`;
  written.set(doc.id, text);
  writeFileSync(docPath(doc.id), text);
}

export function deletePost(id) {
  written.set(id, null);
  rmSync(docPath(id), { force: true });
}

function slug(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function exportPost(id, origin, format, frameId, layerIds) {
  const doc = readPost(id);
  const fmt = format || doc.format;
  const out = layerIds ? join(exportDir, id, fmt, "camadas") : join(exportDir, id, fmt);
  if (!layerIds) rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ["--disable-gpu-vsync", "--disable-frame-rate-limit"],
  });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 1 });
    const only = layerIds ? `&frame=${encodeURIComponent(frameId)}&layers=${encodeURIComponent(layerIds.join(","))}` : "";
    await page.goto(`${origin}/render.html?id=${encodeURIComponent(id)}&format=${encodeURIComponent(fmt)}${only}`, { waitUntil: "networkidle0" });
    await page.waitForFunction("window.__postReady === true", { timeout: 30000 });
    if (errors.length) throw new Error(errors.join("\n"));
    const size = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }));
    await page.setViewport({ width: Math.ceil(size.width), height: Math.ceil(size.height), deviceScaleFactor: SUPERSAMPLE });

    if (layerIds) {
      const frameLayers = doc.frames.find((f) => f.id === frameId)?.layers ?? [];
      const pads = Object.fromEntries(
        layerIds.map((lid) => {
          const l = frameLayers.find((x) => x.id === lid);
          const sh = l?.dropShadow;
          const own = l?.type === "chip" ? 90 : l?.type === "phone" ? 150 : l?.type === "image" && l.shadow ? 120 : 0;
          return [lid, Math.max(own, sh && !sh.hidden ? Math.ceil(sh.blur + Math.max(Math.abs(sh.x), Math.abs(sh.y))) : 0)];
        }),
      );
      const clip = await page.evaluate((ids, pads) => {
        const frame = document.querySelector("[data-frame-view]");
        const f = frame.getBoundingClientRect();
        const rects = ids.map((id) => frame.querySelector(`:scope > [data-layer="${id}"]`)).filter(Boolean).map((el) => {
          const r = el.getBoundingClientRect();
          const pad = pads[el.dataset.layer] ?? 0;
          return { l: r.left - pad, t: r.top - pad, r: r.right + pad, b: r.bottom + pad };
        });
        if (!rects.length) return null;
        const l = Math.max(f.left, Math.min(...rects.map((r) => r.l)));
        const t = Math.max(f.top, Math.min(...rects.map((r) => r.t)));
        const r = Math.min(f.right, Math.max(...rects.map((r) => r.r)));
        const b = Math.min(f.bottom, Math.max(...rects.map((r) => r.b)));
        return { x: Math.floor(l + window.scrollX), y: Math.floor(t + window.scrollY), width: Math.ceil(r - l), height: Math.ceil(b - t) };
      }, layerIds, pads);
      if (!clip || clip.width < 1 || clip.height < 1) throw new Error("camada fora do quadro ou oculta");
      const names = layerIds.map((lid) => frameLayers.find((l) => l.id === lid)?.name ?? lid);
      const file = join(out, `${slug(names.length > 2 ? `${names[0]}-e-mais-${names.length - 1}` : names.join("-")) || "camada"}.png`);
      const shot = await page.screenshot({ clip, omitBackground: true });
      writeFileSync(file, downsample(Buffer.from(shot), SUPERSAMPLE));
      return [resolve(file).slice(root.length)];
    }

    const frames = await page.$$eval("[data-frame]", (els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height, slices: Number(el.dataset.slices || 1) };
      }),
    );

    const files = [];
    let n = 1;
    for (const [i, box] of frames.entries()) {
      const width = box.width / box.slices;
      for (let s = 0; s < box.slices; s++) {
        const label = box.slices > 1 ? `parte-${s + 1}` : slug(doc.frames[i].name);
        const file = join(out, `${String(n++).padStart(2, "0")}-${label}.png`);
        const shot = await page.screenshot({ clip: { x: box.x + s * width, y: box.y, width, height: box.height } });
        writeFileSync(file, downsample(Buffer.from(shot), SUPERSAMPLE));
        files.push(resolve(file).slice(root.length));
      }
    }
    return files;
  } finally {
    await browser.close();
  }
}

const SUPERSAMPLE = 2;

function downsample(buffer, k) {
  const src = PNG.sync.read(buffer);
  const w = Math.floor(src.width / k);
  const h = Math.floor(src.height / k);
  const dst = new PNG({ width: w, height: h });
  const n = k * k;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let dy = 0; dy < k; dy++) {
        let i = ((y * k + dy) * src.width + x * k) * 4;
        for (let dx = 0; dx < k; dx++, i += 4) {
          r += src.data[i];
          g += src.data[i + 1];
          b += src.data[i + 2];
          a += src.data[i + 3];
        }
      }
      const o = (y * w + x) * 4;
      dst.data[o] = Math.round(r / n);
      dst.data[o + 1] = Math.round(g / n);
      dst.data[o + 2] = Math.round(b / n);
      dst.data[o + 3] = Math.round(a / n);
    }
  }
  return PNG.sync.write(dst);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function postsApi() {
  return {
    name: "studio-posts-api",
    configureServer(server) {
      watchJsonDir(server, postsDir, "studio:post", (id, text) => {
        if (!SAFE_ID.test(id) || written.get(id) === text) return undefined;
        written.set(id, text);
        return { id, doc: text === null ? null : JSON.parse(text) };
      });
      server.middlewares.use("/repo-assets", (req, res, next) => {
        const file = normalize(join(root, "assets", decodeURIComponent((req.url ?? "/").split("?")[0])));
        if (!file.startsWith(join(root, "assets")) || !existsSync(file) || !statSync(file).isFile()) return next();
        res.setHeader("Content-Type", MIME[extname(file)] ?? "application/octet-stream");
        createReadStream(file).pipe(res);
      });
      server.middlewares.use("/repo-export", (req, res, next) => {
        const file = normalize(join(exportDir, decodeURIComponent((req.url ?? "/").split("?")[0])));
        if (!file.startsWith(exportDir) || !existsSync(file) || !statSync(file).isFile()) return next();
        res.setHeader("Content-Type", MIME[extname(file)] ?? "application/octet-stream");
        res.setHeader("Cache-Control", "no-store");
        createReadStream(file).pipe(res);
      });
      server.middlewares.use("/api/posts", async (req, res) => {
        const send = (status, body) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };
        try {
          const [path, query] = (req.url ?? "/").split("?");
          const [id, action] = path.split("/").filter(Boolean);
          const params = new URLSearchParams(query ?? "");
          if (!id && req.method === "GET") return send(200, listPosts());
          if (id && action === "export" && req.method === "POST") {
            const origin = (server.resolvedUrls?.local[0] ?? `http://localhost:${server.config.server.port}/`).replace(/\/$/, "");
            const layers = params.get("layers")?.split(",").filter(Boolean);
            return send(200, { files: await exportPost(id, origin, params.get("format"), params.get("frame"), layers?.length ? layers : undefined) });
          }
          if (id && req.method === "GET") return send(200, readPost(id));
          if (id && req.method === "PUT") {
            const doc = await readBody(req);
            if (doc.id !== id) return send(400, { error: "id não confere" });
            writePost(doc);
            return send(200, { ok: true });
          }
          if (id && req.method === "DELETE") {
            deletePost(id);
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
