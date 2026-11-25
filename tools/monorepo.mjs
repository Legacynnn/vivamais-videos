import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("..", import.meta.url));
export const checkout = join(root, ".monorepo");
export const lockFile = join(root, "monorepo.lock");
export const config = JSON.parse(readFileSync(join(root, "monorepo.json"), "utf8"));

export const git = (...args) => execFileSync("git", ["-C", checkout, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 256 * 1024 * 1024 }).trim();

export const readLock = () => (existsSync(lockFile) ? JSON.parse(readFileSync(lockFile, "utf8")) : null);

export function requireCheckout() {
  if (!existsSync(join(checkout, ".git"))) throw new Error("monorepo not fetched: run `pnpm run sync:monorepo`");
  return checkout;
}

export const monorepoFile = (path) => join(requireCheckout(), path);

export function blob(path) {
  try {
    return git("rev-parse", `HEAD:${path}`);
  } catch {
    return null;
  }
}
