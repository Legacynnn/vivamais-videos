import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const HYPERFRAMES = "hyperframes@0.8.95";
const MODELS = { ad: "ads", tutorial: "tutorials" };
const root = fileURLToPath(new URL("..", import.meta.url));
const [model, slug, format = "portrait"] = process.argv.slice(2);
const presets = JSON.parse(readFileSync(join(root, "brand/formats.json"), "utf8"));

if (!MODELS[model]) throw new Error("Use: npm run new -- <ad|tutorial> <slug> [portrait|square|landscape]");
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Use a kebab-case slug, got: ${slug}`);
if (!presets[format]) throw new Error(`Unknown format: ${format}. Use portrait, square, or landscape.`);

const rel = `videos/${MODELS[model]}/${slug}`;
const dir = join(root, rel);
if (existsSync(dir)) throw new Error(`Already exists: ${rel}`);

const preset = presets[format];
const init = spawnSync(
  "npx",
  ["--yes", HYPERFRAMES, "init", rel, "--non-interactive", `--resolution=${preset.resolution}`, "--skill=general-video"],
  { cwd: root, stdio: "inherit" }
);
if (init.status !== 0) process.exit(init.status ?? 1);

for (const file of ["AGENTS.md", "CLAUDE.md"]) rmSync(join(dir, file), { force: true });
cpSync(join(root, "brand/frame.md"), join(dir, "frame.md"));
cpSync(join(root, "brand/formats.json"), join(dir, "formats.json"));
writeFileSync(join(dir, "BRIEF.md"), readFileSync(join(root, `videos/templates/${model}/BRIEF.md`), "utf8").replace("[Video name]", slug));
writeFileSync(join(dir, "assets.json"), "{}\n");

const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
pkg.name = slug;
pkg.scripts = Object.fromEntries(["dev:preview", "check", "render", "publish"].map((cmd) => {
  const [name, sub = name] = cmd.split(":");
  return [name, `npx --yes ${HYPERFRAMES} ${sub}`];
}));
pkg.scripts.seams = "node $HOME/.claude/skills/motion-doctrine/scripts/seam-gate.mjs verify --ledger ledger.json --project .";
writeFileSync(join(dir, "package.json"), JSON.stringify(pkg, null, 2) + "\n");

const landscape = format === "landscape";
const square = format === "square";
const tokens = {
  __RESOLUTION__: preset.resolution,
  __WIDTH__: String(preset.width),
  __HEIGHT__: String(preset.height),
  __SAFE_TOP__: String(preset.safe.top),
  __SAFE_RIGHT__: String(preset.safe.right),
  __SAFE_BOTTOM__: String(preset.safe.bottom),
  __SAFE_LEFT__: String(preset.safe.left),
  __COMPOSITION_ID__: slug,
  __LOGO_WIDTH__: landscape ? "240" : "220",
  __LABEL_SIZE__: landscape ? "22" : "24",
  __TITLE_SIZE__: landscape ? "112" : square ? "96" : "116",
  __TITLE_WIDTH__: landscape ? "1180" : square ? "840" : "820",
  __COPY_SIZE__: landscape ? "34" : "38",
  __COPY_WIDTH__: landscape ? "820" : "650",
};
const starter = Object.entries(tokens).reduce(
  (html, [token, value]) => html.replaceAll(token, value),
  readFileSync(join(root, "videos/templates/starter.html"), "utf8")
);
writeFileSync(join(dir, "index.html"), starter);

const sync = spawnSync("node", [join(root, "tools/sync.mjs"), slug], { cwd: root, stdio: "inherit" });
if (sync.status !== 0) process.exit(sync.status ?? 1);
console.log(`Created ${rel} (${model}, ${format}). Fill BRIEF.md next.`);
