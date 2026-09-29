I could not write files (read-only mode), so here are the four specs in full. Save them to `/Users/legacyn/www/vivamais/vivamais-walkthrough-video/specs/`.

---

# Shared token resolution (applies to all 4 specs)

Source: `/Users/legacyn/www/vivamais/vivamaisa-app/src/theme/tokens.json`, `/Users/legacyn/www/vivamais/vivamaisa-app/src/theme/colors.ts`, `/Users/legacyn/www/vivamais/vivamaisa-app/tailwind.config.js`

- **Font families** (NativeWind `fontFamily` from tokens `type.*.family`)
  - `font-brand` → `SpaceGrotesk_700Bold` → Space Grotesk 700
  - `font-brand-medium` → `SpaceGrotesk_500Medium` → Space Grotesk 500
  - `font-text` → `DMSans_400Regular` → DM Sans 400
  - `font-text-medium` → `DMSans_500Medium` → DM Sans 500
  - `font-text-bold` → `DMSans_700Bold` → DM Sans 700
- **Palette hexes used below**
  - ink: 50 `#F9F8FB`, 100 `#F2F1F6`, 200 `#E6E4EC`, 300 `#D2CFDB`, 400 `#A29FB0`, 500 `#726F80`, 600 `#55525F`, 700 `#403D4A`, 900 `#17151E`
  - violet: 50 `#F5F0FE`, 100 `#EBE1FD`, 200 `#D6C3FB`, 300 `#BC9CF7`, 500 `#7E3BED`, 600 `#6A24DB`, 700 `#5719B6`, 800 `#451391`, 950 `#22084A`
  - lime.400 `#C6FF34`; white `#FFFFFF`; canvas `#FAFAFE`; danger `#EF4444`
  - Role map (theme.light): `background`→canvas `#FAFAFE`; `foreground`→`#17151E`; `card`→`#FFFFFF`; `muted`→ink.100 `#F2F1F6`; `mutedForeground`→ink.500 `#726F80`; `border`→ink.200 `#E6E4EC`; `primary`→violet.500 `#7E3BED`; `destructive`→`#EF4444`
- **Tailwind text sizes used**: `text-base` 16px/24px, `text-sm` 14px/20px, `text-xs` 12px/16px. Arbitrary `text-[Npx]` sets fontSize only (no lineHeight) unless a `leading-*` is present — in HTML use `line-height: normal` (~1.2–1.3×) for those.
- **Default `Text` variant** (`src/components/nativewindui/Text.tsx`) is `body` = `text-[17px] leading-6` + `text-foreground`; every checkout usage overrides size/color via className, so the default only matters for `text-foreground` `#17151E` when no color class is given.
- **`borderCurve: 'continuous'`** appears everywhere → in HTML approximate with standard `border-radius` (iOS squircle; no CSS equivalent).
- **`formatBRL`** = `Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'})` → `R$ 89,90` / `R$ 0,00`. Note the separator is a non-breaking space (U+00A0) in modern ICU: `R$\u00A089,90`.
- **`formatCurrency`** (CouponField) comes from `src/components/payments/consultation-payment.utils`.
- **Entrance animation** (`src/theme/motion.ts` `entrance(index)`): `FadeInDown`, duration 320ms, delay `index * 60ms`, easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- **No Lottie anywhere in the repo** (`grep -rln lottie src` → 0 hits). All motion is Reanimated + SVG.

---

# specs/checkout-index.md — `src/app/(client)/checkout/index.tsx`

## Data / logic facts (read, not guessed)

- File: `/Users/legacyn/www/vivamais/vivamaisa-app/src/app/(client)/checkout/index.tsx` renders `CheckoutScreen` with `lineLabel="Consulta"`, `confirmLabel="Confirmar consulta"`, `methods = availableMethods({walletAvailable, companyCreditAvailable})`, `ready = totals.resolved`.
- Totals come from `checkoutTotals(quote.summary, price.amount)` in `/Users/legacyn/www/vivamais/vivamaisa-app/src/lib/checkout-summary.ts`. Server quote fields map: `consultation = base_amount`, `discount = discount_amount` (when `discount_source !== 'none'`), `discountLabel = discount_label`, `couponCode = applied_coupon.code` only when `discount_source === 'coupon'` (so **null for a benefit**), `subtotal = subtotal_after_discount`, `total = remaining_amount`.
- Benefit is matched in `useCheckoutSession` via `matchDoctorBenefit(doctor, profile.signature.signature_type.benefits)` and sent to the quote as `benefit: benefitId`. When a benefit is sent, `couponBlocked = true` → `couponFieldState(true)` = `{enabled:false, message: COUPON_BENEFIT_CONFLICT_MESSAGE}` and `appliedCode` is forced to `null`.
- **Benefit-covered case: `total` is `R$ 0,00`.** `isFreeCheckout(totals)` = `resolved && total <= 0 && walletApplied <= 0` → **true**.
  - → `CheckoutScreen` **removes the entire "Como você quer pagar?" section and PaymentMethodList** (`{free ? null : (...)}`). There is **no payment-method step at all**.
  - → A `StickyBar` appears at the bottom with one `PillButton variant="primary"` labelled **“Confirmar consulta”**.
  - → ScrollView `paddingBottom` becomes **140** (vs 48 when not free).
  - → Pressing it calls `submitFree()`; on success it `router.replace`s to `/(client)/checkout/sucesso`. It never navigates to `pagar.tsx`.
- **Non-benefit case (pay R$ 89,90 by Pix)**: `free=false` → no StickyBar, ScrollView `paddingBottom: 48`, the method list is shown; tapping “Pix” does `router.push('/(client)/checkout/pagar', { method: 'pix' })`.

## Screen shell

