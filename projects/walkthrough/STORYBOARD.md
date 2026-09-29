---
format: 1080x1920
duration: 62s
message: "Do benefício à consulta em vídeo, sem sair do app"
arc: Abrir o app → escolher benefício → escolher médico → agendar → pagar com Pix → preparar → consulta → até a próxima
audience: TikTok/Instagram viewers in Brazil (patients)
mode: collaborative
---

## Frame 1 — Abrir

- scene: Phone in a device frame on violet ground showing the real home at scroll 0; the dot rises and its first touch pushes the camera into the screen
- duration: 5s
- poster: 2s
- transition_in: cut
- status: animated
- src: compositions/frames/f01-abrir.html
- motion: camera-with-intent; rules spring-pop-entrance (phone), motion-blur-streak (push-in); cursor per oversized-cursor entry law
- exit_vector: Z push (scale growing) → frame 2 enters growing 0.75→1

Home at scroll 0 exactly as the app renders it: violet god-rays backdrop, avatar + menu row, "Boa tarde, Ana." (DM Sans 700 30px white), "Seu plano está ativo e pronto para usar.", the white "Agende sua consulta" hero card with the tint search field and specialty chips, then the white sheet starting with the quick-actions rail. The dot enters from below and touches the screen; the camera pushes in until the UI is full-bleed.

## Frame 2 — Home

- scene: Full-bleed home scrolls down through quick actions, AI card, "Nenhuma consulta agendada", "Seu plano", to "Seus benefícios"; the dot taps the Cardiologia benefit card
- duration: 2.85s
- poster: 5s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/f02-home.html
- motion: sequenced-ui-life; rules nudge-curve (the page scrolls as one group, backdrop parallax 0.45), waterfall-entry (benefit cards stagger as they arrive), cursor-click-ripple
- exit_vector: in-scene morph — the tapped benefit card grows into the search surface (SearchMorphSurface, 360ms cubic-bezier(.32,.72,0,1))

Rails as in the app: quick actions (Pagamentos · Agenda · Plantão · Documentos · Parceiros · Buscar · Mais, 58px violet-100 circles), AI card "Entenda sua consulta" with dots, next-appointment card "Nenhuma consulta agendada / Encontre um especialista disponível / Agendar nova consulta", plan card "Seu plano / Assinatura Viva+", then "Seus benefícios · Ver plano" with 222px cards: "Cardiologia / 20% de desconto" (cardio.png tile), "Chat com IA / Renova todo dia", "Farmácias parceiras". The dot taps the first card; the card's rect morphs into the search sheet.

## Frame 3 — Busca

- scene: The search sheet (radius 26, backdrop rgba(13,11,30,.32)) with grabber, header, Plantão 24h banner, day scroller with Amanhã selected, Cardiologia chip, and 3 doctor rows; the dot taps Dra. Mariana Costa
- duration: 3.2s
- poster: 3s
- transition_in: morph
- status: animated
- src: compositions/frames/f03-busca.html
- motion: staged-reveals; rules waterfall-entry (rows FadeInDown 320ms, 60ms stagger as the app does), spring-pop-entrance (filter badge "1"), cursor-click-ripple
- exit_vector: LEFT (current) with carrier — the tapped row's 56px avatar flies into the hero photo of frame 4 (ios_from_right push in the app)

Header: 44px back circle (ArrowLeft), white search field "Especialidade ou médico", filters circle with violet "1" badge. Plantão banner (violet-950→800 gradient, "Plantão 24h", "Médico online em minutos.", lime "Entrar na fila →", plantao-24h.webp). DayScroller "Setembro" + nav, cells Hoje 14 · Amanhã 15 (selected, violet puck) · qua 16 · qui 17 · sex 18 · sáb 19 · dom 20. Chip "Cardiologia ×". Rows (mist background, benefit line "Coberto pelo seu benefício"): Dra. Mariana Costa · Cardiologia · ★ 4,9 (32) · R$ 89,90 · Hoje; Dr. Rafael Lima · ★ 4,8 (128) · R$ 120 · por consulta; Dra. Júlia Andrade · Novo na Viva · R$ 95 · por consulta.

## Frame 4 — Perfil e horário

