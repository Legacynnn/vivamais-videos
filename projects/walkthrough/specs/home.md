I've read all the source. **I could not write the spec files** — I'm running in read-only mode (no Write/Edit tools, no file creation), and `/Users/legacyn/www/vivamais/vivamais-walkthrough-video/specs/` does not exist. Here are the three complete specs, ready to be saved verbatim by the caller.

---

# `specs/home.md` — Client Home tab

Source: `/Users/legacyn/www/vivamais/vivamaisa-app/src/app/(client)/(tabs)/index.tsx`

## 0. Resolved design tokens (light theme — the app defaults to `light`; `useThemeStore.preference` starts `'light'`)

`src/theme/tokens.json` → `theme.light` refs resolved through `src/theme/palette.js`:

| role | hex | role | hex |
|---|---|---|---|
| background | `#FAFAFE` (canvas) | primary | `#7E3BED` (violet.500) |
| foreground | `#17151E` (ink.900) | primaryStrong | `#6A24DB` (violet.600) |
| foregroundSubtle | `#A29FB0` (ink.400) | primarySoft | `#F5F0FE` (violet.50) |
| card | `#FFFFFF` | primaryForeground | `#FFFFFF` |
| surface | `#F3F4FA` (panel) | secondary | `#C6FF34` (lime.400) |
| tint | `#F3EDFF` (mist) | success | `#22C55E` |
| muted | `#F2F1F6` (ink.100) | warning | `#F59E0B` |
| mutedForeground | `#726F80` (ink.500) | destructive | `#EF4444` |
| border | `#E6E4EC` (ink.200) | borderStrong | `#D2CFDB` (ink.300) |

BRAND scale (`src/theme/colors.ts` → tokens.color):
`violet 50 #F5F0FE · 100 #EBE1FD · 200 #D6C3FB · 300 #BC9CF7 · 400 #9D6BF2 · 500 #7E3BED · 600 #6A24DB · 700 #5719B6 · 800 #451391 · 900 #350E6F · 950 #22084A`
`ink 50 #F9F8FB · 100 #F2F1F6 · 200 #E6E4EC · 300 #D2CFDB · 400 #A29FB0 · 500 #726F80 · 600 #55525F · 700 #403D4A · 800 #282632 · 900 #17151E · 950 #0D0C12`
`lime 100 #F1FFC6 · 400 #C6FF34 · 600 #8CC900` · `white #FFFFFF` · `canvas #FAFAFE` · `panel #F3F4FA` · `mist #F3EDFF`

`PLANS` (`src/components/plans/tokens.ts`): card `#FFFFFF`, hairline `#E6E4EC`, ink `#17151E`, ink2 `#403D4A`, ink3 `#726F80`, ink4 `#A29FB0`, violet `#7E3BED`, violetStrong `#5719B6`, violetSoft `#F5F0FE`, violetTint `#EBE1FD`.

**Fonts** (loaded in `src/app/_layout.tsx` via `@expo-google-fonts/dm-sans` + `/space-grotesk`; mapped in `tailwind.config.js` from `tokens.type`):

| class | family | CSS |
|---|---|---|
| `font-text` | DMSans_400Regular | `"DM Sans", 400` |
| `font-text-medium` | DMSans_500Medium | `"DM Sans", 500` |
| `font-text-bold` | DMSans_700Bold | `"DM Sans", 700` |
| `font-brand` | SpaceGrotesk_700Bold | `"Space Grotesk", 700` |
| `font-brand-medium` | SpaceGrotesk_500Medium | `"Space Grotesk", 500` |

`Text` (`src/components/nativewindui/Text.tsx`) default variant = `body` → `text-[17px] leading-6` (17px / 24px) and `text-foreground` `#17151E`. Any explicit `text-[Npx]` / `style.fontSize` overrides it. **No `lineHeight` is set unless stated** — RN default line box ≈ 1.2–1.3× font size for DM Sans; for HTML use `line-height: 1.25` where unspecified.

## 1. Screen shell

- `ClientTabScreen` (`src/components/client/ClientTabScreen.tsx`), props `tabName="index"`, `edges={['left','right']}`, `className="bg-background"`
  - `SafeAreaView` — `flex:1`, `background #FAFAFE` (then `bg-background` again), safe-area padding applied **left/right only** (no top inset — the ScrollView adds it itself)
  - `AnimatedTabTransition` — on **iOS returns children unchanged** (no wrapper, no animation). Android only: slide-in translateX ±max(width*0.15, 56)px, opacity 0.6→1, 250ms `Easing.out(cubic)`
  - inner `View` `flex-1` (no padding; `padded` defaults false)

### 1a. `HomeGradientBackdrop` (absolutely positioned, behind everything)
`src/components/home/HomeGradientBackdrop.tsx`
- `Animated.View`, `position:absolute; top:0; left:0; right:0; overflow:hidden`, `height = round(windowHeight * 0.58)`, `pointerEvents:none`
- Content = a Skia fullscreen fragment shader ("god rays"), not an image. Uniforms: `u_color1 = colors.primary #7E3BED`, `u_color2 = BRAND.violet[400] #9D6BF2`, `u_intensity 0.2`, `u_rays 0.09`, `u_reach 0.08`, `u_base 0.55`, ray origins `(0.42*W, -0.4*H)` and `(0.44*W, -0.5*H)`, time = `clock/1000 * 0.16`.
- Visual result to reproduce in HTML: a violet radiant field anchored top-center-left, brightest at the top, fading to transparent by ~85% of its height (`smoothstep(0.85,0,y)` base term) and hard-cut by `smoothstep(1.0,0.55,y)`. Good static approximation:
  `background: radial-gradient(120% 90% at 42% -18%, #9D6BF2 0%, #7E3BED 35%, rgba(126,59,237,0) 88%)` over the white/canvas page, plus faint 2-tone diagonal ray streaks.
- Scroll behaviour: `translateY = -scrollY * 0.45`, `opacity` interpolates 1→0 over scroll `0 → layerHeight*0.5`.
- Conditional: returns `null` if the Skia runtime effect fails to compile.

