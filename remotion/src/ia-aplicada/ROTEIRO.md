# IA aplicada — roteiro e plano de animação

Composição Remotion `ia-aplicada`, 1080×1920, 30 fps, 1800 frames (60 s), sem áudio, texto na tela em pt-BR. Paciente: Helena Souza. Só plano; nenhum `.tsx` foi escrito.

Base reaproveitada: `remotion/src/agendamento/kit.tsx` (`Card`, `Shot`, `Region`, `Pop`, `Tap`/`Finger`, `Headline`, `track`, `ramp`, `Sheet`, `Logo`), `docs.tsx` (`Receita`, `Viewer`), fundo `ShaderMeshGradient` violeta (`#1A0640 #4A14A8 #7E3BED #6A5BF0`), `push-through` do remocn. Não usar `fog-rise`, `ui-callout`, `cta-collapse-mark`, nem tilt 3D.

## 1. Por que esta ordem

Ordem escolhida: gancho → abrir a IA → dúvida do dia a dia → entender a consulta → exame → qual médico + horário → WhatsApp (horário, receita, marcar) → fim.

Mudou em relação ao rascunho: pós-consulta sobe para antes do exame, e especialidade vira o último beat dentro do app.

- **Escada de valor.** Cada beat pede mais confiança que o anterior: responde uma pergunta → explica o que o médico disse → lê um documento seu → decide o próximo passo e agenda. O espectador de 60+ entende primeiro o uso mais simples e só depois vê o mais forte.
- **Causa e efeito com os dados que já existem.** O fixture da Helena já amarra tudo: a receita da Dra. Camila é Dipirona 500 mg (a dúvida "dipirona com paracetamol" nasce dela), o resumo da consulta lista "Exame: Hemograma completo", e o beat seguinte é justamente o hemograma chegando. Exame antes da consulta (rascunho) quebra essa causa.
- **O WhatsApp só devolve o que já vimos.** Especialidade por último no app termina com uma consulta marcada (sexta, 10:00). No WhatsApp: "que horas é minha consulta?" devolve essa sexta 10:00; "me manda minha receita" devolve a receita da Dipirona do resumo; "marcar retorno" fecha o "Retorno" do resumo. Prova "mesma IA, mesma conta" sem precisar de texto explicando.
- **Um portador só.** Dentro do app tudo acontece em uma única conversa que sobe; nenhum corte de tela entre os quatro usos. A única troca de mundo (app → WhatsApp) fica reservada para o momento que importa.

Alternativas rejeitadas:

- **Rascunho (exame → joelho → pós-consulta).** Pós-consulta por último dentro do app deixa o beat de agendamento no meio e o WhatsApp sem nada para "lembrar"; exame antes da consulta não tem causa.
- **Cronologia estrita (sintoma → agenda → consulta → resumo → exame).** Começa pelo beat mais longo e denso (dois cards + toque), e a consulta em si não aparece no vídeo, então a cronologia teria um buraco.
- **WhatsApp primeiro (canal que todos conhecem).** Gasta a virada final e faz o app parecer a versão secundária.
- **Uma tela por recurso com corte entre elas.** Vira lista de slides; o usuário já rejeitou cenas que não se conectam.

## 2. Tabela de beats

Tempos absolutos na linha do tempo final. Título sempre no topo (y 196), um por vez, Space Grotesk 500, 80 px, branco, palavra de ênfase em `#D6C3FB`. Logo fixo no canto superior esquerdo até o beat 10. Cartão do app: `Card` do kit (925 px de largura, K = 2,3).

