---
name: Viva Mais
source: brand/tokens.json
colors:
  primary: "#7E3BED"
  primaryStrong: "#6A24DB"
  primarySoft: "#F5F0FE"
  secondary: "#12FFD7"
  secondaryStrong: "#008F7A"
  iris: "#9681EB"
  azure: "#5A9AF0"
  foreground: "#17151E"
  mutedForeground: "#726F80"
  border: "#E6E4EC"
  tile: "#F6F5F9"
  panel: "#F3F4FA"
  canvas: "#FAFAFE"
  mist: "#F3EDFF"
  white: "#FFFFFF"
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

Colours are generated from the product (`packages/theme/tokens.json` in the monorepo, via `pnpm run sync:monorepo`): scales `violet`, `spark`, `ink`, `iris`, `azure`, each 50–950 (`--vm-violet-500`). Roles point at scale steps (`--vm-foreground` = `ink-900`).

- Violet dominates (`primary` = violet-500 #7E3BED). Spark is the secondary accent (`secondary` = spark-400 #12FFD7; `secondary-strong` spark-700 for spark text or fills on light): tags, checks, highlighted words on dark. Iris #9681EB and azure #5A9AF0 are supporting tones for illustration, charts, and a third value when needed; never large fills.
- Backgrounds are violet or white/`canvas`, never spark/azure. Dark frames use `--vm-grad-escuro` (purple only). Cards on light frames use `tile` #F6F5F9 with no border, product style; white wells inside a tile when content needs a second level.
- Text on light: `foreground` ink-900, body ink-600, `muted-foreground` ink-500. Text on dark: white, spark for emphasis.
- Solid fills by default. No gradient text except the cover/closing headline. `logo-aqua` → `logo-purple` belongs to the logo only.

## Type

- Space Grotesk for titles and big numbers, weight 400, tracking -0.035em, like the site headlines (`apps/site`). DM Sans for everything readable (captions, UI, labels).
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

`brand/tokens.json` is the source. `pnpm run sync:brand` regenerates `brand/tokens.css` (and `brand/app-ui.css` from the app's tokens, used only when mimicking app UI). `pnpm run sync` copies brand files into every video and presentation.
