I read every file involved. Note up front: **I operate in read-only mode and cannot create the `.md` files** in `/Users/legacyn/www/vivamais/vivamais-walkthrough-video/specs/`. The three complete specs are below verbatim — paste them into `search.md`, `doctor-profile.md`, `primitives.md`.

---

# Global resolution facts (apply to all three specs)

- **Font class → real family/weight** (`tailwind.config.js` + `src/app/_layout.tsx` `useFonts`):
  - `font-text` → `DMSans_400Regular` (DM Sans 400)
  - `font-text-medium` → `DMSans_500Medium` (DM Sans 500)
  - `font-text-bold` → `DMSans_700Bold` (DM Sans 700)
  - `font-brand` → `SpaceGrotesk_700Bold` (Space Grotesk 700)
  - `font-brand-medium` → `SpaceGrotesk_500Medium` (Space Grotesk 500)
- **`<Text>` default** (`src/components/nativewindui/Text.tsx`, cva variant `body`): `text-[17px] leading-6` + `text-foreground`. `cn()` uses `twMerge`, so a `text-[13px]` className replaces the size but **`leading-6` (line-height 24px) survives unless an explicit `leading-*`/`lineHeight` is given**. Every Text below that has no stated lineHeight renders at **24px line-height**.
- **Palette hexes** (`tokens.json`): ink 50 `#F9F8FB`, 100 `#F2F1F6`, 200 `#E6E4EC`, 300 `#D2CFDB`, 400 `#A29FB0`, 500 `#726F80`, 600 `#55525F`, 700 `#403D4A`, 800 `#282632`, 900 `#17151E`, 950 `#0D0C12`; violet 50 `#F5F0FE`, 100 `#EBE1FD`, 200 `#D6C3FB`, 300 `#BC9CF7`, 400 `#9D6BF2`, 500 `#7E3BED`, 600 `#6A24DB`, 700 `#5719B6`, 800 `#451391`, 900 `#350E6F`, 950 `#22084A`; lime 400 `#C6FF34`, 500 `#ADF20D`; white `#FFFFFF`; canvas `#FAFAFE`; panel `#F3F4FA`; mist `#F3EDFF`.
- **Role classes → hex** (theme.light): `bg-background` = `#FAFAFE`, `bg-card` = `#FFFFFF`, `bg-tint` = `#F3EDFF`, `text-foreground` = `#17151E`, `border-border` = `#E6E4EC`, `bg-primary` = `#7E3BED`.
- `borderCurve: 'continuous'` = iOS squircle; in HTML approximate with the plain `border-radius` given.
- `text-xs` = 12px, `text-sm` = 14px, `text-base` = 16px.

---

# specs/search.md — Doctor search / list `(client)/search`

State documented: arrived from a benefit card, `specialty=Cardiologia` preselected, attends_online, 3 results, **tomorrow** selected in the DayScroller. Today = 2026‑09‑14 (seg), tomorrow = 2026‑09‑15 (ter).

## 0. Route shell
- `src/app/(client)/_layout.tsx` → `<Stack.Screen name="search">`:
  - `headerShown: false`, `presentation: 'containedTransparentModal'`, `animation: 'fade'`, `animationDuration: 180`, `contentStyle.backgroundColor: 'transparent'`, `gestureEnabled: false`.
  - So the screen renders **over** the previous screen; page background is transparent.

## 1. `SearchMorphSurface` (src/components/search/SearchMorphSurface.tsx)
- Root `View` `{flex:1}`.
- **Backdrop**: absolute fill, `backgroundColor: rgba(13, 11, 30, 0.32)` (literal, not a token). Contains a full-bleed `Pressable` that closes. Opacity = morph progress × drag fade.
- **Surface** (`styles.surface` + animated):
  - `position:absolute`, `backgroundColor:'#FFFFFF'`, `borderCurve:'continuous'`, `overflow:'hidden'`.
  - Animated from the benefit-card origin rect (`ox/oy/ow/oh` params) to the docked state:
    - `left: origin.x → 0`
    - `top: origin.y → insets.top + 6`
    - `width: origin.width → screen width`
    - `height: origin.height → screenHeight − (insets.top + 6)`
    - `borderRadius: 16 (origin present) → 26` (`TARGET_RADIUS`); with no origin, from-radius is also 26 and the from-rect is `{x:0, y:screenHeight, w:screenWidth, h:targetHeight}`
    - `opacity: interpolate(p,[0,0.08],[0,1],'clamp')`
  - Open timing: 360 ms `cubic-bezier(0.32, 0.72, 0, 1)`. Close: 230 ms `cubic-bezier(0.4, 0, 0.9, 0.6)`.
  - Inner content wrapper `{width: screenWidth, height: targetHeight}`, opacity `interpolate(p,[0.22,0.7],[0,1],'clamp')`.
  - Pan-to-dismiss: activates after +12px Y, only when list `scrollOffset ≤ 5`; dismiss past 130px; downward drag is 1:1, upward drag ×0.1.
- **Settled/rendered state (what you draw)**: a white sheet, **top = safe-area-top + 6px, left 0, right 0, to bottom of screen**, `border-radius: 26px` on all corners, clipped, sitting on `rgba(13,11,30,0.32)` backdrop.

## 2. Screen body (inside the surface)
- Outer `View className="flex-1"` with `style={{backgroundColor: BRAND.canvas}}` → `#FAFAFE`. (The white surface is behind; visible content bg is `#FAFAFE`.)

### 2.1 Grabber
- `View className="items-center pb-1 pt-2"` → padding-top 8, padding-bottom 4, children centered.
- Bar: `width 36, height 4, borderRadius 2, backgroundColor #D2CFDB` (ink.300).

### 2.2 `SearchHeader`
Container: `flex-row items-center px-5 py-2` + `gap: 10` → padding 8px 20px, horizontal row, vertically centered, 10px gaps.

- **Back button** (`Pressable`):
  - `width 44, height 44`, `rounded-full` (22px), `bg-ink-100` = `#F2F1F6`; pressed `bg-ink-200` `#E6E4EC`.
  - centered content; accessibilityLabel `"Voltar"`.
  - Icon: lucide **`ArrowLeft`**, `size 20`, `color #17151E` (ink.900), stroke width default 2.
- **Search field** (`View`, `flex-1`):
  - `height 44`, `borderRadius 16`, `borderCurve continuous`, `gap 8`, `border: 1px solid #E6E4EC` (`border-ink-200`), `background #FFFFFF`, `padding-left/right 12` (`px-3`), row, items-center.
  - Icon: lucide **`Search`**, `size 18`, `color #A29FB0` (ink.400).
  - `TextInput` `flex-1`, `font-text` (DM Sans 400), `fontSize 15`, `color #17151E`, `paddingVertical: 0`.
    - Placeholder copy: **"Especialidade ou médico"**, placeholder color `#A29FB0`.
    - In this state the user typed nothing (they arrived via specialty param, not query) → **placeholder is shown, no clear button**.
  - Clear button (only when `value.length > 0`): 24×24, centered, lucide **`X`** `size 16` color `#A29FB0`, hitSlop 8, label `"Limpar busca"`.
