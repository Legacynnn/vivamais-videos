---
model: tutorial
workflow: general-video
flow: automation
storyboard: no
status: draft
---

# [Video name]

Full tutorial: a set of long chapters joined by transitions, carried by on-screen text. Usually silent or music only.

## Message

[What the viewer can do after watching]

## Audience

[Who uses this flow: paciente, colaborador, RH/empresa, médico]

## Output

- Format: [portrait (phone, office TV) | landscape (laptop/tablet)]
- Duration: [minutes]
- Language: pt-BR
- App source: [vivamais-monorepo/apps/mobile | apps/web], screens recreated in HTML (faithful layout and tokens, simplified)

## Rules

- The complete journey end to end, not a core subset. Offer cuts only if length becomes a problem.
- Chapter changes: full-screen centered kinetic text saying what comes next. Short full-screen text flashes inside long chapters.
- Explanations are small tooltips attached to the UI element (leader line, follow the camera, glide between anchors), brand violet, no logo inside.
- Logo fixed top-left.
- Real steps shown being filled: typing, taps, chips. Every click/touch sits exactly on its target.
- Skeleton states between pages, page really scrolls with a steady camera, no dead static screens.
- Payments fully acted out (QR read → comprovante → validação → sucesso).
- Opening: generated on-brand scene → zoom into the device showing the real UI.

## Chapters

| # | Flow (tela → tela) | Chapter text | Tooltips |
|---|--------------------|--------------|----------|
| 1 | [home → ...] | [texto central] | [callouts] |

## Reference

`videos/tutorials/onboarding-paciente` (shared kit, phone), `videos/tutorials/tutorial-painel-empresarial` (web, laptop/tablet). Both were captured from the app; new videos recreate the screens instead.
