import { writeFileSync, mkdirSync } from "node:fs";
const root = new URL("../", import.meta.url);
mkdirSync(new URL("assets/fonts/", root), { recursive: true });
const wanted = { Poppins: [400, 500, 600, 700], "Plus Jakarta Sans": [400, 500, 700, 800] };
for (const [family, weights] of Object.entries(wanted)) {
  for (const w of weights) {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${w}&display=block`, { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36" } })).text();
    const blocks = css.split("/*").filter((b) => b.trim().startsWith("latin */"));
    const url = blocks[0].match(/url\((https:[^)]+)\)/)[1];
    const file = `${family.replace(/ /g, "")}-${w}.woff2`;
    writeFileSync(new URL(`assets/fonts/${file}`, root), Buffer.from(await (await fetch(url)).arrayBuffer()));
    process.stdout.write(`${file}\n`);
  }
}
