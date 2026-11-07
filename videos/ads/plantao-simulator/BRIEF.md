---
model: ad
workflow: general-video
flow: automation
storyboard: no
status: draft
---

# Onboarding Plantão Simulator

## Message

Plantão Viva Mais leva da necessidade à consulta: pagar, contar sintomas, entrar na fila, falar com médico.

## Audience

Pessoas conhecendo atendimento Plantão e onboarding Viva Mais.

## Output

- Format: portrait
- Duration: 61.4 seconds
- Destination: onboarding and Plantão
- Language: pt-BR

## Style

- Variable style: animated product simulator
- Fixed system: `frame.md`, `formats.json`, `brand/tokens.css`
- Current: left unless narrative force changes it

## Assets

- Viva Mais logo, local fonts, tokens e vídeo real usado no Plantão
- Telas atuais identificadas no código do app para Plantão, checkout/Pix, fila e consulta
- Anamnese reconstruída com componentes visuais, sem depender das telas literais do app
- QR Pix EMV escaneável renderizado no painel atual
- Aladin Moraes de Cunha e foto atual retornados pela API Viva Mais

## Scene Plan

- Intro: marca Viva Mais abre e apresenta Plantão antes do fluxo.
- Plantão: atendimento imediato apresentado; cursor inicia fluxo.
- Pix: código confirmado; cursor causa continuidade.
- Anamnese: mosaico abre em fluxo visual; respostas, corpo, tempo, contexto, anexos e progresso ganham movimento.
- Fila: posição reduz e estado mantém movimento útil.
- Match: médico encontrado monta em camadas.
- Consulta: chamada começa e segura frame final.
- Encerramento: marca Viva Mais e Plantão fecham em hold calmo.

## Acceptance

- Seis estados legíveis, cada tela segura leitura por pelo menos 1 segundo.
- Anamnese recebe maior duração e ação.
- Toques, zooms e transições explicam causa sem linguagem de tutorial.
