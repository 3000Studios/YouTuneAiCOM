#!/usr/bin/env bash
set -euo pipefail

# ai_backend_health.sh
# Starts the AI backend on port 5000 and runs health checks.

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="${PROJECT_ROOT}/ai-auto-backend"

echo "→ Using backend dir: ${BACKEND_DIR}"
cd "$BACKEND_DIR"

# 1) Install deps if needed
if [ ! -d node_modules ]; then
  echo "→ Installing npm dependencies…"
  npm i
fi

# 2) Kill anything on port 5000
if command -v lsof >/dev/null 2>&1; then
  PIDS=$(lsof -t -i:5000 || true)
  if [ -n "$PIDS" ]; then
    echo "→ Killing processes on :5000 ($PIDS)"
    kill -9 $PIDS || true
  fi
fi

# 3) Start backend in background
echo "→ Starting backend…"
nohup node index.js > logs/server.out 2>&1 &
SERVER_PID=$!
echo "→ Backend PID: $SERVER_PID"

# 4) Wait for health to come up
echo -n "→ Waiting for /health"
for i in {1..30}; do
  if curl -fsS http://localhost:5000/health >/dev/null 2>&1; then
    echo " ✓"
    break
  fi
  echo -n "."
  sleep 1
done

# 5) Show health and OpenAI check
echo "→ /health:"
curl -fsS http://localhost:5000/health || true
echo
echo "→ /debug/openai:"
curl -fsS http://localhost:5000/debug/openai || true
echo

echo "→ Logs: ${BACKEND_DIR}/logs/openai-last.json (OpenAI raw), ${BACKEND_DIR}/logs/server.out (server)"
