import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { requireCheckout } from "../tools/monorepo.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const mono = requireCheckout();
const appSrc = join(mono, "apps/mobile/src");

const shim = (name) => join(here, "shims", name);
const packages = {
  "react-native": shim("react-native.jsx"),
  "react-native-reanimated": shim("reanimated.jsx"),
  "react-native-svg": shim("svg.jsx"),
  "react-native-safe-area-context": shim("pkg-safeArea.cjs"),
  "expo-linear-gradient": shim("pkg-linearGradient.cjs"),
  "expo-image": shim("pkg-expoImage.cjs"),
  "expo-router": shim("pkg-expoRouter.cjs"),
  "@tanstack/react-query": shim("pkg-query.cjs"),
  nativewind: shim("pkg-nativewind.cjs"),
  "react-native-uitextview": shim("pkg-uitextview.cjs"),
  "react-native-keyboard-controller": shim("pkg-keyboard.cjs"),
  "react-native-gesture-handler": shim("pkg-gesture.cjs"),
  "@legendapp/list": shim("pkg-legendList.cjs"),
  "@legendapp/list/reanimated": shim("pkg-legendList.cjs"),
  "@gorhom/bottom-sheet": shim("bottom-sheet.jsx"),
  "react-native-bottom-sheet-stack": shim("bottom-sheet.jsx"),
  "react-native-markdown-display": shim("markdown.jsx"),
  "react-hook-form": shim("hook-form.cjs"),
  "lucide-react-native": require.resolve("lucide-react"),
  "@vivamais/theme/tokens.json": join(mono, "packages/theme/tokens.json"),
  "@vivamais/theme/palette": join(mono, "packages/theme/palette.cjs"),
  "@vivamais/tours": join(mono, "packages/tours/src/index.ts"),
  "@vivamais/ai-client": join(mono, "packages/ai-client/src/index.ts"),
};
const real = /^(react|react-dom|scheduler|react-hook-form|@hookform\/resolvers|clsx|tailwind-merge|lucide-react|date-fns|zod|@hugeicons\/core-free-icons)(\/|$)/;
export const extensions = [".ios.tsx", ".ios.ts", ".native.tsx", ".native.ts", ".tsx", ".ts", ".jsx", ".js", ".cjs", ".json"];
export const media = Object.fromEntries([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".mp4", ".mp3", ".wav", ".riv", ".lottie", ".ttf"].map((ext) => [ext, "file"]));

function mockFor(path) {
  for (const ext of [".tsx", ".ts"]) {
    const file = join(here, "mocks", `${path}${ext}`);
    if (existsSync(file)) return file;
  }
  return null;
}

export const resolver = {
  name: "screens",
  setup(api) {
    api.onResolve({ filter: /^~\// }, (args) => {
      const path = args.path.slice(2);
      const mock = mockFor(path);
      if (mock && !args.importer.startsWith(join(here, "mocks"))) return { path: mock };
      return api.resolve(`./${path}`, { resolveDir: appSrc, kind: args.kind });
    });
    api.onResolve({ filter: /^@screens\// }, (args) => api.resolve(`./${args.path.slice(9)}`, { resolveDir: here, kind: args.kind }));
    api.onResolve({ filter: /^@vivamais\/sdk\// }, (args) => {
      const [scope, ...rest] = args.path.slice(14).split("/");
      const generated = join(mono, "packages/sdk/src/generated", scope);
      if (scope === "mutator") return { path: shim("pkg-generic.cjs") };
      if (rest[0] === "model") return { path: join(generated, "model/index.ts") };
      if (rest[0] === "zod") return { path: join(generated, "zod", rest[1], `${rest[1]}.zod.ts`) };
      return { path: join(generated, "endpoints", rest[0], `${rest[0]}.ts`) };
    });
    api.onResolve({ filter: /^[^./]/ }, (args) => {
      if (args.kind === "entry-point") return null;
      if (args.path in packages && args.importer !== packages[args.path]) return { path: packages[args.path] };
      if (real.test(args.path)) return null;
      return { path: shim("pkg-generic.cjs") };
    });
  },
};

export const define = { __DEV__: "false", "process.env.EXPO_OS": '"ios"', "process.env.NODE_ENV": '"production"', "process.env": "{}", global: "globalThis" };

export function patchInterop(code) {
  if (!code.includes("var __toESM = ")) throw new Error("esbuild helper __toESM not found");
  return code.replace("var __toESM = ", "var __toESM = (mod, node, target) => (mod && mod.__vmsShim ? mod : __toESMCopy(mod, node, target));\nvar __toESMCopy = ");
}