| # | Beat | Frames | Tempo | Texto na tela | Tela / estado | Toque e alvo do zoom | Animação na cena | Costura para o próximo |
|---|------|--------|-------|---------------|---------------|----------------------|------------------|------------------------|
| 0 | Gancho | 0–84 | 0,0–2,8 s | "Dúvida de saúde?" (0–44) → "Pergunte à **Super Inteligência**" (40–84), centro da tela, 104 px | sem tela | nenhum | waterfall entry palavra a palavra (3 f de intervalo, `power4.out`); segunda frase entra por waterfall cut para cima | **cut-the-curve em Y, para cima**: frase sai subindo ~230 px (`power4.in`, 10 f), cartão da home entra de baixo já em movimento (`power4.out`) |
| 1 | Abrir a IA | 84–228 | 2,8–7,6 s | "Ela mora no seu **app**" | `client-home--helena` (novo estado, ver §6) | toque em "Tire dúvidas sobre sua saúde" (painel Super Inteligência) em f 186; zoom nível 2 no painel a partir de f 158 | câmera desce `camY` 0→300 (f 100–140) até o painel; chips do painel correm em marquee horizontal (crop em faixa, como `strip` do agendamento); orbe da IA não pulsa | **zoom-through para frente (Z+)** causado pelo toque: `pushThrough({ zoom: 1.5, blur: 10 })`, 30 f, origem no ponto do toque; entra `ai-chat--empty` crescendo de 0,8 |
| 2 | Dúvida do dia a dia | 228–438 | 7,6–14,6 s | "Pergunte do seu **jeito**" (236–330) → "Resposta na **hora**" (340–438) | `ai-chat--empty` → conversa recriada sobre a moldura real (cabeçalho, compositor e aviso vêm do still) | toque em "Dúvida sobre medicamento" f 262 (zoom nível 1); zoom nível 2 no compositor durante a digitação (f 276–330); toque em enviar f 334 | lista de sugestões sai, texto "Posso tomar dipirona com paracetamol?" digita a 1 f/caractere; bolha violeta sobe do compositor; 3 pontos "Pensando" 12 f; resposta entra linha a linha (texto do fixture `ai-chat-duvida`); câmera volta ao nível 0 enquanto a resposta escreve | **nudge curve em Y, para cima**: a conversa inteira sobe (10/65/25, 22 f, blur 8 px no meio); título troca por waterfall cut para cima |
| 3 | Entender a consulta | 438–672 | 14,6–22,4 s | "Não entendeu a **consulta**?" (446–540) → "Ela **explica**" (552–672) | recriado na mesma conversa; chip real "Entenda sua consulta" acima do compositor | toque no chip f 470 (zoom nível 2 no chip); toque em "Receita" dentro do card f 628 (zoom nível 2) | bolha "Analise minha última consulta" (mensagem real do prompt); card **Resumo da consulta** (§3.1) monta linha a linha, 5 f por linha; pausa de 12 f antes do toque; ao tocar "Receita", mini-receita (`Receita` de `docs.tsx`, escala 0,5) levanta do card por 34 f e volta | nudge curve em Y, para cima; a linha "Exame: Hemograma completo" fica destacada (fundo `#F3EDFE`) nos últimos 14 f e é a última coisa a sair pelo topo |
| 4 | Exame recebido | 672–948 | 22,4–31,6 s | "Chegou o **exame**?" (680–790) → "Ela lê com **você**" (802–948) | recriado; anexo no compositor fiel ao `AIComposer` | toque no "+" f 700 (zoom nível 2 no compositor); toque em enviar f 760; zoom nível 1 no card do exame f 800–900 | "+" abre folha com 3 linhas (Câmera, Fotos, Arquivo — conferir rótulos reais); toque em Arquivo f 724; ficha do anexo "Hemograma - Helena Souza.pdf · 212 KB" entra no compositor; bolha do usuário com o PDF + "Explique meu último exame"; card **Resultado do exame** (§3.2): 4 linhas entram em cascata, marcador de cada faixa desliza até o valor (16 f, `glide`), a linha Hemoglobina recebe o rótulo "abaixo" por último; pausa de 15 f; frase da IA escreve embaixo | nudge curve em Y, para cima |
| 5 | Qual médico + horário | 948–1236 | 31,6–41,2 s | "Não sabe qual **médico**?" (956–1070) → "Ela indica e **agenda**" (1082–1236) | recriado; card de horários fiel ao `AIAvailabilityCard` | zoom nível 2 no compositor na digitação (f 962–1016); toque em enviar f 1020; toque no horário "sex., 13/11 · 10:00" f 1168 (zoom nível 2 na pílula) | digita "Dor no joelho ao subir escada. Que médico?"; card **Especialidade sugerida** (§3.3) entra; 10 f depois o card de **Horários** (§3.4) sobe por baixo dele; pausa de 12 f; toque: pílula fica violeta sólida, as outras apagam para 40%; selo "Consulta agendada · sexta, 10:00" (componente `Booked` do agendamento, check violeta) sobe do card | **zoom inverso (Z−, chegada)**: cartão encolhe 1→0,84 e sobe 60 px (26 f, `power3.in` sem assentar); não corta, continua no beat 6 |
| 6 | Ponte para o WhatsApp | 1236–1326 | 41,2–44,2 s | "E também no **WhatsApp**" | app recuado + notificação recriada (estilo iOS) | toque na notificação f 1290; zoom nível 1 na notificação | notificação desce do topo do cartão (y, 14 f, causada pelo fim do recuo): ícone do WhatsApp, "Viva Mais", "Sua consulta está marcada. Precisa de algo? É só chamar por aqui."; selo "Consulta agendada" some | **container transform (Z+)** causado pelo toque: a notificação cresce até o retângulo do cartão e vira a conversa do WhatsApp (§5), 24 f, `Easing.bezier(0.32, 0.72, 0, 1)` |
| 7 | WhatsApp: horário | 1326–1422 | 44,2–47,4 s | "Pergunte seu **horário**" | WhatsApp recriado | sem toque; zoom nível 1 acompanha a resposta | bolha enviada "Que horas é minha consulta?" já pronta (entra por baixo, sem digitar); "digitando…" no cabeçalho 10 f; resposta **Sua consulta** (§3.5a) | conversa sobe (nudge curve em Y) |
| 8 | WhatsApp: receita | 1422–1530 | 47,4–51,0 s | "Peça sua **receita**" | WhatsApp recriado | toque na bolha do PDF f 1492 (zoom nível 2) | bolha "Me manda minha receita"; resposta: bolha de documento (§3.5b) com miniatura da receita; ao toque, a miniatura cresce 1→1,25 por 22 f e volta | conversa sobe (nudge curve em Y) |
| 9 | WhatsApp: marcar | 1530–1680 | 51,0–56,0 s | "Marque sua **consulta**" | WhatsApp recriado | toque no botão "seg., 16/11 · 14:30" f 1612 (zoom nível 2) | bolha "Quero marcar retorno com a Dra. Camila"; resposta com 3 botões de resposta (§3.5c) em cascata; pausa de 12 f; toque: o botão escolhido vira bolha enviada (voa para a direita, portador); confirmação "Retorno marcado" (§3.5d) entra; pausa final de 20 f | **cut-the-curve em Y, para cima (conclusão)**: cartão sai subindo ~230 px com blur 18 px (`power4.in`, 12 f); o texto final entra de baixo já em movimento |
| 10 | Fim | 1680–1800 | 56,0–60,0 s | "Sua saúde, / sempre com **resposta**" 112 px, centro; lockup branco; "vivamais.ai" | sem tela | nenhum | waterfall entry (4 f por palavra); lockup sobe 30 px em f 1716; "vivamais.ai" (DM Sans 500, 40 px) em f 1734; logo do canto some em f 1680; últimos 40 f parados | — |