- scene: Doctor profile with the 380px photo hero; the page scrolls, the hero collapses to the pinned bar, the calendar and slot grid arrive; the dot taps ter 15, then 16:00, then the booking bar
- duration: 6s
- poster: 6s
- transition_in: cut-the-curve
- status: animated
- src: compositions/frames/f04-perfil.html
- motion: sequenced-ui-life + camera-with-intent; rules nudge-curve (scroll 0→260 drives the hero interpolation exactly as DoctorHero: height 380→155, photo scale 1→1.12 fade, pinned bar fade-in), control-target-sync (slot pick → booking bar label), press-release-spring (slot cell, booking bar), cursor-click-ripple
- exit_vector: LEFT (current)

Hero expanded: photo cover, bottom scrim, aura, "Dra. Mariana Costa" (Space Grotesk 700 28/32 white), cardio.png + "Cardiologia" + rating pill "★ 4,9"; top bar back + heart circles (rgba(34,8,74,.32)). Card 1 (radius 24): "Sobre ˅" collapsed, divider, "Avaliações 32 ˅". "Escolha o horário" (Space Grotesk 500 22px) then card 2: WeekCalendar "Setembro 2026" + nav, D S T Q Q S S, week 13–19 with 14 as today (violet text) and dots; SlotGrid MANHÃ 09:00 10:00 11:00 · TARDE 14:00 15:00 16:00 17:00. Booking bar "Agendar · R$ 89,90" disabled → after taps "Agendar ter 15 · 16:00 · R$ 89,90" enabled. The dot scrolls, taps 15, taps 16:00, taps the bar.

## Frame 5 — Pagamento

- scene: Checkout with the violet amount header (discounted total, struck original, benefit pill), summary card, and "Como você quer pagar?"; the dot taps Pix
- duration: 3.4s
- poster: 3s
- transition_in: cut-the-curve
- status: animated
- src: compositions/frames/f05-pagamento.html
- motion: staged-reveals; rules waterfall-entry (FadeInDown 320ms, 60ms stagger: header, summary, methods), counting-dynamic-scale (R$ 89,90 → R$ 71,92 as the benefit pill lands), cursor-click-ripple
- exit_vector: LEFT (current)

Header "‹ Pagamento". Amount card (violet-950, radius 20): "Total a pagar", "R$ 71,92" (Space Grotesk 500 36px) + struck "R$ 89,90", pill "Desconto do plano · −R$ 17,98", divider, avatar 40 radius 12 + "Dra. Mariana Costa" + cardio "Cardiologia" + "ter, 15 set · 16:00 – 16:50 · Online". Summary card: "Consulta  R$ 89,90", "Desconto do plano  − R$ 17,98", divider, "Tem um cupom? ˅". "Como você quer pagar?" rows: Pix / Aprovação em segundos ›, Cartão de crédito / Aprovação imediata / VISA MC ELO ›. Dot taps Pix.

## Frame 6 — Pix

- scene: "Pagar com Pix": Como funciona steps + Gerar Pix; the QR assembles module by module, the countdown ticks, a scan band reads it, "Aguardando pagamento…" pulses, then the screen recedes as the bank confirms
- duration: 8.1s
- poster: 5s
- transition_in: cut-the-curve
- status: animated
- src: compositions/frames/f06-pix.html
- motion: sequenced-ui-life; rules press-release-spring (Gerar Pix → loading spinner), spring-pop-entrance (QR modules in a diagonal wave, ≤0.5s total), scan-line sweep over the QR (gradient band, transform-only), counting timer 15:00→14:52, press-release-spring (Copiar código → Copiado), cursor-click-ripple
- exit_vector: Z pull (scale shrinking) → frame 7 arrives oversized and retracts (inverse zoom-through, ARRIVAL)

Header "‹ Pagar com Pix", same amount card. Panel "Como funciona" with badges 1 2 3 and the three steps. Sticky "Gerar Pix" → spinner. PixPanel: 220px QR in a 12px white frame, "Código válido por", "15:00" (Space Grotesk 500 22px) ticking, ghost buttons "Copiar código" | "Já paguei", lime dot + "Aguardando pagamento…". Copiar → "Copiado". A bright band sweeps the QR, a 0.5s stillness, then the screen pulls away.

## Frame 7 — Confirmado

- scene: "Sua consulta está marcada." lands big: the confirmation mark springs in, ring pulses out, title and summary cascade, the dot taps Preencher anamnese
- duration: 4.2s
- poster: 3s
- transition_in: inverse-zoom-through
- status: animated
- src: compositions/frames/f07-confirmado.html
- motion: animated-sequence; rules spring-pop-entrance (72px violet disc, back.out 1.7, after 320ms as ConfirmationMark), ring pulse (opacity .45→0 scale .9→1.3), particle-burst (lime + violet confetti ≤40), waterfall-entry (eyebrow, title, subtitle, card rows), cursor-click-ripple
- exit_vector: LEFT (current)

