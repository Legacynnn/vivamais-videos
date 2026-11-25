---
model: ad
workflow: general-video
flow: automation
storyboard: no
status: draft
---

## ROUND 22 (2026-11-12) — abertura beat 1 is kinetic type on the aurora

abertura.html beat 1 (0-1.6s): the lock screen is gone (no phone, notification or clock). Brand aurora wallpaper (gradient, oversized simbolo-branco at 5%, bloom, ring, grain, slow drift) with "Precisa de / médico / agora?" set in Space Grotesk 132px, left-aligned, agora? at 232px in violet-200 with a glow pulse. Each word resolves from a heavy blur (22-28px, scale 1.06, y 26) on the VO onset (0.10 / 0.475 / 0.60 / 0.93), Precisa already mid-resolve at frame 0, agora? lands with a back.out scale overshoot. At 1.36s the line blurs toward camera (scale 1.38, 30px) while the wallpaper fades and the documents resolve in from blur 16 (rack-focus seam). Docs beat and vo-2 timing unchanged. Stopwatch markup and tweens removed; exit is the 2.8x blur zoom ending at 3.75s into vez's 1.45 scale blur entry. Letter-spacing tightening dropped (lint forbids animating letterSpacing).

## ROUND 21 (2026-11-12) — abertura beat 1 is a premium 3 AM lock screen

abertura.html beat 1 (0-1.8s): full-bleed brand wallpaper (aurora gradient from tokens, dimmed toward night, oversized cropped simbolo-branco mark at 3.5%, soft lens bloom and ring, 5% film grain, 1-2% slow parallax drift), status bar, padlock, tracked date and "03:12" clock, headline "Precisa de / médico agora?" (104px, agora? in violet-200) landing word by word with the VO from frame 0, then at 0.98s the frosted Viva Mais notification (real icone-app.png squircle, "Dra. Camila aceitou seu atendimento") drops in with a spring and haptic bump, held about 0.35s, pressed 0.96 at 1.52s and the whole layer zooms through (2.7x blur) into the docs beat, gone by 1.8s. Gotcha fixed: a global .lock rule in kit screens.css (margin-top 8px, svg 16px) clashed with the layer class, now .lscr.

## ROUND 20 (2026-11-12) — retime, small photo, docs breathe

Timing: abertura 0 to 3.75s, plantao (clock) 3.75 to 6.5625s (2.8125s), vez unchanged. VO: "Precisa de um médico agora?" 0.1-1.36; "Receita e atestado na hora, no fim da consulta." 1.7-4.19; "Menos de três minutos de espera." 4.4-5.98.
abertura.html: beat 1 (0-1.6s) the real consultation still (assets/img/atendimento-clinica.jpg) as a small 520x650 rounded photo with outline and layered shadow, slow push-in, no scrim and no overlay; the violet two-line "disponível agora" live pill sits top-right of it and "Médico clínico" is set big bottom-right, all outside the photo. Hook headline until 1.45s, then "Receita e atestado na hora" (the only document message; the extra "Documentos na hora" type was removed). Beat 2 (1.6-3.75s): larger Receita / Atestado / Solicitação de exames stack (real template), sheets move in with transform only under a single group fade (never per-sheet opacity), signature block, QR and validation lines land staged 2.55-3.0s, recoil, hold, then zoom-through into the stopwatch at 3.34s.
plantao.html: 2.8125s, 4 ticks of 75 degrees on the beat, hand never rests on a numeral, crown presses, readout 3:00 to 2:56 with a clean non-overlapping swap, exit zoom 2.3375-2.8125s into vez.

## ROUND 19 (2026-11-12) — abertura as editorial objects + stopwatch

Timing: abertura 0 to 2.8125s, plantao (clock) 2.8125 to 6.5625s (3.75s), vez unchanged.
abertura.html: no cards. Beat 1 (0-1.4s): a 4:5 consultation photo (assets/img/atendimento-clinica.jpg, user overwrites the placeholder) bleeding off the left edge with a slow 1.0 to 1.08 push-in, "Médico clínico" set big in the photo's calm top area over a dark scrim, violet "disponível agora" status pill with live pulse at the bottom. Beat 2 (1.4-2.4s): the real Viva Mais A4 document template rebuilt in HTML (mirrors assets/docs/receita|atestado|exames renders: letterhead, profissional / paciente grid, consulta row, medication / exam tables, ICP-Brasil signature statement, QR, validation text, page footer), neutral black and grey with only the full-colour lockup logo coloured. Receita front over fanned Atestado and Solicitação de exames; the signature block (statement, QR, validation lines) lands staged, then the sheet gives a 6px recoil. "Documentos na hora / no final da consulta" set editorially. Headline hook then "Use o plantão 24/7 da Viva Mais" at 1.4s. Exit: object stack zooms through (2.8x blur) into the clock, velocity-matched.
plantao.html: premium stopwatch (dark-violet bezel, minute and 5-minute ticks, 15/30/45/60 numerals, violet progress arc, dark hand with violet tip, counterweight tail and cast shadow, crown that presses down on every beat, digital readout 3:00 to 2:54 ticking on the beat). Six ticks on the beat grid (0.47-2.81s), exit zoom into vez at 3.275-3.75s.

