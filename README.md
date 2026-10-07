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
- `projects/tutorial-painel-empresarial` — long-form tutorial of the company panel; UI captured as real DOM from `../vivamais-web` (see its README)
- `projects/intro-vivamais` — narrated ad (~1:53): a day at a client company, RH on the web and a collaborator on the phone; reuses both tutorials' captured UI (see its README)
- `projects/onboarding-plantao-*`, `projects/pos-consulta-story` — generated from templates

Each project with a `package-lock.json` installs its own deps: `npm ci` inside it.

## TV Playlist

```bash
npm run tv
npm run tv -- tutorial-painel-empresarial projects/onboard/renders/onboard-medicos-master.mp4
```

Builds `dist-tv/vivamais-tv.zip`: fullscreen looping player for another Mac on a TV. No args = newest render of each slug in `templates/tv/playlist.json`, in that order. Args override: project slug (newest render) or `.mp4` path. Copy zip to TV Mac, unzip, double-click `Play TV.command`. TV Mac needs no npm/Node. Keys: ←/→ previous/next, space pause. Instructions ship in its `README.txt`.