- `SafeAreaView` — `flex:1`, `backgroundColor #FAFAFE`, edges `top|left|right` (bottom NOT inset).
- `ScrollView` contentContainer — `padding: 20px` all sides; `paddingBottom: 140` (benefit/free) or `48` (paid); no scroll indicator.

## Element tree — top to bottom

1. **CheckoutHeader** (`src/components/checkout/CheckoutHeader.tsx`) — row, `align-items:center`
   - Back button `Pressable`: 44×44 px (`h-11 w-11`), `border-radius: 22px`, background `#F2F1F6` (`bg-ink-100`), pressed background `#E6E4EC`; content centered; hitSlop 8; a11y label `Voltar`.
     - lucide **`ChevronLeft`**, size **22**, color `#17151E`, default strokeWidth 2.
   - Title `Text`: **“Pagamento”**, `margin-left: 12px` (`ml-3`), `flex:1`, font **Space Grotesk 500** (`font-brand-medium`), `font-size: 22px`, `line-height: 28px`, `letter-spacing: -0.22px`, color `#17151E`.
2. *(notice slot — `undefined` on this screen, renders nothing)*
3. **AmountHeader** wrapper — `margin-top: 20px`, entrance delay 0ms.
   - Card `View`: `border-radius: 20px`, background **`#22084A`** (violet.950), `padding: 20px`.
     - a. Label `Text`: **“Total a pagar”** — DM Sans 500, 13px, color `#D6C3FB` (`text-violet-200`).
     - b. Amount row — `margin-top: 4px` (`mt-1`), `flex-direction: row`, `flex-wrap: wrap`, `align-items: baseline`, `column-gap: 10px`. (Rendered only when `totals.resolved`; otherwise a `SkeletonBox` 140×34, radius 10, `#e8e8ed`, pulsing opacity 0.3↔0.7 @800ms, with `margin-top: 8px`.)
       - Big total `Text`: **Space Grotesk 500** (`font-brand-medium`), `font-size: 36px`, `line-height: 42px`, `letter-spacing: -0.5px`, color `#FFFFFF`.
         - Benefit case copy: **`R$ 0,00`**
         - Pix/paid case copy: **`R$ 89,90`**
       - `StruckOriginal` (`SavingsPills.tsx`) — rendered only if `showsOriginalPrice` = `resolved && total < consultation`.
         - **Benefit case: shown.** Copy **`R$ 89,90`**, DM Sans 400, 15px, color `#BC9CF7` (`text-violet-300` for tone `dark`), `text-decoration: line-through`.
         - **Paid Pix case: not rendered** (total === consultation).
     - c. `SavingsPills` — `flex-row flex-wrap`, `gap: 6px`, `margin-top: 12px`. Returns `null` when `savingsPills(totals).length === 0`.
       - **Benefit case: exactly one pill** (discount>0, walletApplied=0). `key: 'discount'`, `isCoupon: false` (couponCode is null for benefits).
         - Pill box: `padding: 5px 10px`, `border-radius: 999px`, background **`rgba(255,255,255,0.14)`** (tone dark, non-coupon).
         - Pill text: DM Sans 500, 12px, color `#FFFFFF`; copy = `` `${discountLabel} · −${formatBRL(discount)}` `` → e.g. **`Benefício do plano · −R$ 89,90`** (the label string is `discount_label` from the API; falls back to `Desconto` if the server sends null).
         - (If it were a coupon: background `#C6FF34` lime.400, text color `#17151E`.)
       - **Paid Pix case: no pills at all.**
     - d. Divider + subject row — `margin-top: 20px` (`mt-5`), `border-top: 1px solid rgba(255,255,255,0.12)`, `padding-top: 16px`, `flex-row`, `align-items: center`. Children = `DoctorSubject`:
       - `DoctorAvatar` — 40×40, `border-radius: 12px`, tone dark.
         - With `avatar_url`: `expo-image` cover, 160ms fade-in, clipped to the 12px radius.
         - Fallback `Monogram` (tone dark): 40×40, radius 12, background **transparent**, centered initials (first + last word initial, uppercase, titles `dr/dra/sr/sra` stripped), font **Space Grotesk 700** (`font-brand`), `font-size: round(40*0.38) = 15px`, color `#D6C3FB`.
       - Text column — `margin-left: 12px`, `flex:1`
         - Doctor name `Text`, 1 line, DM Sans 700, 15px, color `#FFFFFF`.
         - `SpecialtyLine` (tone `dark`, size `sm`) — row, `gap: 6px`
           - Icon: for **Cardiologia** `getSpecialtyImage` returns `assets/icons/cardio.png` → `<Image>` 16×16, `contentFit: contain`, `opacity: 0.9`. (If no match: lucide `Stethoscope` size 14, color `#D6C3FB`.)
           - Name `Text`, 1 line, `flex-shrink:1`, DM Sans 500, 13px, color `#D6C3FB`. Copy: **`Cardiologia`**.
         - Schedule `Text`, 1 line, `margin-top: 2px` (`mt-0.5`), DM Sans 400, 13px, color `#D6C3FB`.
           - Built by `scheduleLine()` in `src/lib/checkout-schedule.ts`: `` `${formatDayLabel(date)} · ${start} – ${end} · ${attendanceLabel}` ``
           - `formatDayLabel` = date-fns `format(date, 'EEEEEE, d MMM', {locale: ptBR})` with all `.` stripped → e.g. `qua, 17 set`.
           - Separator between times is an **en dash `–`**; the outer separators are **middle dots `·`**; attendance label is **`Online`** (or `Presencial`).
           - Example verbatim: **`qua, 17 set · 14:00 – 14:50 · Online`** (end time defaults to start + `slotMaxDuration` or +50 min).
