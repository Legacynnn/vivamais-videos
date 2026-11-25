---
model: tutorial
workflow: general-video
flow: automation
storyboard: no
status: built
---

# tutorial-agendamento

Short tutorial of the patient booking journey: entry, plan benefits, doctor list, specialty, filters, doctor profile and time, payment skipped, anamnese, video consultation. Silent, text-led, one headline per frame, app UI elements pop out of the phone to explain each feature.

## Message

The patient knows how to book a consultation in the app on their own: search, see what the plan covers, filter, pick a doctor and a time, fill the anamnese and join the video call.

## Audience

Paciente / colaborador on a company plan (persona Ana Souza, `screens/fixtures/ana-company.ts`: Viva+ Empresarial, R$ 300,00 de crédito no mês, 25% de desconto em 6 especialidades).

## Output

- Format: portrait 1080x1920 @30fps
- Duration: 59.0s, one file
- Language: pt-BR
- Audio: silent, text on screen only
- App source: `.monorepo/apps/mobile/src` through the screen library (`screens/`)
- Delivery: WhatsApp. Final mp4 must be **16 MB or less**.

## Delivery constraint (WhatsApp, 16 MB)

- Budget: 16 MB = 128 Mbit over 59s = 2.17 Mbps total. Silent, so all of it is video.
- Render from the video folder, not `npm run render` (it has no bitrate flag):
  `npm run check && npx --yes hyperframes@0.8.142 render -o renders/tutorial-agendamento.mp4 --video-bitrate=2M --max-bitrate=2.4M`
  then check size (`ls -l`) and the rotation flag (`ffprobe ... stream_side_data=rotation`, strip with `ffmpeg -display_rotation:v:0 0 -c copy` as in `tools/render.mjs`). If the file is over 16 MB, re-render at `--video-bitrate=1.8M`.
- Visuals that compress well, all scenes:
  - Flat backgrounds: `--vm-canvas` or `--vm-mist` solid on light scenes, solid `--vm-violet-700`/`--vm-grad-escuro` (static) on dark. No grain, no noise textures, no animated gradients, no moving glow blobs. If the starter `.glow` layers stay, they are static (no tween on them).
  - No long blurs: `filter: blur()` only on transient exits (≤0.4s), never held. Backdrop scrims are solid rgba, not backdrop-filter.
  - Camera moves are steady and short; no continuous full-frame scale.

## Layout (all scenes, builders keep it identical so seams match)

- Logo: `assets/brand/` transparent wordmark, fixed top-left at the `--vm-safe-*` inset, same position in every scene (including the opener and the payment beat; on dark use the white wordmark). Never on a gradient bar.
- Headline: Space Grotesk, top block under the logo, left-aligned at the safe inset, top edge y=230, max 2 lines, max width 900px, `--vm-fs-*` headline size. One headline per frame, enters with `m.rise`, exits with `m.exit` left.
- Phone (standard rect): `.cam > .dev` centered horizontally, screen 402x874 scaled 1.42 (≈571x1241 screen), top of the bezel at y=560. Same rect at the start and end of every phone scene, so cuts between scenes are invisible on the device.
- Pop-out move: phone slides to x=-150 (`cam` x tween, 0.5s power3.inOut) while `liftOut(el, t, hold, dx, scale)` lifts the element toward the right with scale 1.3–1.45, so the lifted card sits half over the bezel, half beside it. Phone returns to x=0 before the scene exits.
- Callout: `tip()` small violet tooltip attached to the lifted element (dot + short stem), 2–4 words. One tip on screen at a time.
- Screens never leak past the bezel: everything inside `.screen` is clipped by the screen radius; only `liftOut` clones live outside it (in `.lift`). Verify in snapshots at the seams and at every pop-out (zoom review).
- Taps sit exactly on the element centre (`center()`), result visible on the same frame.
- Ids the seam ledger checks (builders must use them): headline `#sNN-head` (words as `.w`), stacked screens `#sNN-sA`, `#sNN-sB`, … in the order of the Screens column, specialty sheet layer `#s05-sheet`, phone `.cam`. Plus cuts use `m.plusCover` / `m.plusReveal` (`.vm-plus`).

## Scenes

One row per sub-composition in `compositions/`. Times are absolute (seconds); local times in the beat column are relative to the scene start.

