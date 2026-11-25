---
model: ad
workflow: general-video
flow: automation
storyboard: no
status: built
---

# plantao-24h

## ROUND 17 (2026-11-11) — chamada attach; overrides earlier rounds where it conflicts

User on v18: "Do seu histórico" being invented is fine. But (1) the medicine photo is still the same (blister pack crop) — replace with a clear, real-looking photo of a medicine box/package (brand-free) held or on a table; (2) the selector should be much better: SEARCHABLE — search old exams, prescriptions, documents — like the app's own documents screen (`.monorepo/apps/mobile/src/components/documents/ClientDocumentsScreen.tsx`, `DocumentsHistoryScreen.tsx`, `ClientDocumentRow`, `DocumentGlyph`, `DocumentSheet`): search field, filter chips (Todos / Exames / Receitas / Atestados…), rows with the app's document glyphs; type a query (e.g. "hemo" or "glic") → filtered results → pick → shared card with real preview in chat.

## ROUND 16 (2026-11-11) — overrides earlier rounds where it conflicts

User on v17:
1. chamada — sending the medicine photo and the document in the chat "didn't look good". Simulate REAL documents with a visual PREVIEW (e.g. a realistic lab result page "Hemograma completo" thumbnail with header, table rows, lab logo-less; a photo of the medicine box). The attachment selector (the full "Anexar" list sheet) also isn't good — make it compact and visual (e.g. a row of big icon tiles or a small popover), and ADD an option to share past data ("Do seu histórico": exames e consultas anteriores) — NOT in the app yet (chat AttachmentPicker has no such option); flag as invented. Show sharing a past exam from history with its preview card.
2. busca (fila) — show the queue's stories ("Enquanto você espera" row) minimally: tap one story → brief story view (real slides from `components/plantao/patient/stories/story-slides.ts`, art in assets/app/illustrations/plantao-stories/) for ~1s with progress bar, then back to the queue.
Durations unchanged.

## ROUND 15 (2026-11-11) — overrides earlier rounds where it conflicts

User: remove the chat/video expand beat before Entrar; improve the in-consult part instead — show only the REAL call screen on the phone in the user's hand, telling that a chat opens too, the camera, you can send documents mid-consult, etc. Also the Perguntar à IA card is duplicated in pronto.

**Timing (total 43.59375, unchanged):** consulte 0–6.5625 · preconsulta 6.5625–11.25 · busca 11.25–17.34375 · chamada 17.34375–27.1875 (9.84375) · pronto 27.1875 · ia 32.8125 · provas 37.03125 · fim 40.78125.
**VO (export.sh delays):** 1 0.2 · 2 6.644 · 3 17.484 ("E a médica já chega sabendo do seu caso.", 3.45s) · 3b 21.2 NEW "Durante a chamada, o chat abre junto. Mande fotos e documentos a qualquer momento." (5.67s; word starts rel. to 21.2: chamada 0.69, chat 1.56, abre 1.94, junto 2.17, Mande 2.97, fotos 3.28, documentos 3.85, qualquer 4.46, momento 4.84) · 4 27.328 · 5 32.928 · 6 36.978 · 7 40.778. vo-1b removed.
- consulte (6.5625): first frame and the three opening texts unchanged; then hub (Vídeo selected) → tap Entrar → exit. No chat/video expand, no "Prefere escrever?".
- chamada (9.84375): a hand holding the phone; on the phone the REAL in-call UI (`.monorepo/apps/mobile/src/components/video-call/**`, chat panel `components/chat/CallChat.tsx`, attachments `chat/AttachmentPicker.tsx`, `MessageBubble`), with our Camila footage in the remote video slot and Helena PiP. Beats synced to VO: doctor arrives / "já chega sabendo do seu caso" → tap chat icon, CallChat slides up over the call ("o chat abre junto") → camera toggle/flip shown ("câmera") → attach → photo + PDF document sent in the chat ("Mande fotos e documentos"). Headlines: "A médica já chega sabendo do seu caso" → "O chat abre junto" → "Mande fotos e documentos". Keep seams with busca (in) and pronto (out).
- pronto: remove the inserted duplicate Perguntar à IA card (library post-consultation now renders the real one); keep the glow on the real card.

## ROUND 14 (2026-11-11) — consulte channel moment; overrides earlier rounds where it conflicts

User disliked the pop-out Vídeo/Chat cards (floating tilted cards with mini flows). Chosen direction: "cartão vira a tela" — a continuous shared-element expand. On the hub phone (library `plantao-hub`), tap Chat → the Chat card grows from its exact tile rect out of the phone until it fills the whole frame and becomes a full-screen chat conversation (big legible bubbles, doctor header, typing, real app chat look), with "Prefere escrever? / Também tem consulta por chat." over it; then it collapses back into its tile. Tap Vídeo → same expand into a full-screen video call with Dra. Camila (our call footage) + Helena PiP + call controls, "Ou por vídeo, cara a cara."; collapses back; Vídeo selected → tap Entrar. No floating cards, no tilt, no fake mini-UIs inside small cards. Expand/collapse are one smooth move (photo → content crossfade during growth, corner radius 20 → 0). Keep VO sync (1b speech 5.93–9.05; tap Vídeo after it), first frame, opening texts and duration.

## ROUND 13 (2026-11-11) — align with the real app; overrides earlier rounds where it conflicts

User: "atualize tudo corretamente" after the app/site audit. Every phone moment must be the REAL app, from the screen library (`<!-- screen:id state -->` markers, see screens/README.md), not hand-drawn.
- Headlines: kit `.vm-head` is now weight 400, tracking -0.035em (site style). Scene-local headings must match (no 500/700 display titles).
- preconsulta → the real anamnese: `plantao-anamnese` symptom → pain (7) states. Titles: "Conte o que sente" / "O médico lê tudo antes de te atender". Drop "Enviar/Enviado ao médico" (not in app).
- busca → the real wait + call: `plantao-queue` (position rolls 4º → 3º → 1º, prep tips are the app's own QueuePrepSection) then `plantao-called` (CalledTakeover: tilted doctor card, Médico encontrado → Leitura do seu caso → Chamada de vídeo, countdown) handing into chamada. Titles: "Na fila, você se prepara" / "É a sua vez." The slot reel, 50/50 match blocks and the invented "Conheça sua médica" sheet go away.
- consulte: hub/channel phone states use `plantao-hub` video/chat where a phone is shown; the pop-out widget cards stay.
- pronto: patient phone uses `post-consultation` preparing → ready; doctor side stays as built (FinishScreen not in library).
- ia: phone uses `ai-chat` if the library renders it faithfully; otherwise keep.
- Doctor stays Dra. Camila Rocha (our call footage). Durations unchanged unless a scene needs ≤0.5s more; VO unchanged.

## ROUND 12 (2026-11-11) — overrides earlier rounds where it conflicts

User feedback on v12 (rest approved):
1. consulte — headline "Consulte agora!" → "Consulte já!" (done by orchestrator).
2. busca pre-call screen — the tips part is still bad. Keep the full-bleed parallax photo + doctor data over the dark shadow at top, but the shadow must MERGE into WHITE below (photo → dark scrim → fades into a white sheet, like a bottom sheet rising out of the photo). On the white part: "Dicas para sua consulta" with the tips as clean rows (soft --vm-tile icon tiles, dark text, no glass), then actions: "Entrar na consulta" as the PRIMARY full-width solid violet button and "Cancelar" as a secondary ghost/text button under it. Tap on Entrar.
3. provas (benefits) — recreate the feel of the business deck's HERO section (`presentations/index.html` slide `#capa`, styles `.s-hero` in `presentations/shared/deck.css`, assets `presentations/assets/hero-pessoa.png`, `hero-medica.png`; reference look `presentations/export/01.png`): big shaped backdrop (cross/ring brand shape behind a smiling person cutout) with a strong soft shadow, and the benefits as FLOATING white chips/pills with icon around the person, drifting gently (each on its own slow float). Benefits: Plantão 24/7 com clínico geral · +40 especialidades por agendamento · Dados e documentos num só lugar · IA: planos, análises e o médico ideal · e muito mais. No green (ads use violet/spark; replace the deck's aqua with spark/violet). Keep duration and the seam into fim.

Durations unchanged. VO unchanged.

## ROUND 11 (2026-11-11) — overrides earlier rounds where it conflicts

