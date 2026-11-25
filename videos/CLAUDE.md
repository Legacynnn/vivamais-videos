# Viva Mais Videos (HyperFrames)

Every video is its own HyperFrames project at `videos/<group>/<slug>/`. Run commands from inside that folder.

## Editor workflow

Every request to make, change, re-cut or render a video goes through the `/video` skill (`.claude/skills/video/SKILL.md`): `video-director` plans, `scene-builder` agents build one composition file each in parallel, `video-reviewer` checks, `pnpm run render <slug>` renders. House taste lives in `STYLE.md`; read it before planning or building.

## Models

Assign the model first; it decides the folder, template and reference.

- **ad** (`ads/`): motion-led, 6–60s, music, optional narrator. Starter: hook → product on device → end card, built on `kit/motion`. Reference `ads/intro-vivamais` (narrated, legacy kit).
- **tutorial** (`tutorials/`): long chapters joined by full-screen chapter text, on-screen tooltips, usually silent. Starter chapter on `kit/screens`. Reference `tutorials/tutorial-medico`.
- `clips/`: in-app clips (`onboard`, frozen) and landing demos (`landing-demo`, own exporter).

`pnpm run new <ad|tutorial> <slug> [portrait|square|landscape]` scaffolds from `templates/<model>/` (BRIEF, `index.html`, starter `compositions/`, `ledger.json`, `assets.json`) and syncs. `pnpm run list` shows every video.

App screens come from the screen library (`screens/`, see `screens/README.md`): a `<!-- screen:id state --><!-- /screen -->` marker inside `.scr` is filled by `pnpm run sync` with the real app screen. Add a missing screen or state to the library instead of redrawing it in the composition; hand-built HTML is only for screens the library cannot render. The DOM-capture pipeline (`capture/webcap`, legacy kit) only serves the finished videos that already use it.

## Shared pieces

- `kit/motion` and `kit/screens`: runtime libraries for new videos, mapped in `assets.json` as `@kit/...` and synced into `assets/kit/`. API in `kit/README.md`. A kit change reaches every video on the next sync, so re-check those videos (`npm run check`).
- `kit/` root files: legacy DOM-capture kit (`onboarding-paciente`) and its tools.
- Brand files land in each video as `assets/brand/`, library files per `assets.json`; both are gitignored copies made by `pnpm run sync`. Edit `brand/`, `assets/` or `kit/` at the source, never the copies.
- `intro-vivamais`, `tutorial-plantao` and `tutorial-painel-empresarial` are finished and keep their own `build/kit.js`; edit only when that video needs a change.
- Sub-composition `<style>` is scoped by HyperFrames: `html[data-resolution]` selectors inside a scene never match. Per-format layout uses the vars in `kit/motion/motion.css`.

## Skills — USE THESE FIRST

**Always invoke the relevant skill before writing or modifying compositions.** Skills encode framework-specific patterns (e.g., `window.__timelines` registration, `data-*` attribute semantics, shader-compatible CSS rules) that are NOT in generic web docs. Skipping them produces broken compositions.

**Doing anything with HyperFrames?** Start at `/hyperframes` — it tells you what HyperFrames can do and which skill or workflow handles your intent (make a video, TTS / BGM, prep footage, author / animate, render, install blocks), confirms your brief up front (the intent layer), and routes every "make me a…" request (a video, a deck, a composition port) to the right workflow. Read it first, especially when there's no project context to orient you. The workflows it routes to:

- `/product-launch-video` — any **website** URL or brief / script → a product launch / SaaS / promo video, or a site tour / showcase featuring the site's own captured visuals.
- `/faceless-explainer` — arbitrary text (topic / article / notes), **no URL, no website capture** → 60-90s faceless explainer.
- `/embedded-captions` — an existing talking-head video (MP4) → the same footage with captions / subtitles added (rail + embed, or pure-cinematic embed); the footage itself is untouched.
- `/talking-head-recut` — an existing talking-head / interview / podcast video (MP4) → the same footage **packaged with designed graphic overlays** (kinetic titles, lower-thirds, data callouts, pull-quotes, side panels, pip) synced to the transcript; the clip plays unchanged underneath. (Plain captions/subtitles → `/embedded-captions`.)
- `/pr-to-video` — a GitHub PR (URL / `owner/repo#N` / "this PR") → 30-90s code-change explainer (changelog / feature reveal / fix / refactor).
- `/motion-graphics` — a short (typically under 10s) design-led **motion graphic**, motion-is-the-message, no narration: kinetic type, a stat / number count-up, a chart, a logo sting, a lower-third / overlay, or an animated tweet / headline / captured-page highlight; rendered to MP4 or a transparent overlay. Longer / narrated / custom → `/general-video`.
- `/music-to-video` — a **music track** (audio file, video to pull audio from, or one generated from a mood brief) → beat-synced video (lyric / slideshow / kinetic promo). Music drives pacing; user-supplied images / videos are cut onto the same beat grid.
- `/slideshow` — a **presentation / pitch deck / interactive deck** — discrete slides, fragment reveals, branching, hotspot navigation, presenter mode. Output is a navigable deck, not a rendered video.
- `/general-video` — fallback for any other video (title card, longer brand / sizzle reel, multi-scene montage, static loop, custom composition) and the home of **companion mode** — co-create with the full HyperFrames toolbox; the original hyperframes authoring flow, any length.