- **Filters button**:
  - 44×44, `rounded-full`, `bg-ink-100` `#F2F1F6` (active `#E6E4EC`).
  - Icon: lucide **`SlidersHorizontal`**, `size 20`, `color #17151E`.
  - **Badge** (rendered because `filterCount = 1`; `activeFilterCount` counts specialty≠null): absolute `top: 2, right: 2`, `minWidth 18`, `height 18`, `rounded-full`, `bg-violet-500` `#7E3BED`, `px-1` (4px), centered.
    - Text: **"1"**, `font-text-bold` (DM Sans 700), `11px`, line-height 24px (inherited `leading-6`), color `#FFFFFF`.
  - accessibilityLabel in this state: `"Filtros, 1 ativos"`.

### 2.3 FlatList
- `contentContainerStyle={{ paddingBottom: 40 }}`, no scroll indicator, `keyboardShouldPersistTaps="handled"`, `scrollEventThrottle 16`.

### 2.4 `ListHeaderComponent` (in render order)

#### a) Plantão banner wrapper
- `View className="pb-5 pt-1"` → padding-top 4, padding-bottom 20.

#### b) `PlantaoBanner` (src/components/search/PlantaoBanner.tsx)
- Root `Pressable` `mx-5` (margin 0 20px), `borderRadius 22`, `borderCurve continuous`, `overflow hidden`; active opacity 0.95. accessibilityLabel `"Plantão 24h, médico online agora"`. Fires `haptic.impact()`.
- `LinearGradient` colors `['#22084A', '#451391']` (violet.950 → violet.800), `start {x:0,y:0}` → `end {x:1,y:1}` (135° diagonal), style: `flexDirection row, alignItems center, paddingLeft 18, minHeight 84`.
- Left column `View className="flex-1 py-3.5"` (padding-top/bottom 14):
  - Title **"Plantão 24h"** — `font-brand-medium` (Space Grotesk 500), `fontSize 18, lineHeight 22, letterSpacing -0.18`, color `#FFFFFF`.
  - Subtitle **"Médico online em minutos."** — `mt-1` (4px), `font-text` (DM Sans 400), `13px / 18px`, color `#D6C3FB` (violet.200).
  - CTA row `mt-2.5` (10px), row, items-center:
    - **"Entrar na fila"** — `font-text-bold` (DM Sans 700), `13px`, line-height 24px inherited, color `#C6FF34` (lime.400).
    - lucide **`ArrowRight`**, `size 14`, `color #C6FF34`, `marginLeft: 4`.
- Right art: `expo-image` of `assets/illustrations/plantao-24h.webp`, `width 92, height 92, marginRight 12, contentFit contain`, a11y-hidden.

#### c) `DayScroller` (src/components/search/DayScroller.tsx)
Constants: `CELL_WIDTH = 48`, `GUTTER = 20`, `NAV = 28`, `WEEKS = 14`, all 7 weekdays allowed, past days filtered out.

- **Header row**: `flex-row items-center justify-between px-5` (padding 0 20px).
  - Month label: `monthLabel(value)` = `date-fns format(…, 'MMMM', ptBR)` with first letter uppercased → for 2026‑09‑15: **"Setembro"**.
    - `font-text-bold` (DM Sans 700), `15px`, line-height 24px inherited, color `#17151E`.
  - Nav group: row, `gap: 8`.
    - Each `NavButton`: `width 28, height 28, borderRadius 14`, centered, `backgroundColor #F2F1F6` (ink.100), `opacity 0.35` when disabled, hitSlop 8.
    - Prev: lucide **`ChevronLeft`** `size 16` color `#17151E`; label `"Mês anterior"`. **Disabled in this state** (current month === month of `days[0]`), so opacity 0.35.
    - Next: lucide **`ChevronRight`** `size 16` color `#17151E`; label `"Próximo mês"`; enabled (October exists).
- **Horizontal ScrollView**: `contentContainerStyle {paddingHorizontal: 20, paddingTop: 10}`, `snapToInterval 48`, `decelerationRate "fast"`, no indicator. Auto-scrolls to `x = max(0, (indexOfSelected − 1) * 48)` → with tomorrow selected, index 1 → `x = 0`.
- **Each cell** = `DayCell` with `width = 48` and a `caption`:
  - caption = `"Hoje"` for today, `"Amanhã"` for tomorrow, else `day.weekdayShort` from `['seg','ter','qua','qui','sex','sáb','dom']`.
  - This state, left→right: `Hoje/14` (unselected), **`Amanhã/15` (selected)**, `qua/16`, `qui/17`, `sex/18`, `sáb/19`, `dom/20`, `seg/21`, …
- **DayCell rendering** (src/components/booking/DayCell.tsx, `DAY_CELL = 40`):
  - Pressable: `width 48`, `alignItems center` (flex:undefined since width given).
  - Caption Text: `mb-1` (4px), `font-text-medium` (DM Sans 500), `11px`, line-height 24px inherited; color **`#5719B6`** (violet.700) when selected, else **`#A29FB0`** (ink.400).
  - Number puck: `40×40`, `borderRadius 20`, centered; background `#7E3BED` when selected, else `transparent`.
    - Number Text: `fontSize 16, lineHeight 20`; family `font-text-bold` (DM Sans 700) when selected **or** isToday, else `font-text-medium` (DM Sans 500).
    - Color: selected → `#FFFFFF`; unavailable (`!day.available`) → `#D2CFDB`; isToday → `#5719B6`; else `#17151E`.
    - In DayScroller all weekdays are allowed so `available` is true for all non-past days.
  - Dot: `4×4`, `borderRadius 2`, `marginTop 2`, background `#BC9CF7` (violet.300) when `available && !selected`, else `transparent` (i.e. the selected cell shows **no** dot).
  - Tap: `haptic.select()`; if muted → `haptic.warn()` + toast `"Sem atendimento às {segundas|terças|quartas|quintas|sextas|sábados|domingos}"`.
  - Cell a11y label: `"{weekdayShort} {day}"` e.g. `"ter 15"`.

#### d) `ActiveFilterChips` wrapper
- Rendered because `chips.length > 0`. Wrapper `View className="pt-3"` → padding-top 12.
- `ActiveFilterChips` (src/components/search/ActiveFilterChips.tsx): horizontal `ScrollView`, `contentContainerStyle {paddingHorizontal: 20, gap: 8, alignItems:'center'}`.
- **In this state exactly one chip**: `{key:'specialty', label:'Cardiologia'}` (label resolved through `specialtyOptions`, falling back to the raw param).
  - Chip `View`: `height 32`, `rounded-full` (9999), `bg-ink-100` `#F2F1F6`, `pl-3` 12px left, `pr-2` 8px right, row, items-center.
  - Label Text: **"Cardiologia"**, `font-text-medium` (DM Sans 500), `13px`, line-height 24px inherited, color `#403D4A` (ink.700).
  - Remove button: `ml-1.5` (6px), hitSlop 8, a11y label `"Remover filtro Cardiologia"`; lucide **`X`** `size 14`, `color #A29FB0`.
  - **"Limpar" is NOT rendered** — it only appears when `chips.length > 1`. (Its style, for reference: `font-text-medium 13px`, color `#5719B6` violet.700.)

#### e) `RecentDoctorsRow` — **NOT rendered in this state**
- Gate: `showRecent = filterCount === 0 && query is empty`; here `filterCount === 1`, so it's hidden.
- Reference spec (src/components/search/RecentDoctorsRow.tsx): wrapper `pt-6` (24px); heading **"Consultados recentemente"** `mb-3 px-5 font-text-bold 15px #17151E`; horizontal ScrollView `paddingHorizontal 20, gap 16`; each item `width 72`, centered: `DoctorAvatar size 56 radius 18`, then first-name Text `mt-2`, centered, `font-text` 12px, color `#726F80` (ink.500), 1 line. First name strips leading `dr|dra|sr|sra` tokens.

