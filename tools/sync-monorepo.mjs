import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { checkout, config, git, lockFile, readLock, root } from "./monorepo.mjs";

const locked = process.argv.includes("--locked");
const status = process.argv.includes("--status");
const lock = readLock();

function remoteHead() {
  const out = execFileSync("git", ["ls-remote", config.url, `refs/heads/${config.ref}`], { encoding: "utf8" });
  return out.split(/\s+/)[0];
}

if (status) {
  const head = remoteHead();
  if (!lock) console.log(`no lock; ${config.ref} is at ${head.slice(0, 9)}`);
  else if (lock.sha === head) console.log(`up to date with ${config.ref} (${lock.sha.slice(0, 9)}, ${lock.date})`);
  else console.log(`behind ${config.ref}: locked ${lock.sha.slice(0, 9)} (${lock.date}), remote ${head.slice(0, 9)}. Run \`pnpm run sync:monorepo\`.`);
  process.exit(0);
}

if (locked && !lock) throw new Error("--locked needs monorepo.lock; run `pnpm run sync:monorepo` once");

if (!existsSync(join(checkout, ".git"))) {
  execFileSync("git", ["clone", "--filter=blob:none", "--no-checkout", "--depth", "1", "--branch", config.ref, config.url, checkout], { stdio: "inherit" });
}
git("sparse-checkout", "set", "--no-cone", ...config.paths);

const want = locked ? lock.sha : config.ref;
git("fetch", "--depth", "1", "origin", want);
const sha = git("rev-parse", "FETCH_HEAD");
git("checkout", "--detach", "--force", sha);
const date = git("log", "-1", "--format=%cs");

writeFileSync(lockFile, `${JSON.stringify({ ref: config.ref, sha, date }, null, 2)}\n`);
console.log(`.monorepo at ${config.ref} ${sha.slice(0, 9)} (${date})${lock && lock.sha !== sha ? `, was ${lock.sha.slice(0, 9)}` : ""}`);

const theme = JSON.parse(readFileSync(join(checkout, "packages/theme/tokens.json"), "utf8"));
const brandFile = join(root, "brand/tokens.json");
const brand = JSON.parse(readFileSync(brandFile, "utf8"));
const kebab = (key) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const resolve = (value) => (value.startsWith("#") ? value : value.includes(".") ? `{${value}}` : theme.color[value]);
const roles = Object.fromEntries(
  Object.entries(theme.theme.light)
    .map(([role, value]) => [kebab(role), resolve(value)])
    .filter(([role]) => !(role in theme.color))
);
const next = { ...brand, color: { ...theme.color, ...roles, ...brand.colorLocal } };
const before = JSON.stringify(brand.color);
writeFileSync(brandFile, `${JSON.stringify(next, null, 2)}\n`);
console.log(before === JSON.stringify(next.color) ? "brand/tokens.json colours unchanged" : "brand/tokens.json colours updated from @vivamais/theme; run `pnpm run sync:brand`");
