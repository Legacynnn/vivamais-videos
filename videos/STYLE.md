# House style

What every Viva Mais video keeps, whatever the model. `brand/frame.md` owns palette, type and the motion contract; this file owns the editorial taste learned from review rounds. When a review adds a rule, add it here.

## Every video

- pt-BR on-screen text. One headline per frame, few words, large, with air. Never many small texts in one frame.
- Logo fixed top-left (transparent wordmark or vector mark from `brand/logos/`). Never `logo-full.png`, never the logo inside tooltips or on a gradient bar.
- Space Grotesk for headlines and big numbers, DM Sans for everything readable. No label/eyebrow rows above titles.
- Violet dominates; green only for chips, checks and emphasized words on dark. Cards are `--vm-tile`, no border.
- Nothing blinks: cuts stay opaque (never fade to the page background), app screens crossfade or push, no yoyo pumps, pulses, looping glows or full-screen wipe panels. Signature transition is the violet "+" (`plusCover` → `plusReveal` in `kit/motion`).
- No dead static screens: something always performs (typing, scroll, camera, tap), but no idle wobble.
- Hold 0.3–0.75s before a key result; stock footage holds ~4s with dissolves, never flashes.
- Office TV is portrait and muted: TV videos are 1080×1920 with burned-in text.

## App UI on screen

- Recreate screens in HTML from the app source (`../vivamais-monorepo/apps/mobile`, `apps/web`): same layout, tokens (`brand/app-ui.css`), fonts, copy, simplified to what the beat needs. Never capture the running app.
- Use the app's own illustrations (`assets/app/illustrations/`) and real doctor portraits (`assets/people/doctors/`) in their slots, never invented art.
- Real steps are acted out: typed text, chips, taps. Every tap/click sits exactly on its target and the result is visible at that moment.
- Skeleton states between pages; pages really scroll with a steady camera; horizontal rows scroll horizontally.
- Payments are acted out fully: QR read → comprovante → platform validates on its own → success with confetti. Collaborator prices are real prices with the plan discount.
- Documents shown on screen match the deployed PDFs (`vivamais-backend` `origin/master` `templates/pdf/`), rendered, never hand-drawn.
- Cards and fields lift out of the device at key moments (`liftOut` in `kit/screens`).

## Ads

- Text-led hook first: a question or claim that gives context before any footage or UI.
- One headline + one device (or one stock shot) per frame. Straight feature showcase; no fictional companies, clocks or time-of-day gimmicks.
- Narration (optional): one VO line per scene, motion lands on spoken words (`A.w("word")` in `kit/ad.js`), VO scenes at speed 1. Voice: HeyGen Marisol `16cae89929d94c25bc28b5af6f04822a`, `--locale pt-BR`.
- Music: one long track, beat-mapped (`npx hyperframes beats`), drops pinned to scene starts, cuts on the beat grid. Never stitch several short tracks.
- Ends on lockup + CTA (`vivamais.ai`).

## Tutorials

- The complete journey end to end; offer cuts only if length becomes a problem. Ask length and audio up front.
- Chapter changes: full-screen centered kinetic text saying what comes next (`titleCard`), plus short full-screen text flashes inside long chapters. No stepper hubs, progress rails or big numerals.
- Explanations are small violet tooltips attached to the element (dot + short stem), following the camera and gliding between anchors; never a long stretched connector or a panel parked in a corner.
- Opening: an on-brand scene (generated image the user makes from a brief) that zooms straight into the device and its first action.

## Images

The user generates images from briefs written here; never generate them via Canva or other services. Write the brief (scene, framing, where the logo appears, aspect ratio) and wait for the file.