### 1b. `Animated.ScrollView`
- `flex-1`, `contentContainerStyle: { paddingTop: safeAreaTop + 8, paddingBottom: 96 }` (iPhone with notch: `59px` top)
- vertical scrollbar hidden, `RefreshControl` (default iOS spinner, `progressViewOffset = insets.top`)
- Children in render order, each wrapped in `Animated.View` with `FadeInDown.duration(320).delay(d)` (skipped entirely when Reduce Motion is on): header (no entrance), hero `d=40`, quick actions `d=90`, AI card `d=120`, next appointment `d=150`, plan status `d=190`, benefits `d=220`; DoctorsSection + PartnersSection have **no** entrance animation.

## 2. Element tree, top to bottom

### 2.1 `HomeHeader` — `src/components/home/HomeHeader.tsx`
- Wrapper `View` `padding-inline: 20px`
- **Top row** `flex-row; align-items:center; justify-content:space-between`
  - Left: `Pressable` → `/(client)/perfil`, `hitSlop 8`, `active:opacity-70`
    - Avatar `View` **42×42**, `border-radius:21px`, `background #F2F2F7`, `overflow:hidden`, centered content
      - if `profile.avatar_url` → `expo-image` 42×42, `contentFit:cover`, 150ms fade-in
      - else → `Text` initial (first letter of first name, uppercased), `font-text-medium` **DM Sans 500 / 17px**, color `#17151E`
    - Status dot `View` `position:absolute; right:1px; top:1px; width:10; height:10; border-radius:5px; background #7E3BED; border:2px solid #FFFFFF` — **always rendered** (not conditional)
  - Right: `Pressable` → `/(client)/menu`, `hitSlop 10`, box **42×42**, content aligned `flex-end`/center
    - lucide **`Menu`**, size **24**, color `#17151E`, `strokeWidth 2`
- **Greeting block** `View` with `margin-top: round(windowHeight * 0.09)` (iPhone 14 Pro 852pt → **77px**)
  - Line 1 `Text`: `"{greeting}, {firstName}."`
    - `font-text-bold` **DM Sans 700 / 30px / lineHeight 36px / letter-spacing -0.6px**, color **`#FFFFFF`**
    - greeting from `greetingFor(new Date())`: `hour < 12` → **"Bom dia"**, `hour < 18` → **"Boa tarde"**, else → **"Boa noite"**
    - `firstName = name.trim().split(/\s+/)[0]`, fallback `"você"`; `name = profile.full_name || user.name || 'Usuário'`. Example render: **`Bom dia, Daniel.`**
  - Line 2 `Text` (subtitle): `font-text-medium` **DM Sans 500 / 20px / lineHeight 26px**, color `rgba(255,255,255,0.92)`, `margin-top:2px`, `numberOfLines={2}` (clamp 2 lines, ellipsis)
    - **Subtitle source** = `useHomeStatus(profile).hero.subtitle` (`src/hooks/useHomeStatus.ts`). Branches, in evaluation order:
      1. upcoming consultation within 48h → `` `Sua consulta é ${formatConsultationDateLong(date).toLowerCase()}.` `` → e.g. `Sua consulta é hoje às 14:30.` / `amanhã às 09:00.` / `12 de março às 09:00.`
      2. else active company credit → `Seu crédito do convênio está disponível.`
      3. else subscription kind `active` | `cancelling` → **`Seu plano está ativo e pronto para usar.`**
      4. else upcoming consultation (>48h out) → `` `Sua próxima consulta é ${…}.` ``
      5. default (`BOOK_HERO`) → `Vamos marcar sua primeira consulta?`
    - **Scenario (subscribed Viva+, no upcoming consultation)** → branch 3: **`Seu plano está ativo e pronto para usar.`**

### 2.2 `ScheduleHeroCard` — `src/components/home/ScheduleHeroCard.tsx`
Wrapped by `styles.heroWrap`: `padding-inline: 20px; margin-top: 18px; z-index: 1`.

- Card `View`: `background #FFFFFF`, `border-radius: 22px` (continuous/squircle), `padding: 18px 18px 16px`, shadow `0 12px 24px rgba(53,14,111,0.10)` (shadowColor `BRAND.violet[900] #350E6F`, offset y12, opacity .10, radius 24), Android elevation 6. No border.
  - Title `Text` **"Agende sua consulta"** — `font-text-bold` DM Sans 700 / **20px**, `letter-spacing -0.4px`, color `#17151E`
  - Subtitle `Text` **"Busque por especialidade ou pelo nome do médico"** — `font-text` DM Sans 400 / **14px**, color `#726F80`, `margin-top: 2px`
  - Search field wrap: `margin-top: 14px; border-radius: 16px; overflow:hidden`
    - `Pressable` row: `height 52px`, `flex-row; align-items:center; gap:10px`, `padding-left:14px; padding-right:6px`, `background #F3EDFF` (tint), `active:opacity-80`
      - lucide **`Search`**, size **20**, color `#A29FB0`, `strokeWidth 1.8`
      - `Text` **"Buscar médico ou especialidade"** — `font-text` DM Sans 400 / **15px**, color `#A29FB0`, `flex:1`, 1 line
      - Action square `View` **38×38**, `border-radius:12px`, `background #7E3BED`, centered
        - lucide **`ArrowRight`**, size **16**, color `#FFFFFF`, `strokeWidth 2.5`
  - **Specialty chips carousel** — horizontal `ScrollView`, `margin-top:12px; margin-inline: -18px` (bleeds to card edges), content `padding-inline:18px; gap:8px`, scrollbar hidden, no snapping
    - Each chip `Pressable`: `flex-row; align-items:center; gap:6px; padding:8px 12px; border-radius:14px; background #F5F0FE` (primarySoft), `active:opacity-70`
      - icon `Image` **18×18**, `resizeMode:contain`, from `getSpecialtyImage(name)` (may be absent → chip is text-only)
      - `Text` chip label — `font-text-medium` DM Sans 500 / **13px**, color `BRAND.ink[700] #403D4A`
    - Chip data: API specialties sorted by `PRIORITY` = clínico, dermato, pediatr, psicol, cardio, gineco, then A→Z (pt-BR); dedup by name. **Fallback when API returns nothing** (use this for the mock): `Clínico Geral`, `Dermatologia`, `Pediatria`, `Psicologia`, `Cardiologia`, `Ginecologia`.
    - **Icon asset map** (`src/utils/specialtyIcons.ts`, case-insensitive `includes`): `clínico|clinico → assets/icons/medico.png`, `cardio → assets/icons/cardio.png`, `neuro → assets/icons/neurologia.png`, `dermato → assets/icons/derma.png`, `ortop → assets/icons/ortopedia.png`, `gineco → assets/icons/ginecologia.png`, `pediatr → assets/icons/pediatria.png`, `psicol|psiquiat → assets/icons/psicologia.png`, `nutri → assets/icons/nutrologista.png`, `urolog → assets/icons/urologista.png`, `endocr → assets/icons/endocrino.png`, `geriat → assets/icons/geriatra.png`, `alerg → assets/icons/alergia.png`, `fono → assets/icons/fonoaudiologa.png`; otherwise `null`.

