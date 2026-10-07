#!/bin/sh
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
APP="$(cd "$HERE/../../../../vivamaisa-app" && pwd)"
OUT="$(cd "$HERE/../../.." && pwd)/.cache/app-web"
rm -rf "$OUT"
mkdir -p "$OUT"
cd "$APP"
git ls-files -z --cached --others --exclude-standard | tar --null -T - -cf - | tar -xf - -C "$OUT"
cp -cR node_modules "$OUT/node_modules"
cd "$OUT"
mkdir -p webcap public
cp "$HERE/stub.js" "$HERE/entry.js" webcap/
cp "$HERE/metro.config.js" metro.config.js
cp "$HERE/Text.web.tsx" src/components/ui/Text.web.tsx
cp "$HERE/Screen.web.tsx" src/components/ui/Screen.web.tsx
cp node_modules/canvaskit-wasm/bin/full/canvaskit.wasm public/
sed -i '' 's#\["babel-preset-expo", { jsxImportSource: "nativewind" }\]#["babel-preset-expo", { jsxImportSource: "nativewind", unstable_transformImportMeta: true }]#' babel.config.js
node -e 'const f="package.json";const p=require("./"+f);p.main="webcap/entry.js";require("fs").writeFileSync(f,JSON.stringify(p,null,2))'
node -e '
const fs=require("fs");const f="node_modules/react-native-safe-area-context/lib/module/NativeSafeAreaProvider.web.js";let s=fs.readFileSync(f,"utf8");
if(!s.includes("__vmInsets"))s=s.replace("onInsetsChange({\n        nativeEvent: {\n          insets,","if (window.__vmInsets) Object.assign(insets, window.__vmInsets);\n      onInsetsChange({\n        nativeEvent: {\n          insets,");fs.writeFileSync(f,s)'
npx tailwindcss -i global.css -c tailwind.config.js -o public/tw.css
echo "app-web ready at $OUT"