#### f) Spacer
- `View className="h-5"` → **20px** tall.

### 2.5 List rows — 3 × `DoctorRow`
Each wrapped in `Animated.View entering={entrance(index, reducedMotion)}` = `FadeInDown`, duration **320 ms** (`motion.duration.layout`), delay `index × 60 ms` (capped at index 7), easing `cubic-bezier(0.22, 1, 0.36, 1)`.

`DoctorRow` (src/components/search/DoctorRow.tsx):
- Root `Pressable`: `borderRadius 20`, `borderCurve continuous`, `minHeight 84`; `mx-5` (20px), `mb-2.5` (10px), `px-4` (16px), `py-3.5` (14px), row, items-center.
  - **Not benefit-covered** → `bg-white` `#FFFFFF`, pressed `bg-ink-50` `#F9F8FB`.
  - **Benefit-covered** (`benefitLabel !== null`) → `bg-tint` = **`#F3EDFF`** (mist), pressed opacity 0.9. Since this session arrived from a benefit card, rows matching the benefit render in mist.
- **Avatar**: `DoctorAvatar doctor size={56} radius={18}` → 56×56, `borderRadius 18`, `overflow hidden`, `expo-image contentFit cover`, `transition 160ms`. On missing/failed URL → `Monogram` (see primitives): 56×56, r18, bg `#D6C3FB`, initials in Space Grotesk 700 at `round(56*0.38) = 21px`, color `#451391`.
- **Middle column** `View className="ml-3 flex-1"` (12px left):
  - Name: `font-text-bold` (DM Sans 700), `16px`, line-height 24px, color `#17151E`, `numberOfLines 1`.
  - Specialty (when present): `mt-0.5` (2px), `font-text` (DM Sans 400), `13px`, line-height 24px, color `#726F80` (ink.500), 1 line. Here: **"Cardiologia"**.
  - Rating row: `mt-1.5` (6px), row items-center.
    - If `rating_count > 0`: lucide **`Star`** `size 12`, `color #17151E`, **`fill #17151E`**; then rating Text `ml-1` (4px), `font-text-medium`, `12px`, color `#403D4A` (ink.700), value = `formatRating(average_rating)` = `toFixed(1).replace('.',',')` → e.g. **"4,9"**; then count Text `ml-1`, `font-text`, `12px`, color `#A29FB0` (ink.400), literally **"(128)"** (parenthesised).
    - Else single Text **"Novo na Viva"**, `font-text`, `12px`, `#A29FB0`.
  - Benefit line (only when covered): `mt-1.5` (6px), `font-text-medium`, `12px`, color `#5719B6` (violet.700), 1 line, copy exactly **"Coberto pelo seu benefício"**.