### 2.3 White sheet container (`styles.sheet` in `index.tsx`)
`margin-top: -44px` (overlaps the hero card), `padding-top: 64px` (44+20), `padding-bottom: 32px`, `gap: 20px` between all direct children, `background #FFFFFF`, `border-top-left-radius / border-top-right-radius: 30px` (continuous), `min-height: 600px`. No horizontal padding — children handle their own.

### 2.4 `HomeQuickActions` — horizontal rail, no section header
`src/components/home/HomeQuickActions.tsx`
- `ScrollView` horizontal, content `padding-inline: 20px; gap: 16px`, scrollbar hidden, no snapping
- Each item `Pressable`: `align-items:center; gap:7px; min-width:76px`, `active:opacity-70`
  - Circle `View` **58×58**, `border-radius:29px`, `background BRAND.violet[100] #EBE1FD`, centered
    - lucide icon, size **22**, color `#6A24DB` (primaryStrong), `strokeWidth 1.9`
  - Label `Text` — `font-text-medium` DM Sans 500 / **14px**, color `BRAND.ink[600] #55525F`, `text-align:center`
- Items in exact order (label / lucide icon / route):
  1. **Pagamentos** — `CreditCard` — `/(client)/plans/faturas`
  2. **Agenda** — `CalendarDays` — `/(client)/(tabs)/consultas`
  3. **Plantão** — `Siren` — `/(client)/(tabs)/plantao`
  4. **Documentos** — `FolderOpen` — `/(client)/arquivos`
  5. **Parceiros** — `Store` — `/(client)/parceiros`
  6. **Buscar** — `Search` — `/(client)/search`
  7. **Mais** — `LayoutGrid` — `/(client)/(tabs)/acoes`
- Not conditional — always all 7.

### 2.5 `AIAssistantCard` — full-width paged carousel + dots
`src/components/home/AIAssistantCard.tsx` (local palette: bg `#F3F3F5`, title `#1C1C1E`, quote `#6E6E73`, dot `#C7C7CC`, dotActive `#3A3A3C`)
- `ScrollView` horizontal, content `padding-inline: 20px; gap: 12px`, `snapToInterval = pageWidth + 12`, `snapToAlignment:start`, `disableIntervalMomentum`, `decelerationRate:fast`
- Card width = **`screenWidth − 40`** (one card per page). Card style: `flex-row; align-items:center; gap:14px; border-radius:22px; background #F3F3F5; padding: 18px 16px`, `active:opacity-80`
  - Icon cluster `View` **60×60**
    - Tile `View` **56×56**, `border-radius:16px`, `background #FFFFFF`, centered, shadow `0 2px 6px rgba(53,14,111,0.08)`
      - `AIAssistantIcon` (custom SVG, `src/components/icons/AIAssistantIcon.tsx`) size **30**, `color = #7E3BED` (flat, gradient disabled since color is passed). Shape: rounded plus/cross outline with a small 4-point sparkle top-right and a chevron-down in the center; viewBox `0 0 90 90`.
    - Badge `View` `position:absolute; right:-4px; bottom:-4px; width:26; height:26; border-radius:13px; background #7E3BED; border:2px solid #F3F3F5`, centered
      - lucide per-prompt icon, size **13**, color `#FFFFFF`, `strokeWidth 2.4`
  - Body `View` `flex:1`
    - Title `Text` — `font-text-medium` DM Sans 500 / **16px**, color `#1C1C1E`
    - Quote `Text` — `font-text` DM Sans 400 / **15px / lineHeight 20px**, color `#6E6E73`, `margin-top:2px`, max 2 lines, wrapped in **curly quotes** `“…”`
- Slides, in order (`AI_HOME_PROMPTS`, `src/components/ai-chat/ai-suggestions.ts`) — title / quote / badge icon:
  1. **Entendа sua consulta** → exact: **"Entenda sua consulta"** / **"Analise minha última consulta"** / `HeartPulse`
  2. **"Agende por mensagem"** / **"Agende um cardiologista para sexta-feira"** / `Calendar`
  3. **"Explique um exame"** / **"Explique meu último exame"** / `FileText`
  4. **"Dúvida sobre remédios"** / **"Posso tomar dipirona com paracetamol?"** / `Pill`
  5. **"Conheça seu plano"** / **"Quais especialidades meu plano cobre?"** / `ShieldCheck`
- Dots row: `flex-row; justify-content:center; align-items:center; gap:6px; margin-top:10px`
  - idle dot **6×6**, `border-radius:3px`, `background #C7C7CC`; active dot **16×6**, `border-radius:3px`, `background #3A3A3C`. 5 dots, first active on load.

