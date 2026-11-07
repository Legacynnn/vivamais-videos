# Viva Mais media

Brand, videos, and presentations for Viva Mais. Standalone repo; the apps live in sibling checkouts (`../vivamaisa-app`, `../vivamais-web`, `../vivamais-monorepo`).

## Layout

- `brand/` — single source of truth for the brand: `tokens.json` (palette, gradients, fonts, radii, eases), generated `tokens.css`, `app-ui.css` (app tokens, only for mimicking app UI), `fonts/`, `logos/`, `frame.md` (design + motion spec), `formats.json`.
- `assets/` — shared media library (app illustrations and icons, doctor portraits, personas, footage). One copy each; videos list what they use in `assets.json`.
- `videos/` — HyperFrames projects: `ads/`, `tutorials/`, `clips/`, plus `kit/`, `capture/`, `templates/`. Read `videos/CLAUDE.md` before touching any video.
- `presentations/` — static HTML decks (apresentação + proposta), not HyperFrames. Read `presentations/README.md` before editing a deck.
- `tools/` — repo scripts behind the root `package.json`.

## Brand rules

- Change a colour, font, or radius in `brand/tokens.json`, then `npm run sync:brand`. Decks read `--vm-*` through `shared/deck.css`; videos link `assets/brand/tokens.css`.
- Violet dominates, green is the secondary accent, iris and aqua are supporting tones, never fills; light cards use `--vm-tile` with no border; token names match the product monorepo; solid fills over gradients. Full spec in `brand/frame.md`.
- Logos come from `brand/logos/`; never redraw or recolor the mark.

## Sync

`npm run sync` copies `brand/` and each video's `assets.json` files into every video and into `presentations/assets/brand/`. The copies are gitignored, so a fresh clone or a brand/library edit needs `npm run sync` before preview, render, or export. Add a shared file to `assets/`, map it in the video's `assets.json`, sync; video-specific media stays inside the video.

## Checks

- Videos: `npm run check` (all) or `npm run check -- <slug>`.
- Decks: `npm run deck:export` and compare against the previous export before calling a deck change done.
- Memory pressure: never run capture, preview, and render at the same time; `pkill -f chrome-headless-shell` when puppeteer stalls.
