I could not write the spec files — this session is read-only (no file creation, including under `/Users/legacyn/www/vivamais/vivamais-walkthrough-video/specs/`). Below is the complete spec content, ready to paste into the intended files. Everything is read from source; no values are inferred.

---

# 0. Shared resolution table (use for all screens)

**Token → hex** (`src/theme/tokens.json`, resolved via `src/theme/palette.js`)

- `violet`: 50 `#F5F0FE` · 100 `#EBE1FD` · 200 `#D6C3FB` · 300 `#BC9CF7` · 400 `#9D6BF2` · **500 `#7E3BED`** · 600 `#6A24DB` · 700 `#5719B6` · 800 `#451391`
- `lime` 400 `#C6FF34`
- `ink`: 50 `#F9F8FB` · 100 `#F2F1F6` · 200 `#E6E4EC` · 300 `#D2CFDB` · 400 `#A29FB0` · 500 `#726F80` · 600 `#55525F` · 700 `#403D4A` · 800 `#282632` · **900 `#17151E`** · 950 `#0D0C12`
- `white #FFFFFF` · `canvas #FAFAFE` · `panel #F3F4FA` · `mist #F3EDFF`
- `success #22C55E` · `warning #F59E0B` · `danger #EF4444` · `info #A78BFA`

**Light theme role map** (`bg-background` etc. resolve through these):
`background→#FAFAFE` · `foreground→#17151E` · `card→#FFFFFF` · `surface→#F3F4FA` · `tint→#F3EDFF` · `muted→#F2F1F6` · `mutedForeground→#726F80` · `border→#E6E4EC` · `borderStrong→#D2CFDB` · `primary→#7E3BED` · `primaryStrong→#6A24DB` · `primaryForeground→#FFFFFF` · `primarySoft→#F5F0FE` · `destructive→#EF4444` · `destructiveSoft→#FEE2E2` · `infoSoft→#EBE1FD`

**Font class → family/weight** (`tailwind.config.js` + `tokens.type`)

| class | family | weight | notes |
|---|---|---|---|
| `font-brand` | Space Grotesk (`SpaceGrotesk_700Bold`) | **700** | this is the *display* family, not 500 |
| `font-brand-medium` | Space Grotesk (`SpaceGrotesk_500Medium`) | 500 | unused in these screens |
| `font-text` | DM Sans (`DMSans_400Regular`) | 400 | |
| `font-text-medium` | DM Sans (`DMSans_500Medium`) | 500 | |
| `font-text-bold` | DM Sans (`DMSans_700Bold`) | 700 | |

**Tailwind default sizes used**: `text-xs` 12/16 · `text-sm` 14/20 · `text-base` 16/24 · `text-lg` 18/28 · `text-xl` 20/28. `tracking-wide` = `letter-spacing: 0.025em`.

**Radii**: `rounded-md` 6px · `rounded-xl` 12px · `rounded-2xl` 16px · `rounded-full`/`rounded-[999]` pill. `borderCurve:'continuous'` = iOS squircle; in HTML approximate with plain `border-radius`.

**`h-*`/`w-*` scale**: `h-1`=4 · `h-1.5`=6 · `h-2`=8 · `h-5`=20 · `h-6`=24 · `h-7`=28 · `h-9`=36 · `h-10`=40 · `h-11`=44 · `h-12`=48 · `w-10`=40 · `w-28`=112. Padding: `p-1`=4 · `p-3`=12 · `p-4`=16 · `px-3`=12 · `px-4`=16 · `px-5`=20 · `px-6`=24 · `py-2`=8 · `py-3.5`=14 · `py-7`=28 · `pt-1`=4 · `pt-2`=8 · `pt-3`=12 · `mt-0.5`=2 · `mt-1`=4 · `mt-1.5`=6 · `mt-2`=8 · `mt-3`=12 · `mt-4`=16 · `mt-6`=24 · `mt-7`=28 · `mt-8`=32 · `gap-1.5`=6 · `gap-2`=8 · `gap-3`=12 · `gap-4`=16 · `gap-6`=24.

---

# 1. `specs/shared-primitives.md`

## PillButton — `src/components/booking/PillButton.tsx`
- Root: `Animated.View`, transform `scale(1)`; on press-in animates to `0.98` over 110 ms (`DURATION.instant`) with cubic-bezier(0.22, 1, 0.36, 1).
- Button: **height 52 px** (const `HEIGHT = 52`), `border-radius: 999px`, `padding: 0 24px`, content centered (row, items-center, justify-center). Full width of its parent (StickyBar → screen width − 40).
- Variants:
  - `primary`, enabled: background `#7E3BED`; active/pressed background `#6A24DB`.
  - `ghost`, enabled: background `#FFFFFF`, `border: 1px solid #E6E4EC`; pressed `#F9F8FB`.
  - `disabled` (any variant): background `#F2F1F6`, label `#A29FB0`.
- Label: `font-text-medium text-base` → **DM Sans 500, 16px / 24px**, color `#FFFFFF` (primary) or `#5719B6` (ghost) or `#A29FB0` (disabled). `numberOfLines=1`, `adjustsFontSizeToFit`, `minimumFontScale 0.85`.
- Loading state: 18 px `Spinner` (stroke 2.4) at left, colored `#FFFFFF` (primary) / `#5719B6` (ghost); label gets `margin-left: 10px` (`ml-2.5`).
- Haptic `impact()` on press.

## StickyBar — `src/components/booking/StickyBar.tsx`
- `position: absolute; left:0; right:0; bottom:0;`
- `padding: 12px 20px max(safe-area-bottom, 16px) 20px`
- `background: #FFFFFF`
- Shadow: color `#17151E`, offset `0 -8px`, opacity `0.10`, radius `24` → CSS `box-shadow: 0 -8px 24px rgba(23,21,30,0.10)`.

## Chip — `src/components/booking/Chip.tsx`
- Pill: `border-radius: 999px`, `min-height: 34px`, `padding: 8px 12px`, row/center.
- Unselected: background `#F2F1F6`; label DM Sans 500 14/20 `#726F80`.
- Selected: background `#EBE1FD`; label DM Sans 500 14/20 `#451391`.
- Optional `spark` dot: 6×6, radius 3, `margin-right 6`, `#C6FF34`. Optional icon image 18×18 `margin-right 6`.
- Press scale 0.98 @110 ms; `hitSlop 6`; haptic `select()`.

## IllustrationSlot — `src/components/booking/IllustrationSlot.tsx`
Wrapper `View` at exact `width`/`height`; `<Image>` 100%/100%, `resizeMode: contain`, accessibility-hidden.

| id | asset |
|---|---|
| `ILL-01` | `assets/illustrations/form-sheet-empty.webp` |
| `ILL-02` | `assets/illustrations/form-sheet-complete.webp` |
| `ILL-08` | `assets/illustrations/optional-skip-attach.webp` |
| `ILL-09` | `assets/illustrations/handoff-sheet.webp` |
| `ILL-10` | `assets/illustrations/anamnese-pen-rest.webp` |
| `search-empty` | `empty-next-day.webp` |
| `slots-empty` | `empty-time-chips.webp` |
| `search-error` | `search-error.webp` |
| `slots-error` | `slots-error.webp` |
| `docs-empty` | `docs-empty.webp` |
| `consultas-empty` | `consultas-empty.webp` |
| `ai-empty` | `ai-empty.webp` |
| `pharmacies-empty` | `pharmacies-empty.webp` |

Each `.webp` has a same-named `.png` sibling in `assets/illustrations/` (higher-res source) — use the `.png` for HTML if you need crispness.

## Lottie
**Not used in any of these screens.** `lottie-react-native ~7.3.1` is in `package.json` and two files exist (`assets/animations/Lottie1.json`, `Lottie2.json`), but `grep` over `src/` finds **zero** imports/usages of Lottie or of `assets/animations/`. Do not render any Lottie in the rebuild.