## ROUND 18 (2026-11-12) — abertura card deck

abertura.html (0 to 4.6875s): one big card at a time under the headline (hook swaps to "Use o plantão 24/7 da Viva Mais" at 1.4s). Order on a 2-beat grid (0, 0.94, 1.88, 2.81s): Médico clínico (Dra. Camila Rocha portrait + AO VIVO), "+25 médicos disponíveis agora" (counter + avatars), documents card (Receita / Pedido de exames / Atestado chips with checks), violet "3 min de tempo médio de espera" (count 15 to 3). Each new card flips up from below while the previous tilts back into depth; card contents are cross-hidden so no text overlaps. The violet card zooms through (2.8x, blur) into the clock at the cut, velocity-matched to plantao's entry. plantao.html untouched.

## ROUND 17 (2026-11-12) — abertura without mockup

abertura.html rebuilt: no phone, no tap. Beat 1: "Precisa de médico <em>online</em> agora?" high in frame over floating app-style widgets (live "Plantão aberto · AO VIVO" card, doctor-avatar cluster "12 médicos", Viva Mais notification card, a small stopwatch widget). Beat 2: widgets blur out, live card collapses into a violet "Entrar no plantão" pill, "Use o plantão <em>24/7</em> da Viva Mais"; the stopwatch (same DOM as the plantao clock) grows to the clock position = match cut into plantao. plantao.html: only the entry ease changed (power3.out to power2.out) for velocity match.

## ROUND 16 (2026-11-12) — audio

Music: HeyGen catalog bgm_004 ("calm premium modern ambient, soft synth pads, gentle pulse", 48s) at volume 0.15 — almost imperceptible bed. export.sh no longer loudnorms (it was undoing the low volume). VO: HeyGen voice "Antonia - Calm & Articulate" (f3318f83c10547dba19f61533d80e258, language pt, speed 0.95), one short line per scene (assets/audio/vo/); free voice credits ran out after vo-1/vo-2 — remaining lines pending credits.
Script: vo-1 "Precisa de um médico agora?" · vo-2 "Use o plantão da Viva Mais." · vo-3 "Menos de três minutos de espera." · vo-4 "Antes da consulta, conte o que sente e envie exames e fotos." · vo-5 "Converse por vídeo, ao vivo, e tire suas dúvidas." · vo-6 "No chat, mande documentos e fotos na hora." · vo-7 "Depois, tudo fica no app: transcrição, resumo e documentos." · vo-8 "E a IA explica sua consulta quando você quiser." · vo-9 "Plantão vinte e quatro horas e mais de quarenta especialidades."

## ROUND 15 (2026-11-12) — hook + ticking clock

No doctor zoom match cut any more. abertura (0–2.8125): plantão hub phone (Vídeo selected) under "Precisa de médico <em>online</em> agora?" → "Use o plantão <em>24/7</em> da Viva Mais"; tap Entrar ~2.1, press-through. plantao.html (2.8125–4.6875) becomes a TICKING CLOCK scene, no phone: a beautiful stopwatch/clock with a satisfying tick animation (hand snapping per beat, ring progress, subtle bounce) + "Menos de <em>3 min</em>" / "de espera na fila"; then straight into the match (vez).

## ROUND 14 (2026-11-12) — faster opening

abertura 0–2.8125 + plantao 2.8125–4.6875 (was 7.5 total). Punchier lines, faster, higher (top ~180–260), better kinetic animation. Later scenes −2.8125; total 42.1875.

## ROUND 13 (2026-11-12) — cut toward 40s

perfil.html dropped. vez = MATCH only, quick (7.5–10.3125, 2.8125s; no "procurando" search). anamnese 10.3125–15.9375 → chamada 15.9375 (enters from the right). pronto 25.3125, ia 32.8125, fim 39.375–45.0 (5.625s). Total 45.0. Opening becomes ad-like (match-cut on the doctor, no "Toque aqui").

## ROUND 12 (2026-11-12) — anamnese as kinetic type

anamnese (11.25–16.875): NO phone, no screens. A lively kinetic-type scene: "Antes da <em>consulta</em>, você informa" → items animating in (Sua dor · Motivo · Alergias · Medicamentos em uso) as icon chips → "e envia exames, fotos e <em>documentos</em>" (file cards flying in) → "para o médico ver <em>antes</em> mesmo da consulta". Then straight into perfil (pre-call with the countdown to enter).

## ROUND 11 (2026-11-12) — no home; start in the plantão

User: don't use the home. abertura (0–3.75) shows the PLANTÃO QUEUE screen (`plantao-queue`, violet, "Você é o 3º", doctor art, stories) in the kit phone under the hook lines ("Precisando de um <em>médico</em> agora?" → "No app Viva Mais, peça um <em>plantão 24h</em> a qualquer momento"). plantao (3.75–7.5) shows the plantão HUB (`plantao-hub video`, Vídeo selected) with "e um médico <em>online</em> vai te atender", spotlight + "Toque aqui" on Entrar, tap, press-through into vez. hub.html dropped (vez now 7.5). Total 51.5625. Music: new calm low track once HeyGen login is done.