**Porting an existing composition?** `/remotion-to-hyperframes` translates a Remotion (React) composition into HyperFrames HTML — a source migration, separate from the creation workflows above.

The domain skills (`/hyperframes-core`, `/hyperframes-animation`, `/hyperframes-keyframes`, `/hyperframes-creative`, `/hyperframes-cli`, `/media-use`, `/hyperframes-audio`, `/hyperframes-registry`, `/figma`) and the full capability map live inside `/hyperframes` — it is the single source of truth for which skill handles which intent.

**Changing how real footage or images look or reveal?** Load `/media-use` and read its `references/media-treatments.md` before editing, even when the request only says dark, flat, boring, retro, private, or “make the reveal cooler.” It governs how footage is treated, never whether media may be used. Use canonical media treatments and seek-safe motion; do not improvise equivalent CSS/SVG filters or overlays.

> **Tailwind v4 projects** (`hyperframes init --tailwind`): see `/hyperframes-core` → `references/tailwind.md`.

> **Skill missing or stale?** Run `npx hyperframes skills update <name>` to install/refresh
> the specific skill you need (the `/hyperframes` router does this automatically before
> entering a workflow), or bare `npx hyperframes skills update` to refresh the core set plus
> everything already installed — neither pulls the full set. Restart the agent session so
> newly installed skills load.

## Commands

```bash
npm run dev          # human-operated foreground preview (blocks until stopped)
npx hyperframes preview --background  # agent-safe persistent Studio preview
npx hyperframes preview --status      # verify the persistent preview is listening
npx hyperframes preview --stop        # stop it when review is finished
npm run check        # lint + runtime + layout + motion + contrast (one command)
npm run render       # render to MP4 (from the repo root prefer `pnpm run render <slug>`: sync + check + render + rotation fix)
npm run publish      # publish and get a shareable link
npx hyperframes lint --verbose  # include info-level findings
npx hyperframes lint --json     # machine-readable output for CI
npx hyperframes docs <topic> # reference docs in terminal
```

> **Agents must use `npx hyperframes preview --background` for Studio handoff.** Do not rely
> on a shell/tool `run_in_background` wrapper around `npm run dev`: that foreground process
> remains owned by the invoking session and can disappear while the browser stays open,
> leaving refreshes at `ERR_CONNECTION_TIMED_OUT`. Verify with `preview --status`, keep it
> alive through review, and stop it explicitly with `preview --stop` afterward.

> **Pinned CLI version.** These scripts pin an exact `hyperframes@X.Y.Z` so this project re-renders identically over time. Weeks later that pin lags fixes shipped since. To move up: `npx hyperframes@latest upgrade --project . --check` (shows the delta), then `npx hyperframes@latest upgrade --project .` to rewrite the pins. Always unpinned — the pinned script re-runs the old version against itself.

## Documentation

**For quick reference**, use the local CLI docs command (no network required):

```bash
npx hyperframes docs <topic>
```

Topics: `data-attributes`, `gsap`, `compositions`, `rendering`, `examples`, `troubleshooting`

**For full documentation**, discover pages via the machine-readable index — do NOT guess URLs:

```
https://hyperframes.heygen.com/llms.txt
```

## Project Structure

- `index.html` — main composition (root timeline)
- `compositions/` — sub-compositions referenced via `data-composition-src`; in kit-based videos these are generated by `npm run build` from `build/scenes/`
- `BRIEF.md` / `STORYBOARD.md` / `ledger.json` — intent, plan, seam ledger
- `frame.md` — design spec copied from `brand/frame.md` at creation
- `assets.json` — library files this video pulls from the repo-root `assets/`
- `capture/` — mock API, capture scripts and captured DOM states (real-UI videos)
- `renders/` — MP4 output (gitignored; `pnpm run tv` picks the newest per slug)

## Linting — ALWAYS RUN AFTER CHANGES

After creating or editing any `.html` composition, **always** run the full check before considering the task complete:

```bash
npm run check
```

Fix all errors before presenting the result. Warnings should be reviewed before rendering.

## Key Rules

1. Every timed element needs `data-start` and a duration. `data-start` is what marks it as timed; `data-track-index` is an optional Studio display lane the render never reads
2. Give timed visual elements `class="clip"`. The framework keys visibility off `data-start`, not the class, but the shared `.clip` CSS is what gives a scene its full-frame box, and `lint` warns without it
3. Register one paused root timeline per composition on `window.__timelines`:
   ```js
   window.__timelines = window.__timelines || {};
   window.__timelines["composition-id"] = gsap.timeline({ paused: true });
   ```
   Scene timelines manually added to this root must not be paused. A paused
   child does not advance when the root is seeked. The runtime activates
   registered composition siblings, not arbitrary nested scene timelines.
4. Videos use `muted` with a separate `<audio>` element for the audio track
5. Sub-compositions use `data-composition-src="compositions/file.html"` to reference other HTML files
6. Only deterministic logic — no `Date.now()`, no `Math.random()`, no network fetches