### 2.6 `NextAppointmentCard` — wrapped in `View className="px-5"` (20px inline padding)
`src/components/home/NextAppointmentCard.tsx`
- Card `View`: `background #FFFFFF`, `border-radius:22px`, `padding: 14px 14px 12px`, `gap:10px`, shadow `0 8px 18px rgba(53,14,111,0.08)`, elevation 2
- **Three mutually exclusive states for the inner block:**
  - `isPending` (consultations still loading) → skeleton row: same `inner` frame; `SkeletonBox` 48×48 r12; text column: 170×14 r6, 6px gap, 110×12 r6. Skeleton color `#e8e8ed`, pulsing opacity 0.3↔0.7 over 800ms each way.
  - consultation exists → pressable row → `/(client)/pre-consulta?consultationId=…`
    - `Avatar` 48px circle (frame `border-radius:12px; overflow:hidden`), fallback bg `#EBE1FD`, initials color `#6A24DB`, initials font = RN default system bold at `48*0.4 = 19.2px`
    - Title `Text` `font-text-medium` 16px `#17151E`, 1 line = `formatConsultationDateLong` → `Hoje às HH:mm` / `Amanhã às HH:mm` / `d 'de' MMMM 'às' HH:mm` (pt-BR)
    - Sub `Text` `font-text` 14px `#726F80`, `margin-top:1px`, 1 line = `` `${specialty} · ${doctorName}` ``
  - **no consultation (our scenario)** → pressable row opening the search morph
    - Icon box `View` **48×48**, `border-radius:12px`, `background #F5F0FE`, centered — lucide **`CalendarPlus`**, size **22**, color `#6A24DB`
    - Title `Text` **"Nenhuma consulta agendada"** — `font-text-medium` DM Sans 500 / **16px**, color `#17151E`
    - Sub `Text` **"Encontre um especialista disponível"** — `font-text` DM Sans 400 / **14px**, color `#726F80`, `margin-top:1px`
- `inner` frame style (all three states): `flex-row; align-items:center; gap:12px; border-radius:16px; border:1px solid #F2F1F6` (muted); `padding:12px`
- **Footer row** (always rendered): `flex-row; align-items:center; justify-content:space-between; padding-inline:6px`, `hitSlop 6`, `active:opacity-70`
  - Left group `flex-row; align-items:center; gap:8px`
    - Conditional dot **7×7**, `border-radius:4px`, only when `needsAnamnese` (a consultation exists *and* its anamnese status is `pending`); color = `#F59E0B` when urgency `calm`, else `#6A24DB`
    - `Text` `font-text-medium` DM Sans 500 / **15px**, color `#6A24DB`. Copy:
      - `needsAnamnese` → `nudgeLabel(consultation.consultation_date)` (see `src/lib/anamnese/urgency.ts`)
      - else consultation → **"Abrir pré-consulta"**
      - else → **"Agendar nova consulta"** ← **our scenario**
  - lucide **`ChevronRight`**, size **18**, color `#A29FB0`

### 2.7 `PlanStatusCard` — `src/components/home/PlanStatusCard.tsx`
- `Pressable` card → `/(client)/plans`: `flex-row; align-items:center; gap:12px; margin-inline:20px; padding: 12px 14px; border-radius:20px; background #FFFFFF; border:1px solid <tint@alpha>`, `active:opacity-80`
- **Three states** (priority order):
  1. `overdue != null` → icon `Receipt`, tint `#EF4444`, border `rgba(239,68,68,0.2)`, label = `overdue.caption`, title = `` `R$ ${amount} em aberto` ``, hint **"Toque para regularizar"**
  2. `planLabel != null` → icon **`ShieldCheck`**, tint `#6A24DB`, border `rgba(106,36,219,0.08)`, label **"Seu plano"**, title = `planLabel`, no hint ← **our scenario**
  3. else → icon `Sparkles`, tint `#6A24DB`, label **"Sem plano ativo"**, title **"Conhecer planos Viva Mais"**
- Icon box `View` **42×42**, `border-radius:12px`, `background = rgba(tint, 0.08)` → `rgba(106,36,219,0.08)`; lucide icon size **20**, color = tint, `strokeWidth 1.9`
- Copy column `flex:1`
  - label `Text` `font-text` DM Sans 400 / **13px**, color `#726F80`, 1 line
  - title `Text` `font-text-medium` DM Sans 500 / **16px**, color `#17151E`, 1 line
  - hint `Text` (only state 1) `font-text-medium` / **12.5px**, color = tint, `margin-top:2px`
- lucide **`ChevronRight`** size **18**, color `#A29FB0`
- **`planLabel`** = `null` when `subscription.kind === 'none'`, otherwise `subscription.planTitle` from `subscriptionState()` (`src/lib/subscription-state.ts`) → `planName(signature_type.title)`: strips `(…)`, keeps text before `" - "`, drops a leading `"Plano "`, then title-cases. For a raw title `"Assinatura Viva+"` the rendered label is **`Assinatura Viva+`**.

### 2.8 `BenefitsSection` — `src/components/home/BenefitsSection.tsx`
- **Conditional: returns `null` when `subscription.benefits.length === 0`** (i.e. `kind === 'none'`).
- Section `View` `gap: 10px`
- `HomeSectionHeader` title **"Seus benefícios"**, action **"Ver plano"** → `/(client)/plans`
- Rail: horizontal `ScrollView`, content `padding-inline: 20px; gap: 10px`, `snapToInterval = 232` (**card 222 + gap 10**), `snapToAlignment:start`, `disableIntervalMomentum`, `decelerationRate:fast`
- **Benefit card** `Pressable`, **width 222px**, `border-radius:18px`, `border:1px solid`, `padding:12px`, `gap:10px`, `active:opacity-85`
  - non-credit (normal benefit): `background #FFFFFF`, `border-color #E6E4EC`
  - credit benefit (`glyph === 'credit'`): `background #F5F0FE`, `border-color #EBE1FD`
  - `opacity: 0.6` when `tone !== 'live'` (exhausted/blocked); pressable disabled when `route === null`
  - Head row `flex-row; align-items:center; gap:10px`
    - Icon tile `View` **40×40**, `border-radius:13px`, centered. Background: dimmed → `#F2F1F6`; credit → `#FFFFFF`; else → `#F5F0FE`
      - if the benefit has a `specialtyName` with a matching PNG → `Image` **24×24**, `resizeMode:contain` (Cardiologia → `assets/icons/cardio.png`)
      - else → `BenefitGlyph` size **24** (custom SVG, viewBox 0 0 48 48; live palette ink `#5719B6`, fill `#D6C3FB`, accent `#C9F7EE`; muted palette ink `#726F80`, fill `#F2F1F6`, accent `#E6E4EC`). Kinds: `consultation` (stethoscope), `discount` (tag), `pharmacy` (pill+plus), `ai-chat` (speech bubble+sparkle), `ai-analysis` (document+sparkle), `credit` (building+coin), `generic` (rounded square+plus).
    - Copy column `flex:1; gap:1px`
      - title `Text` — `DMSans_500Medium` / **15px / lineHeight 20px**, color `#17151E`, 1 line
      - subline `Text` — `DMSans_400Regular` / **12.5px / lineHeight 16px**, color `#726F80`, 1 line
    - lucide **`ChevronRight`** size **16**, color `#A29FB0` — **only when a route exists** (i.e. `tone === 'live'`)
  - Footer row (only when `counter` is non-null): `flex-row; align-items:center; justify-content:space-between; gap:8px`
    - Segments `flex-row; gap:3px` — only when `quota != null`; count = `min(total, 8)`; each segment **14×4**, `border-radius:2px`; filled (`i < round(remaining/total*segments)` and not dimmed) `#7E3BED`, otherwise `#E6E4EC`
    - counter `Text` — `DMSans_500Medium` / **12px**, color `#403D4A` when live / `#726F80` when dimmed, `flex-shrink:1`, 1 line
