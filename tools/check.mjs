import { existsSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const only = process.argv.slice(2);
const videos = readdirSync(join(root, "videos"), { withFileTypes: true })
  .filter((group) => group.isDirectory() && !["kit", "capture", "templates"].includes(group.name))
  .flatMap((group) => readdirSync(join(root, "videos", group.name)).map((name) => join(root, "videos", group.name, name)))
  .filter((dir) => existsSync(join(dir, "index.html")) && (!only.length || only.some((name) => dir.endsWith(`/${name}`))));

const failed = videos.filter((dir) => {
  console.log(`\n== ${relative(root, dir)}`);
  return spawnSync("npm", ["run", "--silent", "check"], { cwd: dir, stdio: "inherit" }).status !== 0;
});
if (failed.length) {
  console.log(`\nfailed: ${failed.map((dir) => relative(root, dir)).join(", ")}`);
  process.exit(1);
}
