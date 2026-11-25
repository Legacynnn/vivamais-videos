---
model: ad
workflow: general-video
flow: automation
storyboard: no
status: planned (cut 3)
---

# Médico no app (cut 3)

Ad: motion-led, silent, 31.5s. Cut 2 fixed the fluidity but kept one phone on screen for 19 of 30 seconds; the user: "we are too focused in the mockups, we can have more ui elements and less mockups too". Cut 3 keeps cut 2's continuity grammar (a carrier across every cut, something always performing, nothing resting) and changes the hero: the phone is on screen for the first 4.25s only, then real app pieces live on the stage at large size, each one born from the piece before it.

## Message

Médico agora, sem sala de espera: você acompanha a sua vez de casa, a médica chama, a consulta é por vídeo, os documentos chegam no app, e ainda há especialistas de todo o Brasil.

## Audience

Patients (B2C), adults 40+, Instagram/Facebook Reels and Stories (9:16). Muted autoplay: every beat is carried by on-screen text and motion.

## Output

- Master: portrait 1080×1920 @30, **31.5s**.
- Feed 4:5: centre crop (y 285–1635) of the same master, not exported until asked.
- Language: pt-BR. Voice: none. Music: none (no `<audio>`).

## What changes from cut 2

1. **Device time 19s → 4.25s.** The tilted phone still opens the film (asked for in the previous round) and stands up, then the queue hero peels off the glass and the phone falls out of frame. No device after that.
2. **Heroes are free app pieces**, cloned from the filled library screens, 860px wide or close to it, never retyped or recoloured: the queue hero, the "Chamando você" doctor card, the "Seu atendimento" steps, the countdown row, the call as a large rounded video card, the "Consulta concluída" header with its chips, the Resumo card, the four document cards, the real prescription page, the home quick-action tiles.
3. **Every piece arrives from something that exists**: from behind the previous piece (doctor card from behind the queue hero, countdown from behind the doctor card), out of it (the call grows out of the doctor card, the documents fly out of the "4 documentos" chip, the prescription opens out of its card), or on a push that inherits the outgoing speed. Nothing slides in from an empty edge onto an empty stage.
4. **Frames stay full**: one headline (y 220–475) plus pieces that occupy y 440–1240 and bleed below it. Never a small card in the top half over an empty bottom half.
5. Cut 2 weak spots designed out: the document grid no longer holds on drift (a tap opens the real prescription); no two app titles ever crossfade (our own lines carry the titles; state changes are chip and row swaps); the call line is on screen 2.5s; the end card is spread over y 300–1250 with real tiles under the link.

## Look

- **Stage** (all scenes, identical, light): first child of the scene root is `<div class="mn-stage"><div class="mn-aurora" data-layout-ignore><i class="a1"></i><i class="a2"></i><i class="a3"></i></div></div>`. The aurora drifts LEFT at a constant 12 px/s for the whole film: in each scene `tl.fromTo(".mn-aurora", { x: -12 * START }, { x: -12 * (START + DUR), duration: DUR, ease: "none" }, 0)`, START = the scene's absolute start (0, 6.2, 13.8, 20.4, 25.9).
- **Phone** (only `fila`, 0–4.25s): as built in cut 2 (`.mn-persp > .cam > .dev …`, `.mn-near`), `assets/mn.css` overrides, animate only `.cam`. Screen px (sx, sy) map to frame px in pose H as `X = 77.6 + 2.3·sx`, `Y = 547.6 + 2.3·sy`.
- **Free pieces.** Two kinds, both in `assets/mn.css`:
  - `.mn-piece`: a clone of one node of a filled screen. Source screens sit in `<div class="mn-src"><div class="scr" id="…"><!-- screen:id state --><!-- /screen --></div></div>` (hidden, 402×874, one `.mn-src` per source state). At load the builder clones the node into `<div class="mn-piece [is-card]" style="left;top;width;height"><div class="vms mn-vms" style="width;height">CLONE</div></div>` (the screen CSS is scoped under `.vms`; the clone gets `position: relative; margin: 0`). `left`/`top`/`width`/`height` are the fixed numbers in the tables below (width and height in app px); size on the stage comes from GSAP `scale` (transform-origin 0 0). `is-card` adds the shadow for pieces that are already cards in the app; text-only pieces get none. `compositions/documentos.html` from cut 2 already clones this way: keep its helper.
  - `.mn-win`: a window on a whole screen, for the queue hero only (it is a background image plus overlaid content, not one node): `<div class="mn-win" style="width:402px;height:457px"><div class="scr" style="top:-56px"><!-- screen:… --><!-- /screen --></div>…</div>`.
- **Piece catalogue** (measured in headless Chrome on `screens/dist`, app px on the 402×874 screen; "node" is how to reach it inside the source `.scr`, with `byText(scope, t)` = the element whose own text is exactly `t` and `up(el, n)` = n-th parent):