Vetores (lei do vetor): dentro de cada mundo a corrente é **para cima** (a conversa sobe; nunca desce). Z+ só em "entrar mais fundo" (abrir a IA, abrir o WhatsApp), sempre causado por toque. Z− só uma vez, na chegada da notificação. Nenhuma costura consecutiva em sentidos opostos no mesmo eixo.

## 3. Redesenho dos widgets (só no vídeo)

Regras comuns: medidas em pt do app (multiplicar por K). Fiel ao app: painel `#F3F4FA` (`panel`) raio 24, poço branco interno raio 20, sem borda, sem sombra, DM Sans para tudo, texto `#17151E`, apoio `#726F80`, violeta `#7E3BED` / forte `#6A24DB`, suave `#F3EDFE`. Sem spark, sem verde, sem vermelho, sem ícone em caixinha colorida, sem glow. Rótulo "Super Inteligência · IA · hora" acima de cada resposta igual ao `AIMessageBubble`; "Copiar / Refazer" aparecem só no beat 2.

### 3.1 Resumo da consulta (beat 3)

Hoje é texto corrido com negritos (`ai-chat--summary`). Vira card.

- Cabeçalho no painel: retrato da Dra. Camila 44 pt (cantos de tile, como `Avatar` do card de horários), "Dra. Camila Rocha" 15 pt bold, "Clínica geral · hoje, 11/11" 13 pt apoio.
- Poço branco com 4 linhas separadas por fio `#EFEDF4`: rótulo 12 pt apoio à esquerda em coluna fixa de 84 pt, valor 15 pt à direita.
  - Achado — Cefaleia tensional
  - Receita — Dipirona 500 mg, de 6 em 6 horas se tiver dor
  - Exame — Hemograma completo
  - Retorno — Se piorar ou tiver febre