4. **OrderSummaryCard** wrapper — `margin-top: 12px`, entrance delay 60ms. (`src/components/checkout/OrderSummaryCard.tsx`)
   - Card: background `#FFFFFF`, `border-radius: 20px`, `padding: 20px`, no border, no shadow.
     - a. Quote-error block — only when `quote.errorMessage !== null`; `margin-bottom: 16px`, `align-items: flex-start`.
       - `Text` DM Sans 400, 14px/20px, color `#726F80`. Copy for consultations: **`Não foi possível calcular o valor da consulta.`**
       - `margin-top: 12px` → `PillButton variant="ghost"` label **`Tentar de novo`**.
     - b. Lines container — `gap: 10px`
       - Line 1 (always): row, space-between
         - Left `Text`, 1 line, `margin-right: 12px`, `flex:1`, DM Sans 400, 15px, color `#726F80`. Copy: **`Consulta`**.
         - Right amount: DM Sans 500, 15px, color `#17151E` → **`R$ 89,90`** in both cases (this is `totals.consultation`, the pre-discount price). If unresolved: `SkeletonBox` 78×16 radius 8.
       - Line 2 — only when `totals.discount > 0` → **benefit case only**
         - Left cluster (`flex:1`, `margin-right:12px`, row, center):
           - `Text` shrink, 1 line, DM Sans 400, 15px, color `#726F80`; copy = `totals.discountLabel ?? 'Benefício'` → e.g. **`Benefício do plano`** (literal fallback string in code: **`Benefício`**).
           - Coupon chip: **not rendered for a benefit** (`couponCode === null`). For a coupon it would be: `margin-left: 8px`, `border-radius: 9999px`, background `#C6FF34`, `padding: 2px 8px`, text DM Sans 500, 11px, color `#17151E`.
         - Right amount: DM Sans 500, 15px, `#17151E`; copy = `` `− ${formatBRL(discount)}` `` — **U+2212 MINUS SIGN followed by a normal space** → **`− R$ 89,90`**.
       - Line 3 — only when `totals.walletApplied > 0` (neither of our two cases): left `Saldo Viva`, right `− R$ x,xx`.
     - c. Divider: `height: 1px`, background `#E6E4EC`, `margin-top: 16px`, `margin-bottom: 8px`.
     - d. **`Expandable`** (`src/components/booking/Expandable.tsx`), `defaultOpen = false`
       - Header `Pressable`: row, space-between, `padding-top/bottom: 12px`
         - Title `Text`: **“Tem um cupom?”**, DM Sans 700, 18px, color `#17151E`.
         - lucide **`ChevronDown`**, size **20**, color `#726F80`; rotates 0deg→180deg over 320ms `cubic-bezier(0.22,1,0.36,1)` when opened.
       - Body: animated `height: 0 → contentHeight`, `opacity: 0 → 1`, `overflow: hidden`. Collapsed by default, so on first render the coupon UI is **not visible**.
       - Body content = **CouponField** (`src/components/checkout/CouponField.tsx`), wrapper `margin-bottom: 16px`:
         - Label row — `margin-bottom: 8px`, row, center
           - lucide **`Tag`**, size **14**, color `#7E3BED` (`colors.primary`).
           - `Text` `margin-left: 8px`, DM Sans 500, 12px/16px, color `#17151E` (`text-foreground`). Copy: **“Cupom de desconto”**.
         - No applied code → input row, `gap: 8px`:
           - `TextInput` `flex:1`, background `rgba(242,241,246,0.3)` (`bg-muted/30`), `border: 1px solid rgba(230,228,236,0.6)` (`border-border/60`), `border-radius: 12px` (`rounded-xl`), `padding: 12px 16px`, text color `#17151E`, `font-size: 14px/20px` (`text-sm`); placeholder **“Digite seu cupom”** color `#9ca3af`; auto-uppercases input; `opacity: 0.5` when `state.enabled === false`.
           - Apply `Pressable`: `min-height: 44px`, centered, `border-radius: 12px`, `padding-left/right: 20px`, background `#7E3BED`; `opacity: 0.4` when disabled/empty/applying. Label `Text` DM Sans 700, 14px, `#FFFFFF`: **“Aplicar”**. While applying: `Spinner` size 18, color `#FFFFFF`.
         - Applied code state: row space-between, `border-radius: 12px`, `border: 1px solid rgba(126,59,237,0.2)`, background `rgba(126,59,237,0.05)`, `padding: 12px 16px`; code `Text` DM Sans 700, 14px, `#7E3BED`; sub-line (only when the discount source is a coupon) `margin-top: 2px`, DM Sans 500, 12px, `#726F80`, copy `` `${discountLabel ?? 'Desconto aplicado'} · - ${formatCurrency(discountAmount)}` ``; remove button 36×36 (`h-9 w-9`) circle, background `rgba(242,241,246,0.5)`, `margin-left: 12px`, lucide **`X`** size **16** color `#726F80`, a11y label `Remover cupom`.
         - **Benefit case disabled message** (`state.enabled === false` and `state.message`): `margin-top: 8px`, DM Sans 500, 12px, color `#726F80`. Verbatim (`COUPON_BENEFIT_CONFLICT_MESSAGE`): **“Esta consulta já está usando um benefício. Não é permitido combinar benefício com cupom.”** The input and the Aplicar button are both at `opacity: 0.5` / `0.4` and non-editable.
         - Error line: `margin-top: 8px`, DM Sans 500, 12px, color `#EF4444`. Generic copy: **“Não foi possível aplicar o cupom.”**
   - `note` prop — **not passed by this screen**, so the `mt-3 px-1 font-text text-[13px] leading-5 text-ink-500` note line does not render.
