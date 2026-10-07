import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const root = new URL("../", import.meta.url);
const stamp = `${process.env.HOME}/.claude/skills/motion-doctrine/scripts/seam-stamp.mjs`;
const run = spawnSync("node", [stamp, "--ledger", "ledger.json", "--write", "index.html"], { cwd: root, stdio: "inherit" });
if (run.status !== 0) process.exit(run.status ?? 1);
const file = new URL("index.html", root);
const html = readFileSync(file, "utf8").replace(/(\/\/ <seams:auto>[\s\S]*?\/\/ <\/seams:auto>)/, (block) => block.replaceAll("autoAlpha", "opacity"));
writeFileSync(file, html);