- **Copy generation** (`src/components/benefits/benefit-model.ts`), by benefit `type`, sorted by `order` (general-practitioner specialties float first within a tie):
  - `CONSULTATION` (order 0, glyph `consultation`, monthly): title = specialty name (e.g. **"Cardiologia"**) else `"Consulta"`; subline = **"Consulta grátis"** if `free_consultation`, else `"R$ X,XX por consulta"`, else **"Incluída no plano"**; route `/(client)/search?benefit_id=…&specialty=…`
  - `DISCOUNT_CONSULTATIONS` (1, `discount`): title `Desconto em {especialidade}`; subline `{N}% de desconto` / `R$ X,XX de desconto` / `Desconto no plano`
  - `DISCOUNT_ALL_CONSULTATIONS` (2): title **"Desconto em consultas"**
  - `AI_CHAT_MESSAGING` (3, `ai-chat`, daily): title **"Chat com IA"**, subline **"Renova todo dia"**, route `/(client)/ai-chat`
  - `ANALYSIS_CONSULTATUION_BY_AI` (4, `ai-analysis`, daily): title **"Análise de consulta com IA"**, subline **"Renova todo dia"**
  - `AI_WHATSAPP_MESSAGING` (5, `ai-chat`, daily): title **"IA no WhatsApp"**, subline **"Renova todo dia"**, **no route** (no chevron)
  - `DISCOUNT_PHARMACIES` (6, `pharmacy`): title **"Farmácias parceiras"**, subline `{N}% de desconto` else **"Desconto em medicamentos"**, route `/(client)/pharmacies`
  - unknown type → glyph `generic`, title = description with `(ENUM_TOKENS)` stripped, subline **"Incluído no plano"**, no route
  - company credit card: title **"Crédito da empresa"**, subline `Em nome de {nome}` or **"Descontado ao pagar uma consulta"**, counter `R$ X de R$ Y`
  - **Counter text**: blocked → **"Bloqueado até o pagamento"**; exhausted daily → **"Esgotado · volta amanhã"**; exhausted monthly → `Esgotado · volta {d 'de' MMM}`; exhausted with no cycle → **"Esgotado"**; unlimited → **"Ilimitado"**; daily quota → `hoje {r} de {t}`; monthly quota → **`{r} de {t}`**
- **Scenario render (Cardiologia consultation, 2 of 4 remaining, plan active):**
  - card 1, width 222, white bg, `#E6E4EC` border, opacity 1
  - icon tile 40×40 `#F5F0FE` containing `assets/icons/cardio.png` at 24×24
  - title **"Cardiologia"** (DM Sans 500, 15/20, `#17151E`)
  - subline **"Consulta grátis"** (or the price/`Incluída no plano` variant) — DM Sans 400, 12.5/16, `#726F80`
  - `ChevronRight` 16px `#A29FB0`
  - 4 segments of 14×4: **first 2 filled `#7E3BED`**, last 2 `#E6E4EC` (`round(2/4*4)=2`)
  - counter **"2 de 4"** — DM Sans 500, 12px, `#403D4A`

### 2.9 `DoctorsSection` — `src/components/home/DoctorsSection.tsx`
- **Conditional: returns `null` when there are 0 entries and the top-doctors query already settled.** While pending it renders 3 skeleton cards.
- Section `View` `gap:10px`; `HomeSectionHeader` title **"Seus médicos"**, action **"Ver todos"** → `/(client)/search`
- Rail: horizontal `ScrollView`, content `padding-inline:20px; gap:10px`, `snapToInterval = 166` (**card 156 + gap 10**), `snapToAlignment:start`, `decelerationRate:fast`
- Skeleton card: width **156**, height **176**, `border-radius:18px`, `background #F3EDFF` (tint), transparent border
- **Doctor card** `Pressable` → `/(client)/doctor/[id]`: width **156px**, `align-items:center; gap:8px; padding:10px 10px 14px; background #FFFFFF; border-radius:18px; border:1px solid #F2F1F6`, `active:opacity-80`
  - Tag pill `View` `align-self:flex-start; padding:3px 8px; border-radius:999px`, background = `rgba(tagTint, 0.12)`
    - `Text` `font-text-medium` DM Sans 500 / **10.5px**, color = tagTint
    - past-consultation doctors: label **"Já consultou"**, tint `#6A24DB` (primaryStrong) → bg `rgba(106,36,219,0.12)`
    - featured doctors: label **"Em destaque"**, tint `#F59E0B` (warning) → bg `rgba(245,158,11,0.12)`
  - `Avatar` size **58** (circle r29); fallback bg `#EBE1FD`, initials color `#6A24DB`, initials = first+last initial, system-bold at `58*0.4 = 23.2px`
  - Copy `View` `align-self:stretch`
    - name `Text` — `font-text-medium` DM Sans 500 / **13.5px**, color `#17151E`, `text-align:center`, 1 line, **literally prefixed with `"Dr. "`** → e.g. `Dr. Ana Souza`
    - specialty `Text` — `font-text` DM Sans 400 / **12px**, color `#726F80`, `text-align:center`, `margin-top:1px`, 1 line (fallback string `"Especialista"`)
  - Meta row `flex-row; align-items:center; gap:4px`
    - lucide **`Star`** size **12**, color+fill `#F59E0B` — **only on featured cards**
    - `Text` `font-text-medium` DM Sans 500 / **11.5px**, color `#726F80` — past card → date `d 'de' MMM` pt-BR (e.g. `12 de mar`); featured card → rating `"5.0"` (`average_rating.toFixed(1)`, default 5)
