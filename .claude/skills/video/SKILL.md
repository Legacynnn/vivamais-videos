---
name: video
description: Viva Mais video editor pipeline - make a new ad or tutorial, edit or extend an existing video, make format cut-downs, render and hand off. Use for any request in this repo to create, change, re-cut or render a Viva Mais video ("faz um ad", "novo tutorial", "muda a cena 3", "versão quadrada", "renderiza").
---

# Viva Mais video editor

Orchestrate; delegate the heavy build to agents. Rules: `videos/STYLE.md`, `brand/frame.md`. Kit API: `videos/kit/README.md`. `pnpm run list` shows every video with model, size, length and status.

## New video

1. Settle the open choices with the user in one question round if the request leaves them open: model (ad | tutorial), format, length, audio (silent | music | VO + music). Defaults: ad = portrait, 15–30s, music; tutorial = portrait, full journey, silent.
2. Spawn `video-director` with the request and the answers. It scaffolds (`pnpm run new <model> <slug> <format>`), fills `BRIEF.md`, `ledger.json` and `index.html`, and returns the file list.
3. Review the plan yourself against `videos/STYLE.md` (hook first, one headline per frame, full journey for tutorials). Fix the brief before anyone builds.
4. Spawn one `scene-builder` per composition file, all in one message so they run in parallel. Each prompt: video folder, file name, its BRIEF row, the neighbour rows (for seams).
5. Audio, if any: load `media-use` / `hyperframes-audio`. VO = HeyGen Marisol pt-BR; music = one long track, beat-mapped, drops on scene starts. Add the `<audio>` clips to `index.html`.
6. Spawn `video-reviewer`. Send findings back to the owning `scene-builder` (SendMessage) until the reviewer says ready.
7. `pnpm run render <slug>` from the repo root (syncs, checks, renders to `videos/<group>/<slug>/renders/<slug>.mp4`, strips the vertical rotation flag). Never run capture, preview and render at the same time.
8. Set `status: built` in the BRIEF frontmatter, commit on a branch, push.

## Edit an existing video

Read its `BRIEF.md` and `README.md` first. Change only the scene files involved (a `scene-builder` each), keep `index.html` timing in sync when a duration changes (shift every later start), rerun `video-reviewer` on the touched scenes and their seams, render. Finished videos with their own `build/kit.js` (intro-vivamais, tutorial-plantao, tutorial-painel-empresarial) build through `npm run build` inside the folder.

## Format cut-downs

Scaffold a sibling (`<slug>-square`, `<slug>-landscape`) with `pnpm run new`, copy `compositions/`, `index.html`, `BRIEF.md`, `ledger.json`, `assets.json`, then replace the width/height/`data-resolution` values. Scenes built on the `motion.css` vars reflow on their own; review every scene, fix the ones with hard-coded positions.

## Preview for the user

`npx hyperframes preview --background` inside the folder, give the URL, stop it with `--stop` when review ends.
