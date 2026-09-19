import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const [slug, format = "portrait"] = process.argv.slice(2);
const presets = JSON.parse(readFileSync(new URL("../formats.json", import.meta.url), "utf8"));

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  throw new Error("Use a kebab-case slug: npm run new -- consulta-em-minutos portrait");
}

if (!presets[format]) {
  throw new Error(`Unknown format: ${format}. Use portrait, square, or landscape.`);
}

const target = new URL(`../projects/${slug}/`, import.meta.url);
const targetPath = fileURLToPath(target);

if (existsSync(targetPath)) {
  throw new Error(`Project already exists: projects/${slug}`);
}

const preset = presets[format];
const init = spawnSync(
  "npx",
  [
    "--yes",
    "hyperframes@0.8.46",
    "init",
    `projects/${slug}`,
    "--non-interactive",
    `--resolution=${preset.resolution}`,
    "--skill=general-video",
  ],
  { cwd: root, stdio: "inherit" }
);

if (init.status !== 0) {
  process.exit(init.status ?? 1);
}

mkdirSync(fileURLToPath(new URL("../projects/", import.meta.url)), { recursive: true });
cpSync(fileURLToPath(new URL("../brand/", import.meta.url)), fileURLToPath(new URL("brand/", target)), { recursive: true });
cpSync(fileURLToPath(new URL("../assets/brand/", import.meta.url)), fileURLToPath(new URL("assets/brand/", target)), { recursive: true });
writeFileSync(fileURLToPath(new URL("frame.md", target)), readFileSync(new URL("../frame.md", import.meta.url), "utf8"));
writeFileSync(fileURLToPath(new URL("formats.json", target)), JSON.stringify(presets, null, 2) + "\n");
writeFileSync(fileURLToPath(new URL("BRIEF.md", target)), readFileSync(new URL("../templates/BRIEF.template.md", import.meta.url), "utf8").replace("[Video name]", slug));

const dimensions = {
  __RESOLUTION__: preset.resolution,
  __WIDTH__: String(preset.width),
  __HEIGHT__: String(preset.height),
  __SAFE_TOP__: String(preset.safe.top),
  __SAFE_RIGHT__: String(preset.safe.right),
  __SAFE_BOTTOM__: String(preset.safe.bottom),
  __SAFE_LEFT__: String(preset.safe.left),
  __COMPOSITION_ID__: slug,
  __LOGO_WIDTH__: format === "landscape" ? "176" : "164",
  __LABEL_SIZE__: format === "landscape" ? "22" : "24",
  __TITLE_SIZE__: format === "landscape" ? "112" : format === "square" ? "96" : "116",
  __TITLE_WIDTH__: format === "landscape" ? "1180" : format === "square" ? "840" : "820",
  __COPY_SIZE__: format === "landscape" ? "34" : "38",
  __COPY_WIDTH__: format === "landscape" ? "820" : "650",
};
const starter = Object.entries(dimensions).reduce(
  (html, [token, value]) => html.replaceAll(token, value),
  readFileSync(new URL("../templates/starter.html", import.meta.url), "utf8")
);
writeFileSync(fileURLToPath(new URL("index.html", target)), starter);
process.stdout.write(`Created projects/${slug}\n`);
