---
model: ad
workflow: general-video
flow: automation
storyboard: no
status: built
---

# Consulta com especialistas (short cut)

Ad: motion-led, silent, 39s. Short cut; a full version comes later as a separate video.

## Message

Marque uma consulta com especialistas de todo o Brasil pelo app: escolha a especialidade e o médico, o horário, converse por vídeo e saia com resumo e documentos prontos.

## Audience

Adults 40+, Instagram/Facebook Reels and Stories (9:16). Muted autoplay: every beat is carried by on-screen text and motion.

## Output

- Master: portrait 1080×1920 @30, **39.0s** (hard max 40s).
- Feed 4:5: none for now (9:16 only).
- Language: pt-BR. Voice: none. Music: none (silent, no `<audio>` clips).

## Look: hybrid motion explainer, Viva Mais light brand

Reference: noramotion healthcare explainer, for **motion grammar only**; the look is 100% Viva Mais (violet, our type, our cards), zero green. Most of the film is free-floating UI pieces on a soft gradient; the phone appears only in `busca` and `chamada`.

- **Stage**: every scene root is `<div class="vm-scene ce-scene">` with a `.ce-stage` (canvas → mist vertical gradient) and one `.ce-halo`. Variants: `.ce-stage--mist` (horario, tempo, resumo), `.ce-stage--violet` only inside a morph (a giant shape that fills the frame is the "colour wipe"; never a flat wipe panel). Shared styles in `assets/ce.css` (linked by index.html; link it in each composition too, after `assets/brand/tokens.css`). Every colour in a composition is a `--vm-*` token (or a `--ce-*` alias from `ce.css`); no hex literals, no `rgba(…)` of raw hex. Recreated app UI uses `assets/brand/app-ui.css` tokens.
- **Spawn graph**: one central card (`.ce-card.ce-hub`) appears first; satellites pop out of it (scale 0.4→1 from the hub centre, power4.out 0.6s, stagger 0.06), travel to fixed slots and lock (tiny overshoot via `back.out(1.4)` once, no yoyo); then SVG links (`.ce-links path`) draw from hub to each satellite (stroke-dashoffset, 0.35s). Used in `burst`, `assinatura`, `resumo`, `fim`.
- **Kinetic type**: big Space Grotesk words arrive one at a time with directional motion blur (filter blur 16→0, x 140→0, power4.out 0.45s); the outgoing word leaves a ghost echo (`.ce-ghost` clone: opacity 0.22, blur 10, drifts 60px LEFT and fades over 0.3s). Used in `hook` and `anamnese`.
- **Tap-driven morphs**: the touch dot (`.ce-tap` + `.ce-tap-ring`, same behaviour as `.v2-tap` in plantao-24h-v2: glide 0.45s power3.inOut, press scale 0.86 for 0.1s, ring 1→1.8 once) presses a pill; on the press frame the pill morphs (width/height/radius tween) into the next shape: pill → button → giant icon → card. Every tap ignites the next beat on that frame.
- **Device**: kit iPhone (`.cam > .dev > .bezel + .screen > .scr`), flat and upright, whole phone, no tilt, no top fade mask; close-ups are camera zooms into the phone. Only in `busca` and `chamada`.
- **Lines** (`.ce-line`): 84px Space Grotesk, ink, one violet `<em>`, top y 330, left 80. One line on screen at a time; a new line enters only after the previous fully exits; each line still ≥ 1.4s.
- **Colour**: violet dominant (`--vm-primary`, `--vm-violet-*`); **zero green**: no `--vm-spark-*`, `--vm-secondary*` or `--vm-success*` anywhere, checks and selected states in violet; iris/azure never as fills. Cards `--vm-white` or `--vm-tile`, no border.
- **Ease**: entrances power4.out 0.5–0.7s; exits power3.in 0.35–0.45s with blur 0→12 and stay in motion through the cut. No pulses, loops, wobble, bounce loops.
- **Logo**: `assets/brand/lockup-cor.svg` as `.ce-logo` (x 80, y 220, w 210) only in `hook` (fades in at 1.6) and `burst`. `fim` has the centred lockup.

## Safe box (mandatory)

Readable content (lines, hub cards, tap targets, logo) inside **x 80–940, y 220–1240**. Phones, halos, orbits and blurred pieces may bleed below. Type floor: lines 84px, readable copy in cards ≥ 40px (scale cloned app components ×2.4–2.6).

## Scene Plan

Times absolute. One row per file in `compositions/`. Selectors named in "Exit → next" must exist (see `ledger.json`).