## ROUND 10 (2026-11-12) — consulta + pós-consulta content

chamada 24.375–33.75 (9.375s): video consult told in lines: "Consulta por <em>vídeo</em>, ao vivo" → "Converse e tire suas <em>dúvidas</em>" → "Tudo fica <em>registrado</em> no app" → chat opens: "Chat ao vivo com o <em>médico</em>" → "Envie exames, documentos e <em>fotos</em>" (photo + hemograma sent). Then end call → same phone into post-consultation (seam kept).
pronto 33.75–41.25 (7.5s): show EVERYTHING the post-consultation gives: the TRANSCRIPT of the consult, the AI SUMMARY already made, and ALL documents generated (receita, pedido de exames, atestado, laudo/encaminhamento) + chat history. Lines: "Reveja a <em>transcrição</em>" → "Resumo feito pela <em>IA</em>" → "Todos os <em>documentos</em> no app".
ia 41.25–47.8125: full consult summary (as built). fim 47.8125–55.3125. Total 55.3125.

## ROUND 9 (2026-11-12)

hub: no Chat detour — Vídeo stays selected, just tap Continuar. hub now 3.75s (7.5–11.25), later scenes −1.875, total 51.5625.

## ROUND 8 (2026-11-12) — opening rebuilt around the real home

User: disliked the opening carousel of many screens. New 0–7.5 (abertura + plantao, timings unchanged):
- Home must be richer and real: library state `client-home video` (new) — the specialties marquee under the search input (FindCareHero AutoMarquee, fed via useSpecialties) and an upcoming consultation with PSICOLOGIA in NextConsultHero (e.g. "Amanhã, 14:00 · Psicologia · Dra. …"), plus quick actions and the Plantão 24h card.
- abertura (0–3.75): hook "Precisa de <em>médico</em> agora?" over that home phone (no carousel). LIFT-OUT highlight effects: real elements pop out of the screen toward camera (untouched clones, scale up + soft shadow, rest of screen dims/blurs slightly), one per beat-pair — e.g. the next-consult card, the specialty marquee row, the Super IA card — then settle back in.
- plantao (3.75–7.5): show WHERE to tap for the plantão: spotlight/dim around the Plantão quick action (or Plantão 24h card), its tile lifts out, a small hint "Toque aqui" pointer, touch dot taps it; line "Chat ou <em>vídeo</em>, sem sair de casa". Exit into hub as now.

## ROUND 7 (2026-11-12) — end card merges especialidades

especialidades.html DROPPED from index (file kept). fim.html now 45.9375–53.4375 (7.5s): centred main headline (`.v2-line`), a white CARD with ALL specialties scrolling VERTICALLY (like the landing specialty rails `.monorepo/apps/site/src/components/landing/plantao/OtherSpecialties.astro`: tile rows, real specialty icons from `packages/web-ui/src/icons/specialty*`), soft shadow/fade at the card's top and bottom edges; the benefit chips FLOAT around the card (slow independent drifts); at the end "Conheça agora" + the vivamais.ai link in link style, pulsing.

## ROUND 6 (2026-11-12) — vez + anamnese rebuilt; overrides earlier rounds where it conflicts

FINAL FLOW v2 (overrides everything below in this round): hub → vez 13.125–16.875 (3.75: quick "procurando médico" animation ~1s → MATCH, médica encontrada, chip "Ela já recebeu sua anamnese") → anamnese 16.875–22.5 (5.625: ONE screen of the anamnese she received, lines tell what you can send: "Conte em poucas <em>palavras</em> o que sente" → "Dor, alergias, remédios e <em>fotos</em>") → perfil.html NEW 22.5–26.25 (3.75: doctor profile + Entrar na chamada) → chamada 26.25 (unchanged onward, total 53.4375). fila.html dropped.

OLDER NOTE: hub → anamnese (in place of the queue) → vez → chamada. fila.html is DROPPED (file kept, not in index). anamnese 13.125–18.75: ONE screen, not filling every field — the lines tell what's possible. vez 18.75–26.25: short "procurando médico" animation (~1s) → match (doctor found) → info that she already has your anamnese → profile + Entrar. Later scenes −3.75: chamada 26.25, pronto 33.75, ia 39.375, especialidades 45.9375, fim 49.6875, total 53.4375.

ANAMNESE (13.125–18.75, now 5.625s; every later scene +1.875 again → vez 22.5–30, total 57.1875): ONE screen only. Message: "Conte em poucas palavras o que sente, sua dor, alergias, medicamentos e já envie fotos ou documentos, caso queira." One phone screen in the app's anamnese look (header "Anamnese do plantão", sections as the library's plantao-anamnese cards): short free-text "O que você sente?" typed in ("Dor de cabeça forte desde ontem"), pain 1–10 with 7 picked, Alergias "Penicilina", Remédios "Dipirona 500 mg", "Fotos ou documentos" with one thumbnail attached, "Enviar anamnese". Camera glides down the single screen as each part fills. Lines: "Conte em poucas <em>palavras</em> o que sente" → "Dor, alergias, remédios e <em>fotos</em>".


