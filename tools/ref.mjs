import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const REF = /vm:([a-z0-9][a-z0-9-]*)\/([A-Za-z0-9_-]+)(?:\/([A-Za-z0-9_-]+))?/g;

const args = process.argv.slice(2);
const json = args.includes("--json");
const input = args.filter((a) => a !== "--json").join(" ") || (process.stdin.isTTY ? "" : readFileSync(0, "utf8"));
const refs = [...input.matchAll(REF)];

if (!refs.length) {
  console.error("usage: npm run ref -- vm:<doc>/<frame>[/<layer>] [--json]");
  process.exit(1);
}

function find(layers, id, path = []) {
  for (const l of layers) {
    if (l.id === id) return { layer: l, path: [...path, l.name] };
    if (l.children) {
      const hit = find(l.children, id, [...path, l.name]);
      if (hit) return hit;
    }
  }
}

function describe(l) {
  const bits = [l.type, JSON.stringify(l.name), l.id];
  if (l.slot) bits.push(`slot=${l.slot}`);
  if (l.text) bits.push(`text=${JSON.stringify(l.text)}`);
  if (l.title) bits.push(`title=${JSON.stringify(l.title)}`);
  if (l.screen) bits.push(`screen=${l.screen}`);
  if (l.src) bits.push(`src=${l.src}`);
  if (l.variant) bits.push(`variant=${l.variant}`);
  if (l.hidden) bits.push("hidden");
  return bits.join(" ");
}

function tree(layers, depth = 1) {
  return layers.flatMap((l) => [`${"  ".repeat(depth)}${describe(l)}`, ...(l.children ? tree(l.children, depth + 1) : [])]);
}

function exports(doc, index) {
  const dir = join(ROOT, "posts/export", doc.id);
  if (!existsSync(dir)) return [];
  const prefix = String(index + 1).padStart(2, "0");
  return readdirSync(dir).flatMap((fmt) =>
    existsSync(join(dir, fmt)) ? readdirSync(join(dir, fmt)).filter((f) => f.startsWith(prefix)).map((f) => `posts/export/${doc.id}/${fmt}/${f}`) : [],
  );
}

let failed = false;
const out = [];
for (const [ref, docId, frameId, layerId] of refs) {
  const file = join(ROOT, "posts", `${docId}.json`);
  if (!existsSync(file)) {
    console.error(`${ref}: peça não encontrada (posts/${docId}.json)`);
    failed = true;
    continue;
  }
  const doc = JSON.parse(readFileSync(file, "utf8"));
  const index = doc.frames.findIndex((f) => f.id === frameId);
  if (index < 0) {
    console.error(`${ref}: quadro ${frameId} não existe em ${doc.name}`);
    failed = true;
    continue;
  }
  const frame = doc.frames[index];
  const hit = layerId ? find(frame.layers, layerId) : undefined;
  if (layerId && !hit) {
    console.error(`${ref}: camada ${layerId} não existe no quadro ${frame.name}`);
    failed = true;
    continue;
  }
  if (json) {
    out.push({ ref, file: `posts/${docId}.json`, doc: { id: doc.id, name: doc.name, kind: doc.kind, format: doc.format, family: doc.family }, frameIndex: index, frame: hit ? undefined : frame, layer: hit?.layer, layerPath: hit?.path });
    continue;
  }
  console.log(ref);
  console.log(`  peça    ${doc.name} (${doc.kind}, ${doc.format}${doc.family ? `, ${doc.family}` : ""}) → posts/${docId}.json`);
  console.log(`  quadro  ${index + 1}/${doc.frames.length} ${JSON.stringify(frame.name)} id=${frame.id} fundo=${frame.background.slice(0, 60)}`);
  const pngs = exports(doc, index);
  if (pngs.length) console.log(`  png     ${pngs.join(", ")}`);
  if (hit) {
    console.log(`  camada  ${hit.path.join(" › ")}`);
    console.log(`          ${describe(hit.layer)}`);
  } else {
    console.log("  camadas");
    console.log(tree(frame.layers).join("\n"));
  }
}
if (json) console.log(JSON.stringify(out.length === 1 ? out[0] : out, null, 2));
process.exit(failed ? 1 : 0);
