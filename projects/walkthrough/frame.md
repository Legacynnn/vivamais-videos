---
name: Viva Mais
description: Electric vector care — médico no bolso, em produto calmo e confiável.
colors:
  violet: "#7E3BED"
  violet-50: "#F5F0FE"
  violet-100: "#EBE1FD"
  violet-200: "#D6C3FB"
  violet-300: "#BC9CF7"
  violet-400: "#9D6BF2"
  violet-600: "#6A24DB"
  violet-700: "#5719B6"
  violet-800: "#451391"
  violet-900: "#350E6F"
  violet-950: "#22084A"
  lime: "#C6FF34"
  lime-50: "#F9FFE5"
  lime-100: "#F1FFC6"
  lime-200: "#E4FF94"
  lime-300: "#D6FF61"
  lime-500: "#ADF20D"
  lime-600: "#8CC900"
  lime-700: "#6A9A02"
  lime-900: "#46650C"
  ink: "#17151E"
  ink-50: "#F9F8FB"
  ink-100: "#F2F1F6"
  ink-200: "#E6E4EC"
  ink-300: "#D2CFDB"
  ink-400: "#A29FB0"
  ink-500: "#726F80"
  ink-700: "#403D4A"
  canvas-white: "#FFFFFF"
  canvas-ice: "#FAFAFE"
  panel-ice: "#F3F4FA"
  lavender-mist: "#F3EDFF"
  success-live: "#22C55E"
  warning-amber: "#F59E0B"
  danger-coral: "#EF4444"
  info-soft-violet: "#A78BFA"
typography:
  display:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.45
rounded:
  md: "12px"
  lg: "16px"
  xl: "20px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.canvas-white}"
    rounded: "{rounded.lg}"
    height: "52px"
    padding: "0 24px"
  button-primary-active:
    backgroundColor: "{colors.violet-600}"
    textColor: "{colors.canvas-white}"
    rounded: "{rounded.lg}"
  button-ghost:
    backgroundColor: "{colors.canvas-white}"
    textColor: "{colors.violet-700}"
    rounded: "{rounded.lg}"
    height: "52px"
  chip-lime:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  card-surface:
    backgroundColor: "{colors.lavender-mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "20px"
  input-field:
    backgroundColor: "{colors.canvas-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    height: "52px"
    padding: "0 16px"
---

# Design System: Viva Mais

## 1. Overview

**Creative North Star: "Médico no Bolso"**

