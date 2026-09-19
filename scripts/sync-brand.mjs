import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../../src/theme/tokens.json", import.meta.url));
const output = fileURLToPath(new URL("../brand/tokens.css", import.meta.url));
const tokens = JSON.parse(readFileSync(source, "utf8"));
const colorVariables = Object.entries(tokens.color)
  .flatMap(([name, value]) => {
    if (typeof value === "string") return [[`--viva-${name}`, value]];
    return Object.entries(value).map(([scale, hex]) => [`--viva-${name}-${scale}`, hex]);
  })
  .map(([name, value]) => `  ${name}: ${value};`)
  .join("\n");
const radiusVariables = Object.entries(tokens.radius)
  .map(([name, value]) => `  --viva-radius-${name}: ${value}px;`)
  .join("\n");
const spaceVariables = Object.entries(tokens.space)
  .map(([name, value]) => `  --viva-space-${name}: ${value}px;`)
  .join("\n");
const css = `@font-face {
  font-family: "Space Grotesk";
  src: url("assets/brand/fonts/SpaceGrotesk-Medium.ttf") format("truetype");
  font-style: normal;
  font-weight: 500;
  font-display: block;
}

@font-face {
  font-family: "Space Grotesk";
  src: url("assets/brand/fonts/SpaceGrotesk-Bold.ttf") format("truetype");
  font-style: normal;
  font-weight: 700;
  font-display: block;
}

@font-face {
  font-family: "DM Sans";
  src: url("assets/brand/fonts/DMSans-Regular.ttf") format("truetype");
  font-style: normal;
  font-weight: 400;
  font-display: block;
}

@font-face {
  font-family: "DM Sans";
  src: url("assets/brand/fonts/DMSans-Medium.ttf") format("truetype");
  font-style: normal;
  font-weight: 500;
  font-display: block;
}

@font-face {
  font-family: "DM Sans";
  src: url("assets/brand/fonts/DMSans-Bold.ttf") format("truetype");
  font-style: normal;
  font-weight: 700;
  font-display: block;
}

:root {
${colorVariables}
${radiusVariables}
${spaceVariables}
}
`;
writeFileSync(output, css);