- **Right column** `View className="ml-2 items-end"` (8px left, right-aligned):
  - Price: `font-text-bold`, `16px`, color `#17151E`. Value from `resolveDoctorPrice(...).label`: integer → `"R$ 89"`; decimal → `"R$ 89,90"`; missing → **"Sob consulta"**.
  - If `availableToday` (doctor has an `online` availability on today's API weekday): row `mt-1` (4px), items-center:
    - Dot `6×6`, `borderRadius 3`, background `#ADF20D` (lime.500).
    - Text `ml-1.5` (6px), `font-text-medium`, `12px`, color `#403D4A`, copy **"Hoje"**.
  - Else: Text `mt-1`, `font-text`, `12px`, color `#A29FB0`, copy **"por consulta"**.
- a11y label composition: `"{name}, {specialty}, avaliação {4,9} de {128} pacientes, {price}"`, or `…, novo na Viva, …`.

### 2.6 Other list states (not active here, for completeness)
- **loading**: `View className="px-5"` with 6 × `SkeletonRow` (keys `s1..s6`).
- **error**: `SearchError offline={…}`.
- **empty**: `SearchEmpty` with `dateLabel = dayLabel(filters.date, today)` from `src/lib/search-dates.ts` → `"Hoje"` | `"Amanhã"` | `"{weekdayShort lowercase} {dayNumber}"` (e.g. `"qua 16"`).

## 3. `FilterSheet` (sibling of the morph surface, closed in this state)
`src/components/search/FilterSheet.tsx`, `@gorhom/bottom-sheet`, `index={-1}` (closed) until the filters button presents it.

- Sheet container: `snapPoints: ['88%']`, `topInset = insets.top`, `enablePanDownToClose`, `enableContentPanningGesture false`, `enableDynamicSizing false`.
  - `backgroundStyle`: `backgroundColor #FFFFFF`, `borderRadius 26`.
  - `handleIndicatorStyle`: `backgroundColor #D2CFDB` (ink.300).
  - Backdrop: `opacity 0.32`, `pressBehavior 'close'`, appears on index 0.
- ScrollView `contentContainerStyle {paddingBottom: 120}`.
- **Title row**: `flex-row items-center justify-between px-5 pb-4 pt-1` (20px sides, top 4, bottom 16).
  - **"Filtros"** — `font-brand-medium` (Space Grotesk 500), `22px`, line-height 24px inherited from `leading-6`, color `#17151E`.
  - **"Limpar"** — `font-text-medium` (DM Sans 500), `14px`, color `#726F80` (ink.500); hitSlop `{t14,b14,l12,r12}`; a11y `"Limpar filtros"`.
- **`SectionLabel`** (used for every section): `mb-3` (12px), `px-5`, `font-text-bold`, `15px`, color `#17151E`.
- **Section "Especialidade"**:
  - Search field: `mx-5 mb-3`, `height 44`, `borderRadius 16`, `borderCurve continuous`, `border 1px #E6E4EC`, `background #F9F8FB` (ink.50), `px-3`, row items-center.
    - lucide **`Search`** `size 18` color `#A29FB0`.
    - `TextInput` `flex:1, marginLeft: 8, fontSize 15, color #17151E`, `font-text`; placeholder **"Buscar especialidade"** in `#A29FB0`.
  - Chip wrap: `flex-row flex-wrap gap-2 px-5` (8px gap, 20px sides), first 30 specialties (or all matches when searching). Each `Chip` gets `icon={getSpecialtyImage(label)}` — for "Cardiologia" that resolves to `assets/icons/cardio.png` (match rule `name.includes('cardio')`), and would be **selected** here.
- **Section "Benefício"** (only when `benefits.length > 0`): wrapper `mt-6` (24px), label, chip wrap `gap-2 px-5`, no icons.
- **Section "Preço"**: `mt-6`, label, `Segmented` with options **"Qualquer" / "Até R$ 100" / "Até R$ 200" / "Até R$ 300"**.
- **Section "Avaliação"**: `mt-6`, label, `Segmented` with **"Qualquer" / "4+" / "4,5+"**.
- **Section "Favoritos"**: `mt-6`, label, `View className="flex-row px-5"` with a single `Chip` labelled **"Só favoritos"**.
- **Section "Ordenar"**: `mt-6`, label, chip wrap with **"Relevância" / "Menor preço" / "Melhor avaliação"**.
- **`Segmented` styling**: track `mx-5 flex-row rounded-full bg-ink-100 p-1` → 20px side margin, pill, `#F2F1F6`, 4px inner padding. Each option `h-9` (36px) `flex-1` centered `rounded-full`; selected adds `bg-white` `#FFFFFF`. Label: selected → `font-text-medium 12px #17151E`; unselected → `font-text 12px #726F80`. Tapping fires `haptic.select()`.
- **Footer** (`BottomSheetFooter`, `bottomInset 0`): `paddingHorizontal 20, paddingTop 12, paddingBottom max(insets.bottom, 16)`, `backgroundColor #FFFFFF`, shadow `color #17151E, offset (0,-8), opacity 0.1, radius 24, elevation 12`.
  - Contains a `PillButton variant="primary"` whose label is: `"Nenhum médico"` (0) | `"Ver 1 médico"` (1) | **`"Ver 3 médicos"`** (n>1 — this state).

## 4. Data/labels used by this screen
- Query: `type 'DOCTOR'`, `attends_online: true`, `available_date = filters.date`, `page_size 30`, plus `speciality`, `name` (only when no specialty and query ≥ 3 chars, debounced 250 ms), `benefit_id`.
- Chip label sources (`src/lib/search-filters.ts`): price `"Até R$ 100/200/300"`, rating `"4+" / "4,5+"`, favorites `"Favoritos"`, sort `"Menor preço" / "Melhor avaliação"` (relevance produces no chip), benefit fallback `"Benefício"`.

---

# specs/doctor-profile.md — Doctor profile `(client)/doctor/[id]`

Route options: `headerShown false`, `presentation 'containedModal'`, `animation 'ios_from_right'`, `gestureDirection 'horizontal'`.

## 0. Screen root
- `View className="flex-1 bg-background"` → background **`#FAFAFE`** (canvas).
- Children in mount order: `Animated.ScrollView` (content), then `DoctorHero` (absolute, overlays top), then `BookingBar` (absolute, overlays bottom).

## 1. ScrollView
- `onScroll` writes `scrollY`; `scrollEventThrottle 16`; no vertical indicator.
- `contentContainerStyle`: `paddingTop = HERO_MAX_HEIGHT + 16 = 380 + 16 = **396px**`, `paddingBottom = insets.bottom + 140`.

## 2. `cardStyle` (defined in `[id].tsx`, shared by both cards)
```
backgroundColor: '#FFFFFF'
borderRadius: 24
borderCurve: 'continuous'
paddingHorizontal: 16
paddingVertical: 4
```
No border, no shadow. Cards sit inside `className="px-5"` wrappers → 20px page gutters, so card width = screenWidth − 40.

## 3. Card 1 — About + Reviews
- Wrapper `Animated.View entering={entrance(0)}` (`FadeInDown`, 320 ms, delay 0, ease `cubic-bezier(0.22,1,0.36,1)`), `className="px-5"`.
- `View style={cardStyle}` containing, in order: `AboutSection`, a 1px divider, `ReviewsSection`.
- **Divider**: `View style={{height: 1, backgroundColor: '#F2F1F6'}}` (ink.100), full card inner width.

### 3.1 `AboutSection` → rendered inside `Expandable title="Sobre"`
- **Expandable header** (`src/components/booking/Expandable.tsx`): `Pressable className="flex-row items-center justify-between py-3"` → 12px vertical padding.
  - Title **"Sobre"** — `font-text-bold` (DM Sans 700), `18px`, line-height 24px, color `#17151E`.
  - Optional count Text (unused here): `ml-2 font-text text-sm #726F80`.
  - Chevron: lucide **`ChevronDown`** `size 20`, `color #726F80` (ink.500); rotates `0deg → 180deg` over 320 ms when open.
  - Body animates `height 0 → measuredHeight` and `opacity 0 → 1`, same 320 ms/ease. `defaultOpen = false` → **collapsed by default**.
- **Body** `View className="pb-4"` (16px bottom):
  - Bio Text: `font-text` (DM Sans 400), `text-base` = **16px / leading-6 = 24px**, color `#403D4A` (ink.700). Fallback copy when no bio: **"Este médico ainda não escreveu uma apresentação."**
  - `InfoRow` (only if present), one per line: `mt-3` (12px), row items-center.
    - Label Text: `font-text` `14px`, `#726F80`. Values: **"CRM"** (from `doctor.medical_register`), **"RQE"** (first specialty item with a non-empty `rqe`).
    - Value Text: `ml-2` (8px), `font-text-medium` `14px`, `#17151E`.
  - Specialty picker (only when `specialties.length > 1`): `View className="mt-4"` (16px):
    - Label **"Especialidade"**: `mb-2` (8px), `font-text-medium`, `14px`, `#726F80`.
    - `View className="flex-row flex-wrap gap-2"` with one `Chip` per specialty (see primitives); selected = current `specialtyId`.
  - Joined year (only when `user.date_joined` parses): `mt-4`, `font-text`, `14px`, `#A29FB0` (ink.400), copy **`Na Viva desde {YYYY}`** e.g. "Na Viva desde 2023".

### 3.2 `ReviewsSection` → `Expandable title="Avaliações" count={ratingCount || undefined}`
- Header identical to above; title **"Avaliações"** `font-text-bold 18px #17151E`; count badge Text `ml-2 font-text 14px #726F80` showing the raw number e.g. **"128"**. Opening triggers the ratings query (`enabled: opened`).
- Body `View className="pb-4"`:
  - **Loading**: two `SkeletonRow avatarSize={36} lines={2}`.
  - **Error**: Text `py-3 font-text 14px #726F80` → **"Não conseguimos carregar as avaliações."**
  - **Empty**: Text `py-3 font-text 14px #726F80` → **"Ainda sem avaliações"**
  - **Ready**: first 3 reviews (`PREVIEW_COUNT = 3`), then optional "see all".
    - `ReviewRow`: `View className="border-t border-ink-100 py-3"` → top border `1px #F2F1F6`, 12px vertical padding.
      - Top row `flex-row items-center justify-between`:
        - Patient name Text: `font-text-medium` `14px` `#17151E`; fallback copy **"Paciente"**.
        - `Stars`: row of 5 lucide **`Star`** `size 12`; index < rating → `color #7E3BED`, `fill #7E3BED`; else `color #D2CFDB`, `fill 'transparent'`.
      - Comment (optional): `mt-1.5` (6px), `font-text`, `14px / leading-5 = 20px`, color `#403D4A`.
      - Date (optional): `mt-1.5`, `font-text`, `text-xs` 12px, color `#A29FB0`; format `date-fns "d 'de' MMM 'de' yyyy"` ptBR → e.g. **"3 de set de 2026"**.
    - "See all" (only if `!showAll && reviews.length > 3`): `Pressable className="pt-3"` hitSlop 6; Text `font-text-medium` `14px` color `#5719B6` (violet.700), copy **`Ver todas ({total})`** e.g. "Ver todas (128)" where total = `data.total ?? ratingCount`.

- **Fallback states of card 1**: if the doctor fetch failed with no seed → `<SearchError offline={…}/>`; while pending with no seed → `View className="px-5"` containing `SkeletonRow avatarSize={44} lines={2}`.

## 4. Card 2 — "Escolha o horário"
- Wrapper `Animated.View entering={entrance(1)}` (FadeInDown 320 ms, **delay 60 ms**), `className="mt-6 px-5"` → 24px top margin, 20px gutters.
- **`SectionHeading title="Escolha o horário"`** (src/components/booking/SectionHeading.tsx):
  - `View className="flex-row items-center justify-between"`.
  - Title Text: `font-brand-medium` (Space Grotesk 500), `fontSize 22, lineHeight 28, letterSpacing -0.22`, color `#17151E`. Copy exactly **"Escolha o horário"**.
  - No `action` passed here (the optional action would be `font-text-medium text-sm #5719B6`).
- `View style={[cardStyle, {marginTop: 14}]}` containing `WeekCalendar`, divider, `SlotGrid`.
- **Divider**: `height 1, backgroundColor #F2F1F6, marginVertical 18`.

### 4.1 `WeekCalendar` (src/components/doctor/WeekCalendar.tsx)
`NAV = 32`, `DAY_CELL = 40`, 8 week pages (`WEEK_COUNT`), paged horizontally at the measured card inner width.

- **Header row** `flex-row items-center justify-between`:
  - Month title Text (`accessibilityRole="header"`): `font-text-bold` (DM Sans 700), `fontSize 16, lineHeight 20`, color `#17151E`. Value = `monthTitle(page)` = `format(…, 'MMMM yyyy', ptBR)` with first letter uppercased, of the month that dominates the visible week → e.g. **"Setembro 2026"**.
  - Nav group row, `gap 8`:
    - `NavButton`: `32×32`, `borderRadius 16`, centered, `backgroundColor #F2F1F6`, disabled opacity 0.35, hitSlop 8. Press fires `haptic.select()`.
    - Prev: lucide **`ChevronLeft`** `size 18` color `#17151E`, label `"Semana anterior"`, disabled when `page === 0`.
    - Next: lucide **`ChevronRight`** `size 18` color `#17151E`, label `"Próxima semana"`, disabled at last page.
- **Weekday header** `View className="mt-4 flex-row"` (16px top). Seven Texts, each `flex-1 text-center font-text-medium text-xs text-ink-400` → DM Sans 500, 12px, line-height 24px, `#A29FB0`, centered, equal width. Letters, in order: **`D S T Q Q S S`** (`WEEK_HEADERS`; note columns run Sunday→Saturday).
- **Paged ScrollView**: `style {marginTop: 6}`, `pagingEnabled`, horizontal, no indicator. Each page `View {width: cardInnerWidth, flexDirection:'row'}` with 7 `DayCell`s (no `width` prop → each `flex: 1`, no caption).
- Before layout is measured, a placeholder `View {height: DAY_CELL + 6 + 6 = 52}` is rendered.
- **DayCell here** (no caption line): `flex:1`, centered; 40×40 puck `borderRadius 20`; selected bg `#7E3BED` with white 16/20 DM Sans 700 number; today (unselected) number `#5719B6` DM Sans 700; available `#17151E` DM Sans 500; unavailable/past `#D2CFDB`; availability dot `4×4 r2 marginTop 2` `#BC9CF7` only when `available && !selected`.
- Availability set = `onlineWeekdays(doctor)` (weekdays with an `online` availability entry).

### 4.2 `SlotGrid` (src/components/doctor/SlotGrid.tsx)
Constants: `SKELETON_COUNT 8`, `COLUMNS 4`, `GAP 8`, `CELL_HEIGHT 44`.
`cellWidth = (measuredWidth − 8 × 3) / 4` — measured width is the card inner width (screenWidth − 40 − 32).

- **loading**: `View className="flex-row flex-wrap" style={{gap: 8}}` with 8 `SkeletonBox` of `width = cellWidth (or 76 before layout)`, `height 44`, `borderRadius 12` (pulsing `#e8e8ed`, opacity 0.3↔0.7, 800 ms each way).
- **error**: `View className="items-start"`:
  - `IllustrationSlot id="slots-error" width={120} height={90}` → `assets/illustrations/slots-error.webp`, `resizeMode contain`.
  - Text `mt-3 font-text text-sm text-ink-500` → 14px `#726F80`, copy **"Não conseguimos carregar os horários."**
  - `View className="mt-3"` with `PillButton variant="ghost" label="Tentar de novo"`.
- **empty**: `View className="items-center py-2"` (8px vertical):
  - `IllustrationSlot id="slots-empty" width={120} height={90}` → `assets/illustrations/empty-time-chips.webp`.
  - Text `mt-4 text-center font-text text-sm text-ink-500` → 14px `#726F80`, copy **`Sem horários em {dayText}.`** where `dayText = dayLabel(activeDate)` from `doctor-schedule` = **`{seg|ter|qua|qui|sex|sáb|dom} {dayNumber}`** e.g. "Sem horários em ter 15."
  - If a next date exists: `Pressable className="mt-1.5"` hitSlop 6 with Text `font-text-medium text-sm text-violet-700` (14px `#5719B6`), copy **`Próximo dia com vagas: {nextDayText}`** e.g. "Próximo dia com vagas: qui 17".
  - Else Text `mt-1.5 text-center font-text text-sm text-ink-400` (12px? no — 14px, `#A29FB0`), copy **"Tente outra data."**
- **ready**: `View style={{gap: 18}}` with one block per period group from `groupSlots`:
  - Group order is always **manhã → tarde → noite**; empty groups are dropped. Period boundaries: `< 12:00` = manhã, `12:00–17:59` = tarde, `≥ 18:00` = noite.
  - Group label Text: `mb-2` (8px), `font-text-medium` (DM Sans 500), `text-xs` **12px**, `uppercase`, `tracking-wide` (letter-spacing 0.025em), color `#A29FB0` (ink.400). Source strings are **"Manhã" / "Tarde" / "Noite"** → rendered uppercase as **"MANHÃ" / "TARDE" / "NOITE"**.
  - Slot row: `View className="flex-row flex-wrap" style={{gap: 8}}`.
  - **`SlotCell`**: `width = cellWidth`, `height 44`, `borderRadius 12`, `borderCurve continuous`, centered, `borderWidth 1`.
    - Unselected: `backgroundColor #F9F8FB` (ink.50), `borderColor #E6E4EC` (ink.200), label `font-text-medium` (DM Sans 500), `fontSize 15`, color `#17151E`.
    - Selected: `backgroundColor #7E3BED`, `borderColor #7E3BED`, label `font-text-bold` (DM Sans 700), `fontSize 15`, color `#FFFFFF`.
    - Label copy = `slot.start`, zero-padded `HH:MM` e.g. **"16:00"**. Tap fires `haptic.select()`.
  - Slots are filtered to `status === 'free' && type === 'online'`, deduped by start, sorted ascending; on today, slots at/earlier than now are dropped.

## 5. `DoctorHero` (src/components/doctor/DoctorHero.tsx)

Constants: **`HERO_MAX_HEIGHT = 380`**, `HERO_BAR_HEIGHT = 96`, `CIRCLE = 44`.
- `minHeight = 96 + insets.top` → **collapsed height = 96 + safe-area-top** (e.g. 96 + 59 = 155 on a notched iPhone; 96 + 47 on others).
- `range = 380 − minHeight` (e.g. 380 − 155 = **225**).

### 5.1 Container
- `position absolute, top 0, left 0, right 0`, `overflow hidden`, `backgroundColor #22084A` (violet.950), `borderBottomLeftRadius 30`, `borderBottomRightRadius 30`, `borderCurve continuous`.
- Animated height:
  - `scrollY < 0` (overscroll): `height = 380 − y × 0.6` (grows); reduced motion → fixed 380.
  - `scrollY ≥ 0`: `height = max(minHeight, 380 − y)` — 1:1 shrink, clamped.

### 5.2 Layers, back to front
1. **Photo layer** — `Animated.View` at `StyleSheet.absoluteFill`:
   - With `avatar_url`: `expo-image` filling the hero, `contentFit cover`, `transition 220ms`, a11y label = doctor name.
   - Without: `View className="flex-1 items-center justify-center"` with `Monogram name size={150} tone="dark"` → 150×150, `borderRadius 75`, **transparent** background, initials in Space Grotesk 700 at `round(150 × 0.38) = 57px`, color `#D6C3FB` (violet.200).
   - Animated:
     - overscroll (`y<0`): `opacity 1`, `scale = 1 + (−y / 380)`, `translateY 0`.
     - forward: `opacity = interpolate(y, [range×0.35, range×0.85], [1, 0], CLAMP)`; `scale = interpolate(y, [0, range], [1, 1.12], CLAMP)`; `translateY = interpolate(y, [0, range], [0, range×0.18], CLAMP)` (e.g. 0 → 40.5px at range 225).
2. **Bottom scrim** `LinearGradient` over the full hero, vertical, colors `[rgba(34,8,74,0)`, `rgba(34,8,74,0.55)`, `#22084A]` at `locations [0.52, 0.76, 1]`.
3. **Top scrim** `LinearGradient`, `position absolute top 0 left 0 right 0`, `height = insets.top + 72`, vertical colors `[rgba(34,8,74,0.7) → rgba(34,8,74,0)]`.
4. **Aura** — `View position absolute, left −80, bottom −120`, containing `<Aura id="doctor-hero" size={360} opacity={0.85} />`: a 360×360 SVG radial gradient circle, stops `#9D6BF2 @22%` at 0%, `#BC9CF7 @10%` at 55%, `#D6C3FB @0%` at 100%, whole SVG at 0.85 opacity.
5. **Expanded title block** — `Animated.View` `position absolute, left 20, right 20, bottom 22`, `pointerEvents none`, opacity `interpolate(scrollY, [0, range×0.5], [1, 0], CLAMP)`:
   - Doctor name Text, `numberOfLines 2`: `font-brand` (Space Grotesk **700**), `fontSize 28, lineHeight 32, letterSpacing -0.42`, color `#FFFFFF`. Copy = `doctor.name` (e.g. "Dra. Marina Ribeiro").
   - Row `mt-2` (8px), `flex-row items-center`:
     - `SpecialtyLine name={specialtyName} tone="dark"`: row with `gap 6`; specialty icon `expo-image` `16×16 contentFit contain opacity 0.9` (for "Cardiologia" → `assets/icons/cardio.png`), or lucide **`Stethoscope`** `size 14` `color #D6C3FB` when no icon matches; then Text `flex-shrink`, `font-text-medium` (DM Sans 500), `text-sm` **14px** (size default `md`), line-height 24px, color `#D6C3FB` (violet.200), 1 line.
     - **Rating pill** (only if `average_rating > 0`): `ml-3` (12px), `px-2.5 py-1` (10px/4px), row items-center, `borderRadius 999`, `borderCurve continuous`, `backgroundColor rgba(255,255,255,0.14)`.
       - lucide **`Star`** `size 12`, `color #FFFFFF`, **`fill #FFFFFF`**.
       - Text `ml-1` (4px), `font-text-medium`, `text-xs` 12px, color `#FFFFFF`, value `formatRating(rating)` (`src/lib/formatters.ts`) = `toFixed(1).replace('.', ',')` → **"4,9"**.
6. **Top bar** — plain `View` (always fully opaque), `position absolute, top = insets.top + 8, left 20, right 20, height 44`, `flexDirection row, alignItems center`:
   - **Back `CircleButton`**: `44×44`, `borderRadius 22`, `borderCurve continuous`, centered, `backgroundColor rgba(34, 8, 74, 0.32)` (= `withOpacity(violet.950, 0.32)`), hitSlop 6, a11y `"Voltar"`. Icon lucide **`ChevronLeft`** `size 22` `color #FFFFFF`.
   - **Pinned title block** — `Animated.View`, `pointerEvents none`, `flex 1, flexDirection row, alignItems center, marginHorizontal 12`, opacity `interpolate(scrollY, [range×0.6, range], [0, 1], CLAMP)`:
     - `DoctorAvatar doctor size={36} tone="dark"` → 36×36 circle (`radius 18`), image cover; monogram fallback is transparent-bg with `round(36×0.38) = 14px` Space Grotesk 700 in `#D6C3FB`.
     - Name Text `ml-2` (8px), `flex-1`, 1 line: `font-text-bold` (DM Sans 700), `15px`, color `#FFFFFF`.
     - Price Text `ml-2`: `font-brand-medium` (Space Grotesk 500), `fontSize 16, letterSpacing -0.16`, color `#FFFFFF`. Value = `priceLabel` → `"R$ 89"` | `"R$ 89,90"` | **"Sob consulta"**.
   - **Favorite `CircleButton`**: same 44×44 `rgba(34,8,74,0.32)` puck; a11y label **"Salvar nos favoritos"** / **"Remover dos favoritos"**; press fires `haptic.select()`.
     - Base icon lucide **`Heart`** `size 20`, `color #FFFFFF`, no fill (outline).
     - Overlaid `Animated.View` at absoluteFill with lucide **`Heart`** `size 20`, `color #BC9CF7`, `fill #BC9CF7`; opacity `0 → 1` and scale `0.8 → 1` over **200 ms** (`DURATION.state`), easing `cubic-bezier(0.22,1,0.36,1)` when favourited.

### 5.3 The two hero states to draw
- **Expanded (scrollY = 0)**
  - Hero height **380px** exactly, corners: bottom-left/right radius 30, top square, full bleed to screen edges.
  - Photo at scale 1, opacity 1; both scrims and the aura visible.
  - Expanded title block fully visible at `bottom: 22, left/right: 20`: 28/32 Space Grotesk 700 white name; below it the specialty line + rating pill.
  - Top bar at `top = insets.top + 8`: back circle left, favourite circle right; **pinned title block opacity 0** (invisible).
  - Content card 1 begins at y = 396 (hero 380 + 16px gap).
- **Collapsed (scrollY ≥ range, e.g. ≥ 225)**
  - Hero height **`96 + insets.top`** (clamped floor), same 30px bottom corners.
  - Photo layer opacity **0** (faded out past `range×0.85`); background is flat `#22084A` plus the bottom scrim and the aura (aura is positioned at `bottom:-120`, mostly clipped out).
  - Expanded title block opacity **0**.
  - Top bar unchanged in position (`top = insets.top + 8`, height 44) and now shows the **pinned row at opacity 1**: 36px avatar · name (DM Sans 700 15px white, ellipsised) · price (Space Grotesk 500 16px, -0.16 letter-spacing, white), between the two 44px circle buttons, with 12px horizontal margins.
  - Vertical math: bar occupies `insets.top + 8` → `insets.top + 52`, inside a `insets.top + 96` box → 44px of hero remains below the bar.
- **Intermediate crossfade thresholds** (with range = 225): expanded block fully gone at `scrollY = 112.5`; pinned block starts fading in at `scrollY = 135` and is fully opaque at `scrollY = 225`; photo starts fading at `78.75` and is gone at `191.25`.

## 6. `BookingBar` (src/components/doctor/BookingBar.tsx) + `StickyBar`
- `StickyBar` (src/components/booking/StickyBar.tsx): `position absolute, left 0, right 0, bottom 0`, `paddingHorizontal 20`, `paddingTop 12`, `paddingBottom max(insets.bottom, 16)`, `backgroundColor #FFFFFF`, shadow `color #17151E`, `offset {0, -8}`, `opacity 0.1`, `radius 24`, `elevation 12`. No border, no radius.
- Contains one `PillButton variant="primary"`, full width of the 20px-inset area, `height 52`, `borderRadius 999`, `borderCurve continuous`, `px-6` (24px), centered.
- **Label logic** (`BookingBar`):
  - No slot selected → **`Agendar · {priceLabel}`** → e.g. **"Agendar · R$ 89,90"** (or "Agendar · Sob consulta"). In this state `disabled = true` (also true while the doctor is still loading).
  - Slot selected → **`Agendar {dayText} · {timeText} · {priceLabel}`**.
    - `dayText = dayLabel(activeDate)` from `src/lib/doctor-schedule.ts` = `` `${WEEKDAY_SHORTS[apiWeekday]} ${dayNumber}` `` with `WEEKDAY_SHORTS = ['seg','ter','qua','qui','sex','sáb','dom']` (index 0 = Monday) — **always the short weekday, never "Hoje"/"Amanhã"** (that's the *search* screen's `dayLabel`).
    - `timeText = selectedSlot.start` → `HH:MM`.
    - Separator is a middle dot with spaces: `" · "` (U+00B7).
    - Example verbatim: **"Agendar seg 14 · 16:00 · R$ 89,90"**; for tomorrow-selected: **"Agendar ter 15 · 16:00 · R$ 89,90"**.
  - Note: the selection is keyed to the date it was made on (`slotPick.date === activeDate`); changing the day clears the selection and the label reverts to "Agendar · {price}".
- **Disabled visual** (`PillButton`): `bg-ink-100` `#F2F1F6`, label color `#A29FB0` (ink.400). **Enabled primary**: `bg-violet-500` `#7E3BED`, pressed `#6A24DB`, label `#FFFFFF`. Label typography: `font-text-medium` (DM Sans 500), `text-base` 16px, line-height 24px, 1 line, `adjustsFontSizeToFit` with `minimumFontScale 0.85` (can shrink to ~13.6px for the long booked label).

## 7. `SheetRegistrar` (src/components/doctor/SheetRegistrar.tsx)
- **Renders nothing** (`return null`) — zero pixels. It is a side-effect component that registers a `openPatients(mode, patient)` callback routing to `/(doctor)/patients` with `mode: 'list' | 'create' | 'detail'`. It is part of the doctor-role surface, not the client profile screen; no visual spec applies.

## 8. Booking handoff (for continuity in the walkthrough)
- Pressing the enabled bar calls `setSelection({doctor, selectedDate, selectedTime:{start_time, end_time}, specialtyId, slotMaxDuration, attendanceType:'online', consultationChannel:'online_room', consultationPrice})` then `router.push('/(client)/checkout')`.

---

# specs/primitives.md — Shared primitives

## `PillButton` (src/components/booking/PillButton.tsx)
- `HEIGHT = 52`. `Pressable` style: `height 52`, `borderRadius 999`, `borderCurve continuous`; classes `items-center justify-center px-6` (24px horizontal padding). Width is whatever the parent gives (in both StickyBar and the FilterSheet footer: full width inside 20px gutters).
- Surface by state:
  - `disabled` → `bg-ink-100` **`#F2F1F6`** (wins over variant).
  - `variant="primary"` → `bg-violet-500` **`#7E3BED`**, active `bg-violet-600` **`#6A24DB`**.
  - `variant="ghost"` → `border 1px #E6E4EC` (`border-ink-200`) + `bg-white #FFFFFF`, active `bg-ink-50 #F9F8FB`.
- Label colour: disabled → `#A29FB0`; primary → `#FFFFFF`; ghost → `#5719B6` (violet.700).
- Label Text: `font-text-medium` (DM Sans 500), `text-base` **16px**, line-height 24px (inherited), `numberOfLines 1`, `adjustsFontSizeToFit`, `minimumFontScale 0.85`.
- Inner `View className="flex-row items-center"`; when `loading`, a `Spinner size={18} strokeWidth={2.4}` (colour `#FFFFFF` for primary, `#5719B6` for ghost) precedes the label and the label gets `ml-2.5` (10px).
- Press animation: `scale 1 → 0.98` over **110 ms** (`DURATION.instant`) with easing `cubic-bezier(0.22, 1, 0.36, 1)`; press fires `haptic.impact()`.

## `Aura` (src/components/ambient/Aura.tsx)
- `<Svg width={size} height={size} style={{opacity}}>` with a single `<Circle cx="50%" cy="50%" r="50%">` filled by a radial gradient `cx 50% cy 50% r 50%`:
  - stop 0% → `#9D6BF2` (violet.400) at **0.22** alpha
  - stop 55% → `#BC9CF7` (violet.300) at **0.10** alpha
  - stop 100% → `#D6C3FB` (violet.200) at **0** alpha
- Props used on the doctor hero: `size 360`, `opacity 0.85`, positioned `left: -80, bottom: -120`.
- CSS equivalent: `width/height: 360px; border-radius: 50%; opacity: .85; background: radial-gradient(circle at 50% 50%, rgba(157,107,242,.22) 0%, rgba(188,156,247,.10) 55%, rgba(214,195,251,0) 100%);`

## `Monogram` (src/components/booking/Monogram.tsx)
- `initialsFrom(name)`: strips tokens matching `dr|dra|sr|sra` (case-insensitive, dots removed), then takes first char of the first word + first char of the last word (only when >1 word), uppercased. Empty → renders **"?"**.
- Box: `width/height = size`, `borderRadius = radius ?? size/2`, `borderCurve continuous`, centered.
  - `tone="light"` (default): background **`#D6C3FB`** (violet.200), text colour **`#451391`** (violet.800).
  - `tone="dark"`: background **`transparent`**, text colour **`#D6C3FB`** (violet.200).
- Text: `font-brand` = **Space Grotesk 700**, `fontSize = Math.round(size * 0.38)` (56 → 21px; 36 → 14px; 150 → 57px), line-height 24px inherited from the Text variant.

## `DoctorAvatar` (src/components/booking/DoctorAvatar.tsx)
- `corner = radius ?? size/2`. No `avatar_url` → `Monogram` with same size/corner/tone. With URL → `View {width, height, borderRadius: corner, borderCurve continuous, overflow hidden}` wrapping `expo-image` `contentFit "cover"`, `transition 160ms`, a11y label = name; on error it falls back to the `Monogram`.
- Usages: search rows & recent row `size 56 radius 18`; hero pinned bar `size 36` (circle) `tone="dark"`.

## `IllustrationSlot` (src/components/booking/IllustrationSlot.tsx)
- Renders `View {width, height}` (a11y hidden: `accessible={false}`, `importantForAccessibility="no-hide-descendants"`) containing an RN `Image` at `100% × 100%`, `resizeMode "contain"`, `accessibilityIgnoresInvertColors`.
- **id → asset map** (all under `assets/illustrations/`):
  - `ILL-01` → `form-sheet-empty.webp`
  - `ILL-02` → `form-sheet-complete.webp`
  - `ILL-08` → `optional-skip-attach.webp`
  - `ILL-09` → `handoff-sheet.webp`
  - `ILL-10` → `anamnese-pen-rest.webp`
  - `search-empty` → `empty-next-day.webp`
  - `slots-empty` → `empty-time-chips.webp`
  - `search-error` → `search-error.webp`
  - `slots-error` → `slots-error.webp`
  - `docs-empty` → `docs-empty.webp`
  - `consultas-empty` → `consultas-empty.webp`
  - `ai-empty` → `ai-empty.webp`
  - `pharmacies-empty` → `pharmacies-empty.webp`
- In `SlotGrid` both error and empty use `width 120, height 90`.

## `SkeletonRow` (src/components/booking/SkeletonRow.tsx)
- `View className="flex-row items-center py-3"` (12px vertical padding).
- Avatar block: `SkeletonBox width=avatarSize height=avatarSize borderRadius=avatarSize/2` — default `avatarSize 56` (search list), `44` on the doctor screen's loading card, `36` in ReviewsSection.
- Lines column `View className="ml-3 flex-1"` (12px left); `lines` boxes (default 2), widths cycling **`[180, 120, 90]`**, height **14** for index 0 else **12**, `borderRadius 7`, `marginTop 0` for index 0 else **8**.
- `SkeletonBox` (src/components/ui/SkeletonBox.tsx): background **`#e8e8ed`** (hard-coded, not a token), default `borderRadius 8`, opacity pulses `0.3 → 0.7 → 0.3`, each leg **800 ms**, `Easing.inOut(ease)`, infinite.

## `SpecialtyLine` (src/components/booking/SpecialtyLine.tsx)
- `View className="flex-row items-center" style={{gap: 6}}`.
- Icon: `getSpecialtyImage(name)` result as `expo-image` `16×16`, `contentFit contain`, opacity **0.7** (`tone="light"`) / **0.9** (`tone="dark"`). If the map returns `null` → lucide **`Stethoscope`** `size 14`, colour `#726F80` (light) / `#D6C3FB` (dark).
- Text: `flex-shrink`, 1 line.
  - light: `font-text` (DM Sans 400), colour `#726F80` (ink.500).
  - dark: `font-text-medium` (DM Sans 500), colour `#D6C3FB` (violet.200).
  - size `md` (default) → `text-sm` **14px**; size `sm` → **13px**. Line-height 24px inherited.
- **`getSpecialtyImage` map** (`src/utils/specialtyIcons.ts`, lower-cased substring match, first hit wins, all under `assets/icons/`): `clínico|clinico → medico.png`, `cardio → cardio.png`, `neuro → neurologia.png`, `dermato → derma.png`, `ortop → ortopedia.png`, `gineco → ginecologia.png`, `pediatr → pediatria.png`, `psicol|psiquiat → psicologia.png`, `nutri → nutrologista.png`, `urolog → urologista.png`, `endocr → endocrino.png`, `geriat → geriatra.png`, `alerg → alergia.png`, `fono → fonoaudiologa.png`; otherwise `null`. "Cardiologia" → `cardio.png`.

## `formatRating`
- Two identical implementations: `src/lib/formatters.ts` (used by `DoctorHero`) and a local copy in `src/components/search/DoctorRow.tsx`.
- `rating.toFixed(1).replace('.', ',')` → `4.85 → "4,9"`, `5 → "5,0"`, `4 → "4,0"`. Always one decimal, comma separator.

## Rating pill (two distinct renderings — do not conflate)
- **Hero pill** (`DoctorHero`, dark-on-photo): `ml-3`, `px-2.5 py-1` (10px/4px), row, `borderRadius 999`, `borderCurve continuous`, background `rgba(255,255,255,0.14)`; lucide `Star` `size 12` `color #FFFFFF` `fill #FFFFFF`; Text `ml-1 font-text-medium text-xs #FFFFFF` with `formatRating(rating)`. Rendered only when `average_rating > 0`.
- **Search-row inline rating** (`DoctorRow`, no pill chrome): lucide `Star` `size 12` `color #17151E` `fill #17151E`; rating Text `ml-1 font-text-medium 12px #403D4A`; count Text `ml-1 font-text 12px #A29FB0` rendered as `(128)`. When `rating_count === 0` the whole thing is replaced by the single Text **"Novo na Viva"** (`font-text 12px #A29FB0`).

## `Chip` (src/components/booking/Chip.tsx) — used by FilterSheet and AboutSection
- `Pressable`: `borderRadius 999`, `borderCurve continuous`, `minHeight 34`, `px-3 py-2` (12px/8px), row, items-center, hitSlop 6.
- Background: selected → `bg-violet-100` **`#EBE1FD`**; unselected → `bg-ink-100` **`#F2F1F6`**.
- Optional `spark` dot: `6×6`, `borderRadius 3`, `marginRight 6`, `#C6FF34` (lime.400).
- Optional `icon` Image: `18×18`, `marginRight 6`, `resizeMode contain`.
- Label: `font-text-medium` (DM Sans 500), `text-sm` **14px**, line-height 24px; selected → `#451391` (violet.800), unselected → `#726F80` (ink.500).
- Press: `haptic.select()`, scale `1 → 0.98` over 110 ms, ease `cubic-bezier(0.22,1,0.36,1)`.

## `SectionHeading`, `StickyBar`, `Expandable`
Fully specified in the doctor-profile spec above (§4, §6, §3.1) — same components, no other call sites in these two screens.

## Motion tokens referenced
`DURATION`: instant 110, fast 160, state 200, layout 320, enter 360, ambient 12000 (ms).
`EASE.out` = `cubic-bezier(0.22, 1, 0.36, 1)`; `EASE.product` = `cubic-bezier(0.25, 0.1, 0.25, 1)`; `EASE.snap` = `cubic-bezier(0.7, 0, 0.2, 1)`.
`entrance(index, reducedMotion)` = `FadeInDown`, duration 320 ms, delay `index × 60 ms`, easing `EASE.out`; returns `undefined` (no animation) under reduced motion.

---

Files read (all absolute): `/Users/legacyn/www/vivamais/vivamaisa-app/src/theme/{tokens.json,colors.ts,palette.js,motion.ts,tailwind-plugin.js}`, `/Users/legacyn/www/vivamais/vivamaisa-app/tailwind.config.js`, `/Users/legacyn/www/vivamais/vivamaisa-app/src/app/(client)/{search.tsx,_layout.tsx,doctor/[id].tsx}`, `/Users/legacyn/www/vivamais/vivamaisa-app/src/components/search/{SearchHeader,SearchMorphSurface,ActiveFilterChips,DayScroller,DoctorRow,PlantaoBanner,RecentDoctorsRow,FilterSheet}.tsx`, `/Users/legacyn/www/vivamais/vivamaisa-app/src/components/doctor/{DoctorHero,AboutSection,ReviewsSection,WeekCalendar,SlotGrid,BookingBar,SheetRegistrar}.tsx`, `/Users/legacyn/www/vivamais/vivamaisa-app/src/components/booking/{PillButton,Monogram,DoctorAvatar,IllustrationSlot,SkeletonRow,SpecialtyLine,SectionHeading,StickyBar,DayCell,Chip,Expandable}.tsx`, `/Users/legacyn/www/vivamais/vivamaisa-app/src/components/ambient/Aura.tsx`, `/Users/legacyn/www/vivamais/vivamaisa-app/src/components/ui/SkeletonBox.tsx`, `/Users/legacyn/www/vivamais/vivamaisa-app/src/components/nativewindui/Text.tsx`, `/Users/legacyn/www/vivamais/vivamaisa-app/src/lib/{search-filters.ts,search-dates.ts,doctor-schedule.ts,doctor-price.ts,formatters.ts,cn.ts}`, `/Users/legacyn/www/vivamais/vivamaisa-app/src/utils/{specialtyIcons.ts,weekday-utils.ts}`, `/Users/legacyn/www/vivamais/vivamaisa-app/src/hooks/useDoctorPrice.ts`.