#!/usr/bin/env node
import { mkdirSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";

const UA = { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) vivamais-videos/stock" };
const [cmd, ...rest] = process.argv.slice(2);
const flag = (k, d) => {
  const i = rest.indexOf(`--${k}`);
  return i < 0 ? d : rest[i + 1];
};
const args = rest.filter((a, i) => !a.startsWith("--") && !(i > 0 && rest[i - 1].startsWith("--")));

const usage = `stock.mjs — keyless stock search
  video <query> [--n 20]              Mixkit clips (free license, 720p)
  image <query> [--n 20] [--any]      Openverse CC0 photos (--any: all commercial CC)
  get video <id|page-url> <out.mp4>   download 720p clip (newer ids need the page URL)
  get image <url> <out.jpg>           download photo
  sheet <dir> <out.jpg>               contact sheet of thumbs in dir (sorted, 4 across)`;

async function html(url) {
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}

async function save(url, out) {
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  appendFileSync(join(dirname(out), "CREDITS.txt"), `${out.split("/").pop()}\t${url}\n`);
  return out;
}

async function video(q, n) {
  const slug = q.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const page = await html(`https://mixkit.co/free-stock-video/${slug}/`);
  const seen = new Set();
  const out = [];
  for (const m of page.matchAll(/\/free-stock-video\/([a-z0-9-]+)-(\d+)\//g)) {
    if (seen.has(m[2])) continue;
    seen.add(m[2]);
    out.push({ id: m[2], title: m[1].replace(/-/g, " "), page: `https://mixkit.co/free-stock-video/${m[1]}-${m[2]}/`, thumb: `https://assets.mixkit.co/videos/${m[2]}/${m[2]}-thumb-720-0.jpg`, src: `https://assets.mixkit.co/videos/${m[2]}/${m[2]}-720.mp4` });
    if (out.length >= n) break;
  }
  return out;
}

async function image(q, n, any) {
  const p = new URLSearchParams({ q, page_size: String(n), license_type: "commercial", ...(any ? {} : { license: "cc0" }) });
  const r = await fetch(`https://api.openverse.org/v1/images/?${p}`, { headers: UA });
  const j = await r.json();
  return (j.results || []).map((x) => ({ id: x.id, title: x.title, size: `${x.width}x${x.height}`, license: `${x.license} ${x.license_version || ""}`.trim(), by: x.creator, src: x.url, page: x.foreign_landing_url }));
}

if (cmd === "video") {
  for (const v of await video(args[0], +flag("n", 20))) console.log(`${v.id}\t${v.title}\t${v.page}`);
} else if (cmd === "image") {
  for (const v of await image(args[0], +flag("n", 20), rest.includes("--any"))) console.log(`${v.size}\t${v.license}\t${v.src}\t${v.title}`);
} else if (cmd === "get" && args[0] === "video") {
  const id = args[1].match(/(\d+)\/?$/)[1];
  const direct = `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`;
  const head = await fetch(direct, { method: "HEAD", headers: UA });
  let src = head.ok ? direct : null;
  if (!src && /^https?:/.test(args[1])) {
    const m = (await html(args[1])).match(/https:\/\/assets\.mixkit\.co\/[^"']+-720\.mp4/);
    src = m && m[0];
  }
  if (!src) throw new Error(`no free 720p file for ${args[1]} (pass the clip page URL for newer ids)`);
  console.log(await save(src, args[2]));
} else if (cmd === "get" && args[0] === "image") {
  console.log(await save(args[1], args[2]));
} else if (cmd === "sheet") {
  if (!existsSync(args[0])) throw new Error(`no dir ${args[0]}`);
  execFileSync("sh", ["-c", `ffmpeg -hide_banner -loglevel error -y -pattern_type glob -i '${args[0]}/*.jpg' -vf "scale=360:240:force_original_aspect_ratio=decrease,pad=360:240:(ow-iw)/2:(oh-ih)/2,tile=4x5" -frames:v 1 '${args[1]}'`], { stdio: "inherit" });
  console.log(args[1]);
} else {
  console.log(usage);
}
