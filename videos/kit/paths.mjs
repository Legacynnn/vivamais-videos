import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

export const root = pathToFileURL(process.cwd() + "/");
export const kit = new URL("./", import.meta.url);

export function pkg(name, file = "") {
  for (let dir = process.cwd(); ; dir = dirname(dir)) {
    const hit = join(dir, "node_modules", name);
    if (existsSync(hit)) return pathToFileURL(join(hit, file));
    if (dir === dirname(dir)) throw new Error(`${name} not installed; run npm install at the repo root`);
  }
}
