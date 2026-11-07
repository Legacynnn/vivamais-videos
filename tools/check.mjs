import { spawnSync } from "node:child_process";
import { relative } from "node:path";
import { root, videos } from "./videos.mjs";

const failed = videos(process.argv.slice(2)).filter((dir) => {
  console.log(`\n== ${relative(root, dir)}`);
  return spawnSync("npm", ["run", "--silent", "check"], { cwd: dir, stdio: "inherit" }).status !== 0;
});
if (failed.length) {
  console.log(`\nfailed: ${failed.map((dir) => relative(root, dir)).join(", ")}`);
  process.exit(1);
}
