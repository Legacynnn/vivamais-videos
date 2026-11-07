---
model: tutorial
workflow: general-video
flow: automation
storyboard: no
status: draft
---

# tutorial-medico

Full tutorial: a set of long chapters joined by transitions, carried by on-screen text. Silent.

## Message

The doctor goes from creating an account to running consultations, signing documents and withdrawing earnings in Viva Mais, without help.

## Audience

Médico (partner account, shown in the app as "Colaborador").

## Output

- Format: portrait 1080x1920 (office TV, WhatsApp)
- Duration: ~9-11 min full; each part also renders as its own cut (~3-4 min)
- Language: pt-BR
- Audio: silent, text on screen only
- App source: `vivamais-monorepo/apps/mobile` (doctor redesign; `mobile-legacy` is gone). Screens are recreated in HTML, not captured: same layout, tokens and fonts, simplified to what each beat needs.
- Framing: the screen lives in an iPhone; at key moments cards, fields and confirmations lift out of the device toward the viewer.

## Rules

- The complete journey end to end, not a core subset. Offer cuts only if length becomes a problem.
- Chapter changes: full-screen centered kinetic text saying what comes next. Short full-screen text flashes inside long chapters.
- Explanations are small tooltips attached to the UI element (leader line, follow the camera, glide between anchors), brand violet, no logo inside.
- Logo fixed top-left.
- Real steps shown being filled: typing, taps, chips. Every click/touch sits exactly on its target.
- Skeleton states between pages, page really scrolls with a steady camera, no dead static screens.
- Payments fully acted out (QR read → comprovante → validação → sucesso).
- Opening: generated on-brand scene (doctor in a consultório holding a phone) → zoom into the device showing the real UI.

## Structure

One project, three parts. Each part opens on its own title and closes on the logo so it renders alone; the full video plays them back to back.

## Chapters

| # | Part | Flow (tela → tela) | Chapter text | Tooltips |
|---|------|--------------------|--------------|----------|
| 1 | 1 Primeiros passos | account-type → Colaborador → cadastro 3 passos (acesso; profissão, CRM, CPF/CNPJ; telefone, experiência, bio) → código no e-mail → account-setup | Crie sua conta de médico | Escolha "Colaborador" · Seu CRM e CPF ou CNPJ · Confirme com o código do e-mail |
| 2 | 1 | **custom** "Envie seus documentos": carteira do CRM, documento com foto, diploma → enviando → enviados | Envie seus documentos | Foto ou PDF · Tudo fica protegido |
| 3 | 1 | Perfil → card real "Em análise" → time passes → push "Cadastro aprovado" → **custom** success (confetti) → card real "Aprovado" | Aguarde a aprovação | A equipe confere seus dados · Você recebe um aviso |
| 4 | 1 | Perfil → Certificado → A1: escolher .pfx + senha → válido. A3: **custom** in app style (escolher PSC BRy → autorizar por QR → "Ativo na nuvem") | Seu certificado digital | A1: arquivo e senha · A3: na nuvem, sem token · Receitas válidas com ICP-Brasil |
| 5 | 1 | Meu plano → escolher → checkout → pagar (Pix acted out) → sucesso → faturas | Escolha seu plano | — |
| 6 | 1 | Perfil → disponibilidade → atendimento → preço e duração por tipo | Defina sua agenda e seus preços | — |
| 7 | 2 Primeira consulta | Início → Central (+) → Novo paciente: buscar → dados pessoais → contato → confirmar | Cadastre seus pacientes | — |
| 8 | 2 | Central → Nova consulta → paciente → horário → agenda (Consultas) | Marque a consulta | — |
| 9 | 2 | Consulta → pré-consulta: pontos de atenção → resumo da anamnese → perguntar à IA | Antes de entrar | O paciente já contou o caso · Pergunte à IA |
| 10 | 2 | Iniciar → **custom** video call with HeyGen patient avatar | A consulta | — |
| 11 | 2 | Prontuário: anamnese → diagnóstico CID-10 → receita (busca, posologia) → pedido de exame (TUSS) → atestado → laudo | Prontuário | — |
| 12 | 2 | Finalizar → gerando → revisão → assinar ICP-Brasil → concluída | Finalize e assine | Documentos assinados chegam ao paciente |
| 13 | 2 | Consulta concluída → Solicitar reconsulta gratuita (modal) → enviada | Agende a reconsulta | Gratuita em até 90 dias |
| 14 | 3 Rotina | Central → documento avulso (receita/atestado) → paciente → preencher → assinar → compartilhar | Documentos a qualquer hora | — |
| 15 | 3 | IA do médico: conversa → histórico → IA dentro do prontuário | Seu assistente de IA | — |
| 16 | 3 | Faturamento → saldo → resumo do mês → entradas → sacar (segurar para confirmar) → conta bancária | Receba seus ganhos | — |

## Decisions (user, 2026-10-08)

- Vertical, silent, one project with three renderable parts.
- Extras in scope: disponibilidade e preço, plano do médico, faturamento e saque, documentos avulsos, IA.
- Screens are recreated, not captured (user, 2026-10-08): faithful but simplified, phone frame with elements lifting out.
- Document upload does not exist in the app: designed as a new step after signup in the app's style.
- Approval has no screen of its own: real Perfil card + custom approved screen with confetti.
- A3 cloud connect only exists on web: custom mobile screens; A1 is the real flow.
- Video call: recreated call screen with a HeyGen patient avatar.
- Plantão (M16) left out.

## Source notes

- Doctor screens to recreate live in `apps/mobile/src/components/` (`auth/PartnerSignupForm`, `doctor-perfil/certificate`, `dashboard`, `doctor-control-center`, `patients/CreatePatientContent`, `consultation/doctor/PreConsultationDetails`, `medical-record/*`, `consultation/ReconsultaModal`, `billing`, `doctor-plans`, `ai-chat`). Layout and copy come from there; tokens from `brand/app-ui.css`.
- Persona: fictional doctor with a real portrait from `assets/people/doctors` (d0, d1, d2, d4 usable). Patient Maria Oliveira, 65, hypertensive, allergic to dipirona (continuity with onboarding-paciente).

## Reference

`videos/tutorials/onboarding-paciente` (phone tutorial pacing, chapter text, tooltips), `videos/tutorials/tutorial-plantao` (HeyGen call, custom screens).