User feedback on v11 ("no resto tá bom" — only these three things change):
1. consulte — the Vídeo / Chat widgets in the pop-out moment must be much better and prettier. Base them on the real app widget `.monorepo/apps/mobile/src/components/plantao/ChannelChoice.tsx` (photo cards `assets/illustrations/plantao/channel-video-photo.webp` / `channel-chat-photo.webp`, already in `assets/app/illustrations/`). Big, photo-led cards with depth (soft shadow, slight 3D tilt toward camera, light sheen), crisp large type, the selected one scaling up with a violet ring/glow, the other dimming. Inside each, the mini flow stays (video call / chat bubbles) but legible and composed, not crammed. Pop-out and return must feel springy and smooth. Keep timing and VO sync.
2. busca — the pre-call screen ("Conheça sua médica" + "Dicas para sua consulta") is still bad and looks like the OLD app. New direction: full-bleed doctor photo as the background of the whole phone screen with a slow PARALLAX (photo drifts/scales slower than the content), and the doctor data (name + verified, Clínica geral · CRM-SP 123456, 4,9 ★, 8 anos) laid over a dark gradient SHADOW at the bottom of the photo, white type. Tips become glass chips/cards floating over the lower photo/shadow (blurred translucent, white icons + text), entering in a stagger, not a white list. "Entrar na consulta" a solid violet pill. Confetti stays. Match the new design language (same as the 50/50 full-bleed match blocks of round 10).
3. pronto — the post-consult (patient) screen must be more worked: keep the real-app structure from round 10, but stage it richer — status banner animating from "Documentos em preparo" to ready, documents landing with the fly-transfer, then a camera move (slow scroll/push) through the screen revealing Resumo/orientações, document tiles with real illustrations where available (`.monorepo/apps/mobile/assets/illustrations/plantao/summary.webp`, `assets/illustrations/doctor/documentos.webp` etc. — copy what you use into `assets/app/illustrations/` and map in assets.json), the Perguntar à IA card glowing as handoff to the ia scene. Final hold readable ≥1.3s. Keep scene duration.

Durations unchanged. VO unchanged.

## ROUND 10 (2026-11-11) — overrides earlier rounds where it conflicts

User feedback on v10 (screenshots of the match frame and the finish frame):
1. Search/match: each block should fill 50% of the width — the doctor block and the patient block side by side, equal, each a FULL-BLEED photo filling the whole block, with name + CRM (doctor) / "Paciente" + "Dor de cabeça" (patient) overlaid at the bottom over a dark gradient shadow. No white inner card, no window-inside-window. The reel scrolls whole full-bleed blocks.
2. The pre-call screen ("Conheça sua médica") must show the doctor's info better AND tips for the consultation. Use the app's real pre-call / waiting tips where they exist (`.monorepo/apps/mobile/src/components/plantao/queue/QueuePrepSection.tsx`, `QueueWaitingRoom.tsx`, `video-call/DeviceCheckStepScreen.tsx`, `CallCountdownNote.tsx`).
3. The finished-consult scene ("A médica finaliza a consulta" / documents) UI is far from the real app. Rebuild both phones' screens faithfully from the real source: doctor side `components/medical-record/screens/FinishScreen.tsx`; patient side `components/consultation/post/PostConsultationScreen.tsx`, `PostConsultationHeader.tsx`, `PostConsultationSections.tsx`, `StatusBanner.tsx`, `ConductBlock.tsx`, `DocumentList.tsx`, `IconTile.tsx`, `AskAiCard.tsx`, `RatingBlock.tsx` (real copy, real hierarchy, real colours from the theme). Keep the doc fly-transfer animation and the scene timing.

Durations unchanged.

## ROUND 9 (2026-11-11) — overrides earlier rounds where it conflicts

User feedback on v8:
1. The search reel ("slot") should pass ONLY a card with the doctor's photo as large as possible plus the name + CRM underneath. One big portrait card per step in the window, nothing else (no rows with small avatars).
2. The pre-call doctor profile screen ("Antes de entrar" / "Conheça sua médica") must be much better.
3. In the opening, the Vídeo / Chat channel widgets of the UI must appear more and POP out of the screen. The phone mockup can even leave: show the two widgets side by side, big, each as a mini consult flow (video call vs chat), then go back to the real UI in the mockup and continue (Vídeo selected → Entrar).

Durations unchanged (consulte 11.71875, busca 6.09375). VO unchanged (1 at 0.2, 1b "Prefere escrever? Também tem consulta por chat." at 5.7 → speech 5.93–9.05).

### consulte (opening) — widget pop-out
- 0–5.6 as now (frame 0 approved; text beats with clean swaps).
- ~5.6 the two channel cards (Vídeo, Chat — the real ChannelChoice tiles with their photos) LIFT OUT of the phone (scale up, z-pop, soft shadow) while the phone sinks/fades back or slides off; the two widgets land side by side, big (each ~440 wide), in the middle of the frame.
- 5.9–9.1 each widget plays its own tiny flow, readable: VÍDEO widget = doctor video tile (doutora video/still) with call controls and patient PIP, label "Por vídeo · cara a cara"; CHAT widget = chat bubbles typing in (patient "Estou com dor de cabeça desde ontem" → doctor "Oi! Já vi sua pré-consulta. Vamos conversar?"), label "Por chat · escrevendo". Caption "Prefere escrever? / Também tem consulta por chat." synced to VO; Chat widget highlighted while VO talks about chat, then Vídeo highlighted after 9.1 with caption "Ou por vídeo, cara a cara." (hold ≥ 1.2s).
- ~10.3 the widgets fly back INTO the phone slots (reverse of the lift-out), the phone returns, Vídeo selected, tap "Entrar" (~11.0), exit Z-forward as now.
- Big type in the widgets (≥ 34px), everything inside x 80–940, y 300–1600.

### busca — reel + better profile
- Left window = reel of BIG portrait doctor cards: photo fills most of the card (≈ 380×470 visible), name (≥ 40px bold) + "CRM-SP ######" (≥ 30px) underneath; one card centred per step, neighbours partially visible above/below under fade masks. Cards scroll, decelerate, settle on Dra. Camila Rocha (CRM-SP 123456).
- Right window: "Paciente" card as now.
- Profile pre-call screen redesign (the "Conheça sua médica" phone): premium, app-like and big: hero photo of Dra. Camila filling the top of the screen with a soft gradient into white, name 2× larger, "Clínica geral · CRM-SP 123456", verified badge, a row of 3 stat tiles with icons (★ 4,9 · 312 avaliações | 8 anos | 2.400 consultas), short bio line ("Atende adultos e idosos. Fala português e inglês."), a "Online agora" pulse dot, primary button "Entrar na consulta" with a pulse then tap. Confetti behind. Everything important above y 1600; fill the screen — no empty white.

## ROUND 8 (2026-11-11) — review fixes; overrides earlier rounds where it conflicts

User removed the tutorial stories (too fast → better not to show). Reviewer findings drive this round: holds too short, overlapping headline swaps, empty phone areas, payoffs outside the 4:5 crop (y 285–1635) and under the Reels band (> y1240), flat-violet flash at chamada→pronto, logo blink at busca→chamada.

**Timing (total 42.65625):** consulte 0–11.71875 (9.84 → 11.72) · preconsulta 11.71875–16.40625 · busca 16.40625–22.5 (4.22 → 6.09) · chamada 22.5–26.25 · pronto 26.25–31.875 · ia 31.875–36.09375 · provas 36.09375–39.84375 · fim 39.84375–42.65625. VO delays: 1 0.2 · 1b 5.7 · 2 11.8 · 3 22.64 · 4 26.39 · 5 31.99 · 6 36.04 · 7 39.84.

**Global headline-swap rule:** a new headline never enters until the previous one has fully exited (no letters of two headlines on screen in the same frame). Every meaning-carrying line is fully still ≥ 1.4s.

## ROUND 7 (2026-11-11) — overrides earlier rounds where it conflicts

User: the opening still passes much too fast. In the hub we should SELECT CHAT and explain there is also a chat version, then go back to VÍDEO and continue.

**Timing:** consulte 0–11.25 (was 7.5); everything after shifts +3.75 (preconsulta 11.25, busca 15.9375, chamada 20.15625, pronto 23.90625, ia 29.53125, provas 33.75, fim 37.5; total 40.3125; music extended again to 44.92s). index/ledger/export updated. New VO line `vo-1b` "Prefere escrever? Também tem consulta por chat." at abs delay 5.7 (speech 5.93–9.05; "escrever" 6.4, "chat" 8.61).

### consulte (11.25)
- Frame 0 unchanged (approved cover).
- 0–4.8 three text beats, ~1.6s each, each fully still ≥ 1.2s.
- 4.8–5.6 hub with channel choice visible; caption "Escolha como ser atendido".
- 5.6 tap on CHAT card → it becomes selected (real ChannelChoice selected state). 5.6–8.6 chat explanation: caption "Prefere escrever? / Também tem consulta por chat." (holds ≥ 2s); the chat card visibly expands / previews a chat (use `assets/illustrations/channel-chat-photo.webp` and/or a mini chat thread: patient "Estou com dor de cabeça desde ontem" → doctor "Oi! Já vi sua pré-consulta…"), clearly readable.
- 8.6 tap back on VÍDEO → selected; caption "Ou por vídeo, cara a cara." (≥ 0.8s); 9.3 tap "Entrar".
- 9.5–10.95 tutorial stories quick (as built), caption "Primeiro, um tutorial rápido".
- 10.95–11.25 exit Z-forward into the phone (as built).

## ROUND 6b (2026-11-11) — overrides Round 6 where it conflicts

