---
model: ad
workflow: general-video
flow: automation
storyboard: no
status: draft
---

# [Video name]

Short ad: motion + narrator voice + music. 15–60s.

## Message

[One viewer takeaway]

## Audience

[Who sees it, where it plays: office TV (muted → burned captions), Instagram, WhatsApp]

## Output

- Format: [portrait | square | landscape]
- Duration: [seconds]
- Language: pt-BR
- Voice: HeyGen TTS, Marisol (`16cae89929d94c25bc28b5af6f04822a`), `--locale pt-BR`
- Music: one long track, beat-mapped (`hyperframes beats`), drops pinned to scene starts

## Rules

- Text-led hook first: a question or claim that gives context before any footage or UI.
- One headline + one device (or one stock shot) per frame. Never many small texts.
- One VO line per scene; motion lands on spoken words (`A.w("word")` in `videos/kit/ad.js`). VO scenes run at speed 1.
- Stock holds ~4s with dissolves. Footage never flashes.
- Real UI only: reuse captured states from the tutorials, never redraw app screens.
- Cuts stay opaque, app screens crossfade, no pumps or pulses.
- Ends on the lockup + CTA (vivamais.ai).

## Scene Plan

| # | VO line | Visual | Caption |
|---|---------|--------|---------|
| 1 | [line] | [hook card] | [text] |
| 2 | [line] | [stock / UI] | [text] |

## Reference

`videos/ads/intro-vivamais` (kit + `ad.js`, VO sync, stock montage, burned captions).