- Ordering: all distinct doctors from past consultations first (tag "Já consultou"), then top doctors not already listed (tag "Em destaque"), **capped at 8 cards**.
- **Scenario (has past doctors):** leading cards are "Já consultou" with the consultation date, followed by "Em destaque" cards with star + rating.

### 2.10 `PartnersSection` — `src/components/home/PartnersSection.tsx`
- **Conditional: returns `null` on query error or when the query settled with 0 partners.** While pending: 3 skeletons (width **214**, height **176**, `border-radius:20px`, `background #F3EDFF`, transparent border).
- Section `View` `gap:10px`; `HomeSectionHeader` title **"Parceiros"**, action **"Ver todos"** → `/(client)/parceiros`
- Rail: horizontal `ScrollView`, content `padding-inline:20px; gap:12px`, `snapToInterval = 226` (**card 214 + gap 12**), `snapToAlignment:start`, `decelerationRate:fast`
- **Partner card** `Pressable` → `/(client)/parceiros/[kind]/[id]`: width **214px**, `background #FFFFFF`, `border-radius:20px`, `border:1px solid #F2F1F6`, `overflow:hidden`, `padding-bottom:14px`, `active:opacity-90`
  - Cover `PartnerCover` height **92px**, full bleed
    - with `coverUrl` → cover image, `contentFit:cover`, 180ms transition, placeholder bg `#F2F1F6`
    - without → `background #F5F0FE` plus a radial gradient circle at `cx 18% / cy 0% / r 90%`: `#BC9CF7 @0.5 → #D6C3FB @0.18 → #F3EDFF @0`, and a `PartnerKindGlyph` SVG size **40** positioned `right:10px; bottom:8px` (`round(40*0.25)`, `round(40*0.2)`)
  - Logo `View` `margin-top:-22px; margin-left:14px` (overlaps the cover) → `PartnerLogo` size **44**, ring **3**
    - outer: 44×44, `border-radius: round(44*0.3) = 13px`, `background #FFFFFF`, `padding:3px`
    - inner: 38×38, `border-radius:10px` — logo image (`contentFit:cover`) or `Monogram` (bg `#D6C3FB`, initials `font-brand` Space Grotesk 700 at `round(38*0.38)=14px`, color `#451391`)
  - Body `View` `margin-top:6px; padding-inline:14px; gap:3px`
    - name `Text` — `font-text-medium` DM Sans 500 / **14px**, color `#17151E`, 1 line
    - then **one of**:
      - `benefitLine` present → `Text` `font-text-medium` DM Sans 500 / **12px**, color **`#5719B6`** (`text-violet-700`), 1 line
      - else `address.short` present → row `flex-row; align-items:center; gap:4px`: lucide **`MapPin`** size **11**, color `#A29FB0`; `Text` `font-text` DM Sans 400 / **12px**, color `#726F80`, `flex:1`, 1 line
      - else nothing
- Partner kind labels (`src/lib/partner-model.ts`, used in the a11y label only): pharmacy → `Farmácia`, laboratory → `Laboratório`, other → `Parceiro`.

### 2.11 `HomeSectionHeader` — shared, used by 2.8/2.9/2.10
`src/components/home/HomeSectionHeader.tsx`
- Row `flex-row; align-items:center; justify-content:space-between; padding-inline:20px`
- Title `Text` — `font-text-bold` DM Sans 700 / **18px**, color `BRAND.ink[950] #0D0C12`, `letter-spacing -0.3px`
- Action `Pressable` (only when both `actionLabel` and `onAction` exist), `hitSlop 8`, `flex-row; align-items:center; gap:2px`, `active:opacity-70`
  - `Text` `font-text-medium` DM Sans 500 / **14px**, color `#6A24DB`
  - lucide **`ChevronRight`** size **16**, color `#6A24DB`

### 2.12 Benefits tutorial overlay (conditional, first launch only)
`useBenefitsTutorial` + `BenefitsTutorialOverlay` — rendered as the last child of `ClientTabScreen`.
- Shows only if: at least one benefit with `tone === 'live'`, profile loaded, and `secureStorage` key `benefits_tutorial_seen_{userId}` is unset. Appears **600ms** after mount. **A returning user does not see it.**
- Bottom sheet modal: backdrop `#0D0C12` at `0.55`; sheet `background #FFFFFF`, top radii **28px** (`radius.sheet`); handle bar 36×4 `#E6E4EC`, `padding-top:10px`; dynamic height capped at `88%` of screen.
  - Header row `padding: 18px 20px 6px`
    - eyebrow **"Seu plano"** — DMSans_500Medium **12px**, `#726F80`, `letter-spacing 0.3px`, `text-transform:uppercase`, `margin-bottom:6px`
    - title — `SpaceGrotesk_500Medium` **22px / lineHeight 27px / letter-spacing -0.3px**, `#17151E`: `"Você tem 1 benefício ativo"` when count === 1, else `` `Você tem ${count} benefícios ativos` ``
    - body — DMSans_400Regular **14/20**, `#726F80`, `margin-top:6px`: **"Toque em um para usar agora. Eles ficam sempre na tela inicial."**
    - close button 36×36 circle, `background #F2F1F6`, lucide **`X`** size 16, color `#403D4A`, `strokeWidth 2.2`
  - list of `BenefitRow` (`src/components/plans/BenefitRow.tsx`)
  - footer `padding: 12px 20px max(safeBottom,16px); gap:4px; background #FFFFFF`
    - primary `Pressable` height **50**, `border-radius:16px` (`radius.control`), `background #7E3BED` (active `#6A24DB`), label **"Entendi"** DMSans_500Medium **16px** `#FFFFFF`
    - secondary `Pressable` height **44**, label **"Ver detalhes do plano"** DMSans_500Medium **14px** `#726F80`

