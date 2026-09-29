---
workflow: general-video
flow: companion
storyboard: yes
message: "Do benefício à consulta em vídeo, sem sair do app"
destination: tiktok
aspect: 1080x1920
language: pt-BR
length: 60-75s
angle: walkthrough
---

## Intent

Silent TikTok/Instagram walkthrough of the Viva Mais client app: pure UI, a glassy
cursor dot taps through the real flow from home to a live video consultation. The
UI is rebuilt in HTML (not screenshots) so every element can animate, but fidelity
is the hard rule: real fonts (DM Sans, Space Grotesk), real Lucide icons, real
illustrations and Lottie files from the app repo, no text wrapping where the app
would not wrap. "Very animated" motion, one continuous camera.

## Assets

- /Users/legacyn/www/vivamais/vivamaisa-app/assets/illustrations — app illustrations
- /Users/legacyn/www/vivamais/vivamaisa-app/assets/icons, assets/animations — icons and Lottie files
- /Users/legacyn/www/vivamais/vivamaisa-app/src/theme/tokens.json — color/radius/type tokens
- Real doctor photos from hml API (fictional names attached)
- iOS Simulator screenshots of every screen as fidelity reference (public/ref/)

## Customizations

- Flow: device frame on brand background → zoom to full-bleed on first tap → home →
  benefit card → doctor list → doctor page → slot pick → checkout → card payment
  (typing beat) → success → anamnese (3 quick answers + send) → pull back out to
  Whereby-style video call with the same doctor. Ends on the call. No end card.
- Cursor: glassy AssistiveTouch-style dot, eased paths, off-screen first entry,
  ripple on tap, hidden during scroll gestures.
- Fictional names, prices, dates; real doctor photos.

## Notes

- No audio at all. No captions, no step labels, no CTA. Pure UI.
- Content in Portuguese (pt-BR), as in the app.
- Real specialty must be one with an illustration in the app.