- Rodapé: chips reais de `AICitations` ("Receita", "Pedido de exame", "Atestado"), 32 pt de altura, fundo `muted`, ícone 13 pt. "Receita" é o alvo do toque.
- Fiel: conteúdo do fixture `aiConsultationSummary`, chips de fontes, tipografia. Novo: estrutura em linhas e cabeçalho com médica.

### 3.2 Resultado do exame (beat 4, desenho novo)

- Cabeçalho no painel: ícone `FileText` 18 pt violeta-600, "Hemograma completo" 15 pt bold, "Coletado em 10/11 · 4 itens" 13 pt apoio.
- Poço branco, 4 linhas de 56 pt. Cada linha: nome 14 pt à esquerda; valor 17 pt Space Grotesk 500 + unidade 12 pt apoio à direita; embaixo, trilho de 4 pt `#EDE8F7` com o trecho da faixa de referência em `#D6C3FB` e um marcador redondo de 10 pt.
  - Dentro da faixa: marcador `#17151E`.
  - Fora da faixa: marcador `#6A24DB`, valor em `#6A24DB`, pílula "abaixo" (12 pt, fundo `#F3EDFE`, texto `#6A24DB`) ao lado do nome. Só a Hemoglobina.
- Abaixo do card, texto normal da IA: "Sua hemoglobina está um pouco abaixo do esperado. Não é urgente, mas vale mostrar para a Dra. Camila."
- Hierarquia: o olho vai para a única linha violeta, depois para a frase. Nada de "normal/alterado" em cores de semáforo.
- Fiel: superfície painel/poço, ficha do anexo do `AIComposer`. Novo: tudo dentro do card.

### 3.3 Especialidade sugerida (beat 5, desenho novo)

- Uma linha só, dentro do painel: ícone da especialidade (mesma família dos ícones de `client-home-specialties`; falta Ortopedia em `remotion/public/icons`, ver §6) 40 pt, "Ortopedia" 20 pt Space Grotesk 500, embaixo "Cuida de ossos, joelhos e articulações" 13 pt apoio.
- Acima, uma frase da IA: "Pelo que você contou, o melhor é um **ortopedista**."
- Fiel: tipografia e painel. Novo: o card.

### 3.4 Horários (beat 5)

`AIAvailabilityCard` real, quase sem mudança: painel + poço com retrato 44 pt, nome 15 pt bold, especialidade, nota "4,9 (128)" e "CRM-SP 148220"; "Próximos horários" 12 pt; pílulas `muted`; botão contorno "Ver agenda completa".

