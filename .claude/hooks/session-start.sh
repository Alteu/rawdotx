#!/bin/bash
# Prepares Claude Code cloud sessions: installs pinned dev tools and points
# Playwright at the pre-installed Chromium. No-op on local machines.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"
npm ci --no-audit --no-fund

# Node's built-in fetch (used by the Shopify Dev MCP) ignores HTTPS_PROXY unless told otherwise.
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo "export NODE_USE_ENV_PROXY=1" >> "$CLAUDE_ENV_FILE"
fi

chromium=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome 2>/dev/null | sort -V | tail -n 1 || true)
if [ -n "$chromium" ] && [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo "export PLAYWRIGHT_CHROMIUM_EXECUTABLE=$chromium" >> "$CLAUDE_ENV_FILE"
fi