## Text primitive — `src/components/nativewindui/Text.tsx`
Default variant `body` = `text-[17px] leading-6` with `text-foreground` (`#17151E`). Every usage in these screens overrides size/family/color explicitly, so the defaults only matter where no size class is given.

---

# 2. `specs/anamnese-index.md` — `src/app/(client)/anamnese/index.tsx`

Route params: `consultationId` (present, scheduled consultation), `fromPlantao` absent → `isPlantao = false`. Stack: `headerShown:false`, `presentation:'card'`, `animation:'slide_from_right'`, `gestureEnabled:false` (`anamnese/_layout.tsx`).

**Root**: `SafeAreaView`, `flex-1`, background `#FAFAFE`, safe edges top/left/right only (bottom is covered by StickyBar).

1. **Close row** — `flex-row justify-end`, `padding: 4px 12px 0`.
   - Close button: 44×44, `border-radius: 999px`, centered; pressed background `#F2F1F6`. `hitSlop 10`. a11y label "Fechar".
     - Icon: **lucide `X`, size 22, color `#55525F` (ink.600), strokeWidth 2.2**.
2. **ScrollView** — `padding: 0 20px 150px`, no scroll indicator.
   1. **Hero row** — `flex-row items-center`, `gap: 16px`.
      - `IllustrationSlot id="ILL-01"` → `form-sheet-empty.webp`, **92 × 92 px**, contain.
      - Text column (`flex: 1`):
        - Title: **"Preparar consulta"** — Space Grotesk 700, `font-size 24px`, `line-height 28px`, `letter-spacing -0.4px`, color `#17151E`. (Plantão variant would be "Preparar atendimento".)
        - Subtitle, `margin-top 4px`: DM Sans 400, **14px / 20px**, `#726F80`. Content = `doctor_name · <data>` joined with " · " where date = `toLocaleDateString('pt-BR', {weekday:'short', day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'})` (e.g. `Dra. Ana Souza · seg., 14 de set. de 2026 14:30`); falls back to **"Sua próxima consulta"** if both empty.
   2. **CarryForwardCard** — plantão-only (`isPlantao && pristine`). **Not rendered for a scheduled consultation.** (Spec kept below under §7 for completeness.)
   3. **Section label**: `margin: 32px 0 8px` — **"Sua anamnese"** — DM Sans 700, 13px / (default ~1.2), `text-transform: uppercase`, `letter-spacing: 0.025em`, `#726F80`.
   4. **Section helper**, `margin-bottom 12px`: **"Perguntas sobre este atendimento. Sua ficha fica separada, logo abaixo."** — DM Sans 400, 14px / 20px, `#726F80`.
   5. **Steps card**: `background #FFFFFF`, `border-radius 16px`, `overflow hidden`, no border/shadow. Contains 5 rows from `ANAMNESE_STEPS` (order fixed):
      - Row: `flex-row items-center`, `padding: 14px 16px`, pressed background `#F9F8FB`. No divider lines between rows.
        - Status bullet (left, `margin-right 12px`): 24 × 24 circle.
          - done → background `#7E3BED`, contains **lucide `Check`, size 13, color `#FFFFFF`, strokeWidth 3**.
          - next-pending → background `#EBE1FD`, contains 6 × 6 dot radius 3 `#7E3BED`.
          - later-pending → background `#F2F1F6`, contains 6 × 6 dot `#D2CFDB`.
        - Text column (`flex:1`):
          - Title: DM Sans 500, 15px, `#17151E`.
          - Subtitle `margin-top 2px`, 1 line: DM Sans 400, 13px, `#A29FB0`.
        - Trailing: **lucide `ChevronRight`, size 18, strokeWidth 2.2**, color `#7E3BED` if it is the next pending step, else `#D2CFDB`.
      - **Row content, in render order** (title / empty-state subtitle / filled subtitle rule):
        1. **"Motivo"** — hint `O que está acontecendo` — filled: first 42 chars of `motivo` + `…` if longer. Done when `motivo.trim().length >= 3`.
        2. **"Onde dói"** — hint `Marque no corpo` — filled: `"Sem dor"` if `noPain`; else region label if 1 marker; else `"N pontos"`. Done when `noPain || markers.length>0`.
        3. **"Há quanto tempo"** — hint `Início e evolução` — filled: `"<onset> · <evolução>"` (e.g. `3 dias · Piorando`). Done when `onset !== null`.
        4. **"Medicamentos e alergias"** — hint `Confirme o que já sabemos` — filled: `"2 medicamentos · 1 alergia"` / `"… · sem alergias"` / `"Confirmado"`. Done when `contextConfirmed`.
        5. **"Anexos"** — optional → subtitle when empty is **`Exames, receitas ou fotos · opcional`**; filled: `"1 arquivo"` / `"3 arquivos"`. Done when `attachments.length>0`.
   6. **Ficha heading**: `margin: 32px 0 8px`, role=header — **"Sua ficha de saúde"** — `font-brand text-[22px]` → Space Grotesk **700, 22px**, default line-height, `#17151E`.
   7. **Ficha helper**, `margin-bottom 12px`: **"Dados salvos para acompanhar sua saúde. Confira aqui e edite apenas o que mudou."** — DM Sans 400, 14/20, `#726F80`.
   8. **FichaSummary** (`src/components/anamnese/FichaSummary.tsx`): card `background #FFFFFF`, `border-radius 20px`, `padding: 0 20px`.
      - Loading: single line `padding: 20px 0`, DM Sans 400, 16/24, `#726F80`: **"Carregando sua ficha..."**
      - If `profile === null`: paragraph `padding-top 20px`, DM Sans 400 16/24 `#726F80`: **"Sua ficha ainda não tem dados salvos. Você pode adicionar quando quiser, sem interromper a anamnese."**
      - Four `Section`s separated by 1 px `#F2F1F6` rules; each Section `padding: 16px 0`, inner `gap 8px`:
        - Header row: title DM Sans **700**, 16px, `#17151E` (flex 1); right "Editar" button `min-height 44px`, `padding 0 8px`, label DM Sans 500, 14px, `#5719B6`, pressed opacity 0.6.
        - Section titles/slugs in order: **"Medidas e pressão"**, **"Medicamentos e hábitos"**, **"Condições e alergias"**, **"Documentos da ficha"**.
        - `Value` block: `padding: 4px 0`, `gap 4px`. Label DM Sans 400, 14/20, `#726F80`; value DM Sans 500, 16/24, `#17151E`.
        - Labels, verbatim: `Peso` (`<n> kg` / `Não informado`), `Altura` (`<n> cm` / `Não informada`) — these two sit in a wrapping row with `column-gap 32px, row-gap 8px`; `Pressão arterial média` (`Não informada`); `Medicamentos contínuos`, `Tabagismo`, `Uso de outras substâncias`, `Alergias`, `Pressão alta`, `Diabetes`. Boolean answer text: details string, else **"Sim, sem detalhes registrados"**, else **"Não registrado na ficha"**.
        - Health problems appended as DM Sans 400 16px `#17151E` lines; fallback **"Condição registrada"**.
        - Documents: DM Sans 400 16px `#403D4A` per file, else **"Nenhum documento salvo na ficha."** in `#726F80`.
3. **StickyBar** (see §1):
   - `PillButton variant="primary"`, label = **`Continuar · <título do próximo passo pendente>`** (e.g. `Continuar · Motivo`); when nothing pending → **"Revisar e enviar"**. Disabled (→ `#F2F1F6` / `#A29FB0`) until `flow.ready`.
   - Secondary (non-plantão only): `margin-top 8px`, height 44, centered, label **"Preencher depois"** — DM Sans 500, 15px, `#726F80`. No background/border.

---

# 3. `specs/anamnese-fluxo.md` — `src/app/(client)/anamnese/fluxo.tsx` + FlowShell

