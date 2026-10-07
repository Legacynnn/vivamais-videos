#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
PAGE="$DIR/index.html"
PROFILE="$HOME/Library/Application Support/VivaMaisTV"

xattr -dr com.apple.quarantine "$DIR" 2>/dev/null
pkill -f "user-data-dir=$PROFILE" 2>/dev/null
sleep 1

if [ -d "/Applications/Google Chrome.app" ] || [ -d "$HOME/Applications/Google Chrome.app" ]; then
  open -na "Google Chrome" --args \
    --kiosk \
    --user-data-dir="$PROFILE" \
    --autoplay-policy=no-user-gesture-required \
    --no-first-run \
    --no-default-browser-check \
    --disable-session-crashed-bubble \
    --disable-features=Translate \
    --allow-file-access-from-files \
    "$PAGE"
  sleep 3
  PID="$(pgrep -o -f "user-data-dir=$PROFILE")"
else
  open -a Safari "$PAGE"
  sleep 3
  osascript -e 'tell application "Safari" to activate' \
    -e 'tell application "System Events" to keystroke "f" using {command down, control down}' 2>/dev/null
  PID="$(pgrep -x Safari)"
fi

if [ -n "$PID" ]; then
  nohup caffeinate -dis -w "$PID" >/dev/null 2>&1 &
fi
