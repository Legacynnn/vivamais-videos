import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { define, extensions, media, patchInterop, resolver } from "../../screens/resolver.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const pkg = join(here, "..");
const root = join(pkg, "..");
const gen = join(pkg, "src/gen");
const screensCss = join(root, "screens/dist/assets/screens/screens.css");

mkdirSync(gen, { recursive: true });
const loader = { ...media };
for (const ext of [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]) loader[ext] = "dataurl";

await build({
  entryPoints: [join(pkg, "app/index.tsx")],
  outfile: join(gen, "app.cjs"),
  bundle: true,
  format: "cjs",
  platform: "browser",
  jsx: "automatic",
  tsconfigRaw: {},
  logLevel: "error",
  resolveExtensions: extensions,
  loader,
  external: ["react", "react-dom", "react/jsx-runtime", "scheduler"],
  define,
  plugins: [resolver],
});
writeFileSync(join(gen, "app.cjs"), patchInterop(readFileSync(join(gen, "app.cjs"), "utf8")));
writeFileSync(
  join(gen, "app.d.cts"),
  `import type { ComponentType } from "react";\ntype Any = ComponentType<any>;\nexport const ActiveFilterChips: Any, CategoryChips: Any, Chip: Any, SkeletonBox: Any, DoctorRow: Any, SearchHeader: Any, Text: Any;\nexport const BRAND: any, SURFACE: any, THEMES: any;\nexport const formatBRLLabel: (n: number) => string;\nexport const SpecialtyPickerScreen: Any, pickerStates: any, getSpecialtyImage: (ref: { name?: string; icon?: string }) => any;\nexport const HomeScreen: Any, MyPlanScreen: Any, SearchResultsScreen: Any, DoctorProfileScreen: Any, AnamneseFillScreen: Any, VideoCallScreen: Any;\nexport const homeStates: any, myPlanStates: any, searchStates: any, profileStates: any, anamneseStates: any, callStates: any, searchQueries: any, anaAnamnese: any;\nexport const today: string, tomorrow: string;\nexport const photos: Record<string, string>;\n`
);

cpSync(screensCss, join(gen, "screens.css"));
cpSync(join(root, "brand/fonts"), join(gen, "fonts"), { recursive: true });
cpSync(join(root, "brand/tokens.css"), join(gen, "tokens.css"));
mkdirSync(join(pkg, "public"), { recursive: true });
cpSync(join(root, "brand/logos"), join(pkg, "public/logos"), { recursive: true });
console.log("remotion/src/gen: app bundle, screens.css, tokens.css, fonts");
