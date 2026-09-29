# Viva Mais Video System

HyperFrames workspace for Viva Mais videos. Standalone repo. Expo app lives in sibling `../vivamaisa-app`; nothing here is installed into it.

## Start a Video

```bash
npm run new -- <slug> <portrait|square|landscape>
```

Example:

```bash
npm run new -- consulta-em-minutos portrait
```

Generator creates independent project in `projects/<slug>`, copies local brand fonts/logo/tokens, writes `frame.md`, `formats.json`, starter composition, and a per-video `BRIEF.md`.

## Brand Sync

```bash
npm run sync:brand
```

Reads `../vivamaisa-app/src/theme/tokens.json` (app checked out as sibling). Writes only `brand/tokens.css`.

## Workflow

1. Fill video `BRIEF.md`.
2. Use HyperFrames workflow matching deliverable.
3. Preserve `frame.md`, `formats.json`, and brand assets.
4. Run `npm run check` inside video project.
5. Preview. Render only after approval.

## Root Preview

```bash
npm run check
npx hyperframes preview --background
```

Root composition is brand-system proof, not production output.

## Projects

- `projects/walkthrough` — client-flow walkthrough (was `../vivamais-walkthrough-video`)
- `projects/onboard` — onboarding slide videos; renders get copied into the app's `assets/videos/` (was `../vivamais-onboard-videos`)
- `projects/onboarding-plantao-*`, `projects/pos-consulta-story` — generated from templates

Each project with a `package-lock.json` installs its own deps: `npm ci` inside it.
