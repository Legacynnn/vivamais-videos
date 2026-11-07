import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("..", import.meta.url));
const SKIP = ["kit", "capture", "templates"];

export function videos(only = []) {
  return readdirSync(join(root, "videos"), { withFileTypes: true })
    .filter((group) => group.isDirectory() && !SKIP.includes(group.name))
    .flatMap((group) => readdirSync(join(root, "videos", group.name)).map((name) => join(root, "videos", group.name, name)))
    .filter((dir) => existsSync(join(dir, "index.html")) && (!only.length || only.some((name) => dir.endsWith(`/${name}`))));
}

export function info(dir) {
  const brief = existsSync(join(dir, "BRIEF.md")) ? readFileSync(join(dir, "BRIEF.md"), "utf8") : "";
  const front = Object.fromEntries([...(brief.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "").matchAll(/^(\w+):\s*"?(.*?)"?$/gm)].map((m) => [m[1], m[2]]));
  const html = readFileSync(join(dir, "index.html"), "utf8");
  const resolution = html.match(/data-resolution="(\w+)"/)?.[1] ?? "";
  const width = html.match(/data-width="(\d+)"/)?.[1];
  const height = html.match(/data-height="(\d+)"/)?.[1];
  const duration = Number(html.match(/id="root"[^>]*data-duration="([\d.]+)"/)?.[1] ?? html.match(/data-duration="([\d.]+)"/)?.[1] ?? 0);
  const renders = existsSync(join(dir, "renders")) ? readdirSync(join(dir, "renders")).filter((f) => f.endsWith(".mp4")) : [];
  return { front, resolution, size: width && height ? `${width}×${height}` : resolution, duration, renders };
}
