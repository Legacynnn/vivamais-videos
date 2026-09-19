---
name: Viva Mais Video System
source: ../src/theme/tokens.json
colors:
  canvas: "#FAFAFE"
  white: "#FFFFFF"
  ink: "#17151E"
  inkMuted: "#726F80"
  mist: "#F3EDFF"
  violet: "#7E3BED"
  violetStrong: "#6A24DB"
  lime: "#C6FF34"
typography:
  display:
    family: Space Grotesk
    weight: 700
  headline:
    family: Space Grotesk
    weight: 500
  text:
    family: DM Sans
    weight: 400
  label:
    family: DM Sans
    weight: 500
spacing:
  base: 8
  frameInset: 88
  frameInsetLandscape: 96
  frameInsetSquare: 72
  grid: 32
motion:
  current: left
  entrance: 0.58
  exit: 0.42
  stagger: 0.06
  easing: power3.out
  ambient: none
formats:
  portrait: 1080x1920@30
  square: 1080x1080@30
  landscape: 1920x1080@30
---

# Viva Mais Video System

Warm clinical light. Energetic, youthful, human. Calm enough for healthcare; never cold, bureaucratic, fintech-loud, neon, or generic SaaS.

## Constants

- Space Grotesk for display/headline. DM Sans for all readable copy.
- Ice-white canvas, ink type, solid violet emphasis, mist surfaces, rare lime spark.
- Violet marks focus, action, progression. Lime stays tiny: live marker, underline, small badge.
- Soft violet aura may ground one hero area. Never gradient text, control fill, or wordmark bar.
- Tonal depth over resting shadows. Float shadows only when an element visibly floats.
- Frame content uses 8px grid. Preserve format-safe insets from `formats.json`.

## Motion Contract

- Motion performs story. No idle wobble, breathing, looping glow, confetti, or bounce.
- Default film current moves left. Multi-scene work records every seam in `ledger.json`.
- Enter with opacity plus transform. Exit stays in motion through cut. No crossfade between scenes.
- Similar elements share duration/ease. Total stagger never exceeds 500ms.
- Hold 0.3–0.75s before a key result. Let information arrive over time instead of filling waits with decoration.

## Variable Style

Video may change subject, format, scene count, narration, footage treatment, UI density, and genre. It may not replace brand palette, font pairing, spacing grid, logo treatment, motion contract, or accessibility floor.

## Source Contract

`../src/theme/tokens.json` remains app source of truth. Run `npm run sync:brand` after token changes. That command reads app tokens and rewrites only `videos/brand/tokens.css`.
