import { existsSync, readFileSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { basename, join } from "node:path";
import { videos } from "./videos.mjs";

const [slug, name] = process.argv.slice(2);
if (!slug) throw new Error("Use: npm run render -- <slug> [output-name]");
const [dir] = videos([slug]);
if (!dir) throw new Error(`No video named ${slug}`);

const pin = JSON.parse(readFileSync(join(dir, "package.json"), "utf8")).scripts.render.match(/hyperframes@[\d.]+/)[0];
const out = join(dir, "renders", `${name ?? basename(dir)}.mp4`);
const run = (cmd, args, opts = {}) => spawnSync(cmd, args, { cwd: dir, stdio: "inherit", ...opts });

if (run("node", [join(dir, "../../../tools/sync.mjs"), basename(dir)]).status !== 0) process.exit(1);
if (run("npx", ["--yes", pin, "check"]).status !== 0) process.exit(1);
if (run("npx", ["--yes", pin, "render", "-o", out]).status !== 0 || !existsSync(out)) process.exit(1);

const probe = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream_side_data=rotation", "-of", "csv=p=0", out], { encoding: "utf8" });
if (probe.stdout.trim() && probe.stdout.trim() !== "0") {
  const fixed = out.replace(/\.mp4$/, ".fixed.mp4");
  run("ffmpeg", ["-y", "-v", "error", "-display_rotation:v:0", "0", "-i", out, "-c", "copy", "-movflags", "+faststart", fixed]);
  renameSync(fixed, out);
  console.log(`stripped rotation flag ${probe.stdout.trim()}`);
}
console.log(`rendered ${out}`);
