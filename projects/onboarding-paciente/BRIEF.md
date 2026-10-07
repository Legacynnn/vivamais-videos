---
workflow: general-video
flow: automation
storyboard: no
status: draft
message: "Viva Mais passo a passo: do primeiro acesso à consulta marcada, sem dificuldade"
destination: tv / whatsapp / app
aspect: 1080x1920
language: pt-BR
audience: beneficiários PJ (funcionários), muitos com 60+
length: 300-360s
angle: onboarding tutorial
---

## Intent

Single overview video for a new patient: what Viva Mais is, first access (create account in the app), Início, benefícios, marcar consulta, histórico, dependentes (cadastro e compra), IA. Slow, direct, big text, one idea per screen. The app mockup is the protagonist; centered chapter titles with transitions and anchored tutorial popups explain each step. Ends with the IA finding a doctor in chat, showing the profile expanded, availability, time pick → payment → anamnese.

## Decisions (user, 2026-10-05)

- Silent: no narration, no captions track, no music. Text carries everything.
- First access = Criar conta no app (Paciente → 4 steps → código no e-mail → Tudo pronto).
- Payment = Pix with plan discount (struck price, "Desconto do plano"), not company credit.
- Vertical 1080x1920, one video ~5-6 min.

## Assets

- ../../../vivamaisa-app (main) — screens captured as rendered DOM from the Expo web build against `capture/mock-api.mjs`
- IA doctor booking (cards inline, expanded profile, availability) does not exist in the app UI; built as custom screens in the app's own components/tokens. Backend has `search_availability` / `get_availability_slots` tools.

## Notes

- Fictional patient Maria Oliveira, dependent José Oliveira; doctors from the existing portrait set.
- 60+ legibility: headlines ≥ 72px, popup body ≥ 40px, holds ≥ 2.5s per readable text, taps shown with a large touch ring, one highlight at a time.
- Calm motion per memory: no pumps/pulses/blinks, opaque cuts, crossfaded screen swaps, power3.out entries.
