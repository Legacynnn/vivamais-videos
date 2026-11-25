const Module = require("node:module");
const path = require("node:path");

const mono = path.join(__dirname, "../.monorepo");
const redirect = {
  "@vivamais/theme/tokens.json": path.join(mono, "packages/theme/tokens.json"),
  "@vivamais/theme/palette": path.join(mono, "packages/theme/palette.cjs"),
  "nativewind/theme": path.join(__dirname, "shims/nativewind-theme.cjs"),
  "nativewind/preset": path.join(__dirname, "shims/nativewind-preset.cjs"),
};
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  return redirect[request] ?? resolve.call(this, request, ...rest);
};

const app = require(path.join(mono, "apps/mobile/tailwind.config.js"));

module.exports = {
  ...app,
  content: [path.join(mono, "apps/mobile/src/**/*.{ts,tsx}"), path.join(__dirname, "**/*.{ts,tsx,jsx}")],
  important: ".vms",
  theme: { ...app.theme, extend: { ...app.theme.extend, fontFamily: { ...app.theme.extend.fontFamily, mono: ["Menlo", "monospace"] } } },
  corePlugins: { preflight: false, transitionProperty: false, transitionDuration: false, transitionTimingFunction: false, transitionDelay: false, animation: false },
};