5. **Payment method section** — `{free ? null : ...}` (entrance delay 120ms)
   - **BENEFIT CASE: absent entirely.**
   - **PAID/PIX CASE:**
     - Heading `Text`: **“Como você quer pagar?”**, `margin-top: 28px` (`mt-7`), DM Sans 700, 15px, color `#17151E`.
     - List wrapper: `margin-top: 10px`, `opacity: ready ? 1 : 0.5`.
     - `PaymentMethodList` — `gap: 10px` vertical; order from `PAYMENT_METHOD_ORDER` filtered by availability: `pix`, `card`, then `wallet` (only if wallet coverage ≠ none), then `company_credit` (only if credit ≥ total). For a plain R$ 89,90 consultation with no wallet/credit: **two rows, “Pix” then “Cartão de crédito”.**
       - Each row `Pressable`: background `#FFFFFF`, pressed `#F9F8FB`, `border-radius: 18px`, `overflow: hidden`, `padding: 16px 18px`, row, center.
         - Left column `flex:1`
           - Title DM Sans 700, 16px, `#17151E` — **`Pix`** / **`Cartão de crédito`** / `Saldo Viva` / `Crédito da empresa`.
           - Subtitle `margin-top: 2px`, DM Sans 400, 13px, `#726F80` — **`Aprovação em segundos`** (pix) / **`Aprovação imediata`** (card) / `Use o crédito da sua conta` / `Use o limite do seu benefício`.
           - Card row only: `margin-top: 10px` → `BrandGlyphs` row `gap: 6px`, three boxes 32×22, `border-radius: 5px`, `border: 1px solid #E6E4EC`, background `#FFFFFF`, centered text DM Sans 700, 9px, color `#403D4A`, copy **`VISA`**, **`MC`**, **`ELO`**.
         - Right chevron pill: `margin-left: 12px`, 30×30, `border-radius: 15px`, background `#F9F8FB` (ink.50); lucide **`ChevronRight`**, size **16**, color `#403D4A`.
       - Tap → `haptic.select()` then `router.push('/(client)/checkout/pagar?method=pix')`.
6. **StickyBar** — `{free ? <StickyBar>… : null}` → **benefit case only** (`src/components/booking/StickyBar.tsx`)
   - Absolute, `left/right/bottom: 0`, background `#FFFFFF`, `padding: 12px 20px`, `padding-bottom: max(safeAreaBottom, 16)` (34px on a notched iPhone), shadow `0 -8px 24px rgba(23,21,30,0.10)`, elevation 12.
   - Optional `FailureBanner` above the button with `margin-bottom: 12px` (only after a failed submit).
   - `PillButton variant="primary"` label **“Confirmar consulta”**, `disabled = !canConfirm || submitting`, `loading = submitting`. See spec 4 for PillButton geometry.

---

# specs/checkout-pagar.md — `src/app/(client)/checkout/pagar.tsx` (Pix)

File: `/Users/legacyn/www/vivamais/vivamaisa-app/src/app/(client)/checkout/pagar.tsx`. Entered with `?method=pix`. Only reachable when the consultation is **not** benefit-covered (total R$ 89,90).

## Shell — `PayScreenLayout` (`src/components/checkout/PayScreenLayout.tsx`)

- `SafeAreaView` `flex:1`, background `#FAFAFE`, edges `top|left|right`.
- `KeyboardAvoidingView` `flex:1`, iOS behavior `padding`.
- `ScrollView` contentContainer `padding: 20px`, **`paddingBottom: 150`** (constant, regardless of CTA presence).
- Sticky CTA bar rendered only when `cta !== null`.

## Element tree

1. **CheckoutHeader** — identical geometry to spec 1. Title = `PAYMENT_METHOD_COPY.pix.screenTitle` = **“Pagar com Pix”** (Space Grotesk 500, 22/28, −0.22px, `#17151E`); back chevron as above.
2. *(notice slot — not passed, nothing renders)*
3. **AmountHeader** — `margin-top: 20px`, entrance delay 0ms. Same component as spec 1.
   - “Total a pagar” label, then big amount **`R$ 89,90`** (Space Grotesk 500, 36/42, −0.5px, `#FFFFFF`).
   - No `StruckOriginal` (total === consultation), **no SavingsPills**.
   - Divider + `DoctorSubject` (Cardiologia line + `qua, 17 set · 14:00 – 14:50 · Online`), exactly as spec 1.
4. **Panel slot** — `margin-top: 16px`, entrance delay 60ms. Content depends on phase:

### Phase A — before “Gerar Pix” (`phase.kind === 'choose'`, `pixView === null`)

Panel = **`PixSteps`** (`src/components/checkout/PixSteps.tsx`), style `PANEL` = background `#FFFFFF`, `border-radius: 20px`, `padding: 20px`.
- `PanelTitle` — row, space-between, `margin-bottom: 16px`; title `Text` DM Sans 700, 16px, `#17151E`: **“Como funciona”**. (No caption here; caption slot would be `margin-left: 12px`, DM Sans 400, 13px, `#A29FB0`.)
- Steps list, `gap: 14px`, each row `align-items: flex-start`:
  - Index badge: 24×24, `border-radius: 12px`, background `#F5F0FE` (violet.50), centered `Text` DM Sans 700, 12px, color `#5719B6` — `1`, `2`, `3`.
  - Step `Text`: `margin-left: 12px`, `flex:1`, DM Sans 400, `font-size: 15px`, `line-height: 22px`, color `#403D4A`.
  - Verbatim copy (`SCHEDULED_PIX_STEPS` in pagar.tsx):
    1. **“Toque em Gerar Pix para criar o código.”**
    2. **“Pague pelo app do seu banco: QR code ou copia e cola.”**
    3. **“A consulta é confirmada assim que o banco avisar. Leva segundos.”**

