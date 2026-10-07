import { readdirSync } from "node:fs";
import { buildState } from "../../../kit/ui-css.mjs";
for (const f of readdirSync(new URL("../capture/states/", import.meta.url))) {
  const n = f.replace(/\.json$/, "");
  await buildState(n, `loc-${n}`);
}
console.log("localized");