| # | File (id) | Start–End | Screens (library id + state) | On-screen text (final, pt-BR) | Visual + beats (local s) | Exit into next |
|---|-----------|-----------|------------------------------|-------------------------------|--------------------------|----------------|
| 1 | `s01-abertura.html` (s01-abertura) | 0.0–4.0 (4.0) | `client-home-company default` | Headline: **Sua consulta em poucos toques** ("poucos toques" in `<em>`) | Flat `--vm-mist` background (solid, static), logo top-left. 0.2 headline rises. 0.7 phone rises from the bottom (`m.device(cam, 0.7, { from: "bottom" })`, y 900→0, 0.9s power3.out) and lands at the standard rect at 1.6, showing the top of the home screen. 1.9–3.6 steady scroll down ~120px and back to top (0.8s each way) so the screen performs, ending at scroll 0 at 3.6. 3.4 headline exits left. | Device hold: at 4.0 the phone is at the standard rect, home at scroll 0, headline gone; s02 starts on that exact frame and its headline enters from the right. |
| 2 | `s02-entrada.html` (s02-entrada) | 4.0–9.5 (5.5) | `client-home-company default` | Headline: **Comece pela busca** · Tip: **Especialidade ou sintoma** | 0.1 headline rises. 1.0 phone slides to x=-150; 1.1 `liftOut` search bar `[aria-label="Buscar especialidade ou sintoma"]` dx=+260 scale 1.35, hold 1.8; tip at 1.4 pointing to the lifted bar. 3.0 phone back to x=0. 3.4 page scrolls (steady) down until the "Viva+ Empresarial" section sits at screen centre, ends 4.9. 5.0 headline exits left. | Continuous scroll: page keeps the same scroll offset; s03 starts on the scrolled frame. |
| 3 | `s03-beneficios.html` (s03-beneficios) | 9.5–15.0 (5.5) | `client-home-company default` (scrolled to "Viva+ Empresarial") | Headline: **Seus benefícios já aparecem** · Tips: **Crédito da empresa** then **25% off em especialistas** | 0.1 headline rises. 0.8 phone to x=-150. 0.9 `liftOut` credit card `[aria-label^="Crédito, Crédito da empresa"]` dx=+260 scale 1.4 hold 1.4, tip 1.2. 2.5 benefit row scrolls horizontally to the discount card; 2.8 `liftOut` `[aria-label^="Desconto, Especialistas"]` same move hold 1.4, tip 3.1. 4.4 phone back to x=0; 4.5 page scrolls back to top (0.4s). 5.0 tap `[aria-label="Agendar consulta"]`; 5.15 push starts toward `search-results cardio`. 5.1 headline exits left. | Screen push left: push from home to the search list starts at 5.15 local and finishes at s04 0.35; s04 renders the list already mid-push (x from 35% to 0). |
| 4 | `s04-medicos.html` (s04-medicos) | 15.0–20.0 (5.0) | `search-results loading` → `search-results clinica` | Headline: **Veja quem atende** · Tip: **Nota, horário e preço** | 0.0 list finishing push (skeleton `loading`), crossfade to `clinica` at 0.6. 0.2 headline rises. 1.2 list scrolls steadily ~260px. 1.9 phone to x=-150; 2.0 `liftOut` first doctor row dx=+250 scale 1.3 hold 1.7, tip 2.3 on the price/slot line. 3.8 phone back. 4.4 tap the specialty field in the search header ("Clínica geral"); sheet starts rising at 4.6. 4.5 headline exits left. | Sheet rise across the cut: specialty sheet slides up from the bottom of the screen starting 4.6 local, s05 opens with the sheet at 40% travel and completes it. |
| 5 | `s05-especialidade.html` (s05-especialidade) | 20.0–25.0 (5.0) | `specialty-picker open` → `specialty-picker cardio` → `search-results loading` → `search-results cardio` | Headline: **Troque a especialidade** · Tip: **Vídeo ou chat** | 0.0 sheet completes rise (0.3s). 0.1 headline rises. 0.9 tap "Cardiologia"; swap to `cardio` state at 1.0 (selected). 1.4 phone to x=-150; 1.5 `liftOut` the format chips (Vídeo / Chat) dx=+250 scale 1.45 hold 1.5, tip 1.8. 3.1 phone back. 3.4 tap "Confirmar"; sheet drops 3.5–3.85; skeleton 3.85–4.2, crossfade to `search-results cardio` at 4.2. 4.5 headline exits left. | Device holds: same list frame across the cut (`search-results cardio` top), s06 starts on it. |
| 6 | `s06-filtros.html` (s06-filtros) | 25.0–30.0 (5.0) | `search-results cardio` → `search-filters default` → `search-filters set` → `search-results cardio-filtered` | Headline: **Filtre do seu jeito** · Tip: **Dia, formato e benefício** | 0.1 headline rises. 0.6 tap `[aria-label="Filtros"]`, filter sheet rises 0.7–1.1. 1.3 taps in order: "Amanhã" (1.3), "Vídeo" (1.7), benefit "Especialistas" (2.1), each swapping in the matching `set` state part (or crossfade to `set` at 2.1 with tap visuals on the three chips). 2.4 phone to x=-150; 2.5 `liftOut` the three selected chip sections as one group (Dia + Formato + Benefício wrapper) dx=+240 scale 1.3 hold 1.2, tip 2.7. 3.7 phone back. 3.9 tap CTA "Ver médicos"; sheet drops, `cardio-filtered` with active filter chips at 4.3. 4.6 tap first doctor row; push starts 4.75. 4.5 headline exits left. | Screen push left: list → doctor profile push starts 4.75 local, s07 opens mid-push. |
| 7 | `s07-perfil-horario.html` (s07-perfil-horario) | 30.0–37.5 (7.5) | `doctor-profile default` → `doctor-profile day` → `doctor-profile slot` | Headline: **Escolha dia e horário** · Tips: **Toque no horário** then **Confira e agende** | 0.0 push completes (0.25). 0.2 headline rises. 0.8 page scrolls to the day strip ("Escolha o dia") and slots (ends 1.8). 2.0 tap tomorrow in the day strip (`day` state, slots for that day). 2.9 tap slot "14:30" (`slot` state, BookingBar shows day + 14:30). 3.2 phone to x=-150; 3.3 `liftOut` the selected 14:30 slot dx=+270 scale 1.45 hold 1.4, tip 3.6. 4.8 phone back. 5.1 `liftOut` BookingBar (date + time + "Agendar") dx=0 y lift only, scale 1.15, hold 1.1, tip 5.3. 6.6 tap "Agendar". 6.7 headline exits left. | Violet "+" match cut: `plusCover` peaks at 7.5 (starts 6.95). |
| 8 | `s08-pagamento.html` (s08-pagamento) | 37.5–40.0 (2.5) | none (no payment screen) | Headline: **Pagamento** / ***confirmado*** ("confirmado" in spark) | Dark violet solid frame (`.vm-bg-violet` or deep, static). 0.0 `plusReveal` (0.6). 0.3 headline rises centered, plus a small spark check pop at 0.9 and a short row of three ">" chevrons sliding left behind the text 0.3–1.6 (time-skip). 1.9 words exit left. | Cut-the-curve LEFT: words exit left 1.9–2.3; phone enters from the right moving left at s09 0.0 (x 420→0, 0.6s). |
| 9 | `s09-anamnese.html` (s09-anamnese) | 40.0–48.0 (8.0) | `anamnese-fill symptom` → `since` → `pain` → `health` → `sent` | Headline: **Conte como você está** · Tips: **Uma pergunta por vez** then **O médico lê antes** | 0.0 phone enters from right. 0.3 headline rises. 1.0 symptom typed into the first field (`typeIn`, 0.9s). 2.0 tap "Continuar" → `since` (push within screen). 2.6 tap "Ontem". 2.9 phone to x=-150; 3.0 `liftOut` the step pills row (progress) dx=+250 scale 1.4 hold 1.3, tip 3.2. 4.3 phone back. 4.5 tap "Continuar" → `pain`; 4.9 tap pain level 4 on the scale. 5.4 tap "Continuar" → `health`; 5.8 tap "Enviar". 6.0 `sent` state ("Anamnese enviada"); 6.3 `liftOut` the sent confirmation card dx=+250 scale 1.3 hold 1.1, tip 6.5. 7.5 headline exits left. | Screen crossfade on device: `sent` crossfades into the dark call screen 7.6–8.0; s10 opens on the call screen with the device unmoved. |
| 10 | `s10-consulta.html` (s10-consulta) | 48.0–55.0 (7.0) | `video-call in-call` → `call-chat button` / `call-chat open` / `call-chat photo` (overlay on the call) | Headline: **Consulta por vídeo** · Tips: **Seu médico, ao vivo** then **Mande fotos e exames** | Remote video slot: doctor portrait `assets/people/rafael.jpg` (same doctor as s07) with a slow 1.03 push, self-view PiP `assets/people/ana.jpg`. 0.1 headline rises. 1.0 phone to x=-150; 1.1 `liftOut` the self-view PiP dx=+260 scale 1.6 hold 1.3, tip on the doctor video at 1.3 ("Seu médico, ao vivo"). 2.6 phone back. 3.0 tap chat button (`call-chat button` → `open`). 3.8 doctor message visible; 4.3 `photo` state (patient photo sent). 4.6 phone to x=-150; 4.7 `liftOut` the photo bubble dx=+250 scale 1.35 hold 1.2, tip 4.9. 6.0 phone back. 6.3 headline exits left. | Violet "+" match cut: `plusCover` peaks at 7.0 (starts 6.45). |
| 11 | `s11-fim.html` (s11-fim) | 55.0–59.0 (4.0) | none | Lockup + line **Agende pelo app** + CTA **vivamais.ai** | White/canvas frame. 0.0 `plusReveal`. 0.4 `m.end(card)`: lockup (`assets/brand/` colour lockup, centred), line rises 0.9, CTA chip 1.3. Hold to 4.0 with `m.hold` slow push (no loop). Top-left logo hidden here (lockup is the logo). | End of video. |

