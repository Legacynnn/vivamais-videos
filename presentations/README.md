# Presentations

Static HTML decks, 1920×1080, one `<section class="slide">` per slide. Not HyperFrames.

- `index.html` — Apresentação Viva Mais (14 slides). Deployed to Vercel (project `apresentacao-viva-mais`).
- `proposta.html` — proposta comercial template (5 slides). Never deployed: it carries client pricing.
- `flyer.html` — A5 printed flyer (148×210mm, one page): plan usage, QualiService hours, WhatsApp QR. `npm run flyer:export` → `export/flyer/`: exact A5 PDF, A5 + 3mm bleed PDF (`?bleed`, TrimBox on A5) for the print shop, 4× PNG. Chrome rounds page sizes, so `tools/pdf-boxes.py` (pypdf) sets exact boxes. Avoid CSS `filter` on mockups: Chrome flattens the subtree to a 300-dpi bitmap. Needs `npm run sync` first (patient photo comes from `assets.json`).
- `shared/` — `deck.css` (brand token mapping in `:root`, shared components, per-slide layout `.s-*`), `deck.js` (icons via `<i data-icon>`, page numbers, cover shapes, viewer scaling), `icons.js` (Lucide paths; add an icon by pasting its inner SVG under a new key).
- `proposta/` — `proposta.css` (proposta-only layouts), `proposta.js` (MRR and table rendering), `proposta-dados.js` (per-client values).
- `assets/` — deck images: `app/` (real app captures, perk photos), `icons/`, `farmacias/` (Wikimedia Commons), hero and cover photos. `assets/brand/` is a synced copy of `brand/` (fonts, logos, tokens): run `npm run sync` from the repo root.
- `reference/` — original Figma PNG exports, numbered by slide.
- `tools/` — `export.mjs` (PNG + PDF), `export-pptx.mjs` (Google Slides), `pdf-links.py`, `denuncia.mjs` (captures the real `/canal-denuncias` page from `vivamais-web` against a mock API).
- `IMAGE-BRIEFS.md` — briefs for the photos the user generates.

## View

Open `index.html` in a browser. Arrow keys jump between slides.

- `index.html?slide=7` — one slide at true size.
- `index.html?print` — all slides, one per page.

## Colour

Tokens come from `brand/tokens.json` (`@import` of `assets/brand/tokens.css` at the top of `shared/deck.css`); the deck's `:root` aliases use the same role names (`--primary`, `--secondary`, `--tile`, `--foreground`…) mapped onto `--vm-*`. Change brand values in `brand/tokens.json`, never in `deck.css`. Inside the `.dash` / `.dnp` app mockups `--muted` is the product's muted background, not text.

- Violet dominates. Spark (`--secondary`) is the accent. Iris and azure are supporting tones, never fills.
- Light slides sit on white (`--white`). Cards on them use `--tile` (#F6F5F9), no border.
- Text: `--foreground` (ink-900), `--body` (ink-600), `--muted-foreground` (ink-500).
- Solid fills. The cover/closing headline gradient is the only gradient on content; slide backgrounds keep soft violet glows.
- Space Grotesk for titles and big numbers, DM Sans for everything else.

## Export

From the repo root:

```bash
npm run deck:export               # presentations/export/NN.png + apresentacao-viva-mais.pdf
npm run deck:export -- 3 7        # only those slides, PNG
npm run deck:export -- proposta   # presentations/export/proposta/
npm run deck:pptx -- proposta     # presentations/export/proposta/proposta-viva-mais.pptx
npm run deck:pptx -- index        # presentations/export/apresentacao-viva-mais.pptx
```

Needs Chrome (`CHROME=/path/to/chrome` if not found) and `npm install` at the repo root. The PDF is assembled from the PNGs (Chrome's vector PDF renders `background-clip: text` as solid blocks in Preview). Headless quirk: the viewport is shorter than `--window-size`, so export shoots 1300px tall with a 110px offset and center-crops.

pptx: each slide is a pixel-exact image of the HTML; only the elements listed in `EDIT` (in the script) are native editable text and shapes on top. Proposta: cover client line, plan prices, and the `[000] vidas · R$ [0.000]/mês` placeholders (rendered by `proposta.js` only with `?modelo` while `vidas` is null). `--native` rebuilds every slide as native shapes instead. Upload to Drive and open with Google Slides.

## Deploy

`.vercelignore` is an allowlist: only `index.html`, `shared/` and `assets/` (minus `assets/proposta-*`) upload. Run `npm run sync` first so `assets/brand/` exists. The brand manual (`../vivamais-brand`) keeps its own copy of the exported PDF and slide JPGs; refresh it by hand after an export.

## Figma

Free plan: run the `html.to.design` plugin on `index.html?slide=N` (editable layers), or drag `export/*.png` in as flat images.

## Proposta

- Per-client values in `proposta/proposta-dados.js`: empresa, vidas, send date, validity days, plans (inclusions + price per vida). Cover fields, MRR on the cards and the comparison table are computed from it. It is a template: empresa stays `[Nome da empresa]` and vidas `null` until edited per client.
- Cover photo: replace `assets/proposta-capa.jpg` (square, subject centred; cropped to the cross).
- The app phones and the company-panel phone are HTML (`.phone.ui`, `.biz`), not captures.

## Shared pieces

- Plan cards (`.pcards`, `.pcard`, `.free-bar`) live in `deck.css`: main deck slide 10 (static HTML) and proposta slide 2 (generated from `proposta-dados.js`). Change a price in both places.
- Slide 8 dashboard is HTML (`.dash`), drawn at 1280×800 and scaled into the laptop, in the monorepo admin style (borderless tiles, white wells, shell `#F3F4FA`).
- Class names are global across both decks: prefix proposta-only and mock-UI classes (`pdash`, `dn-*`) to avoid collisions.