User: the search doesn't need to be a slot machine. Show doctors passing in ONE vertical list (one reel) until the right one stops, next to ONE fixed slot with the patient's card labelled "Paciente" using a photo that reads as a patient (`assets/img/paciente-home.jpg`: the same senhora from the call, at home holding her phone). When found: a pre-call screen with a bit of the doctor's PROFILE and confetti, then the video call.

**Order changed (app flow: anamnese happens while waiting):** consulte 0–7.5 → preconsulta 7.5–12.1875 → busca 12.1875–16.40625 → chamada 16.40625… (rest unchanged). Seams: consulte→preconsulta Z-forward (consulte's exit + preconsulta's entry, both already Z-forward); preconsulta→busca cut-the-curve LEFT (preconsulta's existing exit); busca→chamada cut-the-curve LEFT (chamada's existing entry). VO line 2 now delay 7.58.

### busca (4.21875) — single reel + patient slot + doctor profile
- 0–0.38 entry cut-the-curve LEFT. Headline "Procurando seu médico…".
- 0–1.7 two tall glass windows side by side (same height, ~400×540 each): LEFT = one vertical reel of doctor cards (photo + name + "Clínico geral", from assets/people d0 d1 d2 d4 + others) scrolling down fast with motion blur, decelerating with 2–3 sharp readable faces, overshoot and settle on Dra. Camila Rocha; RIGHT = fixed patient card: paciente-home.jpg, label "Paciente", small chip "Dor de cabeça". A connector between the two windows lights up on the match.
- 1.7–2.3 match: "+" connector pulses, headline "Médico encontrado!", windows glow.
- 2.3–4.0 doctor profile pre-call screen in a big phone (rises with confetti burst from behind): app pre-call layout (`.monorepo/apps/mobile/src/components/video-call/DoctorPreCall.tsx`, `AdmissionBanner.tsx`, plantao `CalledTakeover.tsx` for reference): large doctor photo (doutora-face.jpg / doutora-end.jpg), "Dra. Camila Rocha", "Clínica geral · CRM-SP 123456", rating 4,9 ★ (312 avaliações), "8 anos de experiência", 2–3 short chips ("Atende adultos e idosos", "Fala português e inglês"), primary button "Entrar na consulta" (tapped ~3.7). Holds still ≥ 1.2s. Headline swaps to "Conheça sua médica" (≥ 1.2s).
- 4.0–4.22 exit cut-the-curve LEFT into chamada.

## ROUND 6 (2026-11-11) — overrides Round 5 and everything below where it conflicts

User feedback on v5: the opening is still too fast; before entering the plantão we should pass quickly through the app's tutorial STORIES; the doctor search should be a SLOT-machine animation; documents arriving should visibly LEAVE THE DOCTOR'S PHONE and FLY INTO THE PATIENT'S PHONE.

**New timing (total 36.5625; music.wav extended by one 4-bar loop to 37.46s, original kept as music-30s.wav):**

| # | File | Start–end abs | Dur | Builder |
|---|------|---------------|-----|---------|
| 1 | consulte.html | 0–7.5 | 7.5 | REWORK (opening slower + stories) |
| 2 | busca.html | 7.5–11.71875 | 4.21875 | NEW (slot search → match → confetti → room), split out of the old consulte |
| 3 | preconsulta.html | 11.71875–16.40625 | 4.6875 | untouched |
| 4 | chamada.html | 16.40625–20.15625 | 3.75 | untouched |
| 5 | pronto.html | 20.15625–25.78125 | 5.625 | REWORK (doctor phone → patient phone) |
| 6 | ia.html | 25.78125–30.0 | 4.21875 | untouched |
| 7 | provas.html | 30.0–33.75 | 3.75 | untouched |
| 8 | fim.html | 33.75–36.5625 | 2.8125 | untouched |

Seams (ledger.json updated): consulte→busca Z-forward into the phone; busca→preconsulta = the old consulte→preconsulta Z-forward (busca takes over the old consulte exit verbatim, preconsulta entry unchanged); chamada→pronto signature plus mask (keep); pronto→ia cut-the-curve LEFT (keep).

**Narration delays abs:** 1 0.2 · 2 11.8 · 3 16.55 · 4 20.3 · 5 25.9 · 6 29.95 · 7 33.75. Line 1 ("Precisou de médico? É só um toque. Em menos de um minuto, você já é atendido.", speech 0.44–5.54) now plays over the opening texts + hub.

### 1 · consulte (REWORK, 7.5)
Keep the current frame 0 (cover frame: "Passando mal?", 24h pill with AiOrb, phone with the Plantão hub) exactly — it was approved.
- **0–4.2 texts, slower:** "Passando mal?" (hold to ~1.4), "Precisa de médico agora?" (~1.4–2.8), "Consulte agora! / Médico online 24/7" (~2.8–4.2). One at a time, each fully still ≥ 1.1s, no overlap.
- **4.2–5.4 hub + tap:** the phone shows the Plantão hub (current app layout already in this file), "Vídeo" channel selected, finger tap on "Entrar".
- **5.4–7.2 tutorial stories, quick:** the app's real plantão stories (`.monorepo/apps/mobile/src/components/plantao/patient/PlantaoStoriesScreen.tsx`, `stories/StoryPhone.tsx`, `stories/story-slides.ts`, `components/tours/StoryProgress.tsx`) inside the phone: segmented progress bar on top filling, each slide = eyebrow "Passo N" + title + the slide image (`assets/illustrations/stories/<id>.webp`: channel, payment, anamnese, call, documents, assistant). Pass all 6 quickly (~0.3s each, tap-through feel), titles readable as a flicker; caption at the left column "Primeiro, um tutorial rápido" or similar (holds ≥ 1.2s).
- **7.2–7.5 exit:** Z-forward zoom into the phone → busca.

### 2 · busca (NEW, 4.21875) — slot machine search
Take the doctor-search / match / confetti / room part of the old consulte.html (git HEAD version or current file before the consulte rework — the consulte builder and you are the same agent; build busca first from the current consulte content, then rework consulte).
- **0–2.2 slot:** a slot-machine reel (3 reels or one big reel window, glass + violet, chrome-free, brand style) spinning doctor portraits (assets/people d0 d1 d2 d4 + doutora-face) vertically with motion blur, reels stopping one after another (left→right, each with a little overshoot/bounce) and landing on Dra. Camila Rocha in all reels = "match". Caption "Procurando seu médico…" then "Achamos!".
- **2.2–3.1 match:** the slot window flashes, patient photo (paciente-face.jpg) + doctor connect with "+", "Médico encontrado!" holds ≥ 0.8s.
- **3.1–4.21875 confetti + room:** confetti burst, then ONLY the room in the phone (doctor + "É a sua vez!") as now; exit = the old consulte exit (Z-forward into preconsulta) verbatim.

### 5 · pronto (REWORK, 5.625) — documents travel phone to phone
- **0–0.35:** entry from chamada (keep plus mask handoff).
- **0.35–2.0:** TWO phones on screen side by side (doctor's phone left, slightly tilted toward the patient's phone right; or doctor's phone top-left and patient's phone bottom-right) — doctor's phone shows the existing "Finalizar consulta" checklist (ticks one by one), tap "Finalizar e enviar" (~1.7). Caption "A médica finaliza a consulta" holds ≥ 1.4s.
- **2.0–3.6 transfer:** the four document cards (FileText Receita, FileBadge Atestado, FlaskConical Pedido de exames, ClipboardList Resumo, IconTile style) lift OUT of the doctor's phone one after another (~0.3s apart), fly along a curved arc (motion path, slight scale-up mid-flight, soft trail/glow) into the patient's phone, where each lands in the "Documentos" list with a "Novo" badge and a tiny bounce; patient phone header "Consulta concluída". Caption switches to "Seus documentos chegam no app" (≥ 1.4s).
- **3.6–5.3 focus + hold:** the doctor's phone slides out, the patient phone scales up to hero (like round 5's big phone) showing the 4 docs + "Orientação da médica" + the "Dúvidas sobre a receita? Pergunte à IA" bridge card, and holds still ≥ 1.2s.
- **5.3–5.625:** exit cut-the-curve LEFT (keep).

## ROUND 5 (2026-11-11) — overrides Round 4 and everything below where it conflicts

User feedback on v4: "esse vídeo tá bem ruim". Wants every text and screen to stay up LONGER (slower, calmer, 50+ audience). Anamnese = text-led with ONE screen only. Pós-consulta is "a pior tela até agora": needs the doctor finishing the consult, the documents ARRIVING in the app as an animation, then the patient talking to the AI about the documents and recommendations. Benefits = ONE beautiful screen that stays longer, with a nice reveal animation.

**Reading rule (all rebuilt scenes):** any text that carries meaning stays fully legible and STILL for ≥ 1.4s (headline ≥ 1.8s). At most 2 text ideas per scene. Fewer, bigger, slower moves; no rapid montage. Phone screens hold still long enough to read.

**New timing (total 29.53125, beats 0.46875, music 30s file from 0.485):**

