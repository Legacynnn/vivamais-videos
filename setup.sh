#!/bin/bash
# Sets up a fresh Mac after `glab auth login` + `glab repo clone`; safe to re-run.
set -euo pipefail

cd "$(dirname "$0")"
say() { printf "\n\033[1;35m▸ %s\033[0m\n" "$1"; }

[ "$(uname)" = "Darwin" ] || { echo "Só para macOS."; exit 1; }
git --version >/dev/null 2>&1 || { echo "Falta o git: rode 'xcode-select --install' e depois este script de novo."; exit 1; }

NODE_MAJOR=$(node -v 2>/dev/null | sed -E 's/^v([0-9]+).*/\1/' || true)
if [ -z "$NODE_MAJOR" ] || [ "$NODE_MAJOR" -lt 24 ]; then
  say "Instalando Node 24"
  PKG=$(curl -fsSL https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt | awk '/\.pkg$/{print $2}')
  curl -fL -o "/tmp/$PKG" "https://nodejs.org/dist/latest-v24.x/$PKG"
  sudo installer -pkg "/tmp/$PKG" -target /
  rm "/tmp/$PKG"
  export PATH="/usr/local/bin:$PATH"
else
  say "Node $(node -v) ok"
fi

if ! command -v pnpm >/dev/null 2>&1; then
  say "Ativando pnpm (corepack)"
  sudo corepack enable pnpm
fi
say "pnpm $(pnpm -v)"

if [ ! -d "/Applications/Google Chrome.app" ]; then
  say "Instalando Google Chrome (exports e renders)"
  curl -fL -o /tmp/chrome.dmg https://dl.google.com/chrome/mac/universal/stable/GGRO/googlechrome.dmg
  hdiutil attach /tmp/chrome.dmg -nobrowse -quiet -mountpoint /tmp/chrome-mnt
  cp -R "/tmp/chrome-mnt/Google Chrome.app" /Applications/
  hdiutil detach /tmp/chrome-mnt -quiet
  rm /tmp/chrome.dmg
else
  say "Google Chrome ok"
fi

say "Instalando dependências (raiz + studio + remotion)"
pnpm install

say "Baixando o monorepo (versão do monorepo.lock) e gerando cores e telas do app"
if ! pnpm run setup:monorepo; then
  echo
  if [ -d .monorepo/.git ]; then
    echo "Alguma tela do app não gerou (veja acima). O Studio abre mesmo assim."
  else
    echo "Não deu pra baixar o monorepo. Confira o acesso a gitlab.com/vivamais-ai/vivamais-monorepo"
    echo "(glab auth login, respondendo Yes para autenticar o git) e rode: pnpm run setup:monorepo"
    exit 1
  fi
fi

[ -f .env ] || echo "# AIMLAPI_API_KEY=  (só para pnpm run imagine)" > .env

say "Pronto"
echo "Antes de mexer em vídeos ou decks: pnpm run sync"
echo "Opcional: pip3 install numpy pillow scipy  (tela na foto de mão)"
echo

if [ "${1:-}" != "--no-start" ]; then
  say "Abrindo o Studio em http://localhost:4610 (Ctrl+C para parar)"
  (sleep 4 && open http://localhost:4610) &
  exec pnpm run studio
fi
