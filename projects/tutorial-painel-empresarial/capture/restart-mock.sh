#!/bin/sh
cd "$(dirname "$0")/.."
PID=$(lsof -tiTCP:8787 -sTCP:LISTEN)
[ -n "$PID" ] && kill $PID
nohup node capture/mock-api.mjs > capture/mock.log 2>&1 &
for i in 1 2 3 4 5 6 7 8 9 10; do curl -s -o /dev/null -m 1 http://127.0.0.1:8787/__log && break; python3 -c "import time; time.sleep(0.5)"; done
echo mock restarted