Warm clinical light. The brand voice is energetic, youthful and human (violet, lime spark, flat Viva-vector illustration); the product register is a bright, calm clinic lobby. The screen is ice white (#FAFAFE) and near-black ink; warmth comes from air, soft shapes, human pt-BR copy and the violet aura — a large, soft violet wash allowed only as ambient ground behind headers and hero moments, never on controls. Violet (#7E3BED) stays solid where the user must act or know where they are. Lime (#C6FF34) is a rare spark: a plantão/live dot, a tiny badge — never a surface, never text, never frequent.

This system explicitly rejects the generic SaaS onboarding look (gradient heroes, identical card grids, hero-metric blocks), loud consumer-fintech neon and confetti, and government-portal form walls. It also retires the two legacy palettes: the #9531FF purple/teal generation and the vivamais.pen lilac generation both migrate to the tokens above.

**Key Characteristics:**
- Ice-white canvas, ink type, restrained solid violet, soft aura washes, rare lime spark
- Tonal depth via Lavender Mist surfaces; shadows only for floating layers
- Space Grotesk for display moments, DM Sans for everything else
- Soft, assured shapes: 16–20px radii, pill chips, 48–52pt touch targets
- Motion = snappy fades and soft scale (state 200ms, layout 320ms), critically damped springs, nothing bounces

## 2. Colors

Black-and-white clinical calm, punctuated by one violet voice and one lime spark.

### Primary
- **Violet** (#7E3BED): the single next action, the current position, active tab, focused field. Solid always — the marketing violet→lime gradient never enters product chrome. Ramp violet-50 … violet-950 exists for tints (pressed = violet-600, washes = violet-50/100).

### Secondary
- **Lime** (#C6FF34): electric spark. Badges, underlines, "ao vivo"/plantão accents, celebratory micro-marks. Always with ink (#17151E) text on it; never as text itself, never a large fill in clinical screens.

### Tertiary
- **Lavender Mist** (#F3EDFF): soft panel and card surface on light — the only tinted surface step at rest.

### Neutral
- **Ink** (#17151E): primary text. Tinted toward violet, never #000.
- **Ink-500** (#726F80): secondary text, captions.
- **Ink-400** (#A29FB0): placeholders, disabled labels.
- **Ink-200** (#E6E4EC): dividers, input borders.
- **Ink-50/100** (#F9F8FB / #F2F1F6): quiet grouped backgrounds.
- **Ice White** (#FAFAFE): the canvas — cool, faintly violet, never cream.
- **Panel Ice** (#F3F4FA): quiet grouped panels on the canvas.
- **White** (#FFFFFF): cards and sheets lifted off the ice.

### Semantic
- **Live** (#22C55E): confirmed, paid, active. **Amber** (#F59E0B): pending. **Coral** (#EF4444): errors, destructive. **Soft violet** (#A78BFA): tips, neutral info chips.

### Named Rules
**The Lime Spark Rule.** Lime covers at most 5% of any product screen, always paired with ink, never used for text or body surfaces. Its rarity is the point.

**The Solid Violet Rule.** On controls, violet is always solid. Gradients are marketing-only and never touch the wordmark bar.

**The Aura Rule.** The one gradient allowed in product: a large, soft violet wash (violet-400 → transparent, blurred, low chroma at the edges) as ambient ground behind a header or hero. It never sits on a button, card, or text block, and at most one aura per screen.

**The One Voice Rule.** One violet primary action per screen. Everything else is ghost, text, or icon in ink.

## 3. Typography

**Display Font:** Space Grotesk (with system-ui fallback) — weights 500, 700
**Body Font:** DM Sans (with system-ui fallback) — weights 400, 500, 700

**Character:** Space Grotesk brings the electric, slightly technical brand edge to headings and big numbers; DM Sans keeps forms, records and long Portuguese copy warm and effortless.

### Hierarchy
- **Display** (700, 28px, 1.15, -0.015em): screen titles, onboarding headlines. Space Grotesk.
- **Headline** (500, 22px, 1.25, -0.01em): section heads, big values (prices, dates). Space Grotesk.
- **Title** (700, 18px, 1.35): card titles, doctor names. DM Sans.
- **Body** (400, 16px, 1.6): copy, form values, records. DM Sans. Never below 14px for reading text.
- **Label** (500, 14px, 1.45): field labels, tabs, buttons, chips. DM Sans.

### Named Rules
**The Two Faces Rule.** Space Grotesk appears only at Display/Headline scale. Everything a user reads or types is DM Sans. No third face.

**The Migration Rule.** `font-display` (Prata) and `font-ui*` (Figtree) are legacy. New and redesigned screens use `font-brand` / `font-brand-medium` (Space Grotesk) and `font-text` / `font-text-medium` / `font-text-bold` (DM Sans).

## 4. Elevation

Tonal-first. Surfaces are flat at rest; depth comes from stepping White → Ink-50 → Lavender Mist, not from shadows. Shadows exist only for genuinely floating layers: bottom sheets, the floating video-call pill, toasts. If it scrolls with the page, it does not cast a shadow.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 8px 24px rgba(23, 21, 30, 0.10)`): sheets, floating video pill, toasts.
- **Press glow** (`box-shadow: 0 2px 8px rgba(126, 59, 237, 0.20)`): optional, on the primary button while pressed only.

### Named Rules
**The Tonal-First Rule.** If you reach for a shadow on a card, use Lavender Mist or Ink-50 instead. Audit test: a resting screen screenshot should contain zero drop shadows.

## 5. Components

Soft and assured: generous radii, full-height touch targets, one loud element per screen.

### Buttons
- **Shape:** softly rounded (16px radius); 52px height, 44pt minimum always.
- **Primary:** solid Violet (#7E3BED), white DM Sans 500 label, 24px horizontal padding.
- **Pressed:** Violet-600 (#6A24DB) + soft scale to 0.98 over 200ms; Android ripple white 18%.
- **Ghost:** white background, Violet-700 (#5719B6) label; or bare text button in Ink-500.
- **Destructive:** Coral (#EF4444) solid, white label. One per flow, behind confirmation.

### Chips
- **Style:** pill (full radius), 4px/12px padding, DM Sans 500 at 13–14px.
- **State:** selected = Violet-100 background + Violet-800 text; unselected = Ink-100 + Ink-500. Lime chip reserved for live/plantão and benefit sparks, ink text.

### Cards / Containers
- **Corner Style:** 20px radius.
- **Background:** white on tinted ground, or Lavender Mist (#F3EDFF) on white ground. Never nested cards.
- **Shadow Strategy:** none at rest (see Elevation).
- **Border:** hairline Ink-200 only when the surface matches the ground.
- **Internal Padding:** 20px; related rows separated by 12–16px.

### Inputs / Fields
- **Style:** white fill, 1px Ink-200 border, 16px radius, 52px height, DM Sans 400 at 16px.
- **Focus:** border shifts to Violet (#7E3BED) at 1.5px; label stays Ink-500. No glow.
- **Error:** border and helper text Coral; the message says what to fix, in Portuguese.
- **Disabled:** Ink-50 fill, Ink-400 text.

### Navigation
- **Tab bar:** native tabs on iOS, custom bar on Android. Active = Violet icon + label; inactive = Ink-400. Indicator is color, not a second bar.
- **Headers:** white, Display/Headline type in ink, back chevron 44pt. No colored header fills in clinical flows.

### Benefit Glyphs (signature)
Hand-drawn flat SVG glyphs (thin ink outlines, violet fills, lime accent dots) in the Viva-vector language. This is the house illustration style: flat shapes, 2.4px ink strokes, one lime accent max per glyph.

## 6. Motion

Motion performs; it never decorates. Every animation answers "what just changed?" — a state flipped, a surface arrived, a press landed. If a screen is idle, nothing moves. Values live in `src/theme/tokens.json` → `motion`, exposed as `DURATION`, `EASE`, `SPRING`, `PRESS_SCALE` from `~/theme/motion`.

### Durations
- **instant** (110ms): highlight bars, toggles, chip selection.
- **fast** (160ms): press feedback, icon swaps.
- **state** (200ms): the default product transition — opacity, color, small transforms.
- **layout** (320ms): sheets, expandable sections, list reorders.
- **enter** (360ms): screen and card entrances (fade + ≤12px rise), staggered 60ms per row.
- **ambient** (12s): the aura drift and nothing else.

### Easing
- **product** `cubic-bezier(0.25, 0.1, 0.25, 1)`: state changes.
- **out** `cubic-bezier(0.22, 1, 0.36, 1)`: entrances and anything arriving.
- **softScale** `cubic-bezier(0.16, 1, 0.3, 1)`: press scale.
- **inOut** `cubic-bezier(0.45, 0, 0.55, 1)`: loops and crossfades.
- **snap** `cubic-bezier(0.7, 0, 0.2, 1)`: highlight bars; snaps on, no drift.

### Springs
All springs are critically damped (ζ ≈ 1): they settle, they never overshoot. `settle` (damping 36 / stiffness 320) for generic interpolation, `press` (44 / 480) for scale on touch, `sheet` (44 / 400) for bottom sheets, `drag` (38 / 360) for release after a gesture. No ad-hoc `withSpring` configs in components.

### Named Rules
**The Settle Rule.** Nothing passes 1.0 scale, nothing bounces, nothing celebrates with confetti. A payment confirmed mark draws in; it does not pop.

**The Transform-Only Rule.** Animate `opacity` and `transform` only. Layout properties (height, padding, margin) animate through `layout` transitions or by measuring once — never by tweening the number.

**The Reduced-Motion Rule.** Every entrance and ambient effect checks `useReducedMotion()`; with it on, entrances render at rest and the aura holds still.

**The One-Ambient Rule.** At most one ambient element per screen (the aura). Pulsing dots exist only for something live right now (plantão, a consultation in progress).

## 7. Do's and Don'ts

### Do:
- **Do** keep violet to the single primary action and position markers; ≤10% of a clinical screen.
- **Do** pair lime exclusively with ink text and cap it at spark-scale (badges, dots, underlines).
- **Do** step surfaces tonally (White → Ink-50 → Lavender Mist) before ever considering a shadow.
- **Do** write UI in direct pt-BR second person: "Precisamos do seu CPF e data de nascimento."
- **Do** keep touch targets ≥44pt and body contrast ≥4.5:1 (Ink on white passes everywhere).
- **Do** use `font-brand`/`font-text` tokens and the violet/lime/ink Tailwind ramps (or `BRAND` in `~/theme/colors`) on every screen you touch; the values come from `src/theme/tokens.json` and nowhere else.
- **Do** take every duration, easing and spring from `~/theme/motion`; press = `PRESS_SCALE` 0.98 with `EASE.softScale`.

### Don't:
- **Don't** build generic SaaS onboarding: gradient hero, identical card grids, hero-metric block, mascot-with-checkmark.
- **Don't** go loud consumer fintech: neon gradients, aggressive full-bleed CTAs, streaks, confetti, gamified progress.
- **Don't** build government-portal form walls; fields arrive in small groups with a stated reason.
- **Don't** use gradients on controls, on the Mais bar, or as text fills (the ambient aura wash is the one exception). No `background-clip: text`, ever.
- **Don't** use cream or warm-beige surfaces; warmth comes from air, shape and copy, never from yellowed neutrals.
- **Don't** use lime for text, large fills, or anything in a medical-record context.
- **Don't** use #000 or colored side-stripe borders; no border-left accent bars on cards or alerts.
- **Don't** introduce new uses of legacy tokens (#9531FF, #12FFD7, pen-DS lilacs, Prata, Figtree); migrate on touch.
- **Don't** bounce, spring past 1.0 scale, or animate layout properties. "No bounce playground, no parallax soup."

## The Frame (video-scale notes for this project)

- Canvas 1080x1920. The phone UI is authored at the real iPhone logical size (402pt wide) inside `.phone-screen` and scaled uniformly by 2.6866 (1080/402), so every app value (16px body, 20px card radius, 12px chips) is used verbatim and stays pixel-faithful.
- Outside the phone (open + close scenes only): ground is violet-950 `#22084A` with a violet-600 radial bloom; nothing else, no text.
- Status bar: iOS style, 9:41, ink on light screens, white on violet headers. Home indicator 134x5 pill.
- Cursor dot: glassy AssistiveTouch style, 64pt in phone space, `rgba(255,255,255,.55)` fill, 1.5px white/70 ring, inner 26pt darker disc, backdrop blur 6px, drop shadow. Tap = scale .78 + expanding ring.
