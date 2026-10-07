# Apresentação Viva Mais

Static HTML rebuild of the Figma brand deck. 14 slides, 1920×1080. Not a HyperFrames composition.

- `index.html` — all slides, one `<section class="slide">` each. Edit copy here.
- `deck.css` — tokens (`:root`), shared components, per-slide layout (`.s-*`).
- `deck.js` — injects icons (`<i data-icon="name">`), page numbers (`data-page`), cover shapes (`data-deco`), viewer scaling.
- `icons.js` — Lucide icon paths. Add an icon: paste its inner SVG under a new key.
- `assets/` — brand fonts (Space Grotesk, DM Sans), logo PNGs from Figma, phone crop, pharmacy logos (`farmacias/`, Wikimedia Commons).
- `assets/app/screen-filter.png`, `screen-promo.png` — real app captures from `projects/onboarding-paciente/capture/capture-deck.mjs` (mock `deck` mode: 14 specialties, doctors at R$ 79; the R$ 99 strike and listing icons are injected).
- `reference/` — original Figma PNG exports, numbered by slide.

## View

Open `index.html` in a browser. Arrow keys jump between slides.

- `index.html?slide=7` — one slide at true size.
- `index.html?print` — all slides, one per page.

## Colour

One palette, from the brand (`vivamais-videos/brand/tokens.css`, `vivamais-brand`): violet + Verde Vida `#4EEB8C` + Azul Céu `#62B8FF`. Tokens live in `deck.css` `:root` (`--verde`, `--azul`, `--g-fresco`…).

- Backgrounds stay violet/paper; only the slide backgrounds keep soft violet glows. Cards, tiles, bars, bands and step circles are solid.
- Light slides sit on white (`--paper: #FFFFFF`). Cards on them use `--surface: #F6F5F9`, no border.
- Green is the accent. Blue is a rare spot (one small cover cross, the cover/closing headline gradient), never a fill.
- The cover/closing headline (green→blue) is the only gradient on content. Headline `<em>` is solid violet on light, solid green on dark.
- Type: Space Grotesk for titles and big numbers, DM Sans for everything else.

The PDF is assembled from the PNGs (Chrome's vector PDF renders `background-clip: text` as solid blocks in Preview).

## Export

```bash
node export.mjs        # export/NN.png for every slide + export/apresentacao-viva-mais.pdf
node export.mjs 3 7    # only those slides, PNG
```

Needs Chrome. Set `CHROME=/path/to/chrome` if not found.

## Google Slides

```bash
node export-pptx.mjs proposta   # export/proposta/proposta-viva-mais.pptx
node export-pptx.mjs index      # export/apresentacao-viva-mais.pptx
```

Each slide is a pixel-exact image of the HTML; only the elements listed in `EDIT` (script) are native, editable text and shapes on top. Proposta: cover client line, plan prices, and the `[000] vidas · R$ [0.000]/mês` placeholders (card line + "Total mensal" table row, rendered by `proposta.js` only with `?modelo` while `vidas` is null). `--native` rebuilds every slide as native shapes instead. Upload the `.pptx` to Drive and open with Google Slides. Needs `npm install` at the repo root (`pptxgenjs`, `puppeteer-core`).

## Figma

Free plan options: run the `html.to.design` plugin on `index.html?slide=N` (editable layers), or drag `export/*.png` in as flat images. Space Grotesk and DM Sans are Google Fonts, already available in Figma.

## Proposta

`proposta.html` — 5-slide commercial proposal on the same CSS, fonts and icons (`proposta.css` adds its layouts).

- Per-client values live in `proposta-dados.js`: empresa, vidas, send date, validity days, plans (inclusions + price per vida). Cover fields, MRR on the cards and the comparison table are computed from it.
- `node export.mjs proposta` → `export/proposta/NN.png` + `proposta-viva-mais.pdf`.
- Excluded from the Vercel deploy (`.vercelignore`): proposals carry client pricing.
- Cover photo: replace `assets/proposta-capa.jpg` (square, subject centred; cropped to the cross).
- Slide 4 company-panel phone is HTML (`.biz` in `proposta.css`), not a capture; the two app phones are real captures from `projects/onboarding-paciente`.

## Shared pieces

- Plan cards (`.pcards`, `.pcard`, `.free-bar`) live in `deck.css`: main deck slide 10 (static HTML, prices per vida) and proposta slide 2 (generated from `proposta-dados.js`) both use them. Change a price in both places.
- Main deck slide 8 dashboard is HTML (`.dash` in `deck.css`), drawn at 1280×800 and scaled into the laptop. Styled after the monorepo admin (`apps/admin`, `packages/web-ui`): tile cards with no border or shadow, white wells, shell grey `#F3F4FA`.
