# landing-demo

Tap-driven consultation demo for the vivamais-web landing (`apps/web/components/landing/demo`). Screens are recreated in HTML (`index.html`, `screens.css`, `demo.js`) at 390×840 and captured at 2× by `tools/export.mjs`; the doctor-side web view is `doctor.html` at 1280×800.

- `npm run sync -- landing-demo` (repo root) before exporting.
- `npm run export` writes `out/` (stills, clips, `manifest.json`, `doctor-side.*`). `npm run export -- 2` re-renders one clip; the manifest is rewritten each run.
- `npm run check` verifies sizes, durations, and that each clip's first/last frame matches its stills.

Stills are lossless WebP. Clip edge frames are encoded from the same pixels as the stills; the only residual is H.264/VP9 4:2:0 chroma (~40 dB PSNR).
