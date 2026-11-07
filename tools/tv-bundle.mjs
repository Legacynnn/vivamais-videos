import { chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const videosDir = join(root, "videos");
const templateDir = join(root, "tools", "tv");
const distDir = join(root, "dist-tv");
const outDir = join(distDir, "vivamais-tv");
const zipPath = join(distDir, "vivamais-tv.zip");
const args = process.argv.slice(2);

const newestRender = (slug) => {
  const group = readdirSync(videosDir).find((g) => existsSync(join(videosDir, g, slug, "renders")));
  if (!group) return null;
  const dir = join(videosDir, group, slug, "renders");
  return readdirSync(dir)
    .filter((file) => file.endsWith(".mp4"))
    .map((file) => join(dir, file))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0] ?? null;
};

const entries = args.length ? args : JSON.parse(readFileSync(join(templateDir, "playlist.json"), "utf8"));

const sources = entries
  .map((entry) => {
    if (entry.endsWith(".mp4")) {
      const path = resolve(root, entry);
      if (!existsSync(path)) throw new Error(`Video not found: ${entry}`);
      return path;
    }
    const path = newestRender(entry);
    if (!path) throw new Error(`No renders for ${entry} in videos/*/${entry}/renders`);
    return path;
  });

if (!sources.length) throw new Error("No videos to bundle. Render something first.");

rmSync(distDir, { recursive: true, force: true });
mkdirSync(join(outDir, "videos"), { recursive: true });

const playlist = sources.map((source, i) => {
  const name = `${String(i + 1).padStart(2, "0")}-${basename(source)}`;
  copyFileSync(source, join(outDir, "videos", name));
  console.log(`${name}  <-  ${source.replace(root, "")}`);
  return name;
});

const html = readFileSync(join(templateDir, "index.html"), "utf8").replace("__PLAYLIST__", JSON.stringify(playlist));
writeFileSync(join(outDir, "index.html"), html);
copyFileSync(join(templateDir, "README.txt"), join(outDir, "README.txt"));
copyFileSync(join(templateDir, "Play TV.command"), join(outDir, "Play TV.command"));
chmodSync(join(outDir, "Play TV.command"), 0o755);

const zip = spawnSync("ditto", ["-c", "-k", "--keepParent", outDir, zipPath], { stdio: "inherit" });
if (zip.status !== 0) process.exit(zip.status ?? 1);

console.log(`\n${playlist.length} videos -> ${zipPath.replace(root, "")}`);
