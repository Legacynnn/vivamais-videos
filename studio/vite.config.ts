import { cpSync, createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { postsApi } from "./scripts/posts.mjs";
import { referencesApi } from "./scripts/references.mjs";

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));
const monorepo = here("../.monorepo/packages");
const screensAssets = here("../screens/dist/assets/screens");

const MIME: Record<string, string> = {
  ".css": "text/css",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
};

function screenAssets(): Plugin {
  return {
    name: "studio-screen-assets",
    configureServer(server) {
      server.middlewares.use("/assets/screens", (req, res, next) => {
        const file = normalize(join(screensAssets, decodeURIComponent((req.url ?? "/").split("?")[0])));
        if (!file.startsWith(screensAssets) || !existsSync(file) || !statSync(file).isFile()) return next();
        res.setHeader("Content-Type", MIME[extname(file)] ?? "application/octet-stream");
        createReadStream(file).pipe(res);
      });
    },
    writeBundle(options) {
      if (existsSync(screensAssets)) cpSync(screensAssets, join(options.dir ?? here("./dist"), "assets/screens"), { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), screenAssets(), postsApi(), referencesApi()],
  resolve: {
    alias: [
      { find: "@/", replacement: `${here("./src")}/` },
      { find: "@brand/", replacement: `${here("../brand")}/` },
      { find: "@monorepo/", replacement: `${monorepo}/` },
      { find: /^@vivamais\/theme\/tokens\.(cjs|json)$/, replacement: `${monorepo}/theme/tokens.json` },
      { find: "@vivamais/theme/palette", replacement: here("./src/monorepo/palette.ts") },
      { find: "@vivamais/theme/theme.css", replacement: `${monorepo}/theme/theme.css` },
      { find: /^@vivamais\/web-ui\/globals\.css$/, replacement: `${monorepo}/web-ui/src/styles/globals.css` },
      { find: /^@vivamais\/web-ui\/theme$/, replacement: `${monorepo}/web-ui/src/theme/ThemeProvider.tsx` },
      { find: /^@vivamais\/web-ui\/(.*)$/, replacement: `${monorepo}/web-ui/src/$1` },
      { find: "@screens/", replacement: `${here("../screens/dist")}/` },
      { find: "storybook/test", replacement: here("./src/monorepo/storybook-test.ts") },
    ],
    dedupe: ["react", "react-dom"],
  },
  build: {
    rollupOptions: {
      input: { main: here("./index.html"), frame: here("./frame.html"), render: here("./render.html") },
    },
  },
  optimizeDeps: { entries: ["index.html", "frame.html", "render.html"] },
  server: { port: 4610, fs: { allow: [here("..")] } },
});
