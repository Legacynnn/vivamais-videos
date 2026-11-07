import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const HYPERFRAMES = `hyperframes@${JSON.parse(readFileSync(join(root, "package.json"), "utf8")).config.hyperframes}`;
const MODELS = { ad: "ads", tutorial: "tutorials" };
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

for (const file of ["AGENTS.md", "CLAUDE.md", "index.html"]) rmSync(join(dir, file), { force: true });
cpSync(join(root, "brand/frame.md"), join(dir, "frame.md"));
cpSync(join(root, "brand/formats.json"), join(dir, "formats.json"));

const tokens = { __SLUG__: slug, __RES__: preset.resolution, __W__: String(preset.width), __H__: String(preset.height), "[Video name]": slug, "[portrait | square | landscape]": format };
const fill = (text) => Object.entries(tokens).reduce((out, [k, v]) => out.replaceAll(k, v), text);

function copyTemplate(from, to) {
  for (const name of readdirSync(from)) {
    const src = join(from, name);
    const dst = join(to, name);
    if (statSync(src).isDirectory()) {
      mkdirSync(dst, { recursive: true });
      copyTemplate(src, dst);
    } else writeFileSync(dst, fill(readFileSync(src, "utf8")));
  }
}
copyTemplate(join(root, "videos/templates", model), dir);

const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
pkg.name = slug;
pkg.scripts = Object.fromEntries(["dev:preview", "check", "render", "publish"].map((cmd) => {
  const [name, sub = name] = cmd.split(":");
  return [name, `npx --yes ${HYPERFRAMES} ${sub}`];
}));
pkg.scripts.seams = "node $HOME/.claude/skills/motion-doctrine/scripts/seam-gate.mjs verify --ledger ledger.json --project .";
writeFileSync(join(dir, "package.json"), JSON.stringify(pkg, null, 2) + "\n");

const sync = spawnSync("node", [join(root, "tools/sync.mjs"), slug], { cwd: root, stdio: "inherit" });
if (sync.status !== 0) process.exit(sync.status ?? 1);
console.log(`Created ${rel} (${model}, ${format}). Starter scenes in compositions/; fill BRIEF.md next.`);