| # | File | Start–end abs | Dur | Builder |
|---|------|---------------|-----|---------|
| 1 | consulte.html | 0–5.625 | 5.625 | untouched |
| 2 | preconsulta.html | 5.625–10.3125 | 4.6875 | REBUILD |
| 3 | chamada.html | 10.3125–14.0625 | 3.75 | untouched (only abs start moved) |
| 4 | pronto.html | 14.0625–18.75 | 4.6875 | REBUILD |
| 5 | ia.html | 18.75–22.96875 | 4.21875 | NEW |
| 6 | provas.html | 22.96875–26.71875 | 3.75 | REBUILD |
| 7 | fim.html | 26.71875–29.53125 | 2.8125 | untouched |

index.html, ledger.json and export.sh are updated. Seams: consulte→preconsulta Z-forward (keep preconsulta's current entry); preconsulta→chamada cut-the-curve LEFT (chamada's entry exists, match it); chamada→pronto signature plus mask Z-forward sig 50% 45% (chamada's exit exists, pronto entry must match what the current pronto entry does); pronto→ia cut-the-curve LEFT; ia→provas cut-the-curve LEFT; provas→fim inverse zoom-through (fim's entry exists; provas keeps its current exit technique). Each scene keeps `.p24-cam` as the seam carrier. Every scene's frame 0 must already be its correct initial state (no flash, no empty frame, nothing stacked).

**Narration (variant B) abs delay → speech window:** 1 0.2 (0.44–5.54) · 2 5.7 "Antes, conte o que sente. O médico lê tudo antes de te atender." (5.91–9.87) · 3 10.45 (10.71–13.67) · 4 14.15 "A médica finaliza, e seus documentos chegam direto no app." (14.38–17.89) · 5 18.85 "A IA explica sua receita e as recomendações." (19.07–21.87) · 6 22.9 "Plantão vinte e quatro horas e mais de quarenta especialidades." (23.15–26.63) · 7 26.75 fim line (26.97–29.51). Word timestamps in `assets/audio/vo-raw/vo-N.json` (relative to the delay); land key moves on the spoken word.

Icons, alignment grid, logo position, no-green rule, backgrounds (`assets/p24.css`), safe box and 4:5 crop from earlier rounds stay. Icons = lucide inside the app IconTile style (Round 4).

### 2 · preconsulta (REBUILD, 4.6875)
Text-led, ONE phone screen, no question carousel, no step strip, no per-question captions.
- Left-column headline "Pré-consulta" (eyebrow) + big line "Conte o que sente antes da consulta." then second line "O médico lê tudo antes de te atender." (second line arrives ~2.2s, both stay to the end).
- ONE phone (large, bottom of frame, can bleed off bottom into Reels band) showing a single, already-answered anamnese screen in the real app layout (`.monorepo/apps/mobile/src/components/anamnese/*`): "O que você está sentindo?" with "Dor de cabeça" selected, intensity 7/10, "Desde ontem". The only motion inside the phone: one or two answers settle in gently (a chip selects, the scale slides to 7) early, then it holds still; at ~3.4 a calm "Enviado ao médico ✓" confirmation appears and holds ≥ 0.8s before the exit seam.

### 4 · pronto (REBUILD, 4.6875) — doctor finishes, documents arrive
Two clear acts, each held long enough to read:
- **0–1.9 Doctor finishing:** the doctor's side. Real reference: `.monorepo/apps/mobile/src/components/medical-record/screens/FinishScreen.tsx` and `video-call/DoctorVideoCallScreen.tsx`. Show the doctor's finish screen (phone or tablet-like card): "Finalizar consulta" with the documents she is issuing checked (Receita, Atestado, Pedido de exames, Resumo) and a primary button "Finalizar e enviar" that gets tapped (tap ripple ~1.4). Caption at left column: "A médica finaliza a consulta" (holds ≥ 1.4s). Use `assets/img/doutora-face.jpg` for her avatar.
- **1.9–4.69 Documents arriving:** cut/morph to the patient's phone (app layout, `documents/IssuedDocumentRow.tsx`, `DocumentGlyph.tsx`, `consultation/post/*`): header "Consulta concluída · Dra. Camila Rocha". The four documents FLY IN one after another from above (like notifications landing in a tray), each settling into the "Documentos" list with a "Novo" badge and lucide icon tile (FileText Receita, FileBadge Atestado, FlaskConical Pedido de exames, ClipboardList Resumo), ~0.3s apart, then the list holds still ≥ 1.2s. Caption: "Seus documentos chegam no app" (holds ≥ 1.4s). Optional small push-notification banner at the top of the phone "Viva Mais · Sua receita chegou". No scrolling marathon.
- Exit seam pronto→ia cut-the-curve LEFT.

### 5 · ia (NEW, 4.21875) — patient asks the AI about the documents
- Entry cut-the-curve LEFT; exit cut-the-curve LEFT. Use the scene template/structure of the other compositions (copy root/script skeleton from provas.html or pronto.html; same logo, background class, `.p24-cam`).
- Left column caption: "Tire dúvidas com a IA" + smaller "sobre sua receita e recomendações" (hold ≥ 1.8s).
- Large phone with the real AI chat layout (`.monorepo/apps/mobile/src/components/ai-chat/AIChatScreen.tsx`, `AIChatHeader.tsx`, `UserMessageBubble.tsx`, `AIMessageBubble.tsx`, `ConsultationContextCard.tsx`, `AIComposer.tsx`) and the real AiOrb (already ported in consulte.html — reuse that markup/CSS). Context card at top: "Consulta com Dra. Camila Rocha · hoje" with Receita attached.
- Sequence: user bubble typed in ~0.4 → "Como tomo a receita?" ; AI thinking (orb spins) ~0.5s; AI answer streams in word-by-word (~1.2s) then HOLDS: "Dipirona 1g de 6 em 6 horas, se tiver dor. Beba bastante água e descanse. Se a dor piorar, volte a falar com o plantão." with a small citation chip "Receita · Dra. Camila". Answer fully visible and still ≥ 1.4s before exit.

### 6 · provas (REBUILD, 3.75) — one beautiful benefits screen
ONE composed screen, no beat-by-beat replacement. Headline at top-left: "Tudo isso no Viva Mais" (or "E muito mais"). Below, a clean list/grid of 4 benefit rows, each lucide IconTile + bold title + short line:
1. Stethoscope — **Plantão 24/7** · consulta com clínico geral a qualquer hora
2. CalendarDays — **+40 especialidades** · por agendamento
3. FolderHeart (or FolderOpen) — **Tudo num só lugar** · seus dados e documentos na sua conta
4. Sparkles — **IA pra você** · planos personalizados, análise das consultas e o médico ideal
Then a small trailing "e muito mais" line.
Animation: a nice reveal — rows waterfall in (cut-the-curve skill waterfall entry) 0.25–1.4 with icon tiles popping and a light sheen sweeping the list once; then the WHOLE screen holds still ≥ 1.8s (gentle camera drift only, no idle wobble). Type big (titles ≥ 58px, sublines ≥ 40px). Everything inside the Reels safe box and 4:5 crop. Exit = existing inverse zoom-through into fim.


## ROUND 4 (2026-11-11) — overrides Round 3 and everything below where it conflicts

User feedback on v3: hated the custom icons (several made no sense); texts not well aligned; anamnese passes far too fast and needs explaining; "Procurando médico" should be an animation of doctor profile photos passing until a match with the user.

**New timing (total 24.84375, beats of 0.46875):** consulte 0–5.625 · preconsulta 5.625–11.25 (5.625, was 3.75) · chamada 11.25–15.0 · pronto 15.0–19.21875 (4.21875, was 4.6875) · provas 19.21875–22.03125 (2.8125, was 3.75) · fim 22.03125–24.84375. index.html, ledger.json and export.sh are already updated; each builder updates its own composition root `data-duration` and internal timings. Seam techniques unchanged.

**Narration (variant B) new starts abs:** 1 0.2 · 2 5.8 "Antes, a pré-consulta: umas perguntas rápidas. O médico lê tudo antes de te atender." (5.3s) · 3 11.45 · 4 15.2 "Acabou? Orientação e receita no seu celular." (2.9s) · 5 19.25 · 6 22.22.

**Icons:** `assets/p24-icons.svg` is dropped everywhere. Use the app's real icon language: lucide icons (SVGs in repo `node_modules/lucide-static/icons/<name>.svg`, inline them) inside the app's IconTile style (`.monorepo/apps/mobile/src/components/consultation/post/IconTile.tsx`): rounded square radius 0.32×size, soft = violet-100 bg + violet-700 stroke, solid = violet-500 bg + white stroke, strokeWidth 2, icon 46% of tile. Pick the literal, obvious icon (FileText receita, FileBadge atestado, FlaskConical exames, ClipboardList resumo, Stethoscope orientação, Smartphone celular, Users profissionais, MapPin/BadgeCheck Brasil, Syringe GLP-1, ShieldCheck controlados, Pill antibióticos, Link link).