User: dislikes the doctor SLOT reel. vez.html (20.625–28.125, now 7.5s; every later scene shifted +1.875, total 55.3125) becomes two screens inside the flat kit phone:
1. MATCH (≈0–2.8): the violet "Médica encontrada" screen from the plantão landing (`.monorepo/apps/site/src/components/landing/plantao/tour/screens/Match.tsx`): violet-950 bg with soft radial glow, patient avatar (Helena) and doctor avatar (Dra. Camila Rocha) spring in from the sides and meet, spark check pops between them, a ring pulses, "Médica encontrada" + "Dra. Camila Rocha vai atender você agora.", two fact rows (CRM ativo, conferido no CFM · Já leu sua anamnese), confetti burst (Burst.tsx).
2. DOCTOR PROFILE / pre-call (≈2.8–7.5): "médico encontrado" with the doctor's profile and the option to enter — richer than today and a much better layout (better-ui): big photo, name + verified, Clínica geral · CRM-SP, rating, years, short bio/"já leu seu caso" summary, the app's "Seu atendimento" milestones (Médico encontrado ✓ · Leitura do seu caso ✓ · Chamada de vídeo aberta), countdown "Entrando na chamada em 3", primary "Entrar na chamada" button; tap Entrar → into chamada.
Line: "Encontramos sua <em>médica</em>" during match is optional (the screen already says it); "É a sua <em>vez!</em>" over the profile.

## ROUND 5 (2026-11-12) — overrides earlier rounds where it conflicts

User on the 2026-11-12 render:
1. OPENING — ~7.5s of type only, nothing visual grabs. New 0–7.5:
   - abertura.html (0–3.75): hook "Precisa de <em>médico</em> agora?" from the very first frame, over a ROTATION of what the app has: flat upright kit phones with real library screens (`ai-chat answer`, `post-consultation ready`, `my-plan`, `plantao-queue position-3`… pick ones that render well) gliding past in a smooth carousel behind/under the line (continuous drift, one eased step per beat, no tilts). No logo here. Exit into plantao: the carousel settles/hands off to the home phone.
   - plantao.html (3.75–7.5): the REAL app home (`<!-- screen:client-home default -->`) in the kit phone; touch dot taps the Plantão quick action (or the "Plantão 24h · Entrar na fila" card) on a beat; line "Chat ou <em>vídeo</em>, sem sair de casa". The pill rail and "Conheça o Plantão 24h" go away. Exit into hub as before (hub phone takes over).
2. hub.html line becomes "Escolha como quer ser <em>atendido</em>" (the vídeo/chat promise now lives in plantao).
3. NEW especialidades.html (45.9375–49.6875) between ia and fim: a specialties slide like the patient video's — "E mais de <em>40 especialidades</em>" + subline "por agendamento, no mesmo app"; specialty chips/cards with simple line icons cascading in (Cardiologia, Dermatologia, Pediatria, Ginecologia, Ortopedia, Psiquiatria, Endocrinologia, Nutrição, Oftalmologia, Neurologia…), waterfall entry, slow drift. Light stage like the rest. fim moves to 49.6875–53.4375 (total 53.4375).
4. fim.html — the vivamais.ai link PULSES: gentle repeating pulse (soft ring/glow expanding from the link pill + subtle scale 1→1.03) from when it lands to the end. Overrides the "no pulse" rule for this element only.
5. CROPPED MOCKUPS — wherever a phone is cut by a frame/container edge (hub, anamnese, fila, chamada, pronto, ia), the cut edge fades into the background instead of a hard line: `.v2-crop-fade` / `.v2-crop-fade-b` masks from `assets/v2.css` (or an equivalent bg-coloured gradient shadow) on the cropping container.
6. LOGO — not on every screen. Keep it only in plantao (home) and especialidades; remove from hub, anamnese, fila, vez, chamada, pronto, ia. Position higher: `.v2-logo` top 220px (v2.css).
7. MUSIC — calmer and quieter. Volume 0.9 → 0.45 now; replace `assets/audio/music.wav` with a calm, soft track (HeyGen catalog, e.g. "calm warm acoustic / soft piano, gentle") once signed in; ≥ 54s. export.sh loudnorm now -20 LUFS (was -14, which undid the lower volume). Temp: current track media-start 0, ends 52.4 with 2.5s fade.

## ROUND 4 (2026-11-11)

chamada.html — show more of the phone mockup overall (pull back, whole phone with call + chat visible, gentle zoom only) and make the conversation flow continuously like a real chat (smooth bubble entries, continuous scroll, overlapping eases, smooth sheets). Content/order unchanged.