Durations: 4.0 + 5.5 + 5.5 + 5.0 + 5.0 + 5.0 + 7.5 + 2.5 + 8.0 + 7.0 + 4.0 = 59.0s.

## Screen library additions (build before scenes)

Library has `client-home-company default` (entry + benefits) and `call-chat button/open/photo`. Missing, to add in `screens/mobile/` from `.monorepo/apps/mobile/src`, persona `ana-company` (logged in as Ana, company plan):

| New id | Component (source) | States | Fixture notes |
|--------|--------------------|--------|---------------|
| `search-results` | `components/search/SearchScreen.tsx` (route `(client)/search`) | `loading`, `clinica`, `cardio`, `cardio-filtered` | 3–4 doctors per specialty with real portraits from `assets/people/doctors/` (cardio list: first row is the s07 doctor, photo `rafael.jpg`). Rows show nota, próximo horário ("amanhã"), price with the plan's 25% discount for Cardiologia. `cardio-filtered`: active chips Amanhã · Vídeo · Especialistas (`ActiveFilterChips`). |
| `specialty-picker` | `components/search/SpecialtyPickerSheet.tsx` (`SpecialtyPickerSheet visible`) over the search list | `open` (Clínica geral current), `cardio` (Cardiologia selected, "Confirmar" enabled) | Sheet title "Especialidade e formato", format chips Vídeo/Chat with Vídeo selected. |
| `search-filters` | `components/search/FilterSheet.tsx` (`FilterSheet visible`) over the search list | `default`, `set` (Dia: Amanhã, Formato: Vídeo, Benefício: Especialistas) | CTA label from `FilterSheet` ("Ver N médicos" / "Ver médicos"). |
| `doctor-profile` | `components/doctor/DoctorPublicProfileScreen.tsx` (route `(client)/doctor/[id]`) | `default`, `day` (tomorrow selected), `slot` (14:30 selected, `BookingBar` shows when-text) | Cardiologist, photo `rafael.jpg`, price with 25% off, slots morning/afternoon incl. 14:30. Use `press` for day and slot (`aria-label` from `DayStrip`/`PeriodSlots`). Page must render full height so the scene can scroll to the day strip. |
| `anamnese-fill` | `components/anamnese/AnamneseFillScreen.tsx` (route `(client)/anamnese/fill/[responseId]`, the scheduled-consultation anamnese, not the plantão one) | `symptom`, `since`, `pain`, `health`, `sent` | Same answers as the plantão fixture where they fit (symptom text, "Ontem", pain 4). `sent` = "Anamnese enviada". Do not reuse `plantao-anamnese`: its header says "Anamnese do plantão". |
| `video-call` | `components/video-call/ClientVideoCallScreen.tsx` / `PatientInCall.tsx` (route `(client)/video-call`) | `in-call` | Video renders empty in the library; the remote stream and self-view slots must carry a `data-testid`/`aria-label` so the scene can place `rafael.jpg` and `ana.jpg` in them. Controls, timer and recording indicator from the real component. |

If `video-call in-call` cannot render through the shims, the fallback is a hand-built call screen in `s10` that follows `PatientInCall.tsx` layout and `brand/app-ui.css` tokens; flag it in the scene's PR, do not invent controls.

## Assets

`assets.json` maps: kit files, `people/doctors/rafael.jpg` → `assets/people/rafael.jpg` (confirmed cardiologist for s04, s07, s10), `people/ana.jpg` → `assets/people/ana.jpg`. No video-specific media.

## Images the user generates

None. The opener is a flat brand background (user decision).

## Decisions

- Opener: flat brand background, phone rises in, no photo.
- Doctor: `rafael.jpg` (Cardiologia) in the list, profile and call.
- Missing screens are added to `screens/` by a separate agent with the ids and states above.
- Length 59.0s. To cut to ~50s: drop s04's scroll, trim s07 and s09 by 1.5s each.

Rules live in `videos/STYLE.md` (Tutorials) and `brand/frame.md`. Reference: `videos/tutorials/tutorial-medico`.