CTA (sticky bar, since `pixView === null && !walletSplit`):
- Label = `ctaLabel('pix', totals)` → **“Gerar Pix”** (pix branch wins before the amount branch).
- `disabled = quote.isFetching || !totals.resolved || isSubmitting` ; `loading = isSubmitting` (false here).
- `failure` = null initially.

### Phase B — generating (`phase.kind === 'submitting'`, method pix, `pixTicket` still null)

- Panel is **still `PixSteps`** (unchanged) — the screen does not swap to a loading panel.
- CTA `PillButton`: same label **“Gerar Pix”**, `disabled = true`, `loading = true` → inline `Spinner` size 18, color `#FFFFFF`, strokeWidth 2.4, with `margin-right: 10px` (`ml-2.5` on the label) before the label. Surface stays `bg-violet-500 #7E3BED` (disabled prop is false; only `loading` is true, so it does **not** turn grey).
- If the request fails: `FailureBanner` appears inside the sticky bar above the button, `margin-bottom: 12px` (see spec 4), with the API error message.

### Phase C — Pix ready (`phase.kind === 'pix'`, not expired)

- **The sticky CTA bar disappears entirely** (`pixView !== null` → `cta: null`). The only actions are inside the panel.
- Panel = **`PixPanel`** (`src/components/checkout/PixPanel.tsx`): `align-items: center`, background `#FFFFFF`, `border-radius: 20px`, **`padding: 24px`**.
  1. QR wrapper `View`: background `#FFFFFF`, `padding: 12px` (so a 12px white quiet zone around the code).
     - If `qrImage` (base64 PNG from the API) is present: `expo-image` `source = data:image/png;base64,…`, **`width: 220px, height: 220px`**, `contentFit: 'contain'`.
     - Else: `react-native-qrcode-svg` `size={220}`, foreground `#17151E`, background `#FFFFFF`.
     - **Total QR block footprint: 244×244 px.**
  2. Caption `Text`: `margin-top: 20px` (`mt-5`), DM Sans 400, 13px, color `#726F80` — **“Código válido por”**.
  3. Countdown `Text`: **Space Grotesk 500** (`font-brand-medium`), `font-size: 22px`, `line-height: 28px`, `letter-spacing: -0.22px`, color `#17151E`. No top margin (sits directly under the caption).
     - Format = `formatCountdown(remainingMs(expiresAt, now))` = **`MM:SS`, both parts zero-padded to 2 digits** (e.g. `14:59`, `04:07`, `00:09`). Ticks every 1000 ms via `setInterval`. Window = `PIX_WINDOW_MS` 15 min, capped by the server `expirationDate` → starts at **`15:00`** or lower.
  4. Button row: `margin-top: 20px` (`mt-5`), `width: 100%`, row, `gap: 10px`; each child `flex:1` (two equal halves).
     - Left `PillButton variant="ghost"` — label **“Copiar código”**; after tap it copies the Pix payload to the clipboard, fires `haptic.select()`, and the label becomes **“Copiado”** for exactly **2000 ms**, then reverts. No spinner.
     - Right `PillButton variant="ghost"` — label **“Já paguei”**; rendered only when `onCheckPayment` is provided (it is, once `pollRef` exists). While the check is in flight, `loading = true` → spinner size 18, color `#5719B6` (violet.700, the ghost spinner color), label stays “Já paguei”.
  5. Check-result notice (only after a non-confirmed “Já paguei”): `margin-top: 12px`, `text-align: center`, DM Sans 400, 13px, `#726F80`. Verbatim (`CHECK_NOTICE`):
     - pending → **“Pagamento ainda não confirmado. Se você acabou de pagar, aguarde alguns segundos.”**
     - declined → **“Este Pix não está mais ativo. Gere um novo código.”**
     - error → **“Não foi possível verificar o pagamento. Tente de novo.”**
  6. Waiting row: `margin-top: 16px` (`mt-4`), row, center
     - `WaitingDot`: 7×7, `border-radius: 3.5px`, background **`#C6FF34`** (lime.400); opacity pulses 1 → 0.3 → 1, each leg 700 ms, easing `cubic-bezier(0.45,0,0.55,1)`, infinite (static opacity 1 under reduced motion).
     - `Text` `margin-left: 8px`, DM Sans 400, `14px/20px` (`text-sm`), color `#726F80` — **“Aguardando pagamento…”** (single-character ellipsis U+2026).
- Background polling: `pollPayment` every 5000 ms (`PIX_POLL_INTERVAL_MS`) until `expiresAt`; also re-checks whenever the app returns to `active`.

### Phase D — expired (`isPixExpired`)

Same white panel + same 220px QR still on screen, then instead of the countdown block:
- `Text` `margin-top: 20px`, DM Sans 700, 18px, `#17151E`:
  - if the underlying charge is still alive (`chargeExpiresAt > now` → `renewable`): **“O tempo para pagar acabou”**
  - else: **“Código expirou”**
- Renewable only — `Text` `margin-top: 4px`, centered, DM Sans 400, 13px, `#726F80`: **“Este mesmo código ainda vale. Reabra para pagar sem gerar outra cobrança.”**
- `View` `margin-top: 16px`, `width: 100%` → `PillButton variant="primary"`, label **“Reabrir código”** (renewable) or **“Gerar novo Pix”**, `loading = regenerating`.

### Phase E — confirmed

No confirmed state is rendered on this screen. On `status === 'confirmed'` (poll, AppState resume, or “Já paguei”) it fires `haptic.success()`, stores `consultationId`, and immediately `router.replace`s to `/(client)/checkout/sucesso?consultationId=…`. The hand-off is a screen replacement, not an in-place state.

