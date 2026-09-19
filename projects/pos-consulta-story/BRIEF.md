---
workflow: general-video
flow: automation
storyboard: no
message: "A consulta termina, mas o cuidado continua no pós-consulta da Viva Mais."
destination: social
aspect: portrait
language: pt-BR
audience: pacientes Viva Mais
length: 112s
---

# Intent

Mostrar jornada completa depois da teleconsulta: encerramento, celebração, avaliação, documentos assinados, resumo, reconsulta e IA com contexto real do prontuário.

# Assets

- Retrato local do médico usado no vídeo de Plantão.
- Marca e fontes oficiais Viva Mais.
- UI reconstruída a partir dos componentes atuais de pós-consulta, documentos e chat.

# Customizations

- Confete determinístico somente no encerramento da consulta.
- Documentos reproduzem o sistema A4 preto e branco da branch `feature/redesign-documentos-pdf`: marca mono, masthead, partes, contexto, tabelas e assinatura ICP-Brasil.
- Conversa roteirizada sobre glicemia de jejum 112 mg/dL e HbA1c 5,8%.
- Pós-consulta inteiro em uma única tela rolável: hero médico com CRM, nota e volume de consultas; carrossel de documentos; CTA de reconsulta; registros; avaliação; comentário; IA em alto contraste.
- Seis trocas completas no chat de IA, usando o layout real do app e consulta anexada.
- Receita é aberta por toque direto no card do documento e compartilhada por Activity View com aparência nativa de iPhone.
- Solicitação de exames usa segundo toque direto no próprio card, sem interação falsa sobre o resumo.
- Tela da IA usa navegação push nativa: pós-consulta recua para a esquerda enquanto chat entra pela direita, sem morph ou interstitial roxo.
- Sem narração. Texto e interação carregam história.

# Notes

- Vertical 1080×1920, 30 fps.
- Uma pausa clara antes de cada resultado importante.
- MP4 somente após aprovação do preview final.
