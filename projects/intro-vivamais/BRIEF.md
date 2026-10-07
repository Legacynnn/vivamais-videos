---
workflow: product-launch-video
flow: automation
storyboard: no
status: built
message: "Sua empresa oferece. Sua equipe sente. Saúde de verdade, o dia inteiro."
destination: youtube
aspect: 1920x1080
language: pt-BR
audience: RH, gestores e fundadores decidindo o plano empresarial Viva Mais
length: 120s
angle: feature-showcase
vo_mode: restructured
---

## Intent

Viva Mais apresentada como empresa, em formato de anúncio: "the prettiest one of it all". Not only the
empresarial panel: a deep dive on every Viva Mais feature through the collaborator's eyes — benefits and
how they work, the consultation in the app, documents in the app, smart notifications. Strong triggers and
hooks to grab the audience. Web and mobile mockups of different features, varied motion.

Revision 2026-09-30: user rejected the clock carrier and the "Aurora Logística" company framing: "remove
both and just display features of the vivamais". Now a feature showcase: hook, brand + feature marquee,
then each feature in the real UI (RH web, collaborator phone), RH panel, sign-off.

## Hooks

- Cold open: push notification "sua médica está pronta", kinetic "4 minutos." from fever to doctor on screen.
- Re-hook every ~15s: question seams, number punches (24h · R$ 0 · 4 min), black-frame pattern breaks, sound hits on each hour flip.
- Payoff: the cold-open notification returns at 11:24 and the loop closes.

## Assets

- Real captured UI, reused: phone states from `../tutorial-plantao/capture/states` (Expo app), web states from `../tutorial-painel-empresarial/capture/states` (vivamais-web). Both re-scoped here.
- Custom-built screens from the plantão project (benefícios, IA, documentos) and new ones where the app has no screen (lock-screen notifications, WhatsApp).
- Real doctor portraits, persona photo `assets/app/ana.jpg`, HeyGen doctor clip `assets/video/doutora.mp4`.
- Brand: `frame.md`, `brand/tokens.css`, transparent wordmark + vector mark only.

## Customizations

- Narrator VO pt-BR (HeyGen) + music bed + SFX on clock flips and taps.
- Generated opener scene (Aurora office at 07:59) diving into the RH laptop.
- Logo fixed top-left, tooltips brand violet and anchored, no logo inside tooltips.

## Notes

- Fictional people and numbers (Ana, R$ 300/mês de crédito); company shown as "Minha Empresa".
- CTA and tagline not given: close on wordmark + "vivamais.ai" + "Fale com a gente" (placeholder, swap when confirmed).
- Deviation from the stock product-launch pipeline: scenes are built with the repo's real-UI kit (`build/`), not per-frame HTML workers, to keep UI fidelity; story, script, audio and checks follow the workflow.
