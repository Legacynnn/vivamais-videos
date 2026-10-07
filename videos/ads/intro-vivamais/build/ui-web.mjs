import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { extname } from "node:path";

const APP = "http://127.0.0.1:3457";
const root = new URL("../", import.meta.url);

function localize(ref) {
  if (!ref || ref.startsWith("data:") || ref.startsWith("#") || ref.startsWith("assets/")) return ref;
  let abs = new URL(ref, APP);
  if (abs.pathname === "/_next/image") abs = new URL(abs.searchParams.get("url"), APP);
  const name = `${createHash("sha1").update(abs.href).digest("hex").slice(0, 12)}${extname(abs.pathname) || ".bin"}`;
  if (!existsSync(new URL(`assets/ui/${name}`, root))) process.stderr.write(`web asset miss ${abs.href}\n`);
  return `assets/ui/${name}`;
}

const ICON = (name) =>
  readFileSync(new URL(`node_modules/lucide-static/icons/${name}.svg`, root), "utf8")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s*class="[^"]*"/, "")
    .replace("<svg", '<svg class="h-5 w-5"')
    .trim();
const DOCTORS = { MC: ["Mariana Costa", "d4.jpeg"], RL: ["Rafael Lima", "d0.png"], JA: ["Júlia Andrade", "d2.png"] };

const portraits = (html) =>
  html
    .replace(/style="opacity: 0(\.\d+)?; transform: translate[XY]\([^)]*\);?"/g, 'style=""')
    .replace(/ disabled="">(<div class="flex items-center justify-center gap-2">)<svg[\s\S]*?<\/svg><span>Acesso no horário agendado<\/span>/, (all, head) => `>${head}${ICON("video")}<span>Iniciar videochamada</span>${ICON("chevron-right")}`)
    .replace(/<div class="rounded-2xl border p-4 border-amber-200[^"]*">[\s\S]*?<\/p><\/div><\/div>/, "")
    .replace(/<div class="([^"]*\brounded-full\b[^"]*)">(MC|RL|JA)<\/div>/g, (all, cls, key) => `<div class="${cls}" style="overflow:hidden"><img alt="${DOCTORS[key][0]}" src="assets/doctors/${DOCTORS[key][1]}" style="display:block;width:100%;height:100%;object-fit:cover"></div>`)
    .replace(/(<img[^>]*alt="(Mariana Costa|Rafael Lima|Júlia Andrade)"[^>]*src=")[^"]*(")/g, (all, head, name, tail) => head + "assets/doctors/" + Object.values(DOCTORS).find((d) => d[0] === name)[1] + tail);

export function buildWebState(name) {
  const data = JSON.parse(readFileSync(new URL(`capture/web/states/${name}.json`, root), "utf8"));
  let html = data.html.replace(/\s(srcset|imagesrcset|data-nimg|decoding|loading|fetchpriority)="[^"]*"/g, "");
  const refs = new Set([...html.matchAll(/\ssrc="([^"]+)"/g)].map((m) => m[1]));
  for (const ref of refs) html = html.split(`src="${ref}"`).join(`src="${localize(ref.replace(/&amp;/g, "&"))}"`);
  html = html.replace(/\sid="([^"]+)"/g, (_, id) => ` data-id="${id}"`);
  html = html.replace(/\s(for|aria-controls|aria-labelledby|aria-describedby)="[^"]*"/g, "");
  html = html.replace(/<br\s*\/?>/g, " ");
  html = html
    .split("Aurora Logística").join("Minha Empresa")
    .split("Bem-vindo, Aurora!").join("Bem-vindo, RH!")
    .split("auroralog.com.br").join("minhaempresa.com.br")
    .replace(/>AL</g, ">ME<");
  return { ...data, html: portraits(html) };
}