| # | File | Start–end | On-screen text (final, pt-BR) | Screen / component source | Visual + action (scene-local times) | Mockup | Exit → next |
|---|------|-----------|-------------------------------|---------------------------|--------------------------------------|--------|-------------|
| 1 | hook.html | 0–3.5 | Words: "Marque" · "uma" · "consulta" · "agora" → line "Marque uma consulta agora com médicos de <em>todo o Brasil</em>" | type only | 0–1.5 four words slam in one at a time, centred, 200px, kinetic blur + ghost echo of each outgoing word (0, 0.35, 0.7, 1.05); 1.5 the last word shrinks into place and the full line (96px, centred, 3 lines, y ~700) builds out word by word (stagger 0.05); logo fades in 1.6; hold 2.1–3.1 | no | 3.1 all words blur out LEFT except "todo o Brasil", which collapses to a violet dot `.ce-seed` (60px) at frame centre (540, 900) |
| 2 | burst.html | 3.5–6.0 | Hub: "<b>+40</b>" (count 0→40) / "especialidades disponíveis" | hub type; satellites from real app pieces: doctor avatars (`assets/people/doctors/camila-rocha.jpg`, `rafael.jpg`, `mariana.jpg`, `julia.jpg`), channel pills "Vídeo" / "Chat" (SpecialtyPickerSheet `CHANNEL_OPTIONS`), slot chip "Seg · 14:30", rating chip "★ 4,9", specialty icons `cardio.png`, `pediatria.png`, `derma.png` | 0 `.ce-seed` grows into `.ce-hub` card (centre 540, 820, 760×360), "+40" counts 0→40 (0.15–0.85, Space Grotesk 200px violet), "especialidades disponíveis" 56px under it; 0.8–1.4 eight satellites spawn and lock in a ring (radius ~420, all inside the safe box except the lower two which may bleed), links draw 1.2–1.55; hold to 2.0 | no | 2.0 links retract, satellites snap into a single row `.ce-rail` at y 900 (hub joins as first item) and the row accelerates LEFT with blur |
| 3 | carrossel.html | 6.0–8.75 | Pills (icon + name): Clínica geral · Dermatologia · Pediatria · Ginecologia · Ortopedia · Neurologia · Psicologia · Endocrinologia · Nutrologia · Urologia · Geriatria · Alergologia · Fonoaudiologia · **Cardiologia** | `assets/icons/specialties/*.png` (mapping from `.monorepo/apps/mobile/src/lib/search/specialty-icons.ts`) | `.ce-rail` of `.ce-pill`s enters already moving LEFT (velocity matched to burst), scale 1.0→1.35 toward centre (pills nearer centre larger, depth falloff + blur on the edges), decelerates on a single power4.out 0–1.6 and lands with Cardiologia centred (y 900); 1.75 tap dot presses Cardiologia → turns `.ce-pill--on` on the press frame; others blur away to the edges; hold 1.9–2.4 | no | 2.4 Cardiologia pill `.ce-pick` shrinks (scale 0.55) and drops toward y 1180, the phone top rising under it |
| 4 | busca.html | 8.75–14.5 | "Encontre seu <em>especialista</em>" | **Recreated in HTML** inside `.scr` (see Notes, "Recreated app screens"): search list (Cardiologia), specialty filter sheet, doctor profile + slot | 0–0.6 phone rises from bottom (`m.device`), pill lands in the screen's specialty field (crossfade into the real field on 0.55); line enters 0.3; 1.0 `k.tap` on the specialty field → sheet slides up (0.35s), 1.5–2.4 sheet chip list scrolls down then back so Cardiologia (selected) is visible, 2.6 tap "Confirmar", sheet slides down; 3.0 camera zooms into the first doctor row (Dra. Camila Rocha), 3.3 tap row → push to profile (`k.push`); 3.7–4.6 profile scrolls to the "Seg 16" slots panel; 4.9 tap "14:30" (slot state) | yes (only phone beat #1) | 5.2 the 14:30 chip `liftOut`s toward camera while `.cam` falls away down with blur 0→14 |
| 5 | horario.html | 14.5–17.0 | "Escolha o <em>horário</em>" → card "Consulta agendada" / "Seg, 16 de nov · 14:30" | slot chip and "Agendar" button: the same recreated markup as busca (PeriodSlots chip, BookingBar button), scaled; doctor avatar `camila-rocha.jpg` | 0 `.ce-slot` "14:30" (from busca) enlarges to 3× at centre, flanked by sibling slot chips 14:00 / 15:00 / 15:30 fanning out (power4.out), line 0.2; 0.9 tap dot presses 14:30 → pill morphs into the violet "Agendar" button (width 760, h 140); 1.35 tap button → button morphs into a giant violet check circle (fills ~520px, the only violet field), 1.6 circle morphs into the white `.ce-done` card "Consulta agendada" + "Seg, 16 de nov · 14:30" + avatar; hold 1.7–2.1 | no | 2.1 `.ce-done` exits LEFT with blur |
| 6 | anamnese.html | 17.0–19.0 | "Conte o que <em>sente</em>" ; card "O que você está sentindo?" with chips | question title + chip markup cloned from `<!-- screen:plantao-anamnese symptom -->` (selected chip style from its selected "Dor de cabeça" chip); chips used: Falta de ar · Cansaço · Tontura · Febre · Tosse | 0 `.ce-ask` card enters from right carrying LEFT; line words kinetic in 0.1–0.5 with ghost echo; 0.6 chips pop out of the card in a cloud; 0.9 tap "Falta de ar" (selects), 1.2 tap "Cansaço" (selects); hold 1.25–1.6 | no | 1.6 selected chips fold into one violet dot, card exits LEFT |
| 7 | tempo.html | 19.0–20.75 | "No dia da <em>consulta</em>" ; calendar "nov" days 12 → 16 ; clock 14:30 | invented widget (calendar card + round clock), app tokens only | 0 `.ce-cal` calendar card enters from right; the violet dot lands on "Seg 16"; 0.2–0.9 day highlight steps 12 → 13 → 14 → 15 → 16 (decelerating); line 0.2; 0.9 card flips to a round `.ce-clock`, hands sweep to 14:30 (0.9–1.4, power3.out) | no | 1.45 the clock circle flattens into a rounded rect (shape morph), Z-forward |
| 8 | chamada.html | 20.75–27.0 | Notification: "Sua consulta vai começar agora" / "Com o doutor(a) Camila Rocha" → line 1 "Consulta por <em>vídeo</em>" → line 2 "Tire dúvidas no <em>chat</em>" | notification card invented (copy from backend `send_notification_pre_schedule`, app icon `assets/brand/icone-app.png`); call: `<!-- screen:call-chat button -->` + `assets/footage/doutora-call.mp4` remote + `assets/footage/paciente-pip.mp4` PiP (as plantao-24h-v2 `chamada.html`); chat: `<!-- screen:call-chat open -->` | 0 `.ce-push` notification card at centre (from the morph), settles 0–0.4; 0.9 tap → the card expands into the phone (card corners grow into the screen) and the call resolves 1.0–1.6; line 1 1.4–3.0; 3.2 `k.tap` on the chat icon, CallChat slides up 3.3–3.7; line 2 enters 3.6 after line 1 exits; 3.9–5.0 messages arrive (doctor greeting, then patient photo bubble) as in `call-chat open`; hold to 5.6 | yes (phone beat #2) | 5.75 `m.plusCover(6.25)` |
| 9 | assinatura.html | 27.0–29.75 | "Documentos <em>assinados</em> na hora" ; doc chips: Receita · Pedido de exame · Atestado | doctor card: `camila-rocha.jpg` + "Dra. Camila Rocha" / "Cardiologia"; doc pages: the recreated document cards from documentos (Receita, Pedido de exame, Atestado), same markup; patient card "Helena Souza" (initials avatar "HS" in violet-50, as the app draws it) | 0 `m.plusReveal`; `.ce-doc-hub` doctor card at upper centre; 0.3 a document page slides out of it, a pen stroke signs it (SVG path draw 0.3–0.8), "Assinado digitalmente" tag pops; 0.9 two more pages spawn as satellites, links draw (the `.ce-graph`); line 0.4; 1.4–2.0 the three pages fly along curved paths into the patient card at the bottom (y ~1150), stacking, count badge "3" pops; hold to 2.3 | no | 2.35 camera pans LEFT: graph exits LEFT, patient card travels on |
| 10 | resumo.html | 29.75–32.75 | "Resumo <em>automático</em>" ; satellites "Transcrição" · "Próximos passos" · "Documentos gerados" | **Recreated** cardio record pieces (layout of `DossierTranscript`, `DossierSummary` and the documents rows in `screens/mobile/consultation-record.screen.tsx`), copy in Notes | 0 `.ce-hub` (Helena's consultation card: "Consulta · Cardiologia" / "Seg, 16 de nov") enters from the right carrying LEFT, centres; line 0.3; 0.8–1.4 three satellites spawn and lock (left, right, below), links draw 1.2–1.5; each satellite's content types/rises in 1.4–2.1; hold to 2.6 | no | 2.6 `.ce-sat-docs` scales toward camera with blur (zoom-through) |
| 11 | documentos.html | 32.75–35.25 | chip per page: "Prontuário" · "Receita" · "Pedido de exame" · "Atestado" · "Acompanhamento" · "Encaminhamento" ; line "Tudo no seu <em>app</em>" | **Recreated** document cards (spec in Notes, "Document cards") | 0 first page (Prontuário) resolves from the zoom blur; 0.2–1.9 six `.ce-page` cards pass right-to-left in a fanned deck, ~0.3s each centred, label chip with its record icon (`assets/illustrations/records/*.webp`) under each; line 0.2 (holds to 2.0) | no | 2.05 last page flies LEFT with blur |
| 12 | fim.html | 35.25–39.0 | "+40 especialidades" (orbit hub) → lockup → "Consulte já em" + "vivamais.ai ↗" | `assets/brand/simbolo-cor.svg`, `lockup-cor.svg`; 14 specialty icons | 0 icons enter from the right carrying LEFT and swing into a `.ce-orbit` (two rings) around the symbol at centre, links draw from centre (0.2–1.0); the orbit rotates slowly (one direction, no loop reversal) 0–3.75; "+40 especialidades" under the symbol 0.6–1.8; 1.9 text swaps (blur) to "Consulte já em" + `vivamais.ai ↗` as underlined link (violet, the end-card pulse from plantao-24h-v2 `fim.html`); symbol replaced by full lockup 1.9–2.3; hold to end | no | — |

Durations: 3.5 + 2.5 + 2.75 + 5.75 + 2.5 + 2.0 + 1.75 + 6.25 + 2.75 + 3.0 + 2.5 + 3.75 = **39.0**.

## Builder rules

- Fonts: copy the `@font-face` block from plantao-24h-v2 compositions (DM Sans 400/500/700, Space Grotesk 500/700 from `assets/brand/fonts/`).
- Root of every scene: `<div id="<id>" class="vm-scene ce-scene" data-composition-id="<id>" data-start="0" data-duration="<dur>" data-width="1080" data-height="1920">`, durations as in the table.
- Library screens (only `chamada` and `anamnese`): `<link rel="stylesheet" href="assets/screens/screens.css">`; `<div class="scr"><!-- screen:id state --><!-- /screen --></div>`; `npm run sync -- consulta-especialistas` fills them. Chips in `anamnese` are clones of filled nodes, not retyped.
- Recreated screens (`busca`, `horario`, `resumo`, `documentos`, `assinatura`): HTML inside the kit phone's `.scr` (402×874) or as free cards, matching the current app layout from the listed source files, styled only with `assets/brand/app-ui.css` and `--vm-*` tokens, DM Sans / Space Grotesk, app copy exactly as written in Notes. Do **not** add anything to `screens/`.
- Each builder that recreates the same piece (slot chip, Agendar button, document card) copies the spec in Notes verbatim so the shared elements match across seams.
- Kit: `VMMotion` (`rise`, `slide`, `exit`, `pop`, `count`, `device`, `swap`, `plusCover`/`plusReveal`, `end`) and `VMKit` (`tap`, `center`, `push`, `liftOut`, `typeIn`).
- Doctor: Dra. Camila Rocha, Cardiologia. Patient: Helena Souza. Dates: consultation Seg, 16 de nov de 2026, 14:30.
- Deterministic only; seeded PRNG if positions need jitter.
- Check: `npm run check -- consulta-especialistas`, `npm run seams` in the video folder, snapshots at 1.0, 2.6, 4.8, 7.8, 10.5, 13.5, 16.0, 18.3, 20.2, 22.5, 25.5, 28.5, 31.5, 34.0, 37.5 with the safe box drawn.

## Notes

### Screens: real vs recreated

Real (library): `call-chat button`, `call-chat open` (chamada), `plantao-anamnese symptom` (chips cloned in anamnese).

Recreated in the scenes (no library work), matching the current app layout in `.monorepo/apps/mobile/src`:

1. **Search list, Cardiologia** (busca): `components/search/SearchScreen.tsx`, `SearchHeader.tsx`, `ActiveFilterChips.tsx`, `DoctorRow.tsx`. Header field shows "Cardiologia" with the cardio icon and "Vídeo". Four rows: Dra. Camila Rocha (`camila-rocha.jpg`, "Cardiologia", ★ 4,9, slot chip "Seg · 14:30"), Dr. Rafael Martins (`rafael.jpg`), Dra. Mariana Lopes (`mariana.jpg`), Dra. Júlia Prado (`julia.jpg`), each "Cardiologia" with a next-slot chip. Camila's row price: "R$ 89,00" with "R$ 120,00" struck through.
2. **Specialty filter sheet** (busca): `components/search/SpecialtyPickerSheet.tsx` + `components/ui/Chip.tsx` (size lg, with icon). Title "Especialidade e formato", subtitle "Escolha quem você procura e como quer ser atendido.", search field "Buscar especialidade", segmented Vídeo / Chat (Vídeo on), wrapped chips for the 14 specialties with icons, Cardiologia selected (violet), footer button "Confirmar". Sheet slides over the dimmed list.
3. **Doctor profile + slot** (busca → horario): `components/doctor/DoctorPublicProfileScreen.tsx`, `DoctorHero.tsx`, `DayStrip.tsx`, `PeriodSlots.tsx`, `BookingBar.tsx`. Hero: Dra. Camila Rocha, Cardiologia, CRM; price "R$ 89,00" with "R$ 120,00" struck through (muted, line-through, before the promo price). DayStrip with "Seg 16" selected; PeriodSlots "Tarde" with 14:00 / 14:30 / 15:00 / 15:30; tapping 14:30 selects it and enables BookingBar: price "R$ 89,00" + button "Agendar". The struck-through original price is not drawn by the app today; draw it in the same row as the price label, `--vm-muted-foreground`.
4. **Cardio consultation record** (resumo): layout of `screens/mobile/consultation-record.screen.tsx`.
   - Transcrição (two turns, `DossierTranscript` style): Médica "Oi, Helena. O que você está sentindo?" · Helena "Falta de ar e cansaço quando subo escada."
   - Próximos passos (`DossierSummary` blocks): Conduta "Eletrocardiograma e ecocardiograma" · "Losartana 50 mg, 1 vez ao dia"; Retorno "Retorno em 30 dias com os exames".
   - Documentos gerados: label "Gerados na consulta · 6", rows Prontuário · Receita · Pedido de exame · Atestado · Acompanhamento · Encaminhamento (icon + title + note "16/11/2026").

### Document cards (documentos, also used in assinatura)

Six recreated A4-ratio white cards (`--vm-white`, radius 32, `--ce-shadow`), ~620×876, each with the PDF masthead feel (lockup `assets/brand/lockup-cor.svg` small top-left, title, patient "Helena Souza", doctor "Dra. Camila Rocha · Cardiologia · CRM", date "16/11/2026", 2–4 grey body lines, signature line "Assinado digitalmente"), label chip under the card with the record icon:

| Card | Title | Body (main line) | Icon |
|------|-------|------------------|------|
| 1 | Prontuário | Queixa: falta de ar aos esforços | `records/laudo.webp` |
| 2 | Receita | Losartana 50 mg · 1 vez ao dia | `records/receita.webp` |
| 3 | Pedido de exame | Eletrocardiograma · Ecocardiograma | `records/exames.webp` |
| 4 | Atestado | 1 dia de afastamento | `records/atestado.webp` |
| 5 | Acompanhamento | Pressão arterial: medir 2× ao dia por 30 dias | `records/laudo.webp` |
| 6 | Encaminhamento | Encaminho para avaliação em nutrição | `records/laudo.webp` |

Invented UI (no app screen): push notification card (backend copy), calendar + clock widget in `tempo`, signature stroke in `assinatura`, struck-through original price.

### Shared assets

- Call footage promoted to the shared library: `assets/footage/doutora-call.mp4`, `assets/footage/paciente-pip.mp4` (Mixkit, credits in `assets/footage/CREDITS.txt`), mapped in `assets.json`.

### Images to generate

None.

### Deviations from house rules (asked for by the user)

- `tempo` uses a calendar and clock (STYLE.md says no clocks in ads); approved by the user.
- Booking goes slot → Agendar → done, no checkout; approved.
- Colour changes are shapes that grow to fill the frame (morphs), not wipe panels; approved.
- Silent ad (STYLE.md says music always); the user asked for silent.
- Logo only in hook + burst + end card, at top 220 (latest ad feedback), not fixed on every scene.