- Mudanças só de leitura: pílulas com 40 pt de altura (hoje compactas) e no máximo 3: "Amanhã · 09:30", "sex., 13/11 · 10:00", "sex., 13/11 · 15:30" (formato de `formatNextSlotLabel`; conferir a saída exata de `formatWeekdayDayMonth`).
- Estado escolhido: pílula violeta sólida com texto branco. O anel violeta de 1,5 pt do componente real (`ring`) aparece no toque.
- Um card só (uma médica), para caber grande.

### 3.5 WhatsApp (beats 7–9)

Fiel ao WhatsApp iOS claro atual: cabeçalho branco, papel de parede `#EFEAE2`, bolha recebida branca, bolha enviada `#D9FDD3`, hora 11 pt `#667781`, tiques azuis `#53BDEB`, fonte do sistema (SF/Helvetica; não usar DM Sans aqui). Contato: "Viva Mais" com selo de conta verificada, avatar = símbolo da marca sobre violeta, subtítulo "conta comercial". Barra de mensagem embaixo, estática. Tamanho base 17 pt nas bolhas.

- **a. Sua consulta** — bolha recebida com texto: "Oi, Helena! Sua consulta é **sexta, 13/11, às 10:00**, com a Dra. Mariana Lopes (Ortopedia)." Negrito nativo do WhatsApp; nada de card da marca.
- **b. Receita** — bolha de documento nativa: miniatura da primeira página (componente `Receita` de `docs.tsx`, 240 pt de largura), faixa inferior com ícone PDF, "Receita - Helena Souza.pdf", "1 página · PDF · 84 KB". Texto acima: "Aqui está a receita da sua consulta de 11/11."
- **c. Horários** — bolha recebida "A Dra. Camila tem estes horários:" seguida de 3 botões de resposta nativos (cartões brancos de largura total, texto azul `#027EB5` centralizado): "seg., 16/11 · 09:00", "seg., 16/11 · 14:30", "ter., 17/11 · 10:00". Limite real da API: 3 botões, 20 caracteres.
- **d. Confirmação** — bolha recebida: "Pronto! **Retorno marcado** para segunda, 16/11, às 14:30, com a Dra. Camila Rocha. Já está no seu app."
- Hierarquia: os dados da conta (data, hora, médica) são o único negrito de cada bolha.

## 4. Câmera de zoom no toque

Câmera plana, só escala e translação do grupo `Card` + overlays (nunca rotação).

| Nível | Escala sobre o cartão | Uso |
|-------|----------------------|-----|
| 0 | 1,00 | leitura de respostas e cards |
| 1 | 1,18 | acompanhar um card ou uma área (resposta, card do exame, notificação) |
| 2 | 1,42 | toque em alvo pequeno: linha, chip, "+", enviar, pílula de horário, botão do WhatsApp; digitação no compositor |

- **Aproximação:** 14 f, `glide` (`0.45, 0, 0.15, 1`), `transform-origin` no centro do alvo; o alvo termina entre 40% e 60% da altura da tela, nunca sob o título. Limitar a translação para o cartão não mostrar fundo além de 80 px nas laterais.
- **Toque:** o dedo chega no último frame da aproximação. O resultado aparece no mesmo frame do toque (estado pressionado, anel, mudança de cor).
- **Espera:** 10–14 f no nível de zoom depois do toque, com o resultado já acontecendo.
- **Retorno:** 20 f, `ease` (`0.22, 1, 0.36, 1`), junto com a entrada do conteúdo novo; nunca voltar com a cena parada. Em toques seguidos (beat 4: "+" → Arquivo → enviar) a câmera desliza de alvo em alvo no nível 2 sem voltar ao 0.
- **Digitação:** fica no nível 2 enquanto o texto escreve; o enviar é tocado ainda no nível 2.
- **Indicador:** `Finger` do kit (disco 88 px `rgba(253,252,255,.7)`, borda 3 px branca, sombra; pressão 1→0,8→1 em 9 f; anel que abre 120 px em 14 f). Tamanho constante na tela: dividir pela escala da câmera. Entra de fora do alvo em arco (28 f), some 18 f depois. No WhatsApp o disco ganha borda `#17151E` a 25% para aparecer sobre branco.
- Limite: no máximo um zoom nível 2 a cada ~2 s; total previsto de 11 toques.

