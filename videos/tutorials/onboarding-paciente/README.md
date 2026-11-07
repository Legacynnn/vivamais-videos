# onboarding-paciente

Vertical 1080x1920 onboarding for new patients (PJ beneficiaries, many 60+), silent, ~5:37. Real app UI captured from `vivamaisa-app` main, 10 numbered chapters: o que é, criar conta, benefícios, Início, marcar consulta, anamnese, histórico, dependentes, IA, IA marca consulta.

## Pipeline

1. `npm run app:setup` (copies the app into `.cache/app-web`), `node capture/mock-api.mjs`, `npm run app:web`
2. `node capture/capture.mjs [onboard signup home agendar anamnese historico dependentes ia iajulia plano]` writes `capture/states/*.json`
3. `node build/.localize.mjs` (needs the app server) downloads images/fonts into `assets/ui/`; stop Expo afterwards
4. `npm run build` (ui-css + scenes), `node ../../kit/stamp.mjs`, `npm run seams`, `node ../../kit/audit-marks.mjs`
5. `npx hyperframes render`

## Notes

- Persona Maria Oliveira (65), dependent José Oliveira; plan Viva+ Empresarial with 25% discount; Pix payments.
- The IA doctor cards in `c10-ia-agenda` are not in the app yet; they are injected into the captured chat in the app's styles.
- `assets/docs/*.png` come from the deployed PDF templates (`build/pdf/`, backend `origin/master`).
- `start.sh` runs `pkill -f "expo start --port 8095"`: never call it from a shell whose command line contains that string.
