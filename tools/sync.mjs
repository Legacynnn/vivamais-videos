import { constants, copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const brand = join(root, "brand");
const library = join(root, "assets");
const kit = join(root, "videos/kit");
const screens = join(root, "screens/dist/assets/screens");
const START = "# sync:start";
const END = "# sync:end";

function copy(from, to) {
  if (!existsSync(from)) throw new Error(`missing ${relative(root, from)}`);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to, constants.COPYFILE_FICLONE);
}

function targets(only) {
  const videos = readdirSync(join(root, "videos"), { withFileTypes: true })
    .filter((group) => group.isDirectory() && !["kit", "capture", "templates"].includes(group.name))
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
  for (const [local, source] of entries) copy(source.startsWith("@kit/") ? join(kit, source.slice(5)) : join(library, source), join(dir, local));
  return entries.map(([local]) => `/${local}`);
}

const MARKER = /(<!-- screen:([\w-]+)(?: ([\w-]+))? -->)[\s\S]*?(<!-- \/screen -->)/g;

function syncScreens(dir) {
  const pages = [dir, join(dir, "compositions")]
    .filter((folder) => existsSync(folder))
    .flatMap((folder) => readdirSync(folder).filter((name) => name.endsWith(".html")).map((name) => join(folder, name)));
  let used = false;
  for (const page of pages) {
    const html = readFileSync(page, "utf8");
    if (!html.includes("<!-- screen:")) continue;
    used = true;
    const next = html.replace(MARKER, (_, open, id, state = "default", close) => {
      const fragment = join(screens, "html", `${id}--${state}.html`);
      if (!existsSync(fragment)) throw new Error(`${relative(root, page)}: no screen ${id} ${state}; run \`npm run screens\``);
      const body = readFileSync(fragment, "utf8").trim();
      for (const [, file] of body.matchAll(/assets\/screens\/(img\/[^"')\s]+)/g)) copy(join(screens, file), join(dir, "assets/screens", file));
      return `${open}${body}${close}`;
    });
    if (next !== html) writeFileSync(page, next);
  }
  if (!used) return [];
  copy(join(screens, "screens.css"), join(dir, "assets/screens/screens.css"));
  for (const file of readdirSync(join(screens, "fonts"))) copy(join(screens, "fonts", file), join(dir, "assets/screens/fonts", file));
  return ["/assets/screens/"];
}

function writeIgnore(dir, lines) {
  const file = join(dir, ".gitignore");
  const current = existsSync(file) ? readFileSync(file, "utf8") : "";
  const kept = current.replace(new RegExp(`${START}[\\s\\S]*?${END}\\n?`), "").trimEnd();
  const block = [START, ...lines.sort(), END].join("\n");
  writeFileSync(file, `${kept ? `${kept}\n\n` : ""}${block}\n`);
}

for (const dir of targets(process.argv.slice(2))) {
  const lines = [...syncBrand(dir), ...syncLibrary(dir), ...syncScreens(dir)];
  writeIgnore(dir, lines);
  console.log(`${relative(root, dir)}: ${lines.length - 1} library files + brand`);
}
