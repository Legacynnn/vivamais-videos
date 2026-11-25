import { existsSync, lstatSync, mkdirSync, readlinkSync, symlinkSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";

const monorepo = fileURLToPath(new URL("../../.monorepo", import.meta.url));
const link = `${monorepo}/packages/web-ui/node_modules`;
const target = fileURLToPath(new URL("../node_modules", import.meta.url));

if (!existsSync(`${monorepo}/packages/web-ui`)) {
  console.error("Missing .monorepo/packages/web-ui. Run `pnpm run sync:monorepo` at the repo root.");
  process.exit(1);
}

function ensureLink(from, to) {
  const current = lstatSync(from, { throwIfNoEntry: false });
  if (current?.isSymbolicLink() && readlinkSync(from) === to) return;
  if (current) {
    if (!current.isSymbolicLink()) {
      console.error(`${from} exists and is not a symlink; remove it by hand.`);
      process.exit(1);
    }
    unlinkSync(from);
  }
  mkdirSync(fileURLToPath(new URL(".", `file://${from}`)), { recursive: true });
  symlinkSync(to, from, "dir");
  console.log(`linked ${from} -> ${to}`);
}

ensureLink(link, target);
ensureLink(`${target}/@vivamais/tsconfig`, `${monorepo}/packages/tsconfig`);