`fluxo.tsx` renders nothing until `flow.ready`; then `<FlowShell>` with a `render(slug)` switch: `motivo→MotivoStep`, `dor→DorStep`, `tempo→TempoStep`, `contexto→ContextoStep`, `anexos→AnexosStep` (default `MotivoStep`).

## FlowShell chrome — `src/components/anamnese/FlowShell.tsx`
Root `SafeAreaView flex-1`, background `#FAFAFE`, edges top/left/right.

1. **Nav row** — `flex-row items-center justify-between`, `padding: 4px 12px 0`.
   - Back (left): 44×44, radius 999, pressed `#F2F1F6`, `hitSlop 10`, a11y "Voltar" — **lucide `ChevronLeft`, size 24, color `#17151E`, strokeWidth 2.2**.
   - Close (right): 44×44, radius 999, pressed `#F2F1F6`, a11y "Fechar" — **lucide `X`, size 22, color `#726F80` (ink.500), strokeWidth 2.2**.
   (Note the two screens differ: hub uses ink.600 for X, FlowShell uses ink.500.)
2. **Progress row** — `flex-row items-start justify-between`, `padding: 4px 20px 20px`.
   - **ChapterDots** (left).
   - **Counter** (right): DM Sans 400, **13px**, `#726F80`, text = `"<índice+1> de 5"` (e.g. `2 de 5`). a11y label: `Anamnese, etapa N de 5`.
3. **Step area** — `Animated.View flex-1`, re-keyed per step, entering `FadeIn` over **200 ms** (`DURATION.state`) with cubic-bezier(0.22, 1, 0.36, 1); no fade when reduce-motion.

### ChapterDots — `src/components/anamnese/ChapterDots.tsx`
- Single chapter only: `{ key:'consulta', label:'Sua anamnese' }`. Outer `flex-row items-start gap-24px` (only one child).
- Dot strip: `flex-row items-center`, `height 8px`, `gap 6px`, `margin-bottom 6px`. **5 dots**, one per `ANAMNESE_STEPS` entry, in order.
  - Dot geometry: `height 7px`, `border-radius 3.5px`.
  - `todo` → width **7px**, background `#E6E4EC` (ink.200).
  - `done` → width **7px**, background `#7E3BED`.
  - `current` → width **20px**, background `#7E3BED`.
  - Transition: width + background animate over 200 ms, cubic-bezier(0.25, 0.1, 0.25, 1).
- Chapter label: **"Sua anamnese"** — 11px; active chapter → DM Sans **500**, color `#5719B6` (violet.700); inactive → DM Sans 400, `#D2CFDB`. On this flow the chapter is always active, so: DM Sans 500, 11px, `#5719B6`.

### `railLabelFor` — DEAD CODE
`railLabelFor(slug)` returns `"Etapa 1 de 5 · Sobre esta consulta"`, but `grep` shows it is referenced **only** by `src/lib/anamnese/steps.test.ts`. No screen renders it. Likewise `StepIntroLabel` (exported from FlowShell: DM Sans 700, 12px, uppercase, `tracking-wide`, `#A29FB0`, `margin-bottom 8px`) has **no call sites**. Do not draw either in the HTML rebuild.

