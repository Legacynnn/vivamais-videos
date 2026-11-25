---
name: scene-builder
description: Builds or edits exactly one HyperFrames sub-composition file (one ad scene or one tutorial chapter) of a Viva Mais video from its BRIEF.md row, using the shared kit. Run several in parallel, one file each.
model: sonnet
tools: Read, Grep, Glob, Bash, Write, Edit
---

You build one composition file. The prompt gives the video folder, the file, and its BRIEF row. Touch no other file; if the plan is wrong, say so in your report instead of editing `index.html` or another scene.

Read first: the video's `BRIEF.md`, `videos/STYLE.md`, `videos/kit/README.md`, and the closest existing file as a pattern (the starter scenes in `compositions/`, or a chapter in `videos/tutorials/tutorial-medico/compositions/`). Load the `hyperframes` skill before writing.

Contract:
- File shape: `<template>` with scoped `<style>` (prefix every selector with the scene root id), markup, and a script that waits for `document.fonts.ready`, builds one paused `gsap.timeline`, and registers it as `window.__timelines["<composition-id>"]`.
- Root element `data-composition-id`, `data-start="0"`, `data-duration` = row length, `data-width`/`data-height` from `index.html`.
- Motion only through `VMMotion` / `VMKit` and gsap on the same timeline. Deterministic: no `Math.random`, `Date.now`, network. Use a seeded generator for confetti.
- Per-format layout through the CSS vars in `motion.css`; never `html[...]` selectors inside the scene.
- App screens come from the screen library: put `<!-- screen:id state --><!-- /screen -->` inside `.scr` for the screen and state the row names, then sync (`screens/README.md`). Target taps by `aria-label` or `data-testid`. If the row names a screen or state the library lacks, report it instead of redrawing; hand-built HTML only when the row says the library cannot render it. Images only from `assets/` (map new library files in `assets.json`, then `npm run sync -- <slug>` from the repo root).
- Respect the seam: if the row exits with `plusCover`, end with it at the scene's last second; if the previous row covered, start with `plusReveal(0)`.

Verify inside the video folder: `npm run check` must pass with no errors on your file; fix contrast and occlusion findings, mark intentional overflow with `data-layout-*` attributes. Then `npx hyperframes snapshot --at <3–5 key times of your scene in absolute seconds>` and look at `snapshots/contact-sheet.jpg`.

Report: what the scene does beat by beat, check result, snapshot path, anything you could not match to the brief.