### 2.13 Error state (replaces the whole screen)
Only when `error && !profile`: `ClientTabScreen` → centered column `flex-1 items-center justify-center px-4` (16px)
- `Text` **"Erro ao carregar perfil"** — `font-text-medium` DM Sans 500, `text-lg` **18px**, color `text-destructive` `#EF4444`, `margin-bottom:16px`
- `Button variant="outline"` (nativewindui) with `Text` **"Tentar novamente"** `font-text-medium`

---

# `specs/tabbar-ios.md` — iOS native tab bar

Source: `/Users/legacyn/www/vivamais/vivamaisa-app/src/app/(client)/(tabs)/_layout.ios.tsx`

- Component: `NativeTabs` from `expo-router/unstable-native-tabs` → a **real UIKit `UITabBar`** (not a JS view). Height = system standard: **49pt** bar + home-indicator safe area (**34pt** on notched devices ≈ 83pt total); background = iOS system chrome material (translucent blur over `systemBackground`, hairline top separator `rgba(0,0,0,0.3)` at 0.33pt).
- `tintColor = colors.primary` = **`#7E3BED`** → selected icon + label. Unselected items use the iOS default `secondaryLabel` gray ≈ `#8E8E93` / `rgba(60,60,67,0.6)`.
- `minimizeBehavior="onScrollDown"` — on iOS 26 the bar minimizes when the Home list scrolls down.
- Labels use the **system font (SF Pro), ~10pt medium**, centered under the icon — NOT DM Sans.
- Icons are **SF Symbols**, not lucide (`md` values are the Android/Material fallback used by `_layout.android.tsx`), rendered at ~25pt.

| # | route | label (verbatim) | SF Symbol default | SF Symbol selected | Material fallback |
|---|---|---|---|---|---|
| 1 | `index` | **Início** | `house` | `house.fill` | `home` |
| 2 | `consultas` | **Consultas** | `calendar` | `calendar` | `calendar_month` |
| 3 | `ia` | **IA** | `sparkles` | `sparkles` | `auto_awesome` |
| 4 | `plantao` | **Plantão** | `cross.case` | `cross.case.fill` | `medical_services` |
| 5 | `acoes` | **Ações** | `square.grid.2x2` | `square.grid.2x2.fill` | `apps` |

- On mount the layout prefetches `/(client)/(tabs)/consultas`, `/ia`, `/plantao`, `/acoes` and `/(client)/search`. No badges, no custom backgrounds, no header.
- HTML approximation: fixed bottom bar, 5 equal flex columns, `backdrop-filter: blur(20px); background: rgba(249,249,249,0.94); border-top: 0.5px solid rgba(0,0,0,0.3)`, 49px content height + 34px bottom inset; icon 25px, label 10px `-apple-system` 500; active color `#7E3BED`, inactive `#8E8E93`; tab 1 active on the Home screen.

---

# `specs/primitives.md` — shared primitives

### `ClientTabScreen` — `src/components/client/ClientTabScreen.tsx`
- Props: `children`, `className`, `contentClassName`, `padded = false`, `tabName`, `edges = ['top','left','right']`
- Renders `SafeAreaView` (`react-native-safe-area-context`) with `flex-1 bg-background` (`#FAFAFE`) + `className`; inside, `AnimatedTabTransition` when `tabName` is given, then `View` `flex-1` (+ `px-4` = 16px when `padded`) + `contentClassName`.
- Home passes `edges={['left','right']}` and `className="bg-background"` → **no top safe-area padding**; the ScrollView supplies `insets.top + 8`.
- `AnimatedTabTransition` is a **pass-through on iOS**; on Android it slides `±max(width*0.15, 56)px` → 0 with opacity `0.6 → 1` over 250ms `Easing.out(cubic)` on focus, direction from `useTabDirectionStore`.

### `Text` — `src/components/nativewindui/Text.tsx`
`UITextView` + `cssInterop`. `cva` base class `text-foreground` (`#17151E`). Variants:

| variant | classes | resolved |
|---|---|---|
| largeTitle | `text-4xl` | 36px / 40px |
| title1 | `text-2xl` | 24px / 32px |
| title2 | `text-[22px] leading-7` | 22px / 28px |
| title3 | `text-xl` | 20px / 28px |
| heading | `text-[17px] leading-6 font-semibold` | 17px / 24px / 600 |
| **body (default)** | `text-[17px] leading-6` | 17px / 24px |
| callout | `text-base` | 16px / 24px |
| subhead | `text-[15px] leading-6` | 15px / 24px |
| footnote | `text-[13px] leading-5` | 13px / 20px |
| caption1 | `text-xs` | 12px / 16px |
| caption2 | `text-[11px] leading-4` | 11px / 16px |

Color variants: `primary` (inherit `#17151E`), `secondary` `text-secondary-foreground/90` → `rgba(23,21,30,0.9)`, `tertiary` `text-muted-foreground/90` → `rgba(114,111,128,0.9)`, `quarternary` → `rgba(114,111,128,0.5)`. A `TextClassContext` can inject classes from ancestors. **No font family is set by the variant** — every call site adds `font-text*` explicitly.

