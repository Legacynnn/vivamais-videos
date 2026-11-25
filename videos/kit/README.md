# Kit

New videos load two runtime libraries, synced into `assets/kit/` through `assets.json` entries that start with `@kit/`. Edit them here, never the copies; `pnpm run sync` pushes changes to every video that maps them.

## `motion/` — brand motion (`VMMotion`)

`motion.css`: format-aware tokens (`--vm-safe-*`, `--vm-fs-*`, device placement vars switch on `html[data-resolution]`) and blocks `.vm-scene`, `.vm-bg-{canvas,white,mist,violet,deep}`, `.vm-stage[.center|.top|.bottom]`, `.vm-logo`, `.vm-head`, `.vm-sub`, `.vm-copy`, `.vm-chip`, `.vm-mark`, `.vm-stat`, `.vm-card`, `.vm-media` + `.vm-scrim`, `.vm-end` (`.vm-end-lockup`, `.vm-end-line`, `.vm-end-cta`), `.vm-ad-copy`, `.cam.vm-ad-dev`.

Sub-composition styles are scoped by HyperFrames, so `html[...]` selectors inside them never match. Per-format layout goes through the vars in `motion.css`.

```js
const m = VMMotion.create({ root, tl });
m.rise(el, t)              // words rise out of masks; <em> words get the accent colour; returns end time
m.slide(el, t, { x })      // words slide in along the current
m.exit(el, t, { dir })     // left (default) | right | up | down | blur, keeps moving through the cut
m.pop(el, t) / m.cascade(selector, t)
m.mark(el, t)              // green underline sweep
m.count(el, t, to, { from, dur, fmt })
m.device(el, t, { from })  // bottom | left | right
m.swap(a, b, t)            // crossfade two screens, no blink
m.stock(el, t, hold)       // dissolve in + slow push for footage/photos
m.plusCover(t) / m.plusReveal(t)  // signature violet "+" match cut: cover at the end of scene A, reveal at 0 of scene B
m.sting(mark, word, t)     // logo sting
m.end(card, t)             // end card: lockup, line, CTA
m.hold(el, t, dur)         // slow push during a hold, never a loop
m.word(vo, "palavra#1")    // spoken time of a word; vo = { at, words: [[start, end, text], …] } from the transcript
```

## `screens/` — recreated app screens (`VMKit`)

`screens.css`: backdrop, chapter title card, iPhone (`.cam > .dev > .bezel + .screen > .scr…` + `.lift`), touch, tooltip, lifted card. `screens.js`:

```js
const k = VMKit.create({ root, tl });
k.screens(ids); k.push(from, to, t)   // stacked screens, push transition
k.tap(x, y, t, target); k.center(el)   // tap exactly on the element centre
k.tip(text, x, y, "up"|"down"); k.showTip(tip, t, hold)
k.focusField(f, t); k.typeIn(f, t, dur); k.blurField(f, t); k.enable(btn, t)
k.liftOut(el, t, hold, dx, scale)      // card lifts out of the device
k.titleCard(card, { at, sparkAt, out }) // full-screen chapter text
```

## Legacy

`kit.js`, `kit.css`, `ad.js`, `ad.css`, `parts/` and the `.mjs` tools are the DOM-capture kit used by `onboarding-paciente`; finished videos keep their own copies.