### StepBody — `src/components/anamnese/StepBody.tsx` (frame for all 5 steps)
- `KeyboardAvoidingView flex-1` (iOS `behavior="padding"`).
- ScrollView: `padding: 0 20px 150px`, `keyboardShouldPersistTaps="handled"`, `keyboardDismissMode="interactive"`, no indicator.
  - **Title**: Space Grotesk **700**, `font-size 26px`, `line-height 31px`, `letter-spacing -0.4px`, `#17151E`. No top margin (sits directly under the progress row's 20 px bottom padding).
  - **Intro** (optional), `margin-top 8px`: DM Sans 400, **15px / 22px**, `#726F80`.
  - **Content wrapper**: `margin-top 24px`.
- **StickyBar** (see §1) with the primary `PillButton`, plus optional secondary `Pressable`: `margin-top 8px`, height 44, centered, label DM Sans 500, 15px, `#726F80`.

---

# 4. `specs/anamnese-steps.md` — the five step bodies

## 4.1 Step 1 — MotivoStep (`steps/MotivoStep.tsx`)
- Title: **"O que está acontecendo?"**
- Intro: **"Escreva como você contaria para alguém. Sem termos médicos."**
- Content (inside the `mt-24px` wrapper):
  1. **Textarea** (`TextInput multiline`):
     - `min-height: 150px`, `border-radius: 20px`, `background #FFFFFF`, `padding 16px`, no border.
     - Text: DM Sans 400, **16px / 24px** (`leading-6`), `#17151E`, `textAlignVertical: top`.
     - Placeholder: **"Ex.: estou com dor de cabeça há três dias, piora à noite..."**, color `#D2CFDB` (ink.300).
     - `maxLength 2000`.
  2. **Counter**, `margin-top 8px`, right-aligned: DM Sans 400, **12px**, `#D2CFDB` — text `"<n>/2000"`.
  3. **Starters label**, `margin: 24px 0 12px`: **"Toque para adicionar"** — DM Sans 700, 13px, uppercase, `letter-spacing 0.025em`, `#726F80`.
  4. **Starter chips**: `flex-row flex-wrap`, `gap 8px`. All rendered with `selected={false}` → background `#F2F1F6`, label DM Sans 500 14px `#726F80`, min-height 34, radius 999, padding 8px 12px.
     - Chip set depends on the consultation's `specialty_name` (`src/lib/anamnese/starters.ts`), matched by lowercase substring:
       - default (no specialty / no match): **Dor de cabeça · Febre · Tosse · Dor de garganta · Cansaço · Enjoo**
       - `cardio`: Falta de ar · Palpitação · Dor no peito · Inchaço nas pernas · Tontura
       - `derma`: Mancha na pele · Coceira · Queda de cabelo · Acne · Ferida que não cura
       - `psic`/`psiqu`: Ansiedade · Insônia · Tristeza · Estresse no trabalho · Crise de pânico
       - `pediatr`: Febre · Tosse · Falta de apetite · Diarreia · Choro sem motivo
       - `ortoped`: Dor nas costas · Dor no joelho · Torção · Dor no ombro · Formigamento
       - `ginec`: Cólica · Atraso menstrual · Corrimento · Dor pélvica · Sangramento
       - `endocrin`: Ganho de peso · Cansaço · Sede excessiva · Queda de cabelo · Tireoide
       - `gastro`: Azia · Dor de barriga · Enjoo · Intestino preso · Diarreia
       - `neuro`: Dor de cabeça · Tontura · Formigamento · Perda de memória · Tremor
       - `urolog`: Ardência ao urinar · Vontade frequente · Dor lombar · Sangue na urina
       - `nutri`: Quero emagrecer · Ganhar massa · Intestino irregular · Alimentação
     - Tap appends `"<Starter>. "` (first) or `" <Starter>."` (subsequent) to the textarea; no-op if already contained.
- Primary button: **"Continuar"**, disabled until `motivo.trim().length >= 3`. No secondary action.

## 4.2 Step 2 — DorStep (`steps/DorStep.tsx`)
- Title: **"Onde dói?"**
- Intro: **"Toque no corpo. Pode marcar mais de um lugar."**
- Content:
  1. **BodyMap** (`BodyMap.tsx`), column, centered:
     - **View toggle**: `margin-bottom 20px`, `flex-row`, `border-radius 999px`, background `#F2F1F6`, `padding 4px`.
       - Each tab: `min-height 36px`, `border-radius 999px`, `padding 0 24px`, centered.
       - Active tab: background `#FFFFFF`; label DM Sans 500, 14/20, `#17151E`.
       - Inactive: transparent; label DM Sans 500, 14/20, `#726F80`.
       - Labels, left→right: **"Frente"**, **"Costas"**. Default `front`.
     - **Figure box**: `height = min(390, screenHeight*0.42, (screenWidth-96)*2.1)`; `width = height * 240/520` (viewBox is 240 × 520, so aspect 0.4615). On a 390 × 844 viewport: height = min(390, 354.5, 617.4) = **354.5 px**, width = **163.6 px**.
       - `BodyFigure` SVG, `viewBox="0 0 240 520"`, `pointer-events:none`, tone `quiet`:
         - Fill `#F2F1F6` (ink.100), stroke `#E6E4EC` (ink.200), `stroke-width 1.5` on every shape.
         - Shapes drawn in order: head `<ellipse>`, neck path, torso path, arm path, leg path, then a mirrored `<g transform="translate(240,0) scale(-1,1)">` repeating arm + leg (right-side limbs). Geometry is computed per sex/height/weight in `src/lib/anamnese/body-geometry.ts`.
         - Spine hint: `<path d="M120 104 L120 250">`, `stroke-dasharray="4 6"`, `stroke-linecap="round"`, `stroke-width 1.5`. Stroke = `#E6E4EC` on the **back** view, `transparent` on the front view.
     - **Markers** (absolute, only those whose `view` matches the current tab):
       - Diameter = `20 + 14 * level/10` → level 1 = 21.4 px, level 4 = 25.6 px, level 10 = 34 px.
       - Positioned at `region.x/scale − size/2`, `region.y/scale − size/2` where `scale = 240 / width`.
       - Circle: background `#7E3BED`, `border: 2px solid #FFFFFF`, fully round, centered label = the level number in **Space Grotesk 700, 12px, `#FFFFFF`**. Entering fade 160 ms. `hitSlop 10`.
     - **Miss hint** line, `margin-top 16px`, fixed `height 20px` (always occupies space): DM Sans 400, 13px, `#A29FB0`. Empty string normally; after a tap outside any region → **"Toque um pouco mais perto do corpo."**
     - Tap targets: `regionAt()` picks the nearest region within `HIT_RADIUS = 46` viewBox units. Front regions (id/label/x/y in viewBox coords): Cabeça 120,30 · Rosto 120,58 · Pescoço 120,86 · Ombro direito 80,106 · Ombro esquerdo 160,106 · Peito · lado direito 100,138 · Peito · lado esquerdo 140,138 · Abdome superior direito 102,180 · Abdome superior esquerdo 138,180 · Abdome inferior direito 104,218 · Abdome inferior esquerdo 136,218 · Pelve 120,252 · Braço direito 58,146 · Antebraço direito 45,212 · Mão direita 42,266 · Braço esquerdo 182,146 · Antebraço esquerdo 195,212 · Mão esquerda 198,266 · Coxa direita 100,312 · Joelho direito 97,388 · Perna direita 94,462 · Coxa esquerda 140,312 · Joelho esquerdo 143,388 · Perna esquerda 146,462. Back regions: Nuca 120,44 · Cervical 120,88 · Ombro esquerdo 80,106 · Ombro direito 160,106 · Costas · alto esquerdo 100,142 · Costas · alto direito 140,142 · Costas · baixo esquerdo 102,188 · Costas · baixo direito 138,188 · Lombar 120,226 · Glúteos 120,262 · Braço esquerdo 58,146 · Antebraço esquerdo 45,212 · Braço direito 182,146 · Antebraço direito 195,212 · Coxa esquerda 100,312 · Coxa direita 140,312 (+ remaining back leg entries).
  2. **"Pontos marcados"** list — rendered only when ≥ 1 marker. Wrapper `margin-top 24px`.
     - Label, `margin-bottom 12px`: **"Pontos marcados"** — DM Sans 700, 13px, uppercase, `letter-spacing 0.025em`, `#726F80`.
     - Card: `background #FFFFFF`, `border-radius 16px`, `overflow hidden`.
     - Row: `flex-row items-center`, `padding 14px 16px`, pressed `#F9F8FB`.
       - Level badge: 28 × 28 circle, background `#7E3BED`, label Space Grotesk 700, 12px, `#FFFFFF`.
       - Text column `margin-left 12px`: region label DM Sans 500, 15px, `#17151E`; if sensations exist, second line `margin-top 2px` DM Sans 400, 13px, `#A29FB0`, joined with `" · "`.
- Primary button: **"Continuar"**, disabled until `noPain || markers.length > 0`.
- Secondary (only while `markers.length === 0`): **"Não é dor, é outro sintoma"** — DM Sans 500, 15px, `#726F80`, height 44, centered. Tapping sets `noPain=true` and advances.

### MarkerSheet — `src/components/anamnese/MarkerSheet.tsx` (modal opened by tapping a region/marker)
- `Modal transparent animationType="slide" statusBarTranslucent`. Backdrop = full-screen pressable, **no color / no dim** (transparent), content bottom-anchored.
- Sheet: `background #FFFFFF`, `border-top-left-radius 28px`, `border-top-right-radius 28px`, `padding-bottom: max(safe-area-bottom, 20px)`, `max-height 88%`.
  1. Grabber: centered, `padding-top 12px`, bar **40 × 4 px**, radius 999, `#E6E4EC`.
  2. ScrollView `padding: 16px 20px 12px`:
     - **Region title**: Space Grotesk **700**, `font-size 22px`, `line-height 26px`, `letter-spacing -0.3px`, `#17151E` (e.g. "Peito · lado esquerdo").
     - **PainScale** wrapper `margin-top 24px` (see below).
     - Label `margin: 28px 0 12px`: **"Como é a dor?"** — DM Sans 700, 13px, uppercase, `tracking-wide`, `#726F80`.
     - Sensation chips, `flex-row flex-wrap gap-8px`, multi-select `Chip`s: **Latejante · Queimação · Pontada · Peso · Cólica · Formigamento · Aperto**. Selected → `#EBE1FD` bg / `#451391` label; unselected → `#F2F1F6` / `#726F80`.
  3. Footer `padding: 8px 20px 0`:
     - `PillButton primary` label **"Confirmar"** (52 px, `#7E3BED`).
     - If editing an existing marker: `margin-top 8px`, height 44, row centered — **lucide `Trash2`, size 16, color `#EF4444`, strokeWidth 2.2**, then `margin-left 8px` label **"Remover este ponto"** DM Sans 500, 15px, `#EF4444`.

### PainScale — `src/components/anamnese/PainScale.tsx`
- Header row, `margin-bottom 12px`, `flex-row items-baseline justify-between`:
  - Value: **Space Grotesk 700, 40px / 44px**, `#17151E` (integer 1–10, default 4 for a new marker).
  - Qualifier: DM Sans 500, 15px, `#5719B6` — text from `painLabel`: ≤3 **"Leve"**, ≤6 **"Moderada"**, ≤8 **"Forte"**, else **"Muito forte"**.
- Touch strip: `height 52px`, contents vertically centered (full container width).
  - Track: `height 12px`, `border-radius 6px`, background `#F2F1F6`, `overflow hidden`.
  - Fill: width `= (value-1)/9 * 100%`, height 100%, background `#7E3BED`.
  - Thumb: absolutely positioned at `left = ratio*trackWidth − 15`; **30 × 30 px**, radius 15, background `#FFFFFF`, `border: 3px solid #7E3BED`; shadow `0 2px 6px rgba(23,21,30,0.12)`.
- Tick labels row (`justify-between`), immediately below the strip: **"Leve" · "Moderada" · "Forte"** — DM Sans 400, 12px, `#A29FB0`.
- Explainer box, `margin-top 16px`, `border-radius 16px`, `padding 12px`, background `rgba(126, 59, 237, 0.06)`:
  - **"1 é quase nada. 10 é a pior dor que você já sentiu."** — DM Sans 400, 13px / 20px, `#55525F` (ink.600).

## 4.3 Step 3 — TempoStep (`steps/TempoStep.tsx`)
- Title: **"Desde quando, e como está indo?"**
- Intro: **"Ajuda o médico a entender se o quadro está mudando."**
- Content:
  1. **Curve card**: `background #FFFFFF`, `border-radius 16px`, `padding 16px`.
     - `SymptomCurve` (`SymptomCurve.tsx`): SVG full card width × **height 132 px**, horizontal padding constant `PAD = 16` inside the SVG.
       - Three control levels as fractions of 132 px, by `evolution`: `piorando` → [0.68, 0.50, 0.18] (line rises to the right); `melhorando` → [0.22, 0.42, 0.72]; `igual`/null → [0.44, 0.38, 0.44].
       - Path = two cubic béziers from `(16, y0)` → `(16+inner/2, y1)` → `(16+inner, y2)`; area = same path closed down to `y=132`.
       - Area fill: vertical `linearGradient` id `symptomFill`, `#7E3BED` at 0.16 opacity (top) → `#7E3BED` at 0 (bottom).
       - Line: stroke `#7E3BED`, `stroke-width 3`, `stroke-linecap round`, no fill.
       - Start dot: `r 5`, fill `#FFFFFF`, stroke `#7E3BED` width 3. End dot: `r 5`, solid `#7E3BED`.
     - Axis row below the SVG, `justify-between`: left = onset label or fallback **"Início"**; right = **"Hoje"**. Both DM Sans 400, 12px, `#A29FB0`.
  2. Label `margin: 28px 0 12px`: **"Começou"** — DM Sans 700, 13px, uppercase, `tracking-wide`, `#726F80`.
  3. Onset chips (`flex-wrap gap-8px`, single-select): **Hoje · Ontem · 3 dias · 1 semana · 1 mês · Mais de 1 mês**.
  4. Label `margin: 28px 0 12px`: **"Está"** — same style.
  5. Evolution chips (single-select): **Piorando · Igual · Melhorando**.
- Primary button: **"Continuar"**, disabled until `onset !== null` (evolution is optional).
- **RulerStepper is NOT used here.** `grep` confirms its only consumer is `src/components/anamnese/steps/FichaStep.tsx` (health-profile "Dados básicos", weight/height), which is not part of this flow. Spec retained in §7 in case you need it.

## 4.4 Step 4 — ContextoStep (`steps/ContextoStep.tsx`)
- Title: **"Confirme medicamentos e alergias"** when a health profile exists; **"Medicamentos e alergias"** when it doesn't.
- Intro: with profile → **"Dados da sua ficha de saúde. Ajuste se algo mudou para este atendimento."**; without → **"Informe o que você usa e se tem alguma alergia para este atendimento."**
- Content:
  1. **ChipField "Medicamentos de uso contínuo"** (see spec below), `source = "da sua ficha"`, placeholder **"Ex.: Losartana 50mg"**, empty label **"Nenhum medicamento contínuo."**
  2. **ChipField "Alergias"**, `source = "da sua ficha"`, placeholder **"Ex.: Dipirona"**, empty label **"Nenhuma alergia registrada."** Disabled (opacity 0.45, non-interactive) when "Nenhuma alergia conhecida" is checked.
  3. **Checkbox row**: `margin: -8px 0 24px`, `padding 8px 0`, `flex-row items-center`.
     - Box 24 × 24, `border-radius 6px`. Unchecked: `background #FFFFFF`, `border: 1px solid #E6E4EC`. Checked: `background #7E3BED`, no border, contains **lucide `Check`, size 14, color `#FFFFFF`, strokeWidth 3**.
     - Label `margin-left 12px`: **"Nenhuma alergia conhecida"** — DM Sans 400, 15px, `#403D4A` (ink.700).
  4. Section label, `margin-bottom 4px`: **"O que este médico pode ver"** — DM Sans 700, 13px, uppercase, `tracking-wide`, `#726F80`.
  5. Helper, `margin-bottom 12px`: **"Sua anamnese ele sempre vê. O resto é você quem decide."** — DM Sans 400, 13px / 20px, `#A29FB0`.
  6. **Share-mode radio card**: `background #FFFFFF`, `border-radius 16px`, `overflow hidden`. Three rows, `padding 14px 16px`, pressed `#F9F8FB`:
     - Radio 24 × 24 circle: selected → `#7E3BED` + **lucide `Check` 14 `#FFFFFF` stroke 3**; unselected → `#FFFFFF` with `1px solid #E6E4EC`.
     - Text column `margin-left 12px`: label DM Sans 500, 15px, `#17151E`; hint `margin-top 2px` DM Sans 400, 13px / 20px, `#A29FB0`.
     - Rows in order (`SHARE_MODE_OPTIONS`):
       1. **"Só nesta consulta"** — *"O acesso acaba quando a consulta termina."*
       2. **"Com meus médicos"** — *"Vale para os próximos atendimentos também."*
       3. **"Não compartilhar"** — *"O médico vê apenas o que você escreveu aqui."*
     - Default selection = `temporary` ("Só nesta consulta") unless privacy settings already share globally, in which case `permanent`.
  7. **Scope card** — hidden when mode is "Não compartilhar". Wrapper `margin-top 12px`; card `background #FFFFFF`, `border-radius 16px`, `overflow hidden`. Two checkbox rows, `padding 14px 16px`:
     - Box 24 × 24, `border-radius 6px`, same checked/unchecked styling as (3).
     - Label `margin-left 12px`, flex 1: **"Ficha de saúde"**, then **"Documentos e exames"** — DM Sans 400, 15px, `#403D4A`. Both default to checked.
     - Error line when both are unchecked (`margin-top 8px`): **"Escolha ao menos uma coisa para compartilhar, ou marque "Não compartilhar"."** — DM Sans 400, 13px, `text-destructive` → `#EF4444`. (Note the copy uses curly quotes `“…”` around *Não compartilhar*.)
  8. Sync note (only if meds/allergies differ from the stored ficha), `margin-top 16px`: **"Também atualizamos sua ficha de saúde."** — DM Sans 400, 13px, `#A29FB0`.
- Primary button: **"Confirmar"**; shows the spinner while the profile save is in flight; disabled when a share mode ≠ "none" is selected but both scope checkboxes are off.

### ChipField — `src/components/anamnese/ChipField.tsx`
- Outer `margin-bottom 24px`.
- Header row `margin-bottom 12px`, `flex-row items-baseline justify-between`:
  - Title: DM Sans 700, 13px, uppercase, `letter-spacing 0.025em`, `#726F80`.
  - Source (right): DM Sans 400, 12px, `#A29FB0` — text **"da sua ficha"**.
- Card: `background #FFFFFF`, `border-radius 16px`, `padding 16px`; `opacity 0.45` when disabled.
  - Empty state line, `margin-bottom 12px`: DM Sans 400, 14px, `#A29FB0`.
  - Chip list (when non-empty), `margin-bottom 12px`, `flex-row flex-wrap gap-8px`:
    - Chip: `border-radius 999px`, `min-height 36px`, `padding 8px 12px`, background `#EBE1FD` (violet.100), row/center.
    - Label DM Sans 500, 14/20, `#451391` (violet.800). Then **lucide `X`, size 14, color `#5719B6` (violet.700), strokeWidth 2.4, `margin-left 6px`**. Tapping the chip removes it. `hitSlop 4`.
  - Input row: `flex-row items-center gap-8px`.
    - `TextInput`: flex 1, `height 44px`, `border-radius 12px`, background `#F9F8FB` (ink.50), `padding 0 12px`, text DM Sans 400, 15px, `#17151E`, placeholder color `#D2CFDB`, `returnKeyType="done"`.
    - Add button: **44 × 44**, `border-radius 12px`, background `#7E3BED` (pressed `#6A24DB`), `opacity 0.35` when the input is empty or field disabled. Icon **lucide `Plus`, size 20, color `#FFFFFF`, strokeWidth 2.4**.

## 4.5 Step 5 — AnexosStep (`steps/AnexosStep.tsx`)
- Title: **"Quer anexar alguma coisa?"**
- Intro: **"Exames, receitas ou uma foto do que está te incomodando."**
- Content:
  1. **Three source tiles**: `flex-row gap-12px`, each `flex: 1`, `border-radius 20px`, background `#FFFFFF`, `padding: 28px 0`, centered column, pressed `#F9F8FB`; `opacity 0.4` and disabled when 10 files are attached.
     - Icon (all **size 26, color `#7E3BED`, strokeWidth 2**), then label `margin-top 8px` DM Sans 500, 14px, `#17151E`:
       1. **lucide `Camera`** — **"Câmera"**
       2. **lucide `Image`** (imported as `ImageIcon`) — **"Galeria"**
       3. **lucide `FileText`** — **"Arquivo"**
  2. **Empty state** (0 attachments), `margin-top 32px`, centered:
     - `IllustrationSlot id="ILL-08"` → `optional-skip-attach.webp`, **180 × 140 px**, contain.
     - Caption `margin-top 16px`, centered: **"Nada anexado ainda. Esta etapa é opcional."** — DM Sans 400, 14px, `#A29FB0`.
  3. **File list** (≥1 attachment), wrapper `margin-top 24px`:
     - Counter label `margin-bottom 12px`: **`<n> de 10`** — DM Sans 700, 13px, uppercase, `tracking-wide`, `#726F80`.
     - Card `background #FFFFFF`, `border-radius 16px`, `overflow hidden`; rows `flex-row items-center`, `padding 14px 16px` (not pressable).
       - Leading tile: **36 × 36**, `border-radius 12px`, background `#EBE1FD`; icon **lucide `Image`** (kind image) or **lucide `FileText`** (kind document), **size 17, color `#5719B6`, strokeWidth 2.2**.
       - Filename `margin-left 12px`, flex 1, 1 line, `ellipsizeMode="middle"`: DM Sans 400, 15px, `#17151E`.
       - Trailing delete: **lucide `Trash2`, size 18, color `#A29FB0`, strokeWidth 2.2**, `hitSlop 10`, a11y `Remover <nome>`.
- Primary button: **"Continuar sem anexos"** when the list is empty, **"Continuar"** once ≥1 file. Never disabled. Advancing from `anexos` (last step) pushes `/(client)/anamnese/revisao`.
- Permission denial alert copy: title **"Permissão necessária"**, body **"Precisamos de acesso para anexar a imagem."**

---

# 5. `specs/anamnese-revisao.md` — `src/app/(client)/anamnese/revisao.tsx`

Root `SafeAreaView flex-1`, background `#FAFAFE`, edges top/left/right.

1. **Nav row** — `flex-row items-center`, `padding: 4px 12px 0`. Single left back button 44 × 44, radius 999, pressed `#F2F1F6` — **lucide `ChevronLeft`, size 24, color `#17151E`, strokeWidth 2.2**. (No close button on this screen.)
2. **ScrollView** — `padding: 0 20px 150px`.
   1. **Title**: **"É isso que o médico vai ver"** — Space Grotesk 700, `26px / 31px`, `letter-spacing -0.4px`, `#17151E`.
   2. **Subtitle** `margin-top 8px`: **"Confira antes de enviar. Dá para editar qualquer parte."** — DM Sans 400, 15px / 22px, `#726F80`.
   3. **AnamneseRecap** wrapper `margin-top 24px` (rendered without an `onEdit`, so its internal "Editar" affordance is **absent** here):
      - Card: `background #FFFFFF`, `border-radius 16px`, `padding 16px`.
      - Top row (`flex-row`):
        - **BodyThumbnail** (only when there are markers), `margin-right 16px`: box **58 × 125.67 px** (width 58, height = 58 × 520/240). Same `BodyFigure` quiet tone (fill `#F2F1F6`, stroke `#E6E4EC`, stroke-width 1.5); `sex="OTHER"`, no height/weight. View = `back` only if *every* marker is on the back, else `front`. Marker dots: **12 × 12 px**, radius 6, background `#7E3BED`, `border: 1.5px solid #FFFFFF`, at `region.x/scale − 6`, `region.y/scale − 6` with `scale = 240/58 = 4.138`.
        - Text column (flex 1):
          - **Reason paragraph** (composed by `composeReason`): DM Sans 400, **15px / 21px**, `#17151E`. Format = `"<motivo>. Início: <onset minúsculo>. Evolução: <evolução minúscula>."` plus **"Sem dor localizada."** when `noPain`. Example: `Estou com dor de cabeça há três dias, piora à noite. Início: 3 dias. Evolução: piorando.`
          - **Primary marker row** `margin-top 12px`, `flex-row flex-wrap items-center gap-8px`:
            - Level badge **24 × 24** circle `#7E3BED`, digit Space Grotesk 700, 11px, `#FFFFFF`.
            - Region label DM Sans 500, 13px, `#403D4A`.
            - Sensations (if any) DM Sans 400, 13px, `#A29FB0`, joined with `" · "`.
          - **"+N outros pontos"** line, `margin-top 6px`: DM Sans 400, 13px, `#A29FB0`. Singular/plural handled: 2 markers → `+1 outro ponto`; 3+ → `+2 outros pontos`.
      - **Divider block** `margin-top 12px`, `border-top: 1px solid #F2F1F6`, `padding-top 8px`. Each `Line` is `flex-row`, `padding 6px 0`:
        - Label column fixed **width 112 px**, DM Sans 400, 13px, `#A29FB0`.
        - Value flex 1, DM Sans 400, 13px, `#403D4A`.
        - Rows: **"Medicamentos"** → items joined `" · "` or **"Nenhum"**; **"Alergias"** → **"Nenhuma conhecida"** / joined list / **"Não informado"**; **"Anexos"** (only when attachments exist) → label column, then **lucide `Paperclip`, size 13, color `#726F80`, strokeWidth 2.2**, then `margin-left 6px` text `"N arquivo"` / `"N arquivos"` DM Sans 400 13px `#403D4A`.
   4. **"Editar" label** `margin: 32px 0 8px`: DM Sans 700, 13px, uppercase, `tracking-wide`, `#726F80`.
   5. **Edit list card**: `background #FFFFFF`, `border-radius 16px`, `overflow hidden`. One row per `ANAMNESE_STEPS` entry, `flex-row items-center justify-between`, `padding 14px 16px`, pressed `#F9F8FB`:
      - Left: step title DM Sans 500, 15px, `#17151E` — **Motivo · Onde dói · Há quanto tempo · Medicamentos e alergias · Anexos**.
      - Right: current summary, 1 line, DM Sans 400, 13px, `#A29FB0`; falls back to the em-dash **"—"** when empty.
   6. **Sharing card** `margin-top 16px`: `background #FFFFFF`, `border-radius 16px`, `padding 16px`.
      - Header row `justify-between`: left **"Compartilhamento"** DM Sans 500, 15px, `#17151E`; right pressable **"Mudar"** DM Sans 500, 14px, `#5719B6`, `hitSlop 8` (jumps to the `contexto` step).
      - Body `margin-top 4px`: DM Sans 400, 13px / 20px, `#726F80` — text `"<modo> · <escopo>"` where modo ∈ {Só nesta consulta, Com meus médicos, Não compartilhar} and escopo ∈ {`ficha de saúde e documentos`, `ficha de saúde`, `documentos`, `Nada além desta anamnese`}. Default example: **"Só nesta consulta · ficha de saúde e documentos"**.
3. **StickyBar**: single `PillButton primary` — **"Enviar anamnese"**; spinner while sending; disabled until the flow is ready and a target exists. No secondary action.
- Error toasts on this screen: `"Não encontramos a consulta desta anamnese. Abra pela sua consulta e tente de novo."`; a 400 containing "já possui uma anamnese" silently routes to `enviada`.

---

# 6. `specs/anamnese-enviada.md` — `src/app/(client)/anamnese/enviada.tsx`

Root `SafeAreaView flex-1`, background `#FAFAFE`, edges top/left/right.

1. **Centered block** — `flex-1 items-center justify-center`, `padding: 0 24px`:
   - `IllustrationSlot id="ILL-09"` → `handoff-sheet.webp`, **240 × 180 px**, contain.
   - **Headline** `margin-top 32px`, centered: **"Anamnese enviada"** — Space Grotesk **700**, `font-size 28px`, `line-height 32px`, `letter-spacing -0.42px`, `#17151E`. (Matches the `type.display` token exactly.)
   - **Body** `margin-top 12px`, centered: **"O médico recebe tudo antes da consulta."** — DM Sans 400, 15px / 22px, `#726F80`. (Plantão variant: *"O médico do plantão recebe seu caso ao te chamar."*)
   - **Failed-uploads card** (only when the route carries `?failed=N`), `margin-top 24px`, full width, `background #FFFFFF`, `border-radius 16px`, `padding 16px`:
     - Line 1: DM Sans 500, 14px, `#17151E` — `"1 anexo não foi enviado"` (N=1) or `"3 anexos não foram enviados"` (N>1).
     - Line 2 `margin-top 4px`: **"A anamnese foi enviada mesmo assim. Você pode anexar de novo na tela da consulta."** — DM Sans 400, 13px / 20px, `#726F80`.
2. **StickyBar**: single `PillButton primary` — **"Voltar para a consulta"** (plantão variant: **"Ir para a fila"**). Action: `router.dismissAll()` then `router.back()`.

---

# 7. `specs/anamnese-unused-components.md` (present in the folder, not on the consultation path)

## CarryForwardCard — `src/components/anamnese/CarryForwardCard.tsx`
Rendered **only** when `fromPlantao=true` and the draft is pristine. On the hub screen, `margin-top 24px`; card `background #FFFFFF`, `border-radius 16px`, `padding 16px`.
- Row `flex-row items-center gap-12px`:
  - Badge **36 × 36** circle, background `#EBE1FD`; **lucide `RotateCcw`, size 17, color `#6A24DB` (violet.600), strokeWidth 2.2**.
  - Column flex 1: title **"Você já tinha preenchido uma anamnese"** DM Sans 500, 15px, `#17151E`; body `margin-top 2px` DM Sans 400, 13px / 18px, `#726F80` — `"Preenchida <há X tempo (date-fns ptBR, addSuffix)>. Dá para reaproveitar e só ajustar o que mudou."`, fallback first sentence **"Do seu último atendimento."**, plus **" Os anexos não vêm junto."** when the source anamnese had attachments.
- Actions row `margin-top 16px`, `flex-row items-center gap-8px`:
  - Primary: flex 1, `height 44px`, `border-radius 999px`, background `#7E3BED` (pressed `#6A24DB`), label **"Reaproveitar e revisar"** DM Sans 500, 15px, `#FFFFFF`.
  - Secondary: `height 44px`, `padding 0 16px`, radius 999, transparent (pressed `#F9F8FB`), label **"Do zero"** DM Sans 500, 15px, `#726F80`.

## RulerStepper — `src/components/anamnese/RulerStepper.tsx`
Only used by `FichaStep` (health-profile "Dados básicos"), not by TempoStep.
- Wrapper `margin-bottom 20px`.
- Header row `margin-bottom 4px`, `items-baseline justify-between`: left label DM Sans 400, 13px, `#726F80`; right = value **Space Grotesk 700, 30px / 32px, `#17151E`** (or placeholder `"—"`) + unit `margin-left 4px` DM Sans 400, 14px, `#A29FB0`.
- Ruler: SVG full width × **height 68 px**. Ticks every **9 px** (`TICK_GAP`), stroke `#E6E4EC`; minor ticks `y 26→40`, `stroke-width 1`; major ticks (value % `majorEvery` === 0) `y 16→48`, `stroke-width 2`. Center indicator line at `x = width/2`, `y 10→54`, stroke `#7E3BED`, `stroke-width 3`, round cap. Horizontal pan moves the value (haptic per step).

---

# 8. `specs/video-call.md` — `src/app/(client)/video-call.tsx`

Route params: `consultationId`, optional `fromPlantao`. Polls `GET consultation` every 5 s. Requests camera (`expo-camera`) + mic (`expo-audio`) permissions on mount.

## 8.1 Gate states (each is a full-screen replacement, in evaluation order)
All use raw `react-native` `Text` (not the themed `Text`), so they inherit **system font**, not DM Sans — note this if rebuilding faithfully.

1. **No `consultationId`** → `VideoCallRecovery` with title **"Consulta não encontrada"**, message **"Não foi possível identificar a consulta para esta videochamada."**, retry label **"Voltar"**.
2. **Permissions denied** → `VideoCallRecovery` title **"Permissões necessárias"**, message **"Permita o uso da câmera e do microfone para participar da videochamada."**, retry **"Reconectar"**.
3. **Embed error** → `VideoCallRecovery` default title **"Não foi possível conectar à videochamada"**, message **"Verifique sua conexão e tente novamente. Se o problema continuar, encerre a visualização e tente mais tarde."**
   - `VideoCallRecovery` layout: `flex-1 items-center justify-center`, `padding 0 24px`, background `#FAFAFE`. Title `margin-bottom 12px`, centered, `text-xl` **20px / 28px**, `font-semibold`, `#17151E`. Message `margin-bottom 32px`, centered, `text-base` 16/24, `#726F80`. Primary button `margin-bottom 12px`, `border-radius 12px`, `padding 12px 24px`, background `#7E3BED`, label `font-semibold` 16/24 `#FFFFFF`. Secondary button `border-radius 12px`, `padding 12px 24px`, transparent, label **"Encerrar visualização"** `font-semibold` `#7E3BED`.
4. **Loading** → centered `ActivityIndicator size="large" color #7E3BED`, then `margin-top 16px` text **"Carregando consulta..."** in `#726F80`, background `#FAFAFE`.
5. **Query error / no consultation** → centered, `padding 0 16px`: text **"Erro ao carregar consulta"** `text-lg` 18/28, centered, `text-red-600` (Tailwind default `#DC2626`), `margin-bottom 16px`; then pill-less button `border-radius 12px`, `padding 12px 24px`, background `#7E3BED`, label **"Voltar"** `font-semibold` `#FFFFFF`.
6. **Permissions pending** → centered text **"Aguardando permissões..."**, `padding 0 16px`, `#726F80`.
7. **No room URL** → centered, `padding 0 16px`: **"Link da videochamada não disponível"** `text-lg` 18/28 `#17151E` `margin-bottom 8px`; **"O link será disponibilizado quando a consulta estiver próxima do horário agendado."** 16/24 `#726F80` `margin-bottom 16px`; **"Voltar"** button as above.
8. **Too early (> 15 min before start)** → centered: **"Consulta ainda não iniciou"** 18/28 `#17151E`; **"Sua consulta está agendada para `<data pt-BR completa>`. O link estará disponível 15 minutos antes do horário."** 16/24 `#726F80`; **"Voltar"** button. A native `Alert.alert` with the same two strings also fires (OK → `router.back()`).
9. Missing-room native alert: title **"Link não disponível"**, body **"Sua videochamada ainda não está disponível. Por favor, tente novamente em alguns instantes."**

## 8.2 Live call screen (the normal case)
Root `View flex:1`, background `#FAFAFE` (invisible — the WebView covers it).

1. **Floating back button** — the *only* chrome the app draws over the call:
   - `position: absolute; top: safe-area-top + 8px; left: 16px; z-index: 10;`
   - **40 × 40 px**, `border-radius: 20px`, `background: rgba(0, 0, 0, 0.4)`, centered.
   - Icon: **lucide `ChevronLeft`, size 22, color `#FFFFFF`**, default strokeWidth (2).
   - No label, no blur, no shadow.
2. **`<WherebyEmbed style={{flex:1}}>`** fills the entire screen edge-to-edge, under the status bar (no SafeAreaView wrapper on this branch). It is keyed `whereby-client-<retryKey>` so a retry remounts it.
3. **No app-drawn header, no status pill, no timer, no participant chips, no end-call button.** Everything else you see is Whereby's own web UI.

## 8.3 What Whereby renders (props → room URL query params)
From `node_modules/@whereby.com/react-native-sdk/dist/module/embed/index.js`: the SDK takes the room URL, always appends `sdkPlatform=react-native-embed`, then maps each set prop to a query param. **Only these are passed by the app:**

- `minimal` (true) → **`embed=on`**. This is Whereby's "minimal/embedded" chrome: compact layout, **no Whereby logo**, no room-name header, reduced top bar.
- `skipMediaPermissionPrompt={permissionsGranted}` → `skipMediaPermissionPrompt=on` — skips Whereby's own permission ceremony (the app already asked natively).
- `mediaCapturePermissionGrantType="grant"` — a `react-native-webview` prop (auto-grants the WebView's camera/mic request), **not** a Whereby URL param.

**Everything else is left at the Whereby room's own defaults** — the app does **not** set `chat`, `people`, `screenshare`, `leaveButton`, `bottomToolbar`, `topToolbar`, `logo`, `participantCount`, `settingsButton`, `moreButton`, `pipButton`, `reactions`, `timer`, `background`, `floatSelf`, `precallReview`, `precallCeremony`, `displayName`, `lang`, etc. So the default Whereby embedded room UI applies:

- Full-bleed dark video stage (Whereby's default room background), remote participant filling the frame, local self-view as a small floating (draggable) tile.
- **Bottom toolbar** with the standard round controls: microphone toggle, camera toggle, screenshare, chat, people/participants, reactions, "more" (⋯), and the red **leave** button — light toolbar items on the default dark stage (`toolbarDarkText` not set).
- **Chat** and **people** panels slide in from the right when their toolbar buttons are tapped (both default-on).
- A pre-call review/ceremony screen may appear before joining (Whereby default), though `skipMediaPermissionPrompt=on` removes the device-permission step of it.
- Text/labels default to English unless the room itself is configured otherwise — the app does not pass `lang="pt"`.
- The SDK's WebView is created with `startInLoadingState`, `originWhitelist:['*']`, `mediaPlaybackRequiresUserAction:false`, `allowsInlineMediaPlayback:true`, `javaScriptEnabled`, `domStorageEnabled`.

Events consumed: `ready` (breadcrumb only), `leave` / `meeting_end` → navigate to `/(client)/pos-consulta`, `participant_join` / `participant_leave` / `participantupdate` → drive the disconnect dialog, `deny_device_permission` → native alert title **"Permissão Negada"**, body **"É necessário permitir o acesso ao microfone e câmera."**

## 8.4 Doctor-disconnected overlay (`BrandDialog`)
Appears when a remote participant leaves (or participant count drops to ≤1) after one had joined. `dismissible={false}`.
- Icon slot: **40 × 40** circle, `margin-right 12px`, background `bg-destructive-soft` → **`#FEE2E2`**; **lucide `WifiOff`, size 20, color `#EF4444`**.
- Title: **"Médico desconectado"**.
- Body: **"O médico saiu da sala. Isso pode ter acontecido por um problema de conexão."**
- Actions stack, `gap: 10px`; each button `height 48px`, `border-radius 16px`, row centered, `opacity 0.6` while an action is loading:
  1. **"Esperar"** — primary: background `#7E3BED` (pressed `#6A24DB`); **lucide `Clock`, size 18, `#FFFFFF`**; label `margin-left 8px` **DM Sans 700, 14px, `#FFFFFF`**.
  2. **"Solicitar reembolso"** — secondary: `background #FFFFFF`, `border 1px solid #E6E4EC` (pressed `#F9F8FB`); **lucide `RotateCcw`, size 18, `#403D4A`**; label DM Sans 700, 14px, `#282632` (ink.800). While loading, the icon+label are replaced by a small `ActivityIndicator` colored `#403D4A`.
  3. **"Converter em crédito"** — same secondary styling; **lucide `Wallet`, size 18, `#403D4A`**.

---

# 9. `specs/pre-consulta.md` — `src/app/(client)/pre-consulta.tsx` (brief)

Root `View flex-1`, background `#FAFAFE`. Composition only (each card has its own file under `src/components/pre-consulta/`):

1. **`PreConsultaHeader`** — receives `doctor`, `mode` (online/presencial), `countdown`, `isOnCall`, a back handler and, when cancel/reschedule are allowed, a `⋯` menu handler.
2. **`PendingLine`** (conditional) — a one-line banner with `view.pendingLine` text.
3. **ScrollView** — `padding-top 12px`, `padding-bottom: safe-area-bottom + 140px`. Children animate in with `FadeInDown`, **320 ms**, cubic-bezier(0.22, 1, 0.36, 1), staggered **60 ms** per index (`entrance(i)` in `src/theme/motion.ts`):
   - index 0 — **`ConsultaTicket`** (doctor, schedule, paid line, share button).
   - index 1 — **`LocalCard`** (presencial only; clinic + "como chegar").
   - index 2 — **`AnamneseCard`** — shows the `RecapView` of the already-submitted anamnese, or the CTA to fill it.
   - index 3 — **`PagamentoCard`** with note verbatim: **"Ainda não recebemos a confirmação do pagamento. Se você já pagou, toque em Já paguei para atualizar."**
   - index 4 — **`AjudaCard`** (help topics; "perguntar à IA" → `/(client)/consultation-ai-chat`; support → WhatsApp with prefilled message **"Olá, preciso de ajuda com minha consulta."**).
4. **`StickyActionBar`** — pinned bottom; the action that leads into the call is `enter_video`, which resolves the room via `getClientVideoCallNavigation(mode !== 'presencial', roomUrl, consultationId)` and `router.push`es `/(client)/video-call`. If the room isn't ready: toast **"A sala ainda não está disponível."**
5. Overlays: `CancelDialog`, `RescheduleFlow` (bottom sheet).
6. Missing-consultation state: header + centered **"Consulta não encontrada"** (Space Grotesk 700, 18px, `#17151E`) and **"Ela pode ter sido cancelada ou o link expirou. Veja suas consultas para continuar."** (DM Sans 400, 14px / 21px, `#726F80`), `padding 0 32px`.
7. Action sheet options (native): **"Reagendar"**, **"Cancelar consulta"** (destructive), **"Fechar"**.
8. Toasts: **"Pagamento confirmado."**, **"Ainda não identificamos o pagamento. Tente de novo em instantes."**, **"Endereço da clínica indisponível."**

---

## Notes / gotchas worth flagging before you build

- `railLabelFor()` and `StepIntroLabel` are **unreferenced** by any screen — the flow header shows only `ChapterDots` + `"N de 5"`.
- `RulerStepper` belongs to the *ficha* flow (`FichaStep`), not to `TempoStep`.
- `font-brand` is **Space Grotesk 700**, not 500 — `font-brand-medium` is the 500 alias and appears nowhere in these screens.
- The `MarkerSheet` backdrop has **no scrim color** — the sheet slides over the live step with a fully transparent background behind it.
- `video-call.tsx` and `VideoCallRecovery` use React Native's raw `Text`, so those strings render in the system font, unlike the rest of the app.
- Whereby's in-call UI is entirely Whereby-rendered; the app contributes only the 40 px translucent back circle and the disconnect dialog.