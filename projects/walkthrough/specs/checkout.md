# Checkout / Pagar (Pix) / Sucesso — from source (condensed)

Fonts: font-brand=Space Grotesk 700, font-brand-medium=SG 500, font-text=DM Sans 400/500/700. text-base 16/24, text-sm 14/20, text-xs 12/16.
Ink 50 #F9F8FB 100 #F2F1F6 200 #E6E4EC 300 #D2CFDB 400 #A29FB0 500 #726F80 600 #55525F 700 #403D4A 900 #17151E. Violet 50 #F5F0FE 100 #EBE1FD 200 #D6C3FB 300 #BC9CF7 500 #7E3BED 600 #6A24DB 700 #5719B6 800 #451391 950 #22084A. lime #C6FF34. canvas #FAFAFE. danger #EF4444.
entrance(i): FadeInDown 320ms, delay i*60, cubic-bezier(.22,1,.36,1). No Lottie in app.

## LOGIC
- Benefit that COVERS the consultation => total R$ 0,00, NO payment method section, StickyBar "Confirmar consulta" -> sucesso directly (no Pix ever).
- Paid case (no covering benefit) => no sticky bar, "Como você quer pagar?" + method rows; tapping Pix -> pagar?method=pix.
- Discount-type benefit => AmountHeader shows discounted total + struck original + pill "<discount_label> · −R$ x", summary line 2 "<label>  − R$ x". Coupon field disabled with message "Esta consulta já está usando um benefício. Não é permitido combinar benefício com cupom."

## checkout/index — shell SafeArea bg #FAFAFE; ScrollView padding 20, paddingBottom 48 (paid) / 140 (free)
1 CheckoutHeader: row center. Back 44x44 circle bg #F2F1F6, lucide ChevronLeft 22 #17151E. Title "Pagamento" ml 12, SG500 22/28 ls -.22 #17151E.
2 AmountHeader mt 20: card radius 20 bg #22084A padding 20.
  - "Total a pagar" DM500 13 #D6C3FB
  - amount row mt 4, baseline, col-gap 10: total SG500 36/42 ls -.5 #fff ("R$ 89,90"); StruckOriginal (only if total<consultation) DM400 15 #BC9CF7 line-through.
  - SavingsPills mt 12 gap 6: pill padding 5x10 radius 999 bg rgba(255,255,255,.14) DM500 12 #fff, text "<label> · −R$ 17,98". (coupon pill bg #C6FF34 text #17151E)
  - divider mt 20 border-top 1 rgba(255,255,255,.12) pt 16, row: DoctorAvatar 40x40 radius 12 (photo cover); col ml 12: name DM700 15 #fff; SpecialtyLine row gap 6: cardio.png 16x16 opacity .9 + "Cardiologia" DM500 13 #D6C3FB; schedule mt 2 DM400 13 #D6C3FB "seg, 14 set · 16:00 – 16:50 · Online" (en dash between times, middots).
3 OrderSummaryCard mt 12: bg #fff radius 20 padding 20, no border.
  - lines gap 10, row space-between: "Consulta" DM400 15 #726F80 | "R$ 89,90" DM500 15 #17151E; discount line "<label>" | "− R$ 17,98".
  - divider h1 #E6E4EC mt 16 mb 8
  - Expandable header py 12: "Tem um cupom?" DM700 18 #17151E + ChevronDown 20 #726F80 (collapsed by default).
4 (paid only) "Como você quer pagar?" mt 28 DM700 15 #17151E; list mt 10 gap 10; rows: bg #fff radius 18 padding 16x18 row center; title DM700 16 #17151E "Pix"/"Cartão de crédito"; subtitle mt 2 DM400 13 #726F80 "Aprovação em segundos"/"Aprovação imediata"; card row mt 10 BrandGlyphs 32x22 radius 5 border 1 #E6E4EC DM700 9 #403D4A VISA MC ELO; right pill 30x30 circle bg #F9F8FB ChevronRight 16 #403D4A.
5 (free only) StickyBar: abs bottom, bg #fff padding 12 20 34, shadow 0 -8 24 rgba(23,21,30,.1), PillButton primary "Confirmar consulta".

## checkout/pagar (Pix) — PayScreenLayout: SafeArea #FAFAFE, ScrollView padding 20 pb 150, sticky CTA when cta!=null
1 CheckoutHeader title "Pagar com Pix".
2 AmountHeader mt 20 (same; no pills unless discount).
3 Panel mt 16:
  Phase A (before): PixSteps panel bg #fff radius 20 padding 20. PanelTitle mb 16 "Como funciona" DM700 16 #17151E. steps gap 14 row flex-start: badge 24x24 circle bg #F5F0FE DM700 12 #5719B6 "1/2/3"; text ml 12 DM400 15/22 #403D4A:
    1 "Toque em Gerar Pix para criar o código." 2 "Pague pelo app do seu banco: QR code ou copia e cola." 3 "A consulta é confirmada assim que o banco avisar. Leva segundos."
    Sticky CTA PillButton primary "Gerar Pix".
  Phase B generating: same panel, CTA loading spinner 18 white + label (stays violet).
  Phase C pix ready: NO sticky bar. PixPanel: align center bg #fff radius 20 padding 24.
    - QR wrapper bg #fff padding 12; QR 220x220 (fg #17151E) => 244 footprint
    - "Código válido por" mt 20 DM400 13 #726F80
    - countdown SG500 22/28 ls -.22 #17151E "MM:SS" starts 15:00 ticking 1s
    - buttons mt 20 row gap 10 each flex 1: ghost "Copiar código" (-> "Copiado" 2s) | ghost "Já paguei"
    - waiting row mt 16 center: WaitingDot 7x7 circle #C6FF34 pulsing opacity 1->.3 700ms; "Aguardando pagamento…" ml 8 DM400 14/20 #726F80
  Phase E confirmed: no in-place state; haptic + router.replace -> sucesso.
CTA labels: pix "Gerar Pix"; card "Pagar R$ 89,90".

## checkout/sucesso — SafeArea #FAFAFE all edges; ScrollView px 24 pt 24 pb 28 gap 28
1 Hero center: ConfirmationMark 112x112 box: pulse ring 96 border 2 #BC9CF7 (opacity .45->0 scale .9->1.3); disc 96 circle #EBE1FD; inner 72 circle #7E3BED (in: opacity0 scale.8 y+6 -> 1 over 360ms delay 320); lucide Check 36 #fff stroke 2.8.
  - eyebrow mt 16 DM700 12 uppercase ls .1em #5719B6 "AGENDAMENTO CONFIRMADO"
  - title mt 8 center SG700 32/38 ls -.7 #17151E "Sua consulta está marcada."
  - subtitle mt 12 center DM400 16/24 #726F80 "Agora, vamos preparar seu atendimento."
2 Summary card radius 24 bg #fff padding 20 border 1 #F2F1F6:
  - row gap 12: Avatar 48 circle (photo) ; name DM700 18/24 #17151E; specialty mt 4 DM400 14/20 #726F80 "Cardiologia"
  - divider h1 #F2F1F6 my 20
  - rows gap 16, each row gap 12: CalendarDays 20 #5719B6 + "seg, 14 set" DM500 17 #17151E; Clock3 20 #5719B6 + "16:00 às 16:50" DM500 17; Video 20 #5719B6 + "Online, pelo aplicativo" DM400 16/24 #55525F
3 block gap 8 left: eyebrow "ANTES DA CONSULTA" DM700 12 uppercase #5719B6; "Conte como você está" SG500 22/28 #17151E; "Responda à anamnese para o médico conhecer seus sintomas antes do atendimento." DM400 16/24 #726F80
4 bottom (normal flow, no bar): px 24 pt 12 pb 12: PillButton primary "Preencher anamnese"; secondary mt 8 min-h 44 center DM500 15 #55525F "Fazer isso depois".

## Primitives
PillButton: h 52 radius 999 px 24 row center; label DM500 16/24 1 line; press scale .98 110ms; primary bg #7E3BED (pressed #6A24DB) text #fff; ghost bg #fff border 1 #E6E4EC text #5719B6; disabled bg #F2F1F6 text #A29FB0. Spinner 18 stroke 2.4 arc .28, rotates 720ms.
StickyBar: abs bottom bg #fff px 20 pt 12 pb 34 shadow 0 -8 24 rgba(23,21,30,.1).
FailureBanner: radius 16 bg rgba(239,68,68,.08) padding 14x16 AlertCircle 18 #EF4444 + DM400 14/20 #17151E ml 12.
Monogram: dark: transparent bg, text #D6C3FB; light: bg #D6C3FB text #451391; SG700 size*0.38.
IllustrationSlot map: ILL-01 form-sheet-empty, ILL-02 form-sheet-complete, ILL-08 optional-skip-attach, ILL-09 handoff-sheet, ILL-10 anamnese-pen-rest, search-empty empty-next-day, slots-empty empty-time-chips, search-error, slots-error, docs-empty, consultas-empty, ai-empty, pharmacies-empty (all .webp, contain).
