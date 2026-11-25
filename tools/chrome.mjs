import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const system = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (existsSync(system)) return system;
  const cache = join(homedir(), ".cache/puppeteer/chrome");
  if (existsSync(cache)) {
    for (const version of readdirSync(cache).sort().reverse()) {
      const bin = join(cache, version, "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing");
      if (existsSync(bin)) return bin;
    }
  }
  throw new Error("Chrome not found. Set CHROME=/path/to/chrome");
}
