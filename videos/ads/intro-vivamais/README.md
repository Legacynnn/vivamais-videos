# Intro · Viva Mais

Vertical 1080x1920 ad for the office TV, about 3:00, narrated in pt-BR (HeyGen voice Marisol) with burned-in word captions, one music track and SFX. Split-screen hook (waiting room "3 horas" vs doctor on the phone "4 min"), beat-cut stock montage under the logo, RH setup on the web, the collaborator on the phone (benefícios, IA, plantão, consulta, documentos, avisos), the RH panel, sign-off. The 16:9 build is archived in `.hyperframes/backup/`. The captured web UI's company name is swapped to "Minha Empresa" at build (`build/ui-web.mjs`).

## How it is built

No capture here. UI states are reused from the two tutorial projects:

- `capture/states` — Expo app states from `../../tutorials/tutorial-plantao` (phone, scope `.vm-ph`, `vm-ui-phone.css`)
- `capture/web/states` — vivamais-web states from `../../tutorials/tutorial-painel-empresarial` (laptop, scope `.vm-ui`, `vm-ui-desktop.css`)

To add a screen that does not exist yet, capture it in the owning tutorial project and copy the state JSON here.

```bash
npm ci
npm run build    # compositions/, index.html, ledger.json, STORYBOARD.md (all generated)
npm run check
npm run seams
```

## Editing

- `build/scenes/sNN-*.mjs` — one file per scene; `vo` names the narration line, `A.w("word")` returns the time that word is spoken, so choreography follows the voice
- `build/ad.js` / `build/ad.css` — kinetic text lines (`rise`, `slam`, `pop`, `out`), text substitution in captured states
- `build/kit.js` / `build/kit.css` — camera, touch/arrow cursor, marks, tooltips, device transitions (shared with the tutorials; `free: true` on `cam` lets the device sit off-center)
- `build/music.json` — one track (160 BPM, 1.5s bars) split in two segments; `drop: { at, track }` pins a drop in the file to a scene start. Every scene end snaps to half-bars; `snap: "bar"` makes a scene start on a downbeat. Ducked under each VO line
- Captions come from the VO word timestamps (`index.html` `#caps`); `hot: [words]` paints a word lime, `capsOff: [[from, to]]` hides captions where the scene already spells the line
- `assets/stock/` — Mixkit clips (free license) listed in `shots.json` (crop centre, best window); mount with `vid(key, { id, at, dur })` from `build/parts/stock.mjs`. Search more with `npm run stock -- video "<tag>"` from the repo root
- `SCRIPT.md` + `.media/audio/voice/lines.json` — narration text; regenerate a line with `heygen voice speech create --voice-id 16cae89929d94c25bc28b5af6f04822a --locale pt-BR --speed 1.05`
- `.media/audio/sfx/q.txt` — SFX names and the HeyGen catalog queries they came from

```bash
node ../../kit/preview.mjs s05-beneficios 1,3,5,7 3   # contact sheet of one scene
```

## Known

- Marks never move the camera in the vertical cut (`cam: true` opts back in); keep devices framed with explicit `S.cam` calls (`zoom` is absolute UI-px → screen-px).
- Layout check reports clipped text in the home benefit carousel and overlaps from hidden stacked RN screens; both are capture artifacts (same as the tutorials).

## Brand pass (2026-10-01)

- No narration or captions (`NARRATION = false` in `build/build.mjs`; VO files still time the scenes).
- Brand-moment cuts use the signature "+" transition (`seam: { sig: true }`); other cuts slide or push without any opacity dip.
- Headlines in Space Grotesk; lime only for small accents.
- `node build/audit-marks.mjs` / `python3 ../../kit/flicker.py` as in the plantão tutorial.