### Failure state (Pix dead)

`dispatch({type:'failed', message: PIX_DEAD})` → panel reverts to `PixSteps` (pixView becomes null), the sticky CTA returns with label **“Gerar Pix”**, and above it a `FailureBanner` with verbatim **“Este Pix não está mais ativo. Gere um novo código para pagar.”**

### CTA label reference (`ctaLabel` in checkout-summary.ts)

- free → `Confirmar consulta`; pix → `Gerar Pix`; wallet → `Confirmar com saldo`; company_credit → `Confirmar com crédito da empresa`; total ≤ 0 → `Confirmar com saldo`; else → `` `Pagar ${formatBRL(total)}` `` → **`Pagar R$ 89,90`** (this is the card CTA).

### Card-analysis CTA (for completeness, `src/lib/card-analysis.ts`)

Sticky bar shows a hint `Text` above the button: `margin-bottom: 12px`, centered, DM Sans 400, `font-size: 13px`, `line-height: 19px`, color `#726F80`.
- polling: label **“Analisando pagamento”**, hint **“O banco está analisando o pagamento. Não pague de novo: a confirmação chega aqui.”**, disabled+loading.
- timed out: label **“Verificar pagamento”**, hint **“A análise ainda não terminou. Não pague de novo: verifique em alguns minutos.”**

---

# specs/checkout-sucesso.md — `src/app/(client)/checkout/sucesso.tsx`

File: `/Users/legacyn/www/vivamais/vivamaisa-app/src/app/(client)/checkout/sucesso.tsx`. The `consultationId` param is present in the post-checkout flow, so all `consultationId ? …` branches take the **first** value.

## Shell

- `SafeAreaProvider` > `SafeAreaView` `flex:1`, background `#FAFAFE` (all edges inset — no `edges` prop).
- `ScrollView` `flex:1`, contentContainer: `padding-left/right: 24px`, `padding-top: 24px`, `padding-bottom: 28px`, **`gap: 28px`** between the three top-level blocks; no scroll indicator.

## Element tree

1. **Hero block** — `align-items: center`
   - **`ConfirmationMark`** (`src/components/booking/ConfirmationMark.tsx`) — no illustration asset, no Lottie; it is a pure Reanimated badge.
     - Outer box: 112×112 (`h-28 w-28`), centered, a11y-hidden.
     - Pulse ring (absolute): 96×96, `border-radius: 48px`, `border: 2px solid #BC9CF7` (violet.300); animates opacity `0.45 → 0` and scale `0.9 → 1.3`, so it is **invisible in the settled frame**.
     - Middle disc: 96×96 (`h-24 w-24`), `border-radius: 9999px`, background **`#EBE1FD`** (violet.100).
     - Inner disc: 72×72, `border-radius: 9999px`, background **`#7E3BED`** (violet.500); animates from opacity 0/scale 0.8/translateY +6 to opacity 1/scale 1/translateY 0 over 360 ms after a 320 ms delay, easing `cubic-bezier(0.22,1,0.36,1)`.
     - lucide **`Check`**, size **36**, color `#FFFFFF`, **strokeWidth 2.8**, centered.
   - Eyebrow `Text`: `margin-top: 16px`, DM Sans 700, `font-size: 12px`, `text-transform: uppercase`, `letter-spacing: 0.1em` (`tracking-widest`), color **`#5719B6`** (violet.700). Copy: **“Agendamento confirmado”** (source string is written lowercase-cased as `Agendamento confirmado` and rendered uppercase by CSS → **AGENDAMENTO CONFIRMADO**).
   - Title `Text` (role `header`, live region polite): `margin-top: 8px`, `text-align: center`, **Space Grotesk 700** (`font-brand`), `font-size: 32px`, `line-height: 38px`, `letter-spacing: -0.7px`, color `#17151E`. Copy: **“Sua consulta está marcada.”** (period included).
   - Subtitle `Text`: `margin-top: 12px`, `text-align: center`, DM Sans 400, `font-size: 16px`, `line-height: 24px` (`text-base leading-6`), color `#726F80`. Copy: **“Agora, vamos preparar seu atendimento.”**
2. **Summary card** — rendered when `summary && consultationId`
   - Card: `border-radius: 24px`, background `#FFFFFF`, `padding: 20px` (`p-5`), `border: 1px solid #F2F1F6` (ink.100), `borderCurve: continuous`. Top margin comes from the container `gap: 28px`.
     - a. Doctor row: row, center, `gap: 12px`
       - **`Avatar`** (`src/components/Avatar.tsx`, not DoctorAvatar) `size={48}` → 48×48, `border-radius: 24px`. With no image: background `THEMES.light.primary` = **`#7E3BED`**, centered initials (first + last word initial, uppercase; note this component does **not** strip “Dr.”), plain RN `Text` `font-size: 48*0.4 = 19.2px`, `font-weight: bold`, color `white`. With an image: cover fit, 120 ms transition, `ActivityIndicator` (small, `#7E3BED`) overlaid while loading.
       - Column `flex:1`
         - Name `Text`: DM Sans 700, `font-size: 18px`, `line-height: 24px`, color `#17151E`.
         - Specialty `Text` (if present): `margin-top: 4px`, DM Sans 400, `14px/20px` (`text-sm`), color `#726F80` → **`Cardiologia`**.
     - b. Divider: `height: 1px`, background `#F2F1F6` (`bg-ink-100`), `margin-top/bottom: 20px` (`my-5`).
     - c. Detail list: `gap: 16px` (`gap-4`); each row: row, center, `gap: 12px`
       - Row 1 — lucide **`CalendarDays`**, size **20**, color `#5719B6`; `Text` `flex:1`, DM Sans 500, `font-size: 17px`, color `#17151E`. Copy = `formatDayLabel(date)` = date-fns `'EEEEEE, d MMM'` pt-BR with dots removed → e.g. **`qua, 17 set`**.
       - Row 2 — lucide **`Clock3`**, size **20**, color `#5719B6`; `Text` `flex:1`, DM Sans 500, 17px, `#17151E`. Copy = `` `${start.slice(0,5)} às ${end.slice(0,5)}` `` → e.g. **`14:00 às 14:50`** (literal Portuguese word **`às`**, normal spaces).
       - Row 3 — **online** consultation: lucide **`Video`**, size **20**, color `#5719B6` (offline would be **`MapPin`**, same size/color); `Text` `flex:1`, DM Sans 400, `16px/24px` (`text-base`), color **`#55525F`** (ink.600). Copy: **“Online, pelo aplicativo”** (offline: “Consulta presencial”).