pronto.html — show more of the generated documents: tap Receita simples → the document opens inside the app (real document sheet/viewer, polished but app-native), realistic page previews of receita, pedido de exames, atestado; close back and end on the Perguntar à IA card.

## ROUND 3 (2026-11-11) — overrides earlier rounds where it conflicts

User on round-2 render:
1. plantao.html — the pill rail scroll must be smoother all the way until it settles on Plantão (one long continuous decel, no jerk/stop-start, no blur pop). The handoff from the single word in the pill to the line "Conheça o Plantão 24h" must be much better: the word itself stays put and becomes part of the line (FLIP/morph same font, no font swap DM Sans→Space Grotesk mid-flight, no double text), "Conheça o" and "24h" slide/blur in around it while the pill body dissolves.
2. hub.html — "a primeira tela não está igual ao app": the plantão screen must look EXACTLY like the library render (`screens/dist/shots/plantao-hub--video*.png`): no font-size overrides, no photo resizing/cropping, no scrims eating the header, no hidden title. Compare a frame side by side with the shot before reporting. (Camila swap on the banner photo is fine if it keeps the app's crop.)
3. Retimed: fila 16.875–20.625 (3.75s), vez 20.625–26.25 (5.625s). index.html already updated.
   - fila.html — NO stories. A great animation of the queue moving: the real queue screen in the phone, position rolling 4º→3º→2º→1º with the app's own UI (estimated time ticking down, maybe people-ahead avatars leaving) — smooth, satisfying, beat-synced.
   - vez.html — the doctor SLOT: in the real "Encontramos seu médico" doctor card photo frame, doctor portraits spin past like a slot reel (assets/people/doctors: julia, mariana, rafael, d0–d5 … then camila-rocha), beautifully eased (fast → slow), lands on Dra. Camila = MATCH (a satisfying lock-in beat: subtle scale bump, check, chip "Médico encontrado"), then "É a sua vez!" and tap Entrar na chamada → into the call.
4. chamada.html — also SHOW the user sending the medicine photo (attach → Galeria/Câmera → pick the dipirona box photo → it lands in the chat), and say she can send anything, including old documents saved inside Viva Mais (attach → Do seu histórico → "hemo" → Hemograma → lands). Lines e.g. "Mande foto do remédio" → "e documentos salvos no Viva Mais" (one violet word each).
5. chamada.html — also show the DOCTOR replying in the chat (real incoming bubble, typing indicator first), e.g. "Recebi! É dipirona 500 mg, certo?" after the photo and "Ótimo, já estou vendo seu hemograma." after the PDF.
6. ia.html — now 5.625s (39.375–45.0); fim moves to 45.0–48.75; total 48.75s. A longer AI interaction: real AI chat in the phone, 2 exchanges (e.g. "Como tomo a receita?" → answer citing the receita; follow-up "Posso tomar com café?" or "E se a dor voltar?" → short answer), typed questions, answers streaming word by word, maybe one suggestion chip tapped.
Keep everything else from round 2 (flat upright phone, real app UI, app-native selection, no tilts).

## ROUND 2 (2026-11-11) — overrides the scene table where it conflicts

User on v1 render ("gostei muito mais", but):
1. SELECTION STYLE — the heavy violet fill + spark ring / thick border on selected chips, pills, cards is not the app's style. Selected states must look exactly like the real app: use the screen library's own selected-state markup (e.g. anamnese came pre-selected "Dor de cabeça"/7, plantao-hub video has Vídeo selected) and switch from the unselected clone to the real selected look on the tap frame. No spark rings, no added glows/borders on selections. Tap feedback = the house touch dot only.
2. NO TILTED 3D PLANES — drop the angled/rotated app views. Show the app inside a flat, upright phone mockup: the kit iPhone (`videos/kit/README.md`: `.cam > .dev > .bezel + .screen > .scr`, `m.device`, `k.liftOut`, touch). Camera may still push in / rack-focus / scale the whole phone (no rotateX/rotateY), and blur on seams stays.
3. REAL APP UI, NOT A NEW CARD STYLE — anamnese, queue, doctor card, documents, chat, IA: show them as the real screens inside the phone, not restyled floating hero cards (no re-skinned white/violet cards with new shadows). A close-up = camera zoom into the phone screen on the real component. If one element lifts out, it is an untouched clone of the real node (`k.liftOut`), same look as in the app.
Keep: timing, music, lines/interstitials (small centred text, one violet word), opening, pills→title (but the selected pill drops the spark ring/glow), end card, all content choices (Dra. Camila, hemo search, dipirona photo, 4 documents, IA chat).

# plantao-24h-v2

Ad: motion-led, music only. The plantão journey end to end, told in short on-screen lines, in the motion language of the Polymarket "Perps is live" launch film translated to the light Viva Mais brand. `videos/ads/plantao-24h` (v21) stays untouched; reuse its content and markup by copying, never by editing it.

## Message

Do plantão ao pós-consulta, tudo no app: você escolhe vídeo, conta o que sente, acompanha a fila, fala com a médica (manda fotos e exames na hora) e sai com os documentos prontos e a IA para tirar dúvidas.

## Audience

Adults 40+, Instagram/Facebook Reels and Stories (9:16), feed (4:5 crop). Muted autoplay is common: every story beat is carried by text.

## Output

- Master: portrait 1080×1920 @30, **46.875s** (25 bars at 128 BPM; hard max 50s).
- Feed 4:5: centre crop 1080×1350 at y 285–1635 of the same master, `./export.sh` after render (loudnorm + crop, music only). No re-edit.
- Language: pt-BR. Voice: none.
- Music: `assets/audio/music.wav` (copied from plantao-24h; HeyGen catalog 837fa2d1, 128 BPM, 52.4s), `data-media-start="0.485"`, fade-out 1.2s. Beat file: `beats/assets/audio/music.wav.json`.

## Beat grid (composition time)

128 BPM. Beat = 0.46875s, bar = 1.875s. Bars start at 0, 1.875, 3.75 … 45.0. Every scene starts on a bar. Inner hits at +0.46875 / +0.9375 / +1.40625. Measured energy: flat bars 0–13.1, a breakdown bar at 13.125, **the lift/drop at 15.0** (the "7" tap in anamnese), full energy flat from 15.0 to the end. Taps, numeral rolls, card swaps and word reveals land on beats.

## Look: Polymarket grammar, Viva Mais light brand

Translate every trait; never copy its dark look.

- **Stage**: `#FAFAFE` canvas with one soft violet halo (`.v2-halo`) and a faint lavender floor (`.v2-floor`), both from `assets/v2.css`. No blobs dancing, no grain, no gradient fills behind type. Lots of negative space.
- **Interstitial lines** (`.v2-line`): small centred Space Grotesk 64px (ink `#17151E`), one accent phrase in violet `<em>`, words blur-in one by one (filter blur 12→0, y 24→0, 0.06s stagger). Big variant 96px only for the opening word.
- **3D planes** (`.v2-3d > .v2-plane`): the real app screen as a large flat card (white, radius 56, `--v2-shadow`), tilted rotateX 18–28°, rotateY −10–14°, in perspective 2400px; the camera dollies (translateZ / scale) and settles.
- **Rack focus**: the plane blurs (filter blur 0→14px, slight scale-down) while ONE component is lifted out as a `.v2-hero` card (white, radius 40, soft violet glow `::before`, `--v2-shadow`) that floats up flat to camera and fills ~860px of width. Hero components are the real library markup cut out of the screen (clone the node from the filled marker), not redrawn.
- **Macro**: one component per frame, filling the safe box width; the tap target large.
- **Tap**: oversized touch dot (`.v2-tap` + `.v2-tap-ring`, 132px, white with violet ring), the full-frame version of the house `k.tap` touch in plantao-24h. It enters from off-frame, glides in 0.45s power3.inOut, presses (scale 0.86, 0.1s), the ring expands once (scale 1→1.8, opacity 1→0, 0.35s), the target's state changes on the press frame, then the dot leaves. Inside a still-visible device plane use `k.tap` with the same CSS.
- **Ease**: everything slow-in fast-out: entrances `power4.out` 0.6–0.8s, exits `power3.in` 0.35–0.45s with blur 0→12px, staying in motion through the cut. No yoyo, no pulse, no looping glow. The hero glow fades in once and holds.
- **Colour**: violet `#7E3BED` dominant (accent words, selected pill, buttons); spark `#12FFD7` only as the thin ring on the selected pill and the check dots; iris/azure never as fills; no green fills anywhere.
- **Logo**: `assets/brand/lockup-cor.svg` top-left (`.v2-logo`, x 80, y 300, w 210) in every scene except `abertura` 0–1.4 (frame is the giant word) and `fim` (centred sign-off). Fades in at abertura 1.4 and is present continuously after (same position every scene so cuts do not blink it).

## Safe box (mandatory)

Readable content (lines, hero components, tap targets, logo) inside **x 80–940, y 300–1240** (Reels UI + 4:5 crop y 285–1635). Planes, halos and the blurred device may bleed. Root of every scene: `class="vm-scene v2-scene"`. Type floor: lines ≥ 64px, readable copy inside hero cards ≥ 40px (scale the cloned component up; app copy at 15px × 2.6 ≈ 40px).

## Scene Plan

Times absolute. One row per file in `compositions/`. Seam selectors in the last column must exist in that file (see `ledger.json`).

| # | File | Start–end | On-screen text (final, pt-BR) | Screen / component source | Camera + action | Exit → next |
|---|------|-----------|-------------------------------|---------------------------|-----------------|-------------|
| 1 | abertura.html | 0–3.75 | "Médico" (giant) → "Médico a <em>qualquer hora</em>" | type only | Giant "Médico" (Space Grotesk 260px, centred, letters rise) 0–1.4; on 1.40625 it shrinks and drifts to y 820 as the line's first word, "a qualquer hora" blur-in word by word on beats (1.875, 2.34, 2.81); hold; logo fades in 1.4 | 3.28 the line rack-focuses out (blur 14, scale 0.94, x −120) while the pill rail enters from the right. Class `.v2-line` on the line |
| 2 | plantao.html | 3.75–7.5 | Pills "Agendar · Documentos · Super IA · Meu plano · Plantão 24h" → "Conheça o <em>Plantão 24h</em>" | pill labels from the home quick actions (`client-home default`) and the home Plantão 24h card | `.v2-rail` of `.v2-pill`s slides LEFT, scale 0.8→1.35, decelerates 0–1.9 and lands centred on "Plantão 24h", which turns on (`.v2-pill--on`) at 1.875; 2.34 the pill text detaches and becomes the accent of the small line "Conheça o Plantão 24h" (pill body blurs out, "Conheça o" blur-in letters); hold to 3.4 | 3.4 line blurs back (scale 0.9, blur 14) as the hub plane rises behind it. `.v2-line` |
| 3 | hub.html | 7.5–13.125 | "Escolha <em>vídeo</em> ou chat" (top line) | `<!-- screen:plantao-hub video -->` | 0–1.4 hub screen enters as a tilted 3D `.v2-plane` (rotateX 26, rotateY −12, from z −900), dolly in; 1.4–2.3 rack focus: plane blurs, the ChannelChoice row (Vídeo + Chat cards) lifts as a `.v2-hero` pair, flat, ~860 wide; line at y 420; 2.81 tap dot on Chat (card selects), 3.28 tap back on Vídeo (selected, check); 3.75 hero returns into the plane, camera pushes to the "Entrar" button (macro, fills width at y ~1000); 4.69 tap Entrar | 5.15 press-through: camera zooms through the pressed button with blur (Z-forward). `.v2-plane` |
| 4 | anamnese.html | 13.125–16.875 | "Conte o que <em>sente</em>" | `plantao-anamnese symptom` (chip cloud) → `plantao-anamnese pain` ("Quanto dói?" 1–10 row) | 0–0.5 symptom chip cloud arrives as `.v2-hero` from blur; 0.94 tap "Dor de cabeça" (selects violet); 1.41 hero swaps (blur crossfade) to the "Quanto dói?" card, macro, numerals ≥ 64px; 1.875 (abs 15.0, the drop) tap 7 → "7 · Forte" lights; hold to 3.3 | 3.3 card exits LEFT with motion blur. `.v2-hero` |
| 5 | fila.html | 16.875–22.5 | "Acompanhe a sua <em>vez</em>" → numeral "4º" → "1º" | `plantao-queue position-4` / `position-3` / `position-1`; story slide from plantao-24h `busca.html` (`#bs-st`, slide "Receita no app", art `assets/illustrations/stories/documents.webp`) | 0–1.4 interstitial line centred, enters from right; 1.4 queue screen plane enters tilted below the line, rack focus to the big position numeral as `.v2-num` hero (Space Grotesk 360px, "Você é o" above, "Espera estimada ~12 min" chip under); 2.34 tap the story card "Receita no app" in the "Enquanto você espera" row → story view 1.0s with progress bar (2.5–3.5) → back; 3.75 numeral rolls 4º → 3º (beat) → 1º (4.22), chip to "~3 min"; hold to 5.15 | 5.15 match cut: "1º" scales toward camera and blurs. `.v2-line`, `.v2-num` |
| 6 | vez.html | 22.5–26.25 | "Encontramos seu médico" (screen) → "É a sua <em>vez!</em>" | `plantao-called reading` → `plantao-called calling` | 0–0.6 the tilted doctor card (CalledTakeover, Dra. Camila Rocha) resolves from blur as the floating `.v2-hero`, chip "Preparando"; 0.94 chip flips to "Chamando você"; line "É a sua vez!" blur-in at 1.4; 2.34 camera drops to the "Entrar na chamada" button (macro); 2.81 tap | 3.28 shared element: the card photo expands toward camera into the call. `.v2-hero` |
| 7 | chamada.html | 26.25–33.75 | "A médica já sabe do <em>seu caso</em>" → "Mande <em>fotos</em> e exames" | `call-chat button` / `open` with `assets/video/doutora-call.mp4` in the remote video slot and `assets/video/paciente-pip.mp4` as PiP (as plantao-24h `chamada.html`); compact attach popover + searchable "Do seu histórico" picker + Hemograma preview card + `assets/footage/dipirona-caixa.jpg` photo bubble, copied from plantao-24h `chamada.html` (`#ch-pop`, `#ch-sheet`, `#ch-doc`, `#ch-pg`) | 0–2.3 call screen as a tilted `.v2-plane` (rotateY 14), slow dolly; line 1 at y 420 (holds ≥ 1.8s); 2.34 tap chat icon, CallChat slides up; line 1 exits fully before line 2 enters at 2.81; 3.28 tap attach → popover; 3.75 macro on the picker: type "hemo" in search (typed 0.6s), row "Hemograma completo" filters in; 4.69 tap → preview card sent (lift out as hero 5.15–5.9); 6.1 dipirona photo bubble lands; hold | 7.03 `m.plusCover`. `.v2-plane` |
| 8 | pronto.html | 33.75–39.375 | "Seus documentos, <em>prontos</em>" | `post-consultation preparing` → `post-consultation ready`; document rows from the ready state (DocumentList labels: Receita · Pedido de exame · Atestado · Laudo) | 0 `m.plusReveal`; 0–1.4 ready screen plane tilted, StatusBanner macro "Documentos em preparo" → 0.94 swaps to the ready header "4 documentos" (beat); line at y 420 from 1.4; 1.875–4.2 carousel: four document hero cards (Receita "Dipirona 500 mg", Pedido de exame "Hemograma completo", Atestado "2 dias de afastamento", Laudo) fly past camera tilted, one per beat-pair, each readable ≥ 0.9s at centre; 4.22 the plane returns, the "Perguntar à IA" card glows once (fade-in glow, hold) | 5.15 the Perguntar à IA card isolates and carries LEFT across the cut. `.v2-plane` |
| 9 | ia.html | 39.375–43.125 | "Dúvidas? <em>Pergunte à IA</em>" | AskAiCard (from `post-consultation ready`) → `ai-chat answer` | 0–0.6 Perguntar à IA card arrives from the right as `.v2-hero` (continuing pronto's move); 0.94 tap; 1.2 ai-chat plane resolves, user bubble "Como tomo a receita?" types in (macro), 1.875 answer lines rise ("Dipirona 500 mg de 6 em 6 horas, se tiver dor."); line at y 420 from 0.47; hold to 3.2 | 3.28 inverse zoom-through: plane pulls back and blurs. `.v2-plane` |
| 10 | fim.html | 43.125–46.875 | "Consulte já em" → "<em>vivamais.ai</em>" → lockup | `assets/brand/simbolo-cor.svg`, `assets/brand/assinatura-violeta.svg` (or `lockup-cor.svg`) | 0–0.5 "Consulte já em" resolves from blur, centred; 0.94 it blurs out as "vivamais.ai" (violet) types in letter by letter; 1.875 URL steps up, the symbol scales in from 0.6 with blur (no redraw, no recolour), 2.34 wordmark reveals left→right through a clip mask; quiet hold to the end, slow 3% push. No logo top-left here | end (music fades 45.675–46.875) |

Durations: 3.75 + 3.75 + 5.625 + 3.75 + 5.625 + 3.75 + 7.5 + 5.625 + 3.75 + 3.75 = **46.875**.

## Builder rules

- Fonts: copy the `@font-face` block of plantao-24h compositions (DM Sans 400/500/700, Space Grotesk 500/700 from `assets/brand/fonts/`).
- Link `assets/screens/screens.css` and `assets/v2.css` in each composition that shows a screen; screens go in `<div class="scr"><!-- screen:id state --><!-- /screen --></div>` inside a 402×874 box scaled up (`transform: scale(...)`), then `npm run sync -- plantao-24h-v2` fills them. Target elements by `aria-label` / `data-testid` or by text.
- Hero components are clones of nodes from the filled screen, scaled, inside `.v2-hero`; never retype app copy by hand.
- Kit: `VMMotion` (`rise`, `exit`, `plusCover`/`plusReveal`, `count`, `hold`) and `VMKit` (`k.tap`, `k.center`, `k.typeIn`, `k.liftOut`). Seam selectors from `ledger.json` must exist with those classes.
- One line on screen at a time; a new line enters only after the previous one has fully exited. Each line fully still ≥ 1.4s.
- Doctor: Dra. Camila Rocha (library photo `assets/screens/img/camila-rocha-*.jpg`, footage `assets/video/doutora-call.mp4`). Patient: Helena Souza (`paciente-pip.mp4`).
- Deterministic only (no `Math.random`); seeded PRNG as in plantao-24h `fim.html` if needed.
- Check: `npm run check -- plantao-24h-v2`, `npm run seams` in the video folder, snapshots at 1.0, 2.6, 5.5, 9.5, 15.2, 20.0, 24.0, 29.0, 31.5, 36.5, 41.0, 45.5 with the safe box drawn.

## Notes

- Invented UI (not in the app, kept from plantao-24h round 16/17): the searchable "Do seu histórico" picker and the compact attach popover in `chamada`. Everything else is the screen library.
- Library additions (optional, not blocking): in-call video screen (`.monorepo/apps/mobile/src/components/video-call/**`) as a `video-call` screen; today the call is `call-chat button` + footage overlay, as in plantao-24h.
- Images to generate: none.

VO (2026-11-12): ElevenLabs free, voice Matilda (XrExE9yKIg1WjnnlVkGX), eleven_multilingual_v2, 9 lines in assets/audio/vo, starts 0.1/1.45/3.3/7.7/13.2/18.4/22.7/30.3/37.0. Free plan = attribution "elevenlabs.io" in post caption. Key at ~/.config/elevenlabs/key.
