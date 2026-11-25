# Screens

App screens rendered from the real app source, for videos, decks and static ads. Nothing here is redrawn: each screen imports the component from `.monorepo/apps/mobile/src` (the pinned monorepo checkout) and feeds it fixture data.

## How it works

`pnpm run screens` bundles every `mobile/*.screen.tsx` with esbuild, mounts it in headless Chrome at 402×874 and writes to `dist/` (gitignored):

- `assets/screens/html/<id>--<state>.html`: static markup, one file per state.
- `assets/screens/screens.css`: Tailwind compiled with the app's own `tailwind.config.js`, scoped under `.vms`, no transitions.
- `shots/<id>--<state>.png`: 3x stills, ready for static ads.
- `index.html`: gallery of every screen and state.

React Native, Reanimated, Expo and the rest are replaced by `shims/` (DOM equivalents; unknown native packages become inert stubs). Reduced motion is on, so entrance animations render settled.

## Adding a screen

```tsx
import { SignInScreen } from '~/components/auth/SignInScreen';

export const meta = { title: 'Entrar', route: '(auth)/signin' };
export const states = {
  default: {},
  filled: { form: { email: 'ana.souza@email.com', password: 'segredo123' } },
};
export default SignInScreen;
```

A state is a fixture (`fixture.ts`):

- `queries`: `[{ key, data }]`, served to `useQuery` by key prefix. `pnpm run screens <id> --keys` lists every key the screen asks for and whether it was fed. Unfed keys render the empty state; `loading: true` renders loading.
- `form`: react-hook-form default values.
- `params`, `pathname`: expo-router.
- `user`, `role`: auth session.
- `props`: props for the component.
- `press`: labels to tap after mount, in order (matched by `aria-label`, then exact text), for state held in `useState` (selected channel, form step).
- `queue`, `devicesTested`, `anamnese`: read by the plantão mocks in `mocks/stores` and `mocks/hooks/anamnese`.

Shared data lives in `fixtures/`. When a hook cannot be fed through queries, put a replacement at `mocks/<path under ~/>` (see `mocks/contexts/auth-context.tsx`).

## Component sheets

`mobile/kit-*.screen.tsx` lay out the app's `components/ui` primitives (buttons, selection, fields, headers, feedback, identity) with the helpers in `kit/sheet.tsx`. They build like any screen; the Studio's UI mobile page shows them at full height. Add a sheet when a primitive is missing from the kit.

## Using a screen

In a composition or deck, leave a marker; `pnpm run sync` fills it and copies the CSS, fonts and images into `assets/screens/`:

```html
<link rel="stylesheet" href="assets/screens/screens.css">
<div class="scr"><!-- screen:signin filled --><!-- /screen --></div>
```

The parent needs `position: relative` and a 402×874 box. Target elements by `aria-label` or `data-testid` (the app's `accessibilityLabel` and `testID`). Screens carry `data-layout-ignore`: the HyperFrames layout and contrast audits skip product UI, so check overlays on top of a screen in snapshots.

## Staying current

`pnpm run sync:monorepo` moves `.monorepo` to the latest `main`, regenerates brand colours and rebuilds screens. `screens.lock.json` records the hash of every app file each screen bundles; when the app changed under a screen the build says so. Compare the new shot, re-check videos that use the screen, then `pnpm run screens --stamp <id>`.

## Limits

- Tab bar and navigation headers come from layouts, not screens; compose them in the screen file when a video needs them.
- Skia, maps, video and WebView render empty.
- `apps/web` screens are not wired yet.