3. **“Antes da consulta” block** — `gap: 8px` (`gap-2`), left-aligned
   - Eyebrow `Text`: DM Sans 700, 12px, uppercase, `letter-spacing: 0.1em`, color `#5719B6`. Copy: **“Antes da consulta”** → renders **ANTES DA CONSULTA**.
   - Heading `Text`: **Space Grotesk 500** (`font-brand-medium`), `font-size: 22px`, `line-height: 28px` (`leading-7`), color `#17151E`. Copy: **“Conte como você está”**.
   - Body `Text`: DM Sans 400, `16px/24px`, color `#726F80`. Copy: **“Responda à anamnese para o médico conhecer seus sintomas antes do atendimento.”**
4. **Bottom action area** (outside the ScrollView, in normal flow — **not** a `StickyBar`, no shadow, no background of its own → sits on `#FAFAFE`)
   - Wrapper: `padding-left/right: 24px` (`px-6`), `padding-top: 12px`, `padding-bottom: 12px` (`pt-3 pb-3`), plus the SafeAreaView bottom inset below it.
   - `PillButton variant="primary"` — label **“Preencher anamnese”**; full width; navigates (replace) to `/(client)/anamnese` and clears the appointment store.
   - Secondary `Pressable`: `margin-top: 8px`, `min-height: 44px` (`min-h-11`), centered, `padding-top/bottom: 8px`; `Text` DM Sans 500, `font-size: 15px`, color **`#55525F`** (ink.600). Copy: **“Fazer isso depois”** → replaces to `/(client)/pre-consulta`.

### Empty-param variant (no `consultationId`) — for reference only

No ConfirmationMark, no summary card, no “Antes da consulta”; eyebrow **“Seus agendamentos”**, title **“Confira suas consultas”**, subtitle **“Abra sua agenda para ver os detalhes de cada atendimento.”**, single primary button **“Ver minhas consultas”**, no secondary link.

---

# specs/shared-primitives.md

## PillButton — `/Users/legacyn/www/vivamais/vivamaisa-app/src/components/booking/PillButton.tsx`

- Geometry (identical for both variants): `height: 52px`, `border-radius: 999px`, `borderCurve: continuous`, `padding-left/right: 24px` (`px-6`), content row centered. Width = whatever the parent gives (full width in sticky bars; `flex:1` halves in PixPanel).
- Press animation: scale to **0.98** over **110 ms** (`DURATION.instant`) easing `cubic-bezier(0.22,1,0.36,1)`; blocked while `disabled || loading`. Fires `haptic.impact()` on press.
- Label `Text`: **DM Sans 500** (`font-text-medium`), `font-size: 16px`, `line-height: 24px` (`text-base`), 1 line, `adjustsFontSizeToFit` with `minimumFontScale 0.85` (HTML: allow shrink-to-fit down to 13.6px).
- Spinner (when `loading`): `Spinner` size **18**, strokeWidth **2.4**, rendered before the label; label gets `margin-left: 10px` (`ml-2.5`).
  - Spinner geometry (`src/components/ui/Spinner.tsx`): SVG circle, r = (size − strokeWidth)/2, a full track at `stroke-opacity 0.22` plus an arc `stroke-dasharray = 0.28*C C`, round cap; rotates 360° every **720 ms** linear.
- **variant `primary`**: background `#7E3BED` (`bg-violet-500`), pressed `#6A24DB`; label color `#FFFFFF`; spinner color `#FFFFFF`.
- **variant `ghost`**: background `#FFFFFF`, `border: 1px solid #E6E4EC` (`border-ink-200`), pressed background `#F9F8FB`; label color **`#5719B6`** (`text-violet-700`); spinner color `#5719B6`.
- **`disabled` (either variant)**: background `#F2F1F6` (`bg-ink-100`), label color `#A29FB0` (`text-ink-400`), no border. Note: `loading` alone does **not** grey it out — only the `disabled` prop does.

## StickyBar — `/Users/legacyn/www/vivamais/vivamaisa-app/src/components/booking/StickyBar.tsx`

- `position: absolute; left: 0; right: 0; bottom: 0;`
- `padding-left/right: 20px`, `padding-top: 12px`, `padding-bottom: max(safeAreaInsets.bottom, 16)` → 34px on a home-indicator iPhone, 16px otherwise.
- background `#FFFFFF`; shadow color `#17151E`, offset `0 -8px`, opacity 0.10, radius 24 → CSS `box-shadow: 0 -8px 24px rgba(23,21,30,0.10)`; Android elevation 12.
- Children stack vertically in source order: optional `FailureBanner` (with `margin-bottom: 12px`), optional hint text (`margin-bottom: 12px`, centered, DM Sans 400, 13px/19px, `#726F80`), then the `PillButton`.

## FailureBanner — `/Users/legacyn/www/vivamais/vivamaisa-app/src/components/checkout/FailureBanner.tsx`

