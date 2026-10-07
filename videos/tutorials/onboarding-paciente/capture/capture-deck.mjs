import { readFileSync } from "node:fs";
import { open, go, tap, shot, sleep, mock } from "./lib.mjs";

const ICONS = new URL("../../../../.cache/app-web/assets/icons/", import.meta.url);
const ICON_FILES = {
  "Médico Clínico": "medico.png",
  Cardiologia: "cardio.png",
  Dermatologia: "derma.png",
  Ginecologia: "ginecologia.png",
  Ortopedia: "ortopedia.png",
};
const icons = Object.fromEntries(
  Object.entries(ICON_FILES).map(([name, file]) => [name, `data:image/png;base64,${readFileSync(new URL(file, ICONS)).toString("base64")}`])
);

const blur = (page) => page.evaluate(() => document.activeElement && document.activeElement.blur());

function promo(icons) {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.top < innerHeight;
  };
  const leaves = [...document.querySelectorAll("div,span")].filter((el) => el.children.length === 0 && visible(el));
  for (const el of leaves) {
    const t = el.textContent.trim();
    if (t === "R$ 79,00" && !el.dataset.vmPromo) {
      el.dataset.vmPromo = "1";
      const was = el.cloneNode(true);
      was.textContent = "R$ 99,00";
      was.style.cssText += ";font-size:12px;line-height:14px;font-weight:500;color:#9C98AB;text-decoration:line-through;";
      el.parentElement.insertBefore(was, el);
    }
    if (icons[t] && !el.dataset.vmIcon) {
      el.dataset.vmIcon = "1";
      el.style.display = "flex";
      el.style.alignItems = "center";
      const img = document.createElement("img");
      img.src = icons[t];
      img.style.cssText = "width:16px;height:16px;object-fit:contain;margin-right:5px;flex:none;";
      el.prepend(img);
    }
  }
}

await mock("reset");
await mock("set", { deck: true });
const { browser, page } = await open();
await go(page, "/", { wait: 6000 });
await tap(page, "Buscar médico ou especialidade", { wait: 3500 });
await blur(page);
await sleep(800);
if (process.argv.includes("--raw")) await shot(page, "deck-listing-raw");
await page.evaluate(promo, icons);
await sleep(400);
await shot(page, "deck-listing");
await tap(page, "Filtros", { exact: true, wait: 2500 });
await shot(page, "deck-filter");
await browser.close();