**Alignment (all scenes):** one grid. Logo top-left at the same x/y in every scene. All headlines and text blocks left-aligned to the same x=80 column (fim is the only centred scene). Icon rows: tile and text vertically centred on each other, same gap, same tile size within a list. Multi-line headlines with consistent line-height; no ragged one-word last lines (balance with `text-wrap: balance`).

## ROUND 3 (2026-11-11) — overrides Round 2 and everything below where it conflicts

User feedback on v2, scene by scene. Timing, seams, narration, safe box, no-green rule and skills list from Round 2 stay unless changed here. Old-people-friendly (50+): big type, one idea at a time, nothing too fast to read when it carries meaning.

**Shared icon set** `assets/p24-icons.svg` (SVG `<symbol>` sprite, built by the icon agent; use via `<svg><use href="../assets/p24-icons.svg#id"/></svg>` or inline-copy the symbol if `<use>` of external files fails in render). Custom, NOT lucide/generic: brand duotone, 48-unit grid, rounded joins, a soft lilac/violet back-shape + crisp stroke foreground, a small "+" brand accent where it fits. No green/spark. Ids: `orientacao`, `prescricao`, `atestado`, `exame`, `pedido`, `resumo`, `chat`, `doutor-multi` (milhares de profissionais), `brasil` (válida em todo Brasil), `raio` (rápido), `glp1` (pen/caneta), `controlado` (pill with shield), `antibiotico` (capsule), `link`, `relogio`, `check`, `video`, `estrela`.

