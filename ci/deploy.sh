#!/usr/bin/env bash

echo "Deploying on tw-calc.net..."

VERSION="$(echo "$REF" | cut -d '/' -f3)"

curl \
  --form "apiKey=$TW_CALC_API_KEY" \
  --form "version=$VERSION" \
  --form "updateInfo=Update $VERSION" \
  --form 'userscript=@./dist/TW_Calc.user.js' \
  https://tw-calc.net/service/userscript-publish