| Piece | Source state | Node | App rect (x, y, w×h) | Radius | Stage scale → size |
|-------|--------------|------|----------------------|--------|--------------------|
| Queue hero (window) | `plantao-queue position-3`, `plantao-queue-countdown position-2`, `plantao-queue position-1` | `.mn-win` on sy 56–513 | 0, 56, 402×457 | 0 → 20 | 2.139 → 860×977.5 |
| Doctor card | `plantao-called reading`, `calling` | `up(byText("Preparando"), 3)` / `up(byText("Chamando você"), 3)` | 91.2, 127.4, bounding 219.6×287.2 (the node is 210×280 with its own −2° rotation: keep it) | 28 | 2.9 → 637×833 bounding; 2.5 → 549×718 |
| Atendimento well (doctor row + three steps) | `plantao-called reading`, `calling` | `up(byText("Leitura do seu caso"), 3)` | 16, 607 (reading) / 657 (calling), 370×194 | 12 | 2.324 → 860×451 |
| Countdown well | `plantao-called calling` | `up(q('[aria-label^="Entrando na chamada em"]'), 1)` | 16, 533, 370×60 | 12 | 2.324 → 860×139 |
| Chat pill | `call-chat button` | `q('[aria-label="Abrir chat da consulta"]')` | 304, 60, 82×38 | 999 | 2.6 → 213×99 |
| Header (avatar, "Consulta concluída", meta pill, chips) | `post-consultation ready` | `up(byText("Consulta concluída"), 2)` | 0, 107, 402×252 (content x 20–382) | — | 2.376 → 955×599 (content 860) |
| Chips inside the header | same clone | `[aria-label="4 documentos"]` 67.1, 310, 108.8×25 · `[aria-label="1 remédio"]` 181.9, 310, 78.6×25 · `[aria-label="1 exame"]` 267, 310, 68×25 | | 999 | text 13px → 31px |
| Resumo card | `post-consultation ready` | `up(byText("Resumo"), 2)` | 20, 359, 362×366 | 24 | 2.376 → 860×870 |
| Document cards ×4 | `post-consultation ready` | `[aria-label^="Abrir Receita"]`, `^="Abrir Pedido de exame"`, `^="Abrir Atestado"`, `^="Abrir Laudo"` | 156×112 each (row y 893) | 20 | 2.86 → 446×320 (title 40px) |
| Home tiles (Agendar · Plantão · Documentos · Super IA) | `client-home default` | `up(q('[aria-label="Agendar consulta"]'), 4)` | 16, 369, 370×103 | 20 | 2.324 → 860×239 |

- **Lines** (`.mn-line`): 84px Space Grotesk 500, left 80, right 140, one `<em>` (violet). `top` 300 while the corner logo is on screen (`fila`, first 0.4s of `chamada`), `.mn-line--top` (220) otherwise. One line at a time; each readable ≥ 2s. If a line does not fit two rows inside x 80–940, drop to 80px, never three rows.
- **Logo**: `assets/brand/lockup-cor.svg` as `.mn-logo` (left 80, top 220, width 210) in `fila` and carried 0.4s into `chamada`; centred lockup in `fim`.
- **Tap** (only in `documentos`): `.mn-tap` glides 0.45s power3.inOut to the target centre, presses to scale 0.86 for 0.1s, `.mn-tap-ring` grows 1 → 1.8 once and fades. The result starts on the press frame.
- **Colour**: `--vm-*` tokens only, no hex literals. Never `--vm-spark-*`, `--vm-secondary*`, `--vm-success*`, `--vm-grad-simbolo`, `--vm-grad-fresco`. Aqua appears only inside the real logo and inside cloned app pieces (live dot, step checks), never recoloured.
- **Ease**: entrances power3.out 0.5–0.7s; piece-to-piece moves power3.inOut 0.6–0.8s; exits power3.in and still moving at the cut. Film current LEFT. No loops, pulses, yoyo, wobble. Blur max 4px, exits only.

## Safe box (mandatory)

