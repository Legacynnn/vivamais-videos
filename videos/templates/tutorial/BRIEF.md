---
model: tutorial
workflow: general-video
flow: automation
storyboard: no
status: draft
---

# [Video name]

Full tutorial: long chapters joined by transitions, carried by on-screen text. Usually silent or music only.

## Message

[What the viewer can do after watching]

## Audience

[Who uses this flow: paciente, colaborador, RH/empresa, médico]

## Output

- Format: [portrait | square | landscape]
- Duration: [minutes]
- Parts: [one file | split into parts of ~N min]
- Language: pt-BR
- App source: [vivamais-monorepo/apps/mobile | apps/web] — list the screen files per chapter below

## Chapters

One row per sub-composition in `compositions/`.

| # | File | Flow (tela → tela) | Chapter text | Tooltips | App source files |
|---|------|--------------------|--------------|----------|------------------|
| 1 | ch01.html | [home → ...] | [texto central] | [callouts] | [paths] |

## Notes

[Persona, data shown on screen, images to brief to the user]

Rules live in `videos/STYLE.md` (Tutorials) and `brand/frame.md`. Reference: `videos/tutorials/tutorial-medico` (recreated screens, one file per chapter).
