---
model: ad
workflow: general-video
flow: automation
storyboard: no
status: draft
---

# [Video name]

Ad: motion-led, 6–60s. Narration optional; music always.

## Message

[One viewer takeaway]

## Audience

[Who sees it, where it plays: office TV (muted → burned text), Instagram/Reels, WhatsApp, YouTube]

## Output

- Format: [portrait | square | landscape]
- Cut-downs: [none | square + landscape versions, same scenes]
- Duration: [seconds]
- Language: pt-BR
- Voice: [none | HeyGen Marisol `16cae89929d94c25bc28b5af6f04822a`, `--locale pt-BR`]
- Music: one long track, beat-mapped (`npx hyperframes beats`), drops pinned to scene starts

## Scene Plan

One row per sub-composition in `compositions/`. Times are absolute.

| # | File | Start–end | VO / on-screen text | Visual | Exit → next |
|---|------|-----------|---------------------|--------|-------------|
| 1 | hook.html | 0–4 | [question or claim] | [type on canvas] | plus cover |
| 2 | [scene].html | 4–9.5 | [line] | [device + recreated screen / stock] | exit left |
| 3 | fim.html | 9.5–13 | [line] | lockup + CTA vivamais.ai | — |

## Notes

[Screens to recreate (app file paths), assets needed, images to brief to the user]

Rules live in `videos/STYLE.md` (Ads) and `brand/frame.md`. Starter scenes show the kit: `kit/motion` (type, device, plus transition, end card) and `kit/screens` (taps, tips, screen pushes).
