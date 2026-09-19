# Viva Mais Video System

HyperFrames workspace for Viva Mais videos. Expo app remains outside this workspace.

## Start a Video

```bash
cd videos
npm run new -- <slug> <portrait|square|landscape>
```

Example:

```bash
npm run new -- consulta-em-minutos portrait
```

Generator creates independent project in `videos/projects/<slug>`, copies local brand fonts/logo/tokens, writes `frame.md`, `formats.json`, starter composition, and a per-video `BRIEF.md`.

## Brand Sync

```bash
npm run sync:brand
```

Reads `../src/theme/tokens.json`. Writes only `videos/brand/tokens.css`.

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
