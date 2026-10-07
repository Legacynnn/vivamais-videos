#!/bin/sh
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$(cd "$HERE/../../../.." && pwd)/.cache/app-web"
pkill -f "expo start --port 8095"
cd "$OUT"
EXPO_PUBLIC_ONESIGNAL_ID= EXPO_PUBLIC_SENTRY_DSN= EXPO_PUBLIC_API_URL=${API:-http://127.0.0.1:8788} CI=1 exec npx expo start --port 8095 --no-dev --minify $CLEAR