## 5. Transição para o WhatsApp

1. **Recuo (f 1210–1236).** Depois do selo "Consulta agendada", o cartão do app encolhe para 0,84 e sobe 60 px. Fundo violeta continua igual (nenhum fundo verde em momento algum).
2. **Notificação (f 1240–1254).** Banner iOS recriado (raio 22 pt, branco 92%, sombra suave) desce do topo do cartão sobre o app. Título "E também no **WhatsApp**" entra junto.
3. **Toque (f 1290).** Zoom nível 1 na notificação, dedo toca.
4. **Container transform (f 1290–1314).** O retângulo da notificação cresce até o retângulo do cartão (posição, tamanho e raio 22→64 interpolados juntos). O avatar e o nome "Viva Mais" da notificação viajam até a posição do cabeçalho do WhatsApp (portador). O texto da notificação vira a primeira bolha recebida da conversa. O app por baixo escurece para 0 em 10 f, já coberto. O cartão volta à escala 1 no mesmo movimento.
5. **Três ações rápidas.** Uma conversa só, sempre subindo. Cada ação = bolha enviada pronta (sem digitar, 8 f) → "digitando…" 10 f → resposta. O título do topo troca a cada ação por waterfall cut e é o que faz a ação ser lida em 1 segundo; a bolha confirma. A anterior sobe e sai antes da próxima resposta, então há no máximo uma pergunta e uma resposta legíveis por vez. Só o beat 9 tem toque de decisão.

## 6. Fixtures, stills e dados

Paciente Helena Souza, "hoje" = quarta, 11/11/2026 (igual aos fixtures).

**Existe e serve como está**

- `ai-chat--empty` (alvo `duvida` já em `shots.json`), `ai-chat--summary` (referência de tipografia), `post-consultation--ready` (não usado na tela, só referência), componente `Receita` em `docs.tsx`.

**Estados novos em `screens/` (fora do monorepo)**

- `client-home--helena`: `client-home.screen.tsx` com `user: helena`. Hoje a home só existe como "Olá, Ana".
- Opcional, se o construtor preferir still real a recriar: `ai-chat--duvida-helena` (conversa dipirona com `helena` em vez de `anaCompany`).

**Entradas novas em `remotion/shots.json`**

```json
"client-home--helena": {
  "painel": { "label": "Conversar com a Super IA", "climb": 200 },
  "abrir": { "label": "Conversar com a Super IA" },
  "chips": { "label": "Perguntar: Analise minha última consulta", "strip": true }
},
"ai-chat--empty": {
  "duvida": { "label": "Dúvida sobre medicamento" },
  "composer": { "label": "Mensagem para a Super IA", "climb": 120 },
  "anexar": { "label": "Anexar arquivo ou foto" },
  "enviar": { "label": "Enviar mensagem" }
}
```

Conferir `climb` no still; o painel precisa do retângulo do bloco inteiro.

**Recriado em React no vídeo (sem still)**

- Conversa: bolhas, "Pensando", chip de sugestão, folha de anexo, ficha do anexo no compositor, cards §3.1–3.4. Moldura (cabeçalho, compositor, aviso da IA) recortada de `ai-chat--empty` com `Region`.
- Notificação iOS e WhatsApp inteiro (§3.5, §5).

**Assets a adicionar em `remotion/public/`**