### `PillButton` — `src/components/booking/PillButton.tsx`
- `height 52px`, `border-radius 999px` (continuous), `padding-inline 24px`, centered row. Press: scale → `0.98` over 110ms (`DURATION.instant`, `EASE.out`) + haptic impact.
- `variant="primary"`: `background #7E3BED`, active `#6A24DB`, label `#FFFFFF`
- `variant="ghost"`: `background #FFFFFF`, `border 1px #E6E4EC`, active bg `#F9F8FB`, label `#5719B6`
- `disabled`: `background #F2F1F6`, label `#A29FB0`
- Label `Text` `font-text-medium text-base` → **DM Sans 500 / 16px**, 1 line, `adjustsFontSizeToFit` down to 85%
- `loading`: `Spinner` size 18, `strokeWidth 2.4`, color `#FFFFFF` (primary) / `#5719B6` (ghost), label gets `margin-left: 10px` (`ml-2.5`)
- **Not used on the Home screen.**

### `Aura` — `src/components/ambient/Aura.tsx`
- `<Svg width={size} height={size}>` with a radial gradient circle at 50%/50%, r 50%: stops `#9D6BF2 @ 0.22` (0%), `#BC9CF7 @ 0.10` (55%), `#D6C3FB @ 0` (100%); whole SVG multiplied by the `opacity` prop (default 1).
- HTML: `background: radial-gradient(circle, rgba(157,107,242,0.22) 0%, rgba(188,156,247,0.10) 55%, rgba(214,195,251,0) 100%)` on a `size×size` circle.
- **Not used on the Home screen** (used by auth, doctor hero, plantão, AI hub, onboarding).

### `Monogram` — `src/components/booking/Monogram.tsx`
- `initialsFrom(name)`: splits on whitespace, drops the title words `dr`, `dra`, `sr`, `sra` (dots stripped), takes first char of the first word + first char of the last remaining word, uppercased; empty → `"?"`.
- Box: `size × size`, `border-radius = radius ?? size/2` (continuous), background `#D6C3FB` (violet.200) for `tone="light"` / `transparent` for `tone="dark"`, centered.
- Text: `font-brand` = **Space Grotesk 700**, `fontSize = round(size * 0.38)`, color `#451391` (violet.800) light / `#D6C3FB` dark.
- On Home it appears only inside `PartnerLogo` when a partner has no logo (size 38, radius 10, → 14px text).

### `Avatar` — `src/components/Avatar.tsx` (the other monogram path, used by DoctorsSection & NextAppointmentCard)
- Props default `size 40`, `backgroundColor #7E3BED`, `textColor 'white'`. `border-radius = size/2`.
- With a URL: `expo-image` `contentFit:cover`, `cachePolicy memory-disk`, 120ms transition, container bg `#F2F1F6`, centered `ActivityIndicator` (`#7E3BED`) while loading; on error falls back to initials.
- Without: solid `backgroundColor`, initials via first+last word initial (uppercase, `'U'` fallback) rendered with **plain RN `Text`, system font, `fontWeight:'bold'`, `fontSize = size*0.4`** — not DM Sans. No name at all → lucide `User` at `size*0.5`.
- `resolveAvatarUrl` prefixes `API_BASE_URL` for paths beginning with `/`.

### `IllustrationSlot` — `src/components/booking/IllustrationSlot.tsx`
- Renders `View {width,height}` (a11y-hidden) containing `Image` at `100%/100%`, `resizeMode:contain`, `accessibilityIgnoresInvertColors`.
- **Full id → asset map** (paths relative to repo root):

| id | asset |
|---|---|
| `ILL-01` | `assets/illustrations/form-sheet-empty.webp` |
| `ILL-02` | `assets/illustrations/form-sheet-complete.webp` |
| `ILL-08` | `assets/illustrations/optional-skip-attach.webp` |
| `ILL-09` | `assets/illustrations/handoff-sheet.webp` |
| `ILL-10` | `assets/illustrations/anamnese-pen-rest.webp` |
| `search-empty` | `assets/illustrations/empty-next-day.webp` |
| `slots-empty` | `assets/illustrations/empty-time-chips.webp` |
| `search-error` | `assets/illustrations/search-error.webp` |
| `slots-error` | `assets/illustrations/slots-error.webp` |
| `docs-empty` | `assets/illustrations/docs-empty.webp` |
| `consultas-empty` | `assets/illustrations/consultas-empty.webp` |
| `ai-empty` | `assets/illustrations/ai-empty.webp` |
| `pharmacies-empty` | `assets/illustrations/pharmacies-empty.webp` |

- **Not used on the Home screen.** Other illustrations present but outside this map: `account-type-doctor.webp`, `account-type-patient.webp`, `channel-chat.webp`, `channel-video.webp`, `forgot-password.webp`, `plantao-24h.webp` (+ `.png` originals of most `.webp` files).

### Other assets referenced from Home
- Specialty icons (PNG, rendered 18×18 in chips / 24×24 in benefit tiles): `assets/icons/{medico,cardio,neurologia,derma,ortopedia,ginecologia,pediatria,psicologia,nutrologista,urologista,endocrino,geriatra,alergia,fonoaudiologa}.png`
- **No Lottie animation is used on the Home screen.** Available for other screens: `assets/animations/{Lottie1,Lottie2,Lottie3,doctors_cards,folders,loading,notifications,specialities,swipe}.json`
- All other Home icons are inline SVG (`BenefitGlyph`, `AIAssistantIcon`, `PartnerKindGlyph`, `Aura`, `PartnerCover` gradient) or `lucide-react-native`.

### lucide icons on Home (complete inventory)
`Menu` 24/`#17151E` · `Search` 20/`#A29FB0` · `ArrowRight` 16/`#FFFFFF` · `CreditCard` `CalendarDays` `Siren` `FolderOpen` `Store` `Search` `LayoutGrid` all 22/`#6A24DB` strokeWidth 1.9 · `HeartPulse` `Calendar` `FileText` `Pill` `ShieldCheck` 13/`#FFFFFF` strokeWidth 2.4 (AI badges) · `CalendarPlus` 22/`#6A24DB` · `ChevronRight` 18/`#A29FB0` (NextAppointment + PlanStatus), 16/`#A29FB0` (benefit card), 16/`#6A24DB` (section header) · `ShieldCheck` 20/`#6A24DB` strokeWidth 1.9 (plan card) · `Star` 12/`#F59E0B` filled · `MapPin` 11/`#A29FB0` · `X` 16/`#403D4A` strokeWidth 2.2 (tutorial sheet only).