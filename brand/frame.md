---
name: Viva Mais
source: brand/tokens.json
colors:
  noite: "#22084A"
  viva: "#7E3BED"
  violetStrong: "#6A24DB"
  eletrico: "#9531FF"
  tint: "#F3EDFF"
  verde: "#4EEB8C"
  verdeFundo: "#0F9E62"
  azul: "#62B8FF"
  papel: "#FAFAFE"
  branco: "#FFFFFF"
  surface: "#F6F5F9"
  ink: "#22084A"
  body: "#5C5078"
  muted: "#7E7498"
  line: "#E6E4EC"
typography:
  display:
    family: Space Grotesk
    weight: 700
  headline:
    family: Space Grotesk
    weight: 500
  text:
    family: DM Sans
    weight: 400
  label:
    family: DM Sans
    weight: 500
spacing:
  base: 8
  frameInset: 88
  frameInsetLandscape: 96
  frameInsetSquare: 72
  grid: 32
motion:
  current: left
  entrance: 0.58
  exit: 0.42
  stagger: 0.06
  easing: power3.out
  ambient: none
formats:
  portrait: 1080x1920@30
  square: 1080x1080@30
  landscape: 1920x1080@30
---

# Viva Mais

Warm, human healthcare. Energetic and calm at once; never cold, bureaucratic, fintech-loud, neon, or generic SaaS.

## Color

- Violet dominates (`viva` #7E3BED, `noite` #22084A). Verde #4EEB8C is the secondary accent: tags, checks, highlighted words on dark. Azul #62B8FF only when a third distinct value is truly needed, never a fill.
- Backgrounds are violet or paper, never verde/azul. Dark frames use `--vm-grad-escuro` (purple only). Light frames sit on `branco`/`papel`; cards on them use `surface` #F6F5F9 with no border.
- Solid fills by default. No gradient text except the cover/closing headline. The symbol gradient (aqua → elétrico) belongs to the logo only.
- Text on light: `ink` / `body` / `muted`. Text on dark: white, verde for emphasis.

## Type

- Space Grotesk for titles and big numbers. DM Sans for everything readable (captions, UI, labels).
- One headline per frame. Few words, large, with air.

## Logo

- Files in `brand/logos/` (synced into each project as `assets/brand/`). Never redraw or recolor the mark, never place it on a gradient bar.

## Motion Contract

- Motion performs story. No idle wobble, breathing, looping glow, or bounce. Nothing blinks: cuts stay opaque, app screens crossfade.
- Default film current moves left. Multi-scene work records every seam in `ledger.json`.
- Enter with opacity plus transform. Exit stays in motion through the cut.
- Similar elements share duration/ease. Total stagger never exceeds 500ms.
- Hold 0.3–0.75s before a key result. Stock footage holds ~4s with dissolves, never flashes.

## Variable Style

A video may change subject, format, scene count, narration, footage, UI density, and genre. It may not replace palette, font pairing, spacing grid, logo treatment, motion contract, or accessibility floor.

## Source

`brand/tokens.json` is the source. `npm run sync:brand` regenerates `brand/tokens.css` (and `brand/app-ui.css` from the app's tokens, used only when mimicking app UI). `npm run sync` copies brand files into every video and presentation.