- `people/camila-rocha.jpg` (de `assets/people/doctors/`), `people/mariana.jpg` para a ortopedista (confirmar o retrato com o usuário).
- `icons/ortopedia.png` na mesma família dos ícones de especialidade do app.
- Ícone do WhatsApp para a notificação e selo de verificado (desenho vetorial fiel, sem recolorir).

**Dados**

| Item | Valor |
|------|-------|
| Paciente | Helena Souza |
| Consulta de hoje | Dra. Camila Rocha, Clínica geral, 11/11, CID cefaleia |
| Receita | Dipirona 500 mg, 1 comprimido de 6 em 6 horas, se tiver dor |
| Pergunta 1 | "Posso tomar dipirona com paracetamol?" |
| Resposta 1 | "Em geral, sim, alternando os horários. Siga a dose da bula e não passe do limite do dia. Se a dor durar mais de **3 dias**, vale chamar o plantão." |
| Exame | Hemograma completo, coletado em 10/11, arquivo "Hemograma - Helena Souza.pdf", 212 KB |
| Hemoglobina | 11,2 g/dL (ref. 12,0–15,5) — abaixo |
| Hematócrito | 36 % (ref. 35–45) |
| Leucócitos | 6.800 /mm³ (ref. 4.000–10.000) |
| Plaquetas | 250.000 /mm³ (ref. 150.000–400.000) |
| Pergunta 3 | "Dor no joelho ao subir escada. Que médico?" |
| Ortopedista | Dra. Mariana Lopes, Ortopedia, CRM-SP 148220, 4,9 (128) |
| Consulta marcada no app | sexta, 13/11, 10:00 |
| Retorno no WhatsApp | Dra. Camila Rocha, segunda, 16/11, 14:30 |

Inconsistência a resolver: o resumo atual do fixture diz "Exame: Hemograma completo" pedido hoje (11/11), e o exame aparece como já coletado em 10/11. Opções: tratar o resumo como "sua última consulta" (06/11) ou coletar em 12/11 e mover a sexta para a semana seguinte. Recomendo a primeira: trocar "hoje, 11/11" por "sexta, 06/11" no card §3.1 e na bolha da receita do WhatsApp.

## 7. Decisões do usuário (2026-11-24)

1. WhatsApp IA do paciente existe: contato "Viva Mais" com selo verificado, reply buttons são o formato real.
2. WhatsApp fiel total, verde liberado (exceção à regra "sem verde" só nas cenas WhatsApp).
3. Exame com valores fictícios e texto cauteloso, sem diagnóstico.
4. Agendar direto no chat (toque no horário → "Consulta agendada"), sem preço.
5. Pendente com default: título Space Grotesk 500; consulta resumida = sexta, 06/11; retrato da ortopedista escolhido entre `assets/people/doctors/`.

## 8. Riscos e perguntas em aberto (originais)

1. **IA no WhatsApp para paciente existe ou está prometida?** O vídeo mostra consultar horário, receber PDF e marcar. Preciso do nome do contato, se a conta é verificada e se os botões de resposta são o formato real.
2. **Verde do WhatsApp.** As bolhas enviadas são verde-claro e o ícone é verde. Mantive o mínimo (cabeçalho branco, fundo do vídeo violeta). Aceita, ou prefere WhatsApp em modo escuro para pesar menos?
3. **Leitura de exame.** O card mostra valor "abaixo" e a IA comenta. Alguém clínico ou jurídico precisa aprovar os valores, a frase e a presença do aviso "orienta, mas não substitui o médico" (fica visível no rodapé do chat).
4. **Agendar dentro do chat.** No app real, tocar no horário leva ao fluxo de agendamento; no vídeo confirma direto com o selo. Pode simplificar assim, e o preço fica de fora?
5. **Peso do título.** Usei Space Grotesk 500 (pedido de tipografia mais calma); o `Headline` do kit hoje está em 700. Confirmar 500 para este vídeo. Também: 60 s cabem, mas os beats 7 e 8 têm ~3,4 s cada; se parecer corrido, o corte natural é juntar "horário" e "receita" em um título só.
