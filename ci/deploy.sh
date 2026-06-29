#!/usr/bin/env bash
set -euo pipefail

echo "Deploying on tw-calc.net..."

VERSION="$(echo "$REF" | cut -d '/' -f3)"

response_file="$(mktemp)"
trap 'rm -f "$response_file"' EXIT

# --fail-with-body makes curl exit non-zero on HTTP >= 400 while still capturing the
# body, so a rejected publish can't masquerade as a successful (green) deploy.
http_code="$(
  curl \
    --silent --show-error \
    --fail-with-body \
    --output "$response_file" \
    --write-out '%{http_code}' \
    --form "apiKey=$TW_CALC_API_KEY" \
    --form "version=$VERSION" \
    --form "updateInfo=See <a href='https://github.com/The-West-Scripts/TW-Calc-Script/releases'>releases</a>." \
    --form 'userscript=@./dist/TW_Calc.user.js' \
    https://tw-calc.net/service/userscript-publish
)" || {
  echo "::error::Publish request failed (HTTP ${http_code:-?})."
  cat "$response_file"
  exit 1
}

# The host (WEDOS Global Protection) can answer an automated request with an HTTP 200
# anti-bot challenge page instead of running the publish — which previously looked like
# a successful deploy. Treat a challenge/HTML response as a failure.
if grep -qiE 'wedos|altcha|security verification|<!doctype html|<html' "$response_file"; then
  echo "::error::Publish was intercepted by an anti-bot/challenge page instead of reaching the publish endpoint (HTTP ${http_code}). The script was NOT published."
  echo "---- response (first 40 lines) ----"
  head -n 40 "$response_file"
  exit 1
fi

echo "Publish accepted (HTTP ${http_code}). Response:"
cat "$response_file"