Readable content (lines, logo, chips, countdown digit, document titles, the prescription's header and medication row, the stat, the end card) inside **x 80–940, y 220–1240**. Pieces may bleed: the hero's stories row, the atendimento well, the Resumo card, the lower half of the video card and of the prescription page, marquee rows 5–7, the tiles' labels.

## Scene Plan

Times absolute in "Start–end"; everything else is scene-local. One row per file in `compositions/`. The beat sheets under the table are part of the row and are binding.

| # | File | Builder | Start–end | On-screen text (final) | Pieces | Inherits on frame 0 | Hands over on the last frame |
|---|------|---------|-----------|------------------------|--------|---------------------|------------------------------|
| 1 | fila.html | **edit** (keep 0–3.4, new hand-off) | 0–6.2 | L1 "Médico agora, <em>sem sala de espera.</em>" → L2 "Acompanhe sua vez <em>de casa.</em>" | phone (`plantao-queue position-4`, `position-3`) → free queue hero | nothing: phone a third into frame 0 | `.fl-hero` at left 80, top 500, scale 2.139 showing `position-1`; L2 and logo still; stories row at x −62 app px, drifting |
| 2 | chamada.html | **rewrite** | 6.2–13.8 | L2 (carried, exits) → L3 "A médica <em>chama você.</em>" → L4 "Médica de verdade, <em>no seu celular.</em>" | queue hero → doctor card → atendimento well → countdown well → video card (+ chat pill, PiP) | exactly the last frame of fila | `.ch-video` leaving LEFT at ~3200 px/s, its right edge still 260px inside the frame |
| 3 | documentos.html | **rewrite** (keep the clone helper) | 13.8–20.4 | L5 "Seus documentos, <em>direto no app.</em>" | header + chips → Resumo card → four document cards → real prescription page | `.dc-head` already 200px inside from the right at ~2900 px/s | `.dc-stack` (page + cards) leaving LEFT at ~3000 px/s, right edge 240px inside |
| 4 | especialistas.html | **edit** (stat timing, aurora START) | 20.4–25.9 | L6 "E especialistas de <em>todo o Brasil.</em>" ; "+40" / "especialidades" | marquee rails (as built) | `.es-rails` 200px inside from the right at ~2900 px/s | only `.mn-plus` at centre (510, 700), scale 1, at rest |
| 5 | fim.html | **edit** (layout, tiles, duration, aurora START) | 25.9–31.5 | lockup → "Cuidado <em>quando você precisa.</em>" → "Consulte já em" → "vivamais.ai" ; tiles (real): "Agendar" · "Plantão" · "Documentos" · "Super IA" | mark, lockup, home tiles | `.mn-plus` identical to the last frame of especialistas | — (opaque hold, no fade) |

Durations: 6.2 + 7.6 + 6.6 + 5.5 + 5.6 = **31.5**. Device on screen: 0–4.25 = **4.25s** (13% of the film; cut 2: 19s).

### 1 · fila.html (6.2s): the tilted queue stands up, the hero leaves the glass

Edit of the built file. Unchanged: stage, phone markup, `.mn-near`, logo, L1/L2 markup, the T0 (y 760) → T1 → T2 moves, the non-overlapping numeral roll (out 0.12s, in from t + 0.1), the stories-row drift. Changes: duration 6 → 6.2; the stand-up lands on pose **H** (scale 1.00), not H+; the phone keeps only `#fl-q4` and `#fl-q3`; new `.fl-hero`; the phone leaves.

`.fl-hero`: `.mn-win` at `left: 80px; top: 500px; width: 402px; height: 457px`, three stacked `.scr` at `top: -56px`: `#fl-h3` (`plantao-queue position-3`, visible), `#fl-h2` (`plantao-queue-countdown position-2`), `#fl-h1` (`plantao-queue position-1`). Opacity 0 until 3.6. z-index above the phone, below the line.

Always running, 0 → 6.2, ease none: aurora drift (START 0); stories row (first `.rn-scroll.rn-row > .rn-scroll-content`) in `#fl-q4`, `#fl-q3`, `#fl-h3`, `#fl-h2`, `#fl-h1`: x 0 → −62 app px (10 px/s).

| Local time | Phone (`.cam`) | Free hero (`.fl-hero`) | Text |
|-----------|----------------|------------------------|------|
| 0.0–0.5 | T0 → T1, 0–1.5, power3.out: rising, far end climbing | hidden | L1 rises at 0.15 |
| 0.5–1.0 | rising; "Você é o 4º" readable in perspective | | logo in at 0.5 |
| 1.0–1.5 | settles into T1 without stopping | | |
| 1.5–2.0 | T1 → T2, 1.5–2.6, ease none; 1.7: roll 4º → 3º | | L1 holds |
| 2.0–2.6 | lifting | | L1 exits LEFT at 2.5 |
| 2.6–3.0 | T2 → H, 2.6–3.4, power3.inOut (rotationX 44→0, y 30→0, scale 0.84→1.00); `.mn-near` opacity 1→0 | | L2 slides in at 2.95 |
| 3.0–3.5 | lands upright at H (3.4), "3º · ~9 min" | | L2 in by 3.5 |
| 3.5–4.0 | 3.6: the hero peels. On that frame hide the hero inside `#fl-q3` (opacity 0 on the background layer `#fl-q3 .vms > .rn-view > .rn-view:first-child` and on `up(q('#fl-q3 [aria-label^="Você é o"]'), 3)`), so the glass shows its white page. `.cam` falls 3.6–4.25, power3.in: y 0 → 1750, scale 1 → 0.94 | appears at 3.6 exactly over the glass (`x: -2.4, y: 176.4, scale: 2.3`, radius 0, shadow opacity 0) and travels 3.6–4.3, power3.inOut, to `x: 0, y: 0, scale: 2.139`, radius 0 → 20 app px, shadow in: it rises 176px while the phone drops under it | L2 holds |
| 4.0–4.5 | out of frame at 4.25; `.mn-persp` hidden after | settles at left 80, top 500, 860×977.5 (4.3); 4.4: roll 3º → 2º (`#fl-h3` → `#fl-h2`, same roll as on the phone) | |
| 4.5–5.0 | — | "2º · ~6 min"; stories row drifting inside the card (Y 1161–1477, bleeding) | |
| 5.0–5.5 | — | 5.2: roll 2º → 1º (`#fl-h2` → `#fl-h1`) | |
| 5.5–6.2 | — | "1º · ~3 min" holds 1.0s (the hold before the result); card drifts y 0 → −14, 4.3–6.2, ease none | L2 and logo hold |

Hero rect on the stage after 4.3 (Y = 500 + y + 2.139·(sy − 56)): live pill Y 519–596, "Você é o" Y 682, numeral Y 729–951, wait pill Y 973–1041, "Enquanto você espera" Y 1092, stories Y 1161–1477.

Frame checks: 3.6 the free hero covers the glass hero with no visible jump (same pixels); 3.9 phone lower than the hero, its screen white where the hero was, no duplicate hero anywhere; 4.3 no phone; 6.2 `.fl-hero` at `y: -14`, `#fl-h1` at full opacity.

### 2 · chamada.html (7.6s): she calls, the call grows out of her card

Rewrite. No phone, no `.cam`, no `.mn-persp`. Sources (`.mn-src`): `#ch-s-read` (`plantao-called reading`), `#ch-s-call` (`plantao-called calling`), `#ch-s-chat` (`call-chat button`).

Elements:
- `.ch-hero`: the same `.mn-win` as fila with one `.scr` (`plantao-queue position-1`, `top: -56px`), `left: 80px; top: 500px`, on frame 0 `y: -14, scale: 2.139`, radius 20 app px, stories row at x −62.
- `.mn-logo`, `.ch-l2` (fila's L2, in place), `.ch-l3`, `.ch-l4` (`.mn-line mn-line--top`).
- `.ch-doc`: `.mn-piece is-card`, `left: 191.5px; top: 440px; width: 220px; height: 288px`, holding two stacked doctor-card clones (`reading` visible, `calling` opacity 0), each offset 5px/4px so the rotated card sits inside the box.
- `.ch-well`: `.mn-piece is-card`, `left: 80px; top: 1300px; width: 370px; height: 194px`, two stacked atendimento-well clones (`reading`, `calling`).
- `.ch-count`: `.mn-piece is-card`, `left: 80px; top: 1160px; width: 370px; height: 60px`, the countdown-well clone.
- `.ch-video`: `position: absolute; overflow: hidden; background: var(--vm-violet-950)`, animated with GSAP `left/top/width/height/borderRadius`. Inside: `<video id="ch-vid" class="clip" src="assets/footage/doutora-call.mp4" muted playsinline data-start="3.7" data-duration="3.9" data-media-start="0" data-track-index="0">` (`width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%`), `.ch-chat` (`.mn-piece`, chat-pill clone, scale 2.6, right 56, top 44), `.ch-pip` (230×300, radius 36, right 56, top 500, `<video id="ch-pat" class="clip" src="assets/footage/paciente-pip.mp4" muted playsinline data-start="3.7" data-duration="3.9" data-media-start="0" data-track-index="1">`, object-fit cover). One `<video>` per source.

Always running: aurora drift (START 6.2). Stories row in `.ch-hero` x −62 → −68 over 0–0.6, ease none.

| Local time | Pieces | Text |
|-----------|--------|------|
| 0.0–0.5 | `.ch-hero` leaves LEFT, 0.1–0.75, power3.in (x 0 → −1000). `.ch-doc` was hidden behind it: from `scale: 1.6` centred on the hero centre (510, 975), z under the hero, it grows to `scale: 2.9` at left 191.5, top 440 (637×833 bounding, centred on x 510), 0.1–0.8, power3.out: the doctor card is uncovered as the queue slides off it | `.ch-l2` and logo exit LEFT at 0.05 (0.35) |
| 0.5–1.0 | `.ch-well` stacks out from behind the doctor card: from `scale: 1.4` at (245, 1000) to `scale: 2.324` at left 80, top 1300 (860×451, bleeding), 0.5–1.1, power3.out. Doctor card: chip "Preparando" at Y 476–568 | L3 rises at 0.5, in by 1.0 |
| 1.0–1.5 | doctor card drifts y 0 → −12, 0.8–2.3, ease none. 1.3: she calls: in `.ch-doc` crossfade reading → calling 0.2s (only the chip differs: "Preparando" → "Chamando você"); in `.ch-well` crossfade reading → calling 0.12s ("Leitura do seu caso" gets its check, "Chamada de vídeo aberta") | L3 holds |
| 1.5–2.3 | hold 1.0s on "Chamando você" with the drift running | L3 holds |
| 2.3–3.0 | `.ch-doc` shrinks to `scale: 2.5` at left 235.5, top 440 (549×718), 2.3–2.9, power3.inOut. `.ch-count` comes out from behind its lower edge: from `scale: 1.5` at (232, 1010) to `scale: 2.324` at left 80, top 1160 (860×139; "Entrando na chamada em 3" baseline band Y 1204–1255), 2.35–2.9, power3.out. `.ch-well` moves down 40px over the same window | L3 holds |
| 3.0–3.5 | countdown: digit 3 → 2 at 3.05, 2 → 1 at 3.4 (see "Countdown") | L3 exits LEFT at 3.4 (0.4) |
| 3.5–4.0 | 3.75: the call opens out of the card. `.ch-video` appears on the doctor card's box (left 235.5, top 440, 549×718, radius 70) and grows 3.75–4.55, power3.inOut, to left 60, top 440, 960×1560, radius 72 (bleeds off the bottom); `.ch-doc` fades under it in 0.25s; `.ch-count` and `.ch-well` are pushed DOWN and out (y +900, 3.75–4.3, power3.in). Footage playing from 3.7 | |
| 4.0–4.5 | video card lands (4.55) | L4 slides in at 4.15, in by 4.7 |
| 4.5–5.0 | `.ch-chat` pops at 4.6 (scale 0.6 → 1 of its 2.6, 0.35), `.ch-pip` pops at 4.75. Inside the card the footage pushes: `#ch-vid` scale 1 → 1.06, 4.55–6.9, ease none | L4 holds |
| 5.0–6.5 | footage live (she talks), PiP live, card drifts y 0 → −24, 4.55–6.9, ease none | L4 holds (4.15–6.8 = 2.65s) |
| 6.5–7.0 | 6.9: exit starts | L4 exits LEFT at 6.8 (0.4) |
| 7.0–7.6 | `.ch-video` x 0 → −760, 6.9–7.6, power3.in: about 3200 px/s on the last frame, right edge at X 260, opacity 1, footage still playing | |

Countdown (3.05, 3.4): preferred, two library states `plantao-called calling-2` / `calling-1` (see Notes) as extra stacked clones swapped in 0.12s. Without them: in the `.ch-count` clone, the element whose own text is "3": `tl.set(digit, { textContent: "2" }, 3.05)`, `"1"` at 3.4, each with a y 10 → 0 roll of 0.15s. Nothing else in the clone is retyped.

Frame checks: 0.0 identical to fila 6.2; 0.4 the doctor card visible to the right of the leaving hero, never an empty stage; 1.6 chip "Chamando você" inside the safe box, well bleeding below; 3.0 doctor card, countdown and well stacked without overlap (card bottom Y 1158, countdown Y 1160–1299, well from Y 1340); 5.5 video card x 60–1020, top 440, chat pill and PiP inside x 80–964; 7.6 right edge of the video card at X 240–280.

### 3 · documentos.html (6.6s): the documents fly out of the chip, one opens

Rewrite; keep the clone helper of the built file. No phone. Source (`.mn-src`): `#dc-s` (`post-consultation ready`).

Elements:
- `.dc-l5` (`.mn-line mn-line--top`).
- `.dc-head`: `.mn-piece` (no shadow, no background), `left: 32.5px; top: 443px; width: 402px; height: 252px`, scale 2.376, header clone. Stage positions: avatar Y 450–640, "Consulta concluída" Y 676–747 (62px), meta pill Y 835–880, chips Y 925–985; "4 documentos" chip centre (321, 955).
- `.dc-resumo`: `.mn-piece is-card`, `left: 80px; top: 1070px; width: 362px; height: 366px`, scale 2.376 (860×870, bleeding): "Resumo" Y 1108–1170, "2 dias de afastamento" pill beside it, Dipirona / Hemograma rows from Y 1426.
- `.dc-stack`: wrapper (inset 0) for the four `.dc-card` (`.mn-piece is-card`, 156×112, scale 2.86 → 446×320) and `.dc-page` (`<img src="assets/docs/receita.png">`, `left: 80px; top: 440px; width: 860px; height: 1215px; border-radius: 28px`, shadow `var(--mn-shadow)`).
- `.mn-tap`, `.mn-tap-ring`.

Card slots (`left`/`top` CSS, scale 2.86): Receita simples (60, 470) · Pedido de exames (520, 560) · Atestado médico (60, 810) · Laudo médico (520, 900). Bottoms 790 / 880 / 1130 / 1220; titles at 40px.

Always running: aurora drift (START 13.8).

| Local time | Pieces | Text |
|-----------|--------|------|
| 0.0–0.5 | push in at the speed the call left: `.dc-head` x 880 → 0, 0–0.9, power3.out; `.dc-resumo` x 1040 → 0, 0.06–1.0, power3.out. Both visible in the right 200px on frame 0. In the header clone the "4 documentos" chip starts at opacity 0, scale 0.6, and "1 remédio" / "1 exame" start at x −57.4 app px (centred as a pair, as in the `preparing` state) | L5 rises at 0.4 |
| 0.5–1.0 | pieces decelerate into place: "Consulta concluída" with the doctor's avatar, Resumo under it | L5 in by 0.9 |
| 1.0–1.5 | 1.1: the documents are signed: "1 remédio" and "1 exame" slide to x 0 (0.35, power3.out) and "4 documentos" pops in (0.35) | L5 holds |
| 1.5–2.0 | 1.6: the four cards fly out of the chip: each `.dc-card` from `scale: 0.6` centred on (321, 955), opacity 0 → 1 in 0.12s, to its slot at scale 2.86, 0.6s power3.out, starts 1.6 / 1.74 / 1.88 / 2.02, rotation −4° → 0. At 1.75 `.dc-head` and `.dc-resumo` leave LEFT (x 0 → −1100, 0.6, power3.in, resumo 0.06 later): the cards stay where the header was | L5 holds |
| 2.0–2.6 | cards land (last at 2.62); header gone by 2.4 | |
| 2.6–3.2 | cards drift up −10 / −16 / −12 / −18px, 2.6–3.55, ease none; tap dot appears at (720, 1320) at 2.9 and glides to the Receita card centre (283, 630), arriving 3.45 | |
| 3.2–3.8 | 3.55: press on "Receita simples". On the press frame the Receita card starts growing (scale 2.86 → 4.4 around its centre, opacity → 0 over 0.3s) and `.dc-page` opens out of it: from `scale: 0.42` centred on (283, 630), opacity 0 → 1 in 0.15s, to scale 1 at left 80, top 440, 3.55–4.2, power3.out. The other three cards tuck behind the page (x toward 300, scale 2.86 → 2.6, 3.55–4.0) | L5 holds |
| 3.8–4.5 | page lands (4.2): header "RECEITA MÉDICA" Y 505–545, "Dra. Camila Rocha" / "Helena Souza" Y 650–700, "Dipirona monoidratada 500 mg" Y 925–965, QR Y 1070–1140 | |
| 4.5–5.5 | page drifts up y 0 → −60, 4.2–5.9, ease none; 4.7–5.2: `.dc-hl`, a `--vm-primary` 12% bar (left 30, width 800, height 84, radius 14, 478px below the page top, child of `.dc-page`'s wrapper so it moves with it), scaleX 0 → 1 from the left over the medication row | L5 holds (0.4–5.85) |
| 5.5–5.9 | hold 0.4 | L5 exits LEFT at 5.85 (0.4) |
| 5.9–6.6 | `.dc-stack` x 0 → −700, 5.9–6.6, power3.in: about 3000 px/s on the last frame, page right edge at X 240, opacity 1 | |

`.dc-page` and `.dc-hl` live in one wrapper `.dc-doc` (left 80, top 440, 860×1215) so scale, drift and exit move both; the tuck and the page share `.dc-stack`.

Frame checks: 0.0 header and Resumo edges visible at the right, moving; 1.5 three chips in one row, centred, inside x 80–940; 2.7 four cards, no header, nothing overlapping the line; 3.55 tap dot centred on the Receita card; 4.3 the page covers the three tucked cards completely; 6.6 page right edge at X 220–260. "R$ 59,90 · pago" is never cloned.

### 4 · especialistas.html (5.5s): marquee rows part for the number

Edit of the built file; rows, pills, speeds and the exit are unchanged (spec kept below). Changes:
1. Aurora START 19 → 20.4.
2. The stat no longer appears while the rows are still parting (cut 2 showed "+6" over a doctor-chip row for a few frames): rows 3–7 part 1.9–2.5 as before; `.mn-plus` pops and `.es-num` rises at **2.5** (not 2.0), count 0 → 40 over **2.55–3.3**, `.es-word` rises at 2.75. Before 2.5 the stat group is opacity 0 and nothing of it is in the DOM flow above the rails. Hold "+40 especialidades" 3.3–4.55.
3. Check at 2.5 and 2.6 that the gap Y 782–1160 holds no pill.

Layout: `.mn-stage`; `.es-rails` (position absolute, inset 0, `mask-image: linear-gradient(90deg, transparent 0, black 90px, black calc(100% - 90px), transparent 100%)`) holding seven `.es-row` strips (flex, gap 28, white-space nowrap, height 132); `.es-l5` (`.mn-line mn-line--top`); stat: `.mn-plus` (shared class, text "+"), `.es-num` (Space Grotesk 500, 230px/1, `--vm-primary`, left 222, top 790), `.es-word` ("especialidades", Space Grotesk 500 72px, ink, left 80, top 1020).

Pill `.es-pill`: white, radius 999, height 132, padding 0 44 0 24, `box-shadow: var(--mn-shadow-soft)`, icon 84×84 (`assets/icons/specialties/<file>.png`) + name 52px DM Sans 500 ink. Doctor chip `.es-doc`: same pill, round photo 100×100 (`assets/people/doctors/<file>.jpg`, object-fit cover) + name 46px DM Sans 500 + specialty 38px `--vm-muted-foreground` on one baseline row separated by " · ".

Specialty names → icon file: Clínica geral `medico` · Cardiologia `cardio` · Dermatologia `derma` · Pediatria `pediatria` · Ginecologia `ginecologia` · Ortopedia `ortopedia` · Neurologia `neurologia` · Psicologia `psicologia` · Endocrinologia `endocrino` · Nutrologia `nutrologista` · Urologia `urologista` · Geriatria `geriatra` · Alergologia `alergia` · Fonoaudiologia `fonoaudiologa`.

| Row | top | Content (14 pills each, in this order, then the same order once more) | Drift LEFT, 0 → 5.5, ease none |
|-----|-----|-----------------------------------------------------------------------|--------------------------------|
| 1 | 480 | Cardiologia, Pediatria, Dermatologia, Psicologia, Ortopedia, Clínica geral, Neurologia, Ginecologia, Endocrinologia, Urologia, Geriatria, Nutrologia, Alergologia, Fonoaudiologia | 150 px/s |
| 2 | 650 | Ginecologia, Neurologia, Clínica geral, Urologia, Cardiologia, Geriatria, Dermatologia, Nutrologia, Pediatria, Alergologia, Psicologia, Fonoaudiologia, Ortopedia, Endocrinologia | 230 px/s |
| 3 | 820 | doctor chips, cycle ×3: "Dra. Camila Rocha · Clínica geral" (`camila-rocha`), "Dr. Rafael Martins · Cardiologia" (`rafael`), "Dra. Mariana Lopes · Dermatologia" (`mariana`), "Dra. Júlia Prado · Pediatria" (`julia`) | 180 px/s |
| 4 | 990 | Psicologia, Endocrinologia, Ortopedia, Cardiologia, Alergologia, Pediatria, Urologia, Clínica geral, Dermatologia, Fonoaudiologia, Ginecologia, Geriatria, Neurologia, Nutrologia | 260 px/s |
| 5 | 1160 | Dermatologia, Geriatria, Nutrologia, Clínica geral, Neurologia, Cardiologia, Fonoaudiologia, Psicologia, Urologia, Ortopedia, Pediatria, Endocrinologia, Ginecologia, Alergologia | 160 px/s |
| 6 | 1330 | order of row 2 reversed | 220 px/s |
| 7 | 1500 | order of row 1 reversed | 190 px/s |

Rows start at left offsets 0, −220, −90, −310, −150, −260, −40 so pills do not align in columns. Each row's own drift never stops or changes speed; every other move is on a wrapper.

Always running: aurora drift (START 20.4); the seven row drifts.

| Local time | Rails | Stat | Text |
|-----------|-------|------|------|
| 0.0–0.5 | `.es-rails` x 880 → 0, 0–0.9, power3.out, rows flowing | hidden | L6 (`.es-l5`) rises at 0.35 |
| 0.5–1.9 | rows flowing at their seven speeds | hidden | L6 holds |
| 1.9–2.5 | rows 3–7 move down 340px (`.es-low`, 1.9–2.5, power3.inOut): gap opens at Y 782–1160 | hidden until the gap is fully open | |
| 2.5–3.3 | flowing | `.mn-plus` pops and `.es-num` rises at 2.5; count 0 → 40 over 2.55–3.3; `.es-word` rises at 2.75 | |
| 3.3–4.55 | flowing | "+40 especialidades" holds; `m.hold` scale 1 → 1.03 | L6 holds |
| 4.55–5.0 | `.es-rails` clip-path `inset(0 0 0 0)` → `inset(0 100% 0 0)` and x 0 → −400, 4.55–5.3, power2.in | `.es-num`, `.es-word` exit LEFT at 4.7 | L6 exits LEFT at 4.55 |
| 5.0–5.5 | last pills leave at 5.3 | `.mn-plus` travels 4.7–5.5, power3.inOut, to centre (510, 700), scale 1; at rest on the last frame | |

Frame checks: 0.0 rows visible in the right 200px, nothing else; 2.5 "+40" reads as one word (tune `.es-num` left so the gap between "+" and "4" equals the gap between "4" and "0"), no pill overlaps the stat; 5.5 only `.mn-plus` on the stage.

### 5 · fim.html (5.6s): the plus becomes the mark, the card fills the frame

Edit of the built file. Unchanged: `.mn-plus` hand-over, the mask-drawn mark, the lockup expansion. Changes: duration 5.5 → 5.6, aurora START 25.9, the block is redistributed over y 300–1250 and the real home tiles close it. Source (`.mn-src`): `#fm-s` (`client-home default`).

Final layout (all centred on x 510):
- `.fm-lockup`: width 700, centre Y 400.
- `.fm-line`: "Cuidado <em>quando você precisa.</em>", Space Grotesk 500 84px/1.04 (80px if the second row passes x 940), two rows, top 560.
- `.fm-pre`: "Consulte já em", DM Sans 500 48px, `--vm-muted-foreground`, top 800.
- `.fm-url`: "vivamais.ai", Space Grotesk 500 124px, `--vm-primary`, top 866; `.fm-rule` 6px under it at Y 1004.
- `.fm-tiles`: `.mn-piece is-card`, `left: 80px; top: 1040px; width: 370px; height: 103px`, scale 2.324 (860×239): the app's own quick-action tiles; icons Y 1070–1190, labels Y 1198–1238.

| Local time | Mark and lockup | Text and tiles |
|-----------|-----------------|----------------|
| 0.0–0.5 | mask stroke-dashoffset 1 → 0, 0–0.9, power2.inOut around the "+"; `.mn-plus` scale 1 → 1.3, 0.15–0.9 | |
| 0.5–1.0 | fill-opacity 0 → 1, 0.6–1.0; `.mn-plus` opacity 1 → 0, 0.6–0.9 | |
| 1.0–1.5 | hold 0.25; 1.25: mark swapped for the clipped lockup, starts expanding | |
| 1.5–2.0 | 1.25–2.0, power3.inOut: lockup 620 wide centred on (510, 700), wordmark uncovered left to right | |
| 2.0–2.5 | 2.0–2.7, power3.inOut: lockup rises to centre Y 400 and grows to 700 wide | `.fm-line` rises at 2.25 |
| 2.5–3.0 | | `.fm-pre` rises at 2.85 |
| 3.0–3.5 | | `.fm-url` rises at 3.0; `.fm-rule` scaleX 0 → 1, 3.3–3.75 |
| 3.5–4.0 | | tiles: the four tile nodes inside the clone (`[aria-label="Agendar consulta"]`, `"Abrir plantão 24h"`, `"Abrir documentos"`, `"Abrir Super IA"`) rise y 40 app px → 0 with opacity, stagger 0.08 from 3.45; the grey tray behind them fades in 3.4–3.7 |
| 4.0–5.6 | `m.hold` on `.fm-block` (everything), scale 1 → 1.035, 3.9–5.6 | opaque to the last frame |

Frame checks: 0.0 identical to especialistas 5.5; 4.2 lockup top above Y 340, tiles' labels above Y 1240, nothing between Y 300 and 1250 left as an empty band taller than 110px.

## Builder rules

- One builder per file; five files; builders overwrite in place (do not delete or rename compositions). "Edit" files: change only what the beat sheet lists. "Rewrite" files: replace the body and timeline, keep the font block and link order.
- Root: `<div id="<id>" class="vm-scene mn-scene" data-composition-id="<id>" data-start="0" data-duration="<dur>" data-width="1080" data-height="1920">`. Links in order: `assets/brand/tokens.css`, `assets/kit/screens.css`, `assets/kit/motion.css`, `assets/screens/screens.css`, `assets/mn.css`.
- Timeline: `document.fonts.ready.then(...)`, `gsap.timeline({ paused: true })`, `VMMotion.create({ root, tl })`, register on `window.__timelines["<id>"]`.
- Library screens: leave markers empty, `npm run sync -- medico-no-app` fills them. Clone nodes after the markers are filled (they are static HTML in the file after sync, so cloning at load is deterministic). Never retype, restyle or recolour a clone; the only allowed writes are opacity, transforms, and the countdown digit fallback. All rects are the fixed numbers in this brief: no `getBoundingClientRect` at runtime.
- Do not edit `assets/mn.css`. Scene CSS goes in the scene `<style>` under the scene id.
- Shared elements pixel-identical on both sides of a match cut: `.fl-hero` / `.ch-hero` at 6.2 (left 80, top 500, `y: -14`, scale 2.139, radius 20 app px, `position-1`, stories row x −62), L2 + logo at 6.2, `.mn-plus` at 25.9. Use `fromTo` with the inherited values on frame 0.
- Push seams (13.8, 20.4): the outgoing piece is at opacity 1 and 200–280px inside the frame on the last frame; the incoming piece is 200px inside and moving on frame 0. No fade, no blur above 4px.
- Every row of every beat sheet is mandatory. No half second anywhere in the film without at least one of: a piece travelling, an in-piece change, footage, or text in motion (the aurora alone does not count).
- Deterministic only. Check: `npm run check -- medico-no-app`; `npm run seams` in the video folder; snapshots with the safe box drawn at 0.0, 1.5, 3.4, 3.7, 4.0, 4.4, 5.3, 6.15, 6.25, 6.6, 7.6, 8.9, 9.6, 10.2, 11.0, 12.5, 13.75, 13.85, 14.8, 15.6, 16.3, 17.3, 17.5, 18.3, 19.5, 20.35, 20.45, 22.9, 23.0, 24.0, 25.85, 25.95, 27.2, 28.6, 30.5.

## Notes

- **Library additions** (optional, fallback in the chamada beat sheet): `plantao-called` states `calling-2` and `calling-1` (auto-enter countdown at 2 and 1; the digit is the `countdown` prop of `components/plantao/CalledTakeover.tsx`). Everything else exists: `plantao-queue position-4|position-3|position-1`, `plantao-queue-countdown position-2`, `plantao-called reading|calling`, `call-chat button`, `post-consultation ready`, `client-home default`.
- **Prescription page**: `assets/docs/receita.png` (1087×1536), copied into this video from `videos/ads/plantao-24h-v2/assets/docs/receita.png`: the real backend PDF template rendered with the same fixture (Dra. Camila Rocha, Helena Souza, Dipirona 500 mg, 11/11/2026). It is tracked in this video, not synced; if it is promoted to the shared `assets/`, map it in `assets.json` under the same path.
- **Fixture copy that shows**: "Espera estimada ~12 / ~9 / ~6 / ~3 min", "Plantão 24h · ao vivo", "CRM SP 123456 · Clínica geral", "Vídeo · 11 de novembro de 2026 · 17 min", "2 dias de afastamento", and on the prescription "CRM 184233 / SP", CPF and e-mail of the fixture patient. The two CRM numbers differ between the app fixture and the PDF fixture; they are never on screen together (chamada vs documentos) and both are below reading size.
- **Type below the 40px floor, by design**: the countdown text (35px: the well is 370 app px wide and must fit 860), the atendimento steps (35px, bleed zone), the header chips (31px), the tiles' labels (28px). Document titles are at 40px, "Consulta concluída" at 62px, the lines at 84px.
- **Doctor**: Dra. Camila Rocha. The queue hero photo and the doctor-card art are the app's own illustrations and show a different woman than the avatar and the footage; this is how the app renders today.
- **Footage**: `doutora-call.mp4`, `paciente-pip.mp4` (Mixkit, credits in `assets/footage/CREDITS.txt`), 3.9s from 0.
- **Kit gaps** (built in-scene): free pieces cloned out of a screen (`.mn-piece`, `.mn-win`, `.mn-src` in `mn.css`), a video card that grows out of another card, marquee rails, the mask-drawn mark.
- **Images to generate**: none.
- **Deviations from house rules**: silent (user's choice); corner logo only in the opener; one tap in the whole film.
- **Open questions for the user**: music bed for the Reels cut; "vivamais.ai" vs store badges on the end card; whether "+40 especialidades" stays; whether the end-card link should pulse.
