# Chapter authoring contract

Host `index.html` sequences chapter sub-compositions. Each chapter is one file, built by one agent, with no dependency on other chapters.

## Files

- `compositions/chNN-slug.html` (`ch01-02-cadastro` covers chapters 1 and 2). Composition id = file name without `.html`.
- `shared/app.css`: all reusable CSS. Do not copy it; add generic pieces there, chapter-only pieces in the chapter `<style>`.
- `shared/kit.js`: `window.VMKit`.
- Start from `compositions/ch01-02-cadastro.html`.

## Host line

Add one line in `index.html` inside `#root` and raise the root `data-duration`:

```html
<div id="el-chNN-slug" class="clip" data-composition-id="chNN-slug" data-composition-src="compositions/chNN-slug.html" data-start="42" data-duration="D" data-track-index="0" data-width="1080" data-height="1920"></div>
```

Alternate `data-track-index` 0/1 for back-to-back chapters. Chapter timelines are local: t=0 is the host `data-start`.

## Loading rules

- `kit.js`, `app.css`, gsap and `tokens.css` are loaded once in the host `<head>`. A `<script src>` inside a `<template>` is not reliable (cloned scripts are not guaranteed to load before the inline script), so chapters never load it; they use `VMKit` as a global.
- Everything else (`<style>`, markup, `<script>`) lives inside `<template>`. Style the root by `#chNNNN` id, never by class.
- Chapter `<style>` must repeat the five `@font-face` rules from the sample: lint checks each file alone. Paths are `assets/brand/fonts/...`.
- Prefix every id with the chapter prefix (`c12-`, `c03-`) so chapters coexist. Never use global `#id` strings in GSAP or `document.querySelector`; go through `k.$`.
- Build the timeline inside `document.fonts.ready.then(...)`, then set `window.__timelines["chNN-slug"] = tl`. Timeline stays paused; no `Date.now`, `Math.random`, fetches.
- Copy these four blocks from the sample: `bg` clip (`.backdrop .grid .glow-a .glow-b`), title card `section.clip.chapter`, phone `section.clip` with `.cam > .dev > (.bezel, .screen, .lift)`, brand logo clip (`img.logo`, top-left, whole chapter). Each chapter owns its copy of the background.

## Kit

```js
const k = VMKit.create({ root, tl, screenEl?, liftEl? });
```

`root` is the chapter root element; `screenEl`/`liftEl` default to `.screen`/`.lift` in it. In all signatures below an element argument also accepts a selector string scoped to `root`; screen ids can be bare ids.

- `$(sel|el)`, `$$(sel)`: scoped query (element, array).
- `screens(ids)`: first screen at x 0, rest parked at x 402 and hidden. Call once.
- `push(from, to, t)`: slide `to` in over 0.5s, `from` out left. 
- `titleCard(card, { at, sparkAt?, out, from?, stagger? })`: words (`.w` in `.chapter-words`) rise in at `at` (`from` default `{y: 70}`, stagger 0.08), `.chapter-spark` grows at `sparkAt` (default at+0.5), words exit left at `out`.
- `center(el)` -> `{x, y, p:{x,y,w,h}}` in screen coordinates.
- `posIn(el)` -> `{x,y,w,h}` relative to the screen.
- `tap(x, y, t, target?)`: touch ring landing at `t`; optional element gets a 0.97 press.
- `focusField(f, t)`, `blurField(f, t)`: violet focus border and floating label (`.field` with `.box-focus .label`).
- `typeIn(f, t, dur)`: types `.val[data-final]` with a moving `.caret`.
- `enable(btn, t)`: `.btn.off` becomes violet (`.on` overlay + white `.lbl`).
- `tip(text, ax, ay, side)` -> tip object; `showTip(tip, t, hold)`: dot, stem, bubble in, out at `t+hold`. `ax, ay` is the anchor in screen coordinates; `side` `"down"` puts the bubble below, `"up"` above. Bubble x is clamped to -96..(500 - width).
- `liftOut(el, t, hold, dx, scale)`: replaces the element with a raised clone (final text, focused labels) that scales/shifts out, returns at `t+hold`. Pair with `showTip`. Returns the clone.
- `finalClone(el)`, `make(cls, style, html)`, `touch(x, y)`: lower-level; `make` appends to `.lift`.
- `E` = `"power3.out"`.

`typeIn` and `liftOut` need `data-final` on `.val`, `.val` empty in markup, `.caret` inside the field.

## Phone geometry

Frame 1080x1920. `.cam` at left 173, top 318, 733x1545. `.dev` 426x898 scaled 1.72 (origin 0 0). `.screen` 402x874 at (12,12) inside `.dev`, radius 54. All kit coordinates are in this 402x874 space. Status bar 54px high, island 126x37. Header `.auth-head` top 62; `.progress` top 126; `.body` left/right 24, top 130-230 per screen; primary `.btn` top 764, height 52, tap at (201, 790). Logo: `.logo` left 88, top 112, width 230.

## Conventions

- Open on the full-screen kinetic title (`titleCard`, about 3s), phone enters at `xPercent 22 -> 0`, 0.8s `power4.out`.
- Close with the phone exiting (`xPercent -24`, 0.42s `power4.in`, then `opacity 0`) or held on its last screen, so the next chapter title can cut in.
- Logo top-left for the whole chapter.
- Camera: punch-ins by tweening `.cam` `scale`/`y` (1.05-1.08, y 30-70), always back to 1 before a push.
- Tooltip idiom: `liftOut(el, t, hold, dx, scale)` + `showTip(tip(text, cx, bottom + 6..14, "down"), t + 0.3, hold - 0.45)`.
- Tap idiom: `tap(x, y, t, target)`, then `focusField(f, t + 0.05)`, `typeIn(f, t + 0.15, dur)`, `blurField(f, t + dur + 0.25)`, `enable(btn, ...)`, tap button, `push`.
- Fields to type need `class="field"`, `.box .box-focus .label .val[data-final] .caret`; `.field.multi` for 96px text areas.

## Tokens (from `assets/brand/tokens.css`)

`--vm-canvas`, `--vm-foreground`, `--vm-primary` (violet title word), `--vm-secondary` (green spark), `--vm-violet-50/100/300/500/600`, `--vm-ink-100/200/300/400/500/600/900`, `--vm-tile`, `--vm-green-800`. Literal: success `#22C55E`, focus violet `#7E3BED`. Fonts: Space Grotesk 500/700 headings, DM Sans 400/500/700 body.

## Verify

From the project folder, never with preview or render running:

```
npx hyperframes check
npx hyperframes snapshot --at <times> --no-end
```

Sample `check` passes with 0 errors; overlap warnings during screen pushes are expected. `pkill -f chrome-headless-shell` if puppeteer stalls.