### 1 · consulte
- **First frame must be stronger**: a composed, finished-looking frame at t=0 (title already legible, phone already placed, gradient rich), with motion already under way. No empty or half-built first frame.
- **AI orb = the real AiOrb** from `.monorepo/apps/mobile/src/components/ui/AiOrb.tsx`. Port it faithfully to HTML/SVG: violet[50] shell, rotating radial blobs (logo.purple, violet[400], logo.aqua at its real opacity), white rim + top-left highlight, sparkle glyph (real SPARKLE_PATH), halo violet[400], shadow violet[600]. Use real colours from `.monorepo/apps/mobile/src/theme/colors` (aqua inside the orb is allowed — it is the real component; it is the only exception to no-green). States: idle → thinking (fast spin + orbiters) while "procurando médico".
- **Custom waiting component** (ours, not the app's): a new visual that clearly simulates the queue moving — e.g. a vertical lane/stack of patient avatars/tokens where the people ahead leave one by one and "Você" slides up to the front, position number rolling (4º → 3º → 2º → 1º) with a ring/progress arc filling, estimated time counting down to "menos de 1 min". Must read instantly to a 60-year-old. Glass + violet, big numbers.
- **Doctor found**: confetti burst, then show ONLY the room — the phone (or the frame) goes to the clean "sala" (doctor photo + "Dra. Camila Rocha" + entering-the-room state), nothing else competing: no extra floating cards, no chips.

### 2 · preconsulta
- Show the **clínico geral anamnese questions passing quickly** in the phone, one per beat, using the app's real question controls (`.monorepo/apps/mobile/src/components/anamnese/QuestionControl.tsx`, `PainScale.tsx`, `AnamneseFrame.tsx`): 1 "O que você está sentindo?" (chips: Dor de cabeça ✓, Febre, Tosse, Enjoo), 2 "Onde dói?" (body/pain map tap), 3 "Qual a intensidade?" (0–10 scale lands on 7), 4 "Há quanto tempo?" (Desde ontem), 5 "Envie exames e fotos" (2 thumbnails drop in), 6 "Alergias e medicamentos" (Dipirona ✗ alergia / Losartana), 7 "Histórico de saúde" (Hipertensão). Progress bar on top advancing. The 5 checklist rows beside/over the phone tick in sync. Fast but each question legible ~0.4s+.

### 3 · chamada
- The call is shown **inside a phone held by a hand**: `assets/img/hand-phone.jpg` (1440×2160 plate, phone screen = green rect x 588–1371, y 225–1860, corner radius ≈ 90px in plate coords; slightly soft, user may replace with hi-res at the same path and same screen rect). Cover-fit/scale the plate as a layer, place the crisp HTML call UI exactly over the green screen (overscan 4px, same radius, no green may show at any frame). Inside: `doutora-call.mp4` full screen, patient `paciente-pip.mp4` small PIP corner, call controls bar, "Dra. Camila Rocha · Clínica geral" label, timer. Gentle hand/phone push-in. Keep the two caption lines ("Já leu sua pré-consulta", "Vi aqui: dor de cabeça desde ontem.") in the safe box, outside the phone if they would cover the doctor's face.

### 4 · pronto
- Post-consult screen rebuilt and much nicer: header with doctor + "Consulta concluída", conduct/orientation card, then **Documentos** list where each row uses a custom icon from the sprite (`prescricao` Receita, `atestado` Atestado, `pedido` Pedido de exames, `resumo` Resumo da consulta) with "PDF assinado" badges in violet. Slow scroll ~3–4s to Documentos stays. The two benefit lines ("Orientação médica em minutos", "Prescrição no seu celular") get the `orientacao` / `prescricao` icons, big.

### 5 · provas
- Benefits passed **quickly** with custom icons, one icon+line per beat: `doutor-multi` Milhares de profissionais, `brasil` Receitas digitais válidas em todo o Brasil, `glp1` GLP-1, `controlado` Controlados, `antibiotico` Antibióticos, `raio` Da solicitação à resolução, rápido. Icons animate in (draw/pop), not static stickers.

### 6 · fim
- The link gets a **link icon** (`link` from sprite) and much more emphasis: big pill/button, bright, with a sheen/pulse that performs once, "vivamais.ai" at least as prominent as the tagline.

## ROUND 2 (2026-11-11) — overrides everything below where it conflicts

User feedback on v1: the opening must be much better, in our gradient style with custom backgrounds; the phone mockup and the queue must use the **current app layout** and look far more beautiful; a much better **queue simulation** ending in **confetti**; **no green at all** (purple and gradients instead); **more complex, beautiful transitions**; use the best motion skills.

Every builder loads these skills before editing: `motion-doctrine` (gateway), `cut-the-curve`, `seam-craft`, `hyperframes-animation`. Follow them; they override generic motion habits.

### New timing (25s hard max → 24.375s)

| # | File | Start–end (abs) | Dur |
|---|------|-----------------|-----|
| 1 | consulte.html | 0–5.625 | 5.625 |
| 2 | preconsulta.html | 5.625–9.375 | 3.75 |
| 3 | chamada.html | 9.375–13.125 | 3.75 |
| 4 | pronto.html | 13.125–17.8125 | 4.6875 |
| 5 | provas.html | 17.8125–21.5625 | 3.75 |
| 6 | fim.html | 21.5625–24.375 | 2.8125 |

Beats every 0.46875s from 0 (downbeats every 1.875). Scene starts all sit on beats. Music lift at abs 15.0 = pronto rel 1.875. Times inside the scene sections below are relative to the scene unless marked abs; v1 scene detail still applies for content unless changed here.

### Global rules

- **No green anywhere.** Never `spark-*`, `#12FFD7`, `--vm-grad-fresco`, `--vm-grad-simbolo`, `success` green — not in chips, checks, ticks, icons, live dots, stopwatch hand, tags, highlights, progress bars. Use white, `violet-200…700`, `iris-*`, soft `azure-300` only as a faint blob tint, and gradients. Logo files are used as-is (never recolored).
- **Backgrounds** come from `assets/p24.css` (already linked in index.html): `.p24-bg` + `--violet | --deep | --light`, 2–4 `.p24-blob--a/b/c/d`, an optional big `.p24-plus` (brand plus silhouette) and `.p24-grain`. Backgrounds move **with intent**, never idle wobble: blobs travel with the scene's camera/current (leftward drift through the scene, parallax at ~50% of foreground on x seams, full scale on z seams) and shift on story beats (a blob swells into the spot where a reveal lands). Light scenes use `--light`, never flat white.
- **Type:** accent words `<em class="p24-hi-dark">` on dark, `<em class="p24-hi-light">` on light. Only the hook headline and the end-card line may use `.p24-grad-text`.
- **Chips/cards:** `.p24-chip--glass` on dark, `.p24-chip--violet` on light; white cards `.p24-card` (radius 36, violet soft shadow). Checks `.p24-check` (violet on light, white-with-violet-tick on dark).
- **Phone:** premium look: kit device with `--p24-shadow`, may enter with a 3D tilt (perspective 2400px, rotateX/rotateY ≤ 14°) that resolves while it moves. Screens recreated from the **current** app source in `.monorepo/apps/mobile/src` using `assets/brand/app-ui.css` tokens and `assets/app/illustrations` / `assets/illustrations`.
- **Structure:** every scene = bg layer + `.p24-cam` content layer (everything but bg) so seam/camera moves are one transform. Each scene authors its own seam halves (master index has no seam tweens). Frames at cut ±1 are fully opaque and mid-motion; never autoAlpha a layer to the page background.
- **Motion craft:** waterfall entries for headlines (per-word stagger ≤ 0.5s total, power4.out), nudge curve for group repositioning, causal chains (tap → squash → screen reacts on the same frame), stillness-before-climax (0.3–0.5s) before the payoff, no idle wobble/pulse/breathe, no bounce/elastic, overshoot only `back.out(1.4–1.7)`.
- **Confetti:** deterministic (seeded PRNG such as mulberry32, fixed seed), ~90 pieces like the app's `components/ui/Confetti.tsx`; colours `#FFFFFF #D6C3FB #9D6BF2 #7E3BED #9681EB #92BFF7`; rects + circles + thin ribbons; burst from a point with spread, gravity and spin, all tweens on the scene timeline (seek-safe); settled/out by ~1.6s after burst. Two bursts in the film: queue → "É a sua vez" (consulte 3.75) and end card (fim 0.47).

### Seam plan (vector ledger, current = LEFT, 3 transition families)

1. **consulte → preconsulta @5.625 — Z-forward zoom-through.** Exit (consulte, 5.27–5.625): `.p24-cam` and bg push into the lifted doctor card centre: scale 1→1.6, blur 0→18px, power4.in. Entry (preconsulta 0–0.5): `.p24-cam` scale 0.82→1, blur 18→0, power4.out; its light bg is opaque from frame 0 (bg may also grow 0.9→1). Both sides growing.
2. **preconsulta → chamada @9.375 — cut-the-curve LEFT.** Exit (3.45–3.75): `.p24-cam` x 0→-130 + blur 0→10px, power4.in; headline words may waterfall-cut (stagger 0.03). Entry (chamada 0–0.38): call window from x +130 + blur 10 → 0, power4.out. Bg parallax half the travel.
3. **chamada → pronto @13.125 — signature plus mask (Z-forward).** `m.plusCover(3.75)` / `m.plusReveal(0)` as now, plus the call window pushes 1→1.08 (power4.in) under the cover so the scale sign matches; pronto content grows 0.92→1 under the reveal.
4. **pronto → provas @17.8125 — cut-the-curve LEFT** (same numbers as 2).
5. **provas → fim @21.5625 — inverse zoom-through (ARRIVAL).** Exit (3.45–3.75): `.p24-cam` scale 1→0.82 + blur 0→14px, power4.in. Entry (fim 0–0.5): scale 1.22→1 + blur 14→0, power4.out. Both shrinking.

### 1 · consulte (0–5.625) — rebuilt from scratch, the hook

Read first, fully: `.monorepo/apps/mobile/src/components/plantao/PlantaoTabScreen.tsx`, `PlantaoQueueScreen.tsx`, `queue/QueueWaitingRoom.tsx`, `queue/QueueBannerBackdrop.tsx`, `queue/QueueBannerContent.tsx`, `queue/RollingNumber.tsx`, `queue/PrepRow.tsx`, `queue/QueuePrepSection.tsx`, `queue/QueueCompactHeader.tsx`, `CalledTakeover.tsx`, `PhaseHero.tsx`, `shared/PlantaoFrame.tsx`, `shared/PlantaoArt.tsx`, `patient/PlantaoHubHero.tsx`, `ChannelChoice.tsx`, `components/ui/Confetti.tsx`, plus copy in `src/lib/plantao/*`. Recreate the **current** layout faithfully (copy, structure, radii, colours from app-ui.css) — prettier than v1, not invented.

- **Bg:** `.p24-bg--deep` with blob a (violet-400) top-right, blob b (iris) bottom-left, small blob d (soft azure) behind the phone, a huge `.p24-plus` half off-frame right whose rotation/scale follows the camera push (not a loop), grain.
- **0–1.875 hook:** frame 0 already mid-flight. H1 "Consulte <em class="p24-grad-text">agora!</em>" 112px waterfall at y ~360. Glass chip with stopwatch (white ring, violet-200 hand) + "menos de 1 min" pops 0.3 at y ~560. Phone rises from below with 3D tilt resolving (rotateX 14°→0, power4.out), placement per v1 safe-box formula. Phone shows the current Plantão tab; **tap "Entrar" at 0.938** with a white touch ripple and a button squash on the same frame.
- **0.938–1.25:** screen pushes to the queue screen (current `PlantaoQueueScreen` waiting room: banner backdrop + content, compact header, position, prep rows).
- **1.875:** H1 waterfall-cuts LEFT, H2 "Médico online <em class="p24-hi-dark">24/7</em>" waterfalls in (96px), held to 5.25.
- **1.25–3.28 queue simulation (sequenced UI life):** the app's `RollingNumber` rolls the position on beats: 4º (1.25) → 3º (2.344) → 2º (2.813) → 1º/"Você é o próximo" (3.281); estimated time ticks down; prep rows tick in violet; doctors' avatars (d0 d1 d2 d4) in the waiting-room row. **Lift the position out of the phone** into a big glass bubble inside the safe box (number ≥ 120px, label ≥ 52px), rolling in sync with the phone. Stopwatch hand sweeps 0.469→3.75.
- **3.28–3.75 stillness before climax:** everything holds, slow camera push only.
- **3.75 (downbeat) payoff:** phone switches to the current `CalledTakeover` ("É a sua vez" / doctor found layout) and **confetti bursts** from the phone's top centre across the frame. The stopwatch chip gets a white check. At 4.0 the "Dra. Camila Rocha · aceitou seu pedido" card (`assets/img/doutora-face.jpg`, violet check) lifts out of the device into the box (y ~930–1160), the queue bubble yields to it (nudge curve).
- **5.27–5.625:** zoom-through exit into the doctor card (seam 1).
- VO 1 (variant B): 0.2–5.35 "Precisou de médico? É só um toque. Em menos de um minuto, você já é atendido."

### 2–6 · changes to the existing scenes

- **All:** apply global rules (no green, p24 backgrounds with intentful blob motion, `.p24-cam` layer, new seam halves above), keep the v1 safe box and type floor, retune to the new durations.
- **2 preconsulta (abs 5.625):** entry = zoom-through arrival (seam 1) instead of the slide; bg `--light`; checks violet; exit = seam 2.
- **3 chamada (abs 9.375):** entry = seam 2 cut-the-curve; "Já leu sua pré-consulta" chip → `.p24-chip--glass` with white check (no spark); "Ao vivo" dot white/violet-200 (or red-500 live dot — not green); controls glass; exit = seam 3.
- **4 pronto (abs 13.125, now 4.6875s):** "Tudo pronto!" 0–1.8 then icon rows waterfall in on 1.875 (music lift, abs 15.0); icon tiles violet/glass, no spark; slow steady scroll 0.35→3.2 (sine.inOut) to Documentos; "Receita simples" lift at 3.28 with tag "PDF assinado" as `.p24-chip--violet` (no spark); exit = seam 4 (4.39–4.6875).
- **5 provas (abs 17.8125):** entry = seam 4; chips glass/violet, arrow chip "Solicitação → resolução rápida" glass; accents `p24-hi-dark`; exit = seam 5. Keep the stamp beats.
- **6 fim (abs 21.5625, 2.8125s):** entry = seam 5 arrival (scale 1.22→1); bg `--light` with blobs; lockup + line (`.p24-grad-text` not on light — use violet `p24-hi-light`) + violet CTA; confetti burst from behind the lockup at 0.47; slow push to the end, no exit.

### Narration (variant B, new windows abs)

| # | Start | Line |
|---|-------|------|
| 1 | 0.2 | Precisou de médico? É só um toque. Em menos de um minuto, você já é atendido. |
| 2 | 5.875 | Antes, você conta o que está sentindo. |
| 3 | 9.675 | E a médica já chega sabendo do seu caso. |
| 4 | 13.4 | Acabou a consulta? Orientação e receita chegam direto no seu celular. |
| 5 | 18.05 | Receita digital, válida em todo o Brasil. |
| 6 | 21.75 | Viva Mais. Médico a qualquer hora. |


Ad: motion-led, 23.4s, music always; two audio variants of the same picture.

## Message

Médico online 24/7: você pede, um médico aceita em menos de um minuto, já chega sabendo do seu caso, e a receita cai no seu celular.

## Audience

Adults 50+, Instagram/Facebook Reels and Stories (9:16) and feed (4:5). Big type, high contrast, one headline per frame, each headline on screen ≥ 1.8s. Energetic ad pacing: cuts on the bar downbeat, something always moving, no dead frames, nothing blinks, opaque cuts only.

## Output

- Master: portrait 1080×1920 @30, 23.4s (hard max 25s).
- Feed 4:5: centre crop 1080×1350 at y 285–1635 of the same master. No re-edit.
- Language: pt-BR.
- Variant A: music only → `index.html`.
- Variant B: music + narration, same picture: render `index.html` (`npm run render -- plantao-24h`), then `./export.sh` mixes `assets/audio/vo-1..6.wav` (HeyGen Marisol pt-BR, starts 0.2 / 4.0 / 7.8 / 11.55 / 17.05 / 20.7) over the music at 0.4 and writes `renders/plantao-24h-vo.mp4`, plus 4:5 crops (`-4x5`) of both variants. HyperFrames allows one root index, so the VO variant is not a second composition.
- Music: `assets/audio/music.wav` (HeyGen catalog 837fa2d1, upbeat commercial pop, claps, 128 BPM, 30s, full energy from the start, lifts ~16s of the file). Starts at `data-media-start="0.485"`, fade out last 0.8s.

## Beat grid (composition time)

Bar downbeats: 0, 1.875, 3.75, 5.625, 7.5, 9.375, 11.25, 13.125, 15.0, 16.875, 18.75, 20.625, 22.5. Beats every 0.469s (inner hits: +0.469, +0.938, +1.406 after each downbeat). Every scene starts on a downbeat; taps, ticks, stamps and swaps land on a beat. The track lifts at 15.0: that is the Documentos payoff in `pronto`.

## SAFE BOX (mandatory for every builder)

Reels covers the top 14% and bottom ~35% plus the right-side buttons; the 4:5 crop keeps only y 285–1635. So:

- Everything the viewer must read (headlines, body, chips, captions, logo, the tapped/read part of the phone, lifted cards) sits inside **x 80–940, y 300–1240**. The right 140px (x 940–1080) never holds text.
- Backgrounds, footage, phone body, avatars and decorative shapes may bleed past the box.
- Override the kit safe vars on every scene root (the kit portrait defaults are 118/88/150/88 and are wrong for this ad):

```css
#<scene-id> {
  --vm-safe-t: 300px; --vm-safe-r: 140px; --vm-safe-b: 680px; --vm-safe-l: 80px;
  --vm-fs-head: 96px; --vm-fs-sub: 84px; --vm-fs-copy: 52px; --vm-fs-label: 52px;
  --vm-logo-w: 210px; --vm-head-w: 860px;
}
```

- Type floor: headlines ≥ 84px (Space Grotesk 700), every other readable text ≥ 52px (DM Sans 500). In-app UI inside the phone is decoration at device scale; anything the viewer must read from the phone is also lifted out (`k.liftOut`) or repeated at ≥ 52px inside the box.
- Logo: `assets/brand/lockup-branco.svg` on violet/footage, `lockup-cor.svg` on light, top-left at x 80, y 300, width 210, in every scene except `fim` (which centres the lockup).
- Phone placement (scenes `consulte`, `preconsulta` uses its own, `pronto`): use `.cam > .dev` from `kit/screens` with `--vm-dev-scale: 1.45` (device 618×1302). Frame position of an app point: `X = camLeft + (12 + appX) × 1.45`, `Y = camTop + (12 + appY) × 1.45`. With camLeft 231 the app spans x 248–831 (inside the box). Only app content above the box bottom (Y ≤ 1240) may be tapped or read, so **scroll the recreated screen** so the target sits there before the tap; never tap below y 1240.
- Text exits stay in motion through the cut; nothing fades to the page background; no pulses, glows, yoyos or wipes.

## Scene Plan

One row per sub-composition in `compositions/`. Times are absolute; durations are 3.75 + 3.75 + 3.75 + 5.625 + 3.75 + 2.775 = 23.4.

| # | File | Start–end | On-screen text (final, pt-BR) | Visual | Exit → next |
|---|------|-----------|------------------------------|--------|-------------|
| 1 | consulte.html | 0–3.75 | H1 "Consulte <em>agora!</em>" (0–1.875) → H2 "Médico online <em>24/7</em>" (1.875–3.75). Chip "menos de 1 min" with stopwatch. Lifted card "Dra. Camila Rocha aceitou" | `vm-bg-violet`. Phone scrolls Plantão tab, taps Entrar, searching, doctor accepts | push LEFT on 3.75 |
| 2 | preconsulta.html | 3.75–7.5 | Headline "Pré-consulta: diga ao médico o que está <em>sentindo</em>". Checklist: "Dor e local" · "Nível da dor" · "Envie seus exames e fotos" · "Alergias e medicamentos" · "Histórico de saúde" | `vm-bg-canvas`. Big ticking checklist on the left, phone with the anamnese overview bleeding off bottom-right, its rows ticking in sync | exit LEFT on 7.5 |
| 3 | chamada.html | 7.5–11.25 | Chip "Já leu sua pré-consulta". Caption card "“Vi aqui: dor de cabeça desde ontem.”" | `assets/video/doutora-call.mp4` in a big call window, `assets/video/paciente-pip.mp4` PIP top-right inside the box, "Ao vivo" pill | plus cover at 11.25 |
| 4 | pronto.html | 11.25–16.875 | Headline "Tudo <em>pronto!</em>" (0–2.25 rel) → icon rows "Orientação médica em minutos" · "Prescrição no seu celular". Lifted row "Receita" | `vm-bg-violet`. Plus reveal, phone with Consulta concluída scrolling slowly to Documentos, payoff on the 15.0 lift | exit LEFT on 16.875 |
| 5 | provas.html | 16.875–20.625 | Stamp 1 "Milhares de profissionais <em>cadastrados</em>" + chip "Solicitação → resolução rápida" (0–1.875 rel). Stamp 2 "Receitas digitais válidas em <em>todo o Brasil</em>" + chips "GLP-1" · "Controlados" · "Antibióticos" (1.875–3.75 rel) | `vm-bg-deep`. Avatar stack d0 d1 d2 d4, hard stamps on downbeats | exit LEFT on 20.625 |
| 6 | fim.html | 20.625–23.4 | Lockup, line "Médico online, <em>a qualquer hora.</em>", CTA "vivamais.ai" | `vm-bg-canvas`, centred lockup + CTA, music fades | — (end) |

## Scene detail (times relative to the scene)

### 1 · consulte (0–3.75) — hook, first frame already moving

- Background `vm-bg-violet`, logo `lockup-branco.svg`.
- Frame 0 is mid-motion: H1 words already rising (start the rise tween at −0.25s, i.e. build the timeline so 0 shows it 40% in), phone already travelling up from the bottom.
- H1 "Consulte <em>agora!</em>" at y ~400 (one line, 104px allowed). Visible 0–1.85, exits left from 1.8; H2 "Médico online <em>24/7</em>" rises at 1.875 (downbeat), two lines at 96px, held to the cut and exiting through it.
- Stopwatch chip under the headline (y ~600–680, x 80): 64px stopwatch icon (white ring, spark hand) + "menos de 1 min" 52px white. Chip pops at 0.3; the hand sweeps once clockwise from 0.469 to 2.344 (power2.inOut) and stops when the doctor accepts.
- Phone: `.cam` left 231, top 760, scale 1.45 (key window is app y 0–312, frame y 777–1240). Screens, hand-built from `.monorepo/apps/mobile/src/components/plantao/PlantaoTabScreen.tsx` + `patient/PlantaoHubHero.tsx` + `ChannelChoice.tsx`:
  1. Plantão tab: "Clínico geral · 24h" / "Plantão" header, hub hero card (`assets/illustrations/plantao-hub-bg.webp` backdrop, `plantao-hub-doctor.webp`, live chip "Plantão aberto 24h", "Clínico geral", "Atendimento em minutos"), "Como quer ter sua consulta?", Vídeo card selected, pill button "Entrar →". Page scrolls 0–0.75 so the Entrar button lands at app y ~260.
  2. Tap Entrar at 0.938 (beat), exactly on its centre (`k.center`).
  3. 1.0–2.3 searching screen (transitional, as in tutorial-plantao ch06 "Conectando ao plantão"): "Procurando seu médico" title, avatar row d0, d1, d2, d4 lighting in turn on beats, "6 médicos online agora". Keep it in app y 40–300.
  4. 2.344 (beat) push to `CalledTakeover` (`components/plantao/CalledTakeover.tsx`): "Encontramos seu médico", doctor chip "Dra. Camila Rocha", timeline "Médico encontrado ✓ / Leitura do seu caso / Chamada de vídeo".
  5. 2.5 `k.liftOut` a card out of the device into the box (x 120–900, y ~930–1160): round portrait (`assets/img/doutora-face.jpg`, the same doctor as the call footage, 132px), "Dra. Camila Rocha" 52px bold, "aceitou seu pedido" 52px, spark check. Hold 0.5s, then the whole scene pushes left on 3.75.
- VO A (variant B only) 0.25–3.3.

### 2 · preconsulta (3.75–7.5)

- Background `vm-bg-canvas`, logo `lockup-cor.svg`. Enters from the right.
- Headline (88px, three lines, x 80–860, y 390–660): "Pré-consulta: diga ao médico o que está <em>sentindo</em>". Rises 0.05–0.5, held to the cut.
- Checklist, left column x 80–700, y 700–1220, five rows of 100px: 56px circle + 52px label, DM Sans 500, ink-900. Rows cascade in 0.3–0.7 (unchecked, ring only). Each check fills violet with a white tick on a beat: 0.938, 1.406, 1.875, 2.344, 2.813. Labels wrap to two lines rather than pass x 700.
  1. Dor e local
  2. Nível da dor
  3. Envie seus exames e fotos
  4. Alergias e medicamentos
  5. Histórico de saúde
- Phone (visual only, may bleed): `.cam` scale 1.0, left 690, top 760, rotated −6°, bleeding off right and bottom. Screen hand-built from `components/anamnese/PlantaoAnamneseFillScreen.tsx` / `AnamneseOverviewScreen.tsx` and tutorial-plantao `ch05-anamnese` copy: "Preparar atendimento", "Plantão 24h · atendimento agora", "N de 5 etapas preenchidas", rows Motivo / Onde dói / Há quanto tempo / Medicamentos e alergias / Anexos. The counter and row states advance with each checklist tick.
- 3.3 everything exits left in motion; the cut at 3.75 is opaque.
- VO B 0.25–3.4.

### 3 · chamada (3.75s, abs 7.5–11.25)

- Footage (clean Mixkit stock, no watermark): doctor `assets/video/doutora-call.mp4` (1280×720 landscape, a doctor in a white coat at her office desk talking to camera, face at ~69% x / 35% y), patient `assets/video/paciente-pip.mp4` (1280×720, woman 60+ with grey hair and glasses smiling at her phone, face ~55% x / 30% y). Both `muted`.
- Background `vm-bg-deep`. The doctor plays in a big rounded call window that bleeds slightly: x 40–1040, y 250–1560 (1000×1310), radius 48px, `object-fit: cover; object-position: 66% 40%` (keeps desk/shelves = consultation environment; upscale stays ~1.8x, do not go full-bleed 1080×1920 or it gets soft). Window enters from the right on 0, slow push 1.0 → 1.05 on the video inside across the scene. `data-media-start="2"`.
- Logo `lockup-branco.svg` top-left at x 80, y 300 over a soft violet-950 gradient at the window top for contrast.
- PIP patient top-right **inside the box**: x 690–920, y 330–675 (230×345), radius 28px, 4px white ring, `object-position: 55% 30%`, scale-in from 0.9 at 0.3. `data-media-start="1"`.
- "Ao vivo" pill (spark dot + "Ao vivo" 52px white on violet-950/70%) at x 80, y 420, pops 0.2.
- Call control row (decorative, inside the window bottom, y ~1420–1520): mute, camera, red hang-up circles 88px. May sit below the box (decoration).
- 0.938 (beat) chip slides in from the left, x 80, y ~930: spark fill, violet-950 text, check icon + "Já leu sua pré-consulta" 52px.
- 1.406 (beat) caption card, `--vm-tile` white, x 80–900, y ~1040–1230, radius 32px: "“Vi aqui: dor de cabeça desde ontem.”" 52px ink-900, two lines. Held to the cut.
- 3.75 `m.plusCover(3.75)` at 50% 45%.
- VO C 0.3–3.4.

### 4 · pronto (5.625s, abs 11.25–16.875)

- `m.plusReveal(0)`, background `vm-bg-violet`, logo `lockup-branco.svg`.
- Headline "Tudo <em>pronto!</em>" 104px at y ~390, rises 0.1, held to 2.25, exits left. At 2.344 (beat) two icon rows rise in its place (y 380–560, 52px white, 64px spark icon tiles): "Orientação médica em minutos" (clipboard/stethoscope icon), at 2.813 "Prescrição no seu celular" (pill + phone icon). Held to the cut.
- Phone: `.cam` left 231, top 620, scale 1.45 (key window app y 0–416), device rises from bottom 0.1–0.6. Screen hand-built from `components/consultation/post/PostConsultationScreen.tsx`, `PostConsultationHeader.tsx`, `DocumentList.tsx` and tutorial-plantao `ch08-pos` copy: "Consulta concluída", "com Camila Rocha · Médico Clínico", "Vídeo · 14 min", stats "4 documentos · 2 remédios · 2 exames", Resumo, Orientações (Dipirona 500 mg …), then section "Documentos 4" with rows Receita simples / Pedido de exames / Atestado médico / Prontuário da consulta (each `IconTile` + title + issued date + share icon, as in `DocumentList.tsx`; kind labels Receita / Pedido de exame / Atestado / Prontuário). No PDF page content anywhere.
- Steady slow scroll 0.5 → 3.75 (one ease, `sine.inOut`), ending with the "Documentos" header at app y ~70 so the four rows fill app y 110–410 at abs 15.0, the music lift.
- 3.9 `k.liftOut` the "Receita simples" row out of the device to x 120–900, y ~880–1060, scale to make its title 52px; spark tag "PDF assinado" 52px beside/below. Hold to 5.2, then phone + card exit left through the cut.
- VO D 0.35–5.2.

### 5 · provas (3.75s, abs 16.875–20.625)

- Background `vm-bg-deep`, logo `lockup-branco.svg`. Stamps: scale 1.18 → 1, 0.22s, `power3.out`, no overshoot, on the downbeat.
- 0: stamp 1 "Milhares de profissionais <em>cadastrados</em>" 92px three lines, y 400–700. Avatar stack (d0, d1, d2, d4, 120px circles, 4px violet ring, overlapping) at y ~760, cascades in 0.2–0.45. 0.469 chip "Solicitação → resolução rápida" 52px spark at y ~940. Block exits left 1.75–2.05.
- 1.875: stamp 2 "Receitas digitais válidas em <em>todo o Brasil</em>" 92px three lines, y 400–700. Chips (52px, white on violet-700, wrap to two rows inside x 80–940): "GLP-1" at 2.344, "Controlados" at 2.813, "Antibióticos" at 3.281, y ~780–960. Exit left through the cut.
- VO E 0.25–3.4.

### 6 · fim (2.775s, abs 20.625–23.4)

- Background `vm-bg-canvas`. Content centred on x 510 (stage padding left 80, right 140).
- `lockup-cor.svg` width 520 at y ~470; line "Médico online, <em>a qualquer hora.</em>" 84px two lines at y ~700–880; CTA pill "vivamais.ai" 52px at y ~980. `m.end` from 0.05, last element landed by 0.6, then a slow `m.hold` push to the end. No exit; music fades over the last 0.8s.
- VO F 0.2–2.4.

## Narration (variant B)

Warm, natural, conversational pt-BR, short phrases, smiling voice, mid tempo (~2.3 words/s). 47 words. Each line lives inside its scene window above; picture motion keys off downbeats, not words, so the picture is identical in both variants.

| Scene | Window (abs) | Line |
|---|---|---|
| 1 consulte | 0.25–3.3 | Precisou de médico? Um toque, e pronto. |
| 2 preconsulta | 4.0–7.15 | Antes, você conta o que está sentindo. |
| 3 chamada | 7.8–10.9 | E a médica já chega sabendo do seu caso. |
| 4 pronto | 11.6–16.45 | Acabou a consulta? Orientação e receita chegam direto no celular. |
| 5 provas | 17.1–20.3 | Receita digital, válida em todo o Brasil. |
| 6 fim | 20.8–23.0 | Viva Mais. Médico a qualquer hora. |

Record one file per line (`assets/audio/vo-1.wav` … `vo-6.wav`), trim silence, place each at its window start in `index-vo.html`. If a line runs long, tighten the read; do not move cuts.

## Music brief

Upbeat, bright commercial pop, 128 BPM, claps and synth stabs, full energy from bar 1 (no slow intro), a lift around 15.0 for the payoff, clean ending we fade over 0.8s. Mid-range left open for the narrator (no lead vocal, no busy melody in 1–4 kHz during VO). Chosen file: `assets/audio/music.wav`, offset 0.485s so downbeats sit on the grid above.

## Notes for builders

- Every scene: kit `motion` + `screens` (`VMMotion`, `VMKit`), fonts as in the template, safe-box var override above.
- Screens are hand-built HTML, faithful to the app source paths listed per scene, using `assets/brand/app-ui.css` tokens. The screen library (`screens/`) has none of them yet; library additions for later: `PlantaoTabScreen` (idle), `CalledTakeover` (found), `AnamneseOverviewScreen` (plantão, 0–5 steps), `PostConsultationScreen` (done, documents). Do not block the build on them.
- Doctor: "Dra. Camila Rocha, Clínica geral" is the woman in `assets/video/doutora-call.mp4`; the acceptance card and any post-consulta header avatar use `assets/img/doutora-face.jpg` so the face matches the call. The old `assets/footage/doutora*.mp4` / `paciente*.mp4` carry a HeyGen watermark: never use them. Other doctor faces only `d0, d1, d2, d4`.
- Assets mapped in `assets.json`: d0/d1/d2/d4, doutora.mp4, doutora-end.jpg, paciente.mp4, paciente-a.jpg, plantao hub backdrop + doctor illustration, plantao-24h illustration. Video-specific: `assets/audio/music.wav`.
- Check with `npm run check -- plantao-24h`, and snapshot frames at 1.0, 2.6, 5.5, 9.5, 15.2, 18.0, 19.8, 22.0 with the safe box drawn to confirm nothing readable leaves x 80–940, y 300–1240.