- Row, center, `border-radius: 16px`, background **`rgba(239,68,68,0.08)`**, `padding: 14px 16px`, no border, `role=alert`.
- lucide **`AlertCircle`**, size **18**, color `#EF4444`.
- `Text` `margin-left: 12px`, `flex:1`, DM Sans 400, `14px/20px` (`text-sm`), color `#17151E`.

## PanelTitle / PANEL — `/Users/legacyn/www/vivamais/vivamaisa-app/src/components/checkout/PanelTitle.tsx`

- `PANEL` style constant: background `#FFFFFF`, `border-radius: 20px`, `borderCurve: continuous`, `padding: 20px`.
- `PanelTitle`: row, space-between, center, `margin-bottom: 16px`; title DM Sans 700, 16px, `#17151E`; optional caption `margin-left: 12px`, DM Sans 400, 13px, `#A29FB0` (ink.400).

## BalancePanel — `/Users/legacyn/www/vivamais/vivamaisa-app/src/components/checkout/BalancePanel.tsx` (not used in the Pix/benefit flows; included for completeness)

- `PANEL` container. `PanelTitle` copy by kind: wallet → title **“Saldo Viva”**, caption **“Débito imediato”**; company_credit → **“Crédito da empresa”** / **“Limite do mês”**.
- Icon tile 40×40, `border-radius: 12px`, background `#F5F0FE`; lucide **`Wallet`** (wallet) or **`Building2`** (company credit), size **20**, color `#5719B6`.
- Text column `margin-left: 12px`: caption DM Sans 400, 13px, `#726F80` — **“Saldo disponível”** / **“Disponível neste mês”**; value DM Sans 700, 17px, `#17151E`.
- Divider `height: 1px`, background `#F2F1F6`, `margin: 16px 0`.
- Split rows (`remaining > 0`): `Usado nesta consulta` (label DM Sans 400 15px `#726F80`, value DM Sans 500 15px `#17151E`), `margin-bottom: 10px`.
- Final row: label **“Restante a pagar”** (when remaining > 0) else **“Depois do pagamento”**, DM Sans 400, 15px, `#726F80`; value DM Sans 700, 15px, `#17151E`.

## SavingsPills / StruckOriginal — `/Users/legacyn/www/vivamais/vivamaisa-app/src/components/checkout/SavingsPills.tsx`

- Container: row, wrap, `gap: 6px`, `margin-top: 12px`. Renders nothing when there are no pills.
- Pill: `padding: 5px 10px`, `border-radius: 999px`.
  - coupon pill → background `#C6FF34`, text `#17151E`.
  - non-coupon, tone `dark` → background `rgba(255,255,255,0.14)`, text `#FFFFFF`.
  - non-coupon, tone `light` → background `#F2F1F6`, text `#403D4A`.
- Pill text: DM Sans 500, 12px.
- Label templates: discount → `` `${couponCode ?? discountLabel ?? 'Desconto'} · −${formatBRL(discount)}` `` (U+2212, **no** space after it here); wallet → `` `${formatBRL(walletApplied)} em saldo` ``.
- `StruckOriginal`: DM Sans 400, 15px, `line-through`; color `#BC9CF7` (tone dark) / `#A29FB0` (tone light); text = `formatBRL(totals.consultation)`.

## IllustrationSlot — `/Users/legacyn/www/vivamais/vivamaisa-app/src/components/booking/IllustrationSlot.tsx`

**Not used by any of the three checkout screens** (the success screen uses `ConfirmationMark` instead). Full id → asset map (all in `/Users/legacyn/www/vivamais/vivamaisa-app/assets/illustrations/`):

| id | asset |
|---|---|
| `ILL-01` | `form-sheet-empty.webp` |
| `ILL-02` | `form-sheet-complete.webp` |
| `ILL-08` | `optional-skip-attach.webp` |
| `ILL-09` | `handoff-sheet.webp` |
| `ILL-10` | `anamnese-pen-rest.webp` |
| `search-empty` | `empty-next-day.webp` |
| `slots-empty` | `empty-time-chips.webp` |
| `search-error` | `search-error.webp` |
| `slots-error` | `slots-error.webp` |
| `docs-empty` | `docs-empty.webp` |
| `consultas-empty` | `consultas-empty.webp` |
| `ai-empty` | `ai-empty.webp` |
| `pharmacies-empty` | `pharmacies-empty.webp` |

Render: an a11y-hidden `View` of the given `width`/`height` containing an `Image` at `100%`/`100%` with `resizeMode: 'contain'`.

## Lottie

`grep -rln lottie src` → **no matches**. There is no Lottie animation in the app; all animation is Reanimated (`ConfirmationMark`, `WaitingDot`, `SkeletonBox`, `Spinner`, `Expandable`, `PillButton` press, `entrance()` FadeInDown).

## Other shared bits referenced above

- **Expandable** (`src/components/booking/Expandable.tsx`): header `padding: 12px 0`, title DM Sans 700 18px `#17151E`, optional count `margin-left: 8px` DM Sans 400 14px `#726F80`, lucide `ChevronDown` 20 / `#726F80`, 320 ms height+opacity+rotate, collapsed by default.
- **SkeletonBox** (`src/components/ui/SkeletonBox.tsx`): background `#e8e8ed`, default radius 8, opacity pulsing 0.3 ↔ 0.7 at 800 ms per leg, `Easing.inOut(ease)`.
- **Monogram** (`src/components/booking/Monogram.tsx`): tone dark → transparent background, text `#D6C3FB`; tone light → background `#D6C3FB` (violet.200), text `#451391` (violet.800); font Space Grotesk 700 at `round(size * 0.38)`.