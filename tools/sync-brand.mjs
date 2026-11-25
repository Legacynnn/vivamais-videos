import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const brand = (file) => fileURLToPath(new URL(`../brand/${file}`, import.meta.url));
const vars = (prefix, entries) => entries.map(([name, value]) => `  --${prefix}-${name}: ${value};`).join("\n");

const tokens = JSON.parse(readFileSync(brand("tokens.json"), "utf8"));
const faces = tokens.fontFiles
  .map(([family, weight, file]) => `@font-face {\n  font-family: "${family}";\n  src: url("fonts/${file}") format("truetype");\n  font-style: normal;\n  font-weight: ${weight};\n  font-display: block;\n}`)
  .join("\n\n");
const flat = (entries) =>
  entries.flatMap(([name, value]) =>
    typeof value === "string" ? [[name, value]] : Object.entries(value).map(([step, hex]) => [`${name}-${step}`, hex])
  );
const colors = flat(Object.entries(tokens.color)).map(([name, value]) => [
  name,
  value.replace(/^\{(\w+)\.(\w+)\}$/, (_, family, step) => `var(--vm-${family}-${step})`),
]);
const groups = [vars("vm", colors)].concat(
  ["gradient", "font", "radius", "ease"].map((group) =>
    vars(`vm-${group === "gradient" ? "grad" : group}`, Object.entries(tokens[group]))
  )
);
writeFileSync(brand("tokens.css"), `${faces}\n\n:root {\n${groups.join("\n")}\n}\n`);
console.log("brand/tokens.css");

const app = fileURLToPath(new URL("../.monorepo/packages/theme/tokens.json", import.meta.url));
if (!existsSync(app)) {
  console.log("skip brand/app-ui.css: run `pnpm run sync:monorepo`");
  process.exit(0);
}
const appTokens = JSON.parse(readFileSync(app, "utf8"));
const radius = Object.entries(appTokens.radius).map(([name, value]) => [`radius-${name}`, `${value}px`]);
const space = Object.entries(appTokens.space).map(([name, value]) => [`space-${name}`, `${value}px`]);
writeFileSync(brand("app-ui.css"), `:root {\n${vars("viva", [...flat(Object.entries(appTokens.color)), ...radius, ...space])}\n}\n`);
console.log("brand/app-ui.css");
