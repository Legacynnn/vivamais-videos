---
workflow: general-video
flow: automation
storyboard: no
status: built
message: "Do cadastro da empresa à consulta da sua equipe: tudo no Painel Empresarial Viva Mais"
destination: youtube
aspect: 1920x1080
language: pt-BR
audience: RH e gestores de empresas contratando ou já usando o plano empresarial Viva Mais
length: 214s
angle: tutorial
---

## Intent

Long-form tutorial of the Viva Mais enterprise panel (vivamais-web, `/empresa-cadastro` and
`/painel-empresarial`). User's words: "a full flow, from registering the company to vidas to
setting credit to importing a planilha, see the groups and paying an invoice, then seeing
those lives having consultations inside the platform through the UI". Real UI with motion,
inside a laptop mockup (tablet for the employee side), strong transitions, high UI fidelity.
More text than the earlier walkthrough: on-screen step titles and explainer lines.

## Assets

- ../../../vivamais-web — source of truth for every screen; UI is captured from the running app, not redrawn
- capture/states/*.html — real DOM snapshots of each screen state, rendered by the app against a mock API
- capture/ui.css — the app's compiled Tailwind stylesheet, scoped to `.vm-ui`
- assets/ui/fonts — Poppins files the app ships via next/font

## Customizations

- Flow: cadastro da empresa → planos → dashboard → cadastrar vida → importar planilha →
  grupos de assinatura → créditos → financeiro (pagar fatura) → vida agenda e faz consulta → relatório de uso
- Laptop mockup for the company admin; tablet mockup for the employee (vida) consultation beat
- On-screen text only: chapter cards, step caption, callouts. Silent.
- Oversized cursor drives every click; camera punches into the region being explained

## Notes

- No audio, no narration.
- Fictional company, people, CPF, CNPJ, values. Nothing from a real backend.
- Web app keeps its own look (Poppins, #9531FF, Tailwind grays). Everything outside the device follows `frame.md`.
