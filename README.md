# Viva Mais media

Brand system, videos, and presentations for Viva Mais. The apps live in sibling checkouts (`../vivamaisa-app`, `../vivamais-web`); nothing here is installed into them.

```
brand/           tokens.json → tokens.css, app-ui.css, fonts/, logos/, frame.md, formats.json
assets/          shared media library (app illustrations/icons, people, footage)
videos/
  ads/           short: motion + voice + music
  tutorials/     long: chapters + transitions + on-screen text
  clips/         small clips shipped in the app
  kit/           motion/ + screens/ runtime libraries, legacy capture kit
  capture/       Expo-on-web capture (webcap)
  templates/     per model: BRIEF, index, starter scenes
  STYLE.md       house style learned from reviews
presentations/   static HTML decks (apresentação, proposta)
tools/           repo scripts
```

## Setup

```bash
npm install      # shared deps for kit, capture, deck export
npm run sync     # copy brand + library files into every video and deck
```

Videos with their own `package-lock.json` (the finished ones) also need `npm ci` inside their folder.

## Brand

`brand/tokens.json` is the source. After editing it:

```bash
npm run sync:brand   # regenerate tokens.css (+ app-ui.css from ../vivamaisa-app) and sync everywhere
```

## Videos

With an agent (Claude Code): ask for the video, the `/video` skill plans it (`video-director`), builds every scene in parallel (`scene-builder`), reviews (`video-reviewer`) and renders. House style in `videos/STYLE.md`, kit API in `videos/kit/README.md`.

By hand:

```bash
npm run new -- ad consulta-em-minutos portrait
npm run new -- tutorial agendar-consulta landscape
```

Creates `videos/<ads|tutorials>/<slug>` from `videos/templates/<model>/`: `BRIEF.md`, `index.html`, working starter scenes in `compositions/` (motion kit for ads, recreated-screen kit for tutorials), `ledger.json`, `assets.json`, synced brand + kit. Fill `BRIEF.md`, build, then:

```bash
npm run list                  # catalog: model, size, length, status, renders
npm run check                 # every video
npm run check -- <slug>       # one video
npm run render -- <slug>      # sync + check + render + strip vertical rotation flag
```

HyperFrames skills are per machine: `npx hyperframes skills update` once after cloning.

| Video | Model | Format | Notes |
|---|---|---|---|
| `ads/intro-vivamais` | ad | 1080×1920, ~3:00 | narrated, office TV |
| `ads/plantao-simulator` | ad | 1080×1920, ~1:00 | silent draft |
| `tutorials/tutorial-plantao` | tutorial | 1080×1920, ~5:00 | client app, plantão |
| `tutorials/tutorial-painel-empresarial` | tutorial | 1920×1080, ~3:50 | web company panel |
| `tutorials/onboarding-paciente` | tutorial | 1080×1920, ~5:40 | new patient onboarding, in progress |
| `tutorials/tutorial-medico` | tutorial | 1080×1920, ~11:00 | doctor journey, recreated screens, 2 parts |
| `clips/landing-demo` | clip | 390×840 @2× | tap-driven demo for the web landing |
| `clips/onboard` | clip | 1080×1080 | app onboarding carousel |

## Shared assets

Put a file used by more than one video in `assets/`, map it in each video's `assets.json` (`"local/path": "library/path"`), run `npm run sync`. Synced copies are gitignored.

## TV playlist

```bash
npm run tv
npm run tv -- tutorial-painel-empresarial videos/clips/onboard/renders/onboard-medicos-master.mp4
```

Builds `dist-tv/vivamais-tv.zip`: fullscreen looping player for the office TV Mac. No args = newest render of each slug in `tools/tv/playlist.json`. Unzip on the TV Mac and double-click `Play TV.command` (no Node needed). Keys: ←/→ previous/next, space pause.

## Presentations

See `presentations/README.md`. Export with `npm run deck:export` / `npm run deck:pptx`.

## Stock

`npm run stock -- video "<tag>"` searches keyless Mixkit/Openverse stock and appends credits next to the download.
