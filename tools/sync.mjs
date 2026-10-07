import { constants, copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const brand = join(root, "brand");
const library = join(root, "assets");
const START = "# sync:start";
const END = "# sync:end";

function copy(from, to) {
  if (!existsSync(from)) throw new Error(`missing ${relative(root, from)}`);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to, constants.COPYFILE_FICLONE);
}

function targets(only) {
  const videos = readdirSync(join(root, "videos"), { withFileTypes: true })
    .filter((group) => group.isDirectory() && group.name !== "kit" && group.name !== "capture")
    .flatMap((group) =>
      readdirSync(join(root, "videos", group.name), { withFileTypes: true })
        .filter((d) => d.isDirectory() && existsSync(join(root, "videos", group.name, d.name, "index.html")))
        .map((d) => join(root, "videos", group.name, d.name))
    );
  const all = [...videos, join(root, "presentations")];
  return only.length ? all.filter((dir) => only.some((name) => dir.endsWith(`/${name}`))) : all;
}

function syncBrand(dir) {
  const out = join(dir, "assets/brand");
  for (const file of readdirSync(join(brand, "fonts"))) copy(join(brand, "fonts", file), join(out, "fonts", file));
  for (const file of readdirSync(join(brand, "logos"))) copy(join(brand, "logos", file), join(out, file));
  for (const file of ["tokens.css", "app-ui.css"]) copy(join(brand, file), join(out, file));
  return ["/assets/brand/"];
}

function syncLibrary(dir) {
  const manifest = join(dir, "assets.json");
  if (!existsSync(manifest)) return [];
  const entries = Object.entries(JSON.parse(readFileSync(manifest, "utf8")));
  for (const [local, source] of entries) copy(join(library, source), join(dir, local));
  return entries.map(([local]) => `/${local}`);
}

function writeIgnore(dir, lines) {
  const file = join(dir, ".gitignore");
  const current = existsSync(file) ? readFileSync(file, "utf8") : "";
  const kept = current.replace(new RegExp(`${START}[\\s\\S]*?${END}\\n?`), "").trimEnd();
  const block = [START, ...lines.sort(), END].join("\n");
  writeFileSync(file, `${kept ? `${kept}\n\n` : ""}${block}\n`);
}

for (const dir of targets(process.argv.slice(2))) {
  const lines = [...syncBrand(dir), ...syncLibrary(dir)];
  writeIgnore(dir, lines);
  console.log(`${relative(root, dir)}: ${lines.length - 1} library files + brand`);
}
