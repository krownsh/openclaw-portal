#!/usr/bin/env bash
set -euo pipefail

: "${PORTAL_CONTENT_REPO_URL:?Need PORTAL_CONTENT_REPO_URL}"
CONTENT_DIR="content_repo"

rm -rf "$CONTENT_DIR"
echo "[fetch-content] cloning: $PORTAL_CONTENT_REPO_URL -> $CONTENT_DIR"
git clone --depth=1 "$PORTAL_CONTENT_REPO_URL" "$CONTENT_DIR"

# sanity checks
if [ ! -d "$CONTENT_DIR/content" ]; then
  echo "[fetch-content] ERROR: expected $CONTENT_DIR/content/" >&2
  exit 1
fi

echo "[fetch-content] OK"
ls -la "$CONTENT_DIR" | sed -n '1,80p'
