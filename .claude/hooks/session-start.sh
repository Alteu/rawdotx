#!/bin/bash
# Prepares Claude Code cloud sessions: installs pinned dev tools and points
# Playwright at the pre-installed Chromium. No-op on local machines.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"
npm ci --no-audit --no-fund

# Store connection. Not secrets: the real Theme Access password is a network secret on the
# cloud environment, which the agent proxy injects into requests to
# theme-kit-access.shopifyapps.com in place of this placeholder.
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo "export SHOPIFY_FLAG_STORE=wide-clownfish-3r7al4-r4j2fm0h.myshopify.com" >> "$CLAUDE_ENV_FILE"
  echo "export SHOPIFY_CLI_THEME_TOKEN=shptka_placeholder" >> "$CLAUDE_ENV_FILE"
fi

# Node's built-in fetch (used by the Shopify Dev MCP) ignores HTTPS_PROXY unless told otherwise.
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo "export NODE_USE_ENV_PROXY=1" >> "$CLAUDE_ENV_FILE"
fi

chromium=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome 2>/dev/null | sort -V | tail -n 1 || true)
if [ -n "$chromium" ] && [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo "export PLAYWRIGHT_CHROMIUM_EXECUTABLE=$chromium" >> "$CLAUDE_ENV_FILE"
fi
