---
name: build
description: Build the TW-Calc userscript and copy it to the clipboard for testing (paste into Tampermonkey). Use when the user wants to build the script, copy the userscript, or test a change in-game.
---

# /build — build the userscript and copy it to the clipboard

Builds `dist/TW_Calc.user.js` and puts it on the clipboard so it can be pasted straight into Tampermonkey for in-game testing (see `CONTRIBUTING.md` → "Building").

`$ARGUMENTS`:

-   empty or `dev` → **dev build** (default): faster, not minified, debug logs enabled — use this for testing.
-   `prod` → production build: minified, slower; use only to sanity-check the shipped artifact.

## Steps

### 1. Build + copy

Dev (default) — this is exactly the repo's `build:dev:copy-script` script:

```shell
npm run build:dev:copy-script
```

Prod (when `$ARGUMENTS` is `prod`):

```shell
npm run build && pbcopy < dist/TW_Calc.user.js
```

`pbcopy` is macOS-only (this repo's convention). On Linux substitute `xclip -selection clipboard` or `wl-copy`; on Windows `clip`.

### 2. Report

Confirm the build succeeded and the script is on the clipboard, and remind to paste it into Tampermonkey and reload the game. Mention the artifact path (`dist/TW_Calc.user.js`) and the build type used. If the build failed, surface the error instead of claiming it was copied.

## Notes

-   For testing prefer the **dev** build — debug logs can also be turned on via `?tw-calc--debug=true` in the URL or `localStorage.setItem("TWCalc_DEBUG", "1")`.
-   `dist/` is git-ignored, so this never affects the working tree.
