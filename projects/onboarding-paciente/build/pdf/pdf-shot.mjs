import puppeteer from "puppeteer-core";
const CHROME = `${process.env.HOME}/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"] });
for (const n of ["receita", "exames", "atestado"]) {
  const p = await b.newPage();
  await p.goto(`file:///tmp/vmpdf/out/${n}.html`, { waitUntil: "load" });
  await p.addStyleTag({ content: "@page{margin:16mm 18mm 24mm 18mm !important}" });
  await p.pdf({ path: `/tmp/vmpdf/out/${n}.pdf`, format: "A4", printBackground: true, margin: { top: "16mm", right: "18mm", bottom: "24mm", left: "18mm" }, displayHeaderFooter: true, headerTemplate: "<span></span>", footerTemplate: `<div style="width:100%;font-family:'Liberation Sans',Arial,sans-serif;font-size:7pt;color:#000;text-align:right;padding-right:18mm">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>` });
  await p.close();
}
await b.close();