ConfirmationMark (96 violet-100 disc, 72 violet-500 disc, white check 36 stroke 2.8), eyebrow "AGENDAMENTO CONFIRMADO", title "Sua consulta está marcada." (Space Grotesk 700 32/38), "Agora, vamos preparar seu atendimento.". Summary card (radius 24): avatar 48 + "Dra. Mariana Costa" / "Cardiologia", divider, rows CalendarDays "ter, 15 set", Clock3 "16:00 às 16:50", Video "Online, pelo aplicativo". "ANTES DA CONSULTA / Conte como você está / Responda à anamnese para o médico conhecer seus sintomas antes do atendimento." Buttons "Preencher anamnese" + "Fazer isso depois".

## Frame 8 — Anamnese

- scene: The full anamnese as the app renders it: intro, then every consultation step, review, sent
- duration: 18.4s
- poster: 8s
- transition_in: cut-the-curve
- status: animated
- src: compositions/frames/f08-anamnese.html
- motion: sequenced-ui-life; rules nudge-curve (steps slide left inside the screen), discrete-text-sequence (typed motivo), spring-pop-entrance (body-map marker, chips), control-target-sync (ruler stepper → label), press-release-spring (Continuar), cursor-click-ripple
- exit_vector: Z pull (scale shrinking) → frame 9 arrives oversized and retracts (camera backs out of the phone)

Hub "Preparar consulta" (ILL-01, steps list with the next-step violet dot, "Continuar · Motivo"), then FlowShell steps with ChapterDots + "N de 5": 1 "O que está acontecendo?" textarea typed + cardio starter chips → 2 "Onde dói?" Frente/Costas toggle, body figure, tap on "Peito · lado esquerdo" pops a level-4 marker, "Pontos marcados" → 3 "Desde quando, e como está indo?" symptom curve + Começou chips (1 semana) + Está chips (Piorando) → 4 "Confirme medicamentos e alergias" chip fields (Losartana 50mg), "Nenhuma alergia conhecida", sharing radios → 5 "Quer anexar alguma coisa?" Câmera/Galeria/Arquivo tiles, ILL-08, "Continuar sem anexos" → "É isso que o médico vai ver" recap with body thumbnail, "Enviar anamnese" → "Anamnese enviada" (ILL-09). The sketch shows all eight screens as a grid; the build plays them as one continuous nudge-curve sequence.

## Frame 9 — Consulta

- scene: Camera pulls back out of the phone into the device frame; the Whereby room with Dra. Mariana Costa is live; the dot ends the call
- duration: 5.6s
- poster: 4s
- transition_in: inverse-zoom-through
- status: animated
- src: compositions/frames/f09-consulta.html
- motion: camera-with-intent (pull back to the device frame, settle); rules motion-blur-streak (pull), spring-pop-entrance (self-view, toolbar), counting timer; cursor returns only for the end-call tap
- exit_vector: LEFT (current)

The app draws only a 40px rgba(0,0,0,.4) back circle over the Whereby embed (embed=on, minimal). Whereby default room: dark stage, remote video full-bleed (real photo, slow push-in), small name tag, floating self-view tile, bottom toolbar mic · camera · chat · people · more · red leave. Timer is not drawn by the app, so none is shown. The dot returns to tap leave.

## Frame 10 — Até a próxima

- scene: In-app goodbye after the call: "Consulta finalizada", a warm line, receipts already in Documentos; hold on the device frame
- duration: 5s
- poster: 3s
- transition_in: cut-the-curve
- status: animated
- src: compositions/frames/f10-ate-a-proxima.html
- motion: staged-reveals; rules waterfall-entry (title, line, document rows), spring-pop-entrance (heart badge); no cursor; camera holds on the device frame
- exit_vector: none (film ends holding)

Designed in the app's own language (ConfirmationMark geometry with a Heart, eyebrow + Space Grotesk title, white radius-24 card rows): "CONSULTA FINALIZADA", "Até a próxima, Ana.", "Cuide-se. Seus documentos já estão prontos.", rows FileText "Receita digital · Assinada", FileCheck "Atestado · Assinado", PillButton "Ver documentos".
