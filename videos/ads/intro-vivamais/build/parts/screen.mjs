import { existsSync, readFileSync } from "node:fs";

const dir = new URL("../../../../../screens/dist/assets/screens/html/", import.meta.url);

export function screen(spec) {
  const [id, state = "default"] = spec.split(" ");
  const file = new URL(`${id}--${state}.html`, dir);
  if (!existsSync(file)) throw new Error(`no screen ${id} ${state}; run npm run screens`);
  return `<!-- screen:${id} ${state} -->${readFileSync(file, "utf8").trim()}<!-- /screen -->`;
}
