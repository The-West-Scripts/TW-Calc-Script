---
name: deploy
description: Manually publish the built userscript to tw-calc.net from the local machine (the publish endpoint blocks CI/datacenter IPs via WEDOS anti-bot protection). Use when a release's Deploy job failed on the captcha, or to push the userscript live without CI.
---

# /deploy — publish the userscript to tw-calc.net locally

CI **Deploy** (`.github/workflows/deploy.yml` → `ci/deploy.sh`) POSTs the userscript to `https://tw-calc.net/service/userscript-publish`. WEDOS Global Protection serves an anti-bot challenge to datacenter IPs (GitHub Actions runs on Azure), so the CI publish gets blocked. A residential/local IP reaches the endpoint, so the same `ci/deploy.sh` can be run locally to push the update to users.

> Workaround, not the happy path. Once DNS points directly at webhosting (or a WGP bypass is configured for `/service/userscript-publish`), publishing the GitHub release deploys via CI and this skill isn't needed — re-running the failed Deploy run (`gh run rerun <id>`) is the CI equivalent. See [[new-version]].

`$ARGUMENTS` — the version to deploy (`2.11.5` or `v2.11.5`). If empty, use the `version` from `package.json`.

## Steps

### 1. Decide the version + make the build match it

The userscript's `@version` comes from `package.json` at **build time**, while `ci/deploy.sh` only labels the publish from `REF`. A stale `dist/` (e.g. built before a version bump) publishes the wrong script under the right label — so always rebuild and verify.

-   Target = `$ARGUMENTS` (strip a leading `v`) or `node -p "require('./package.json').version"`.
-   Ensure `package.json` is at that version (it is on the matching `vX.Y.Z` tag, and on `main` right after the release commit), then build and check:

```shell
npm run build
grep -m1 '@version' dist/TW_Calc.user.js     # MUST equal the target version
```

If `@version` ≠ target you're on the wrong checkout — `git checkout vX.Y.Z` (or fix `package.json`), rebuild.

### 2. Publish — the user runs this (it needs the secret)

`ci/deploy.sh` reads `./dist/TW_Calc.user.js`, derives the version from `REF`, and POSTs it with the API key:

```shell
REF=refs/tags/vX.Y.Z TW_CALC_API_KEY='<key>' ./ci/deploy.sh
```

-   `REF` MUST be `refs/tags/vX.Y.Z` — the script does `cut -d '/' -f3`, so anything else yields the wrong/empty version field.
-   `TW_CALC_API_KEY` is the same value as the GitHub `TW_CALC_API_KEY` secret. Claude does **not** have it: prepare everything up to this command, then have the user run it **in their own terminal**. Never ask for the key in chat, echo it, or commit it (avoid the `!`-prefix — it lands in the transcript).
-   The hardened `ci/deploy.sh` (`--fail-with-body` + challenge detection) prints `Publish accepted (HTTP …)` on success, or fails loudly with an `::error::` line on an HTTP error or an intercepted challenge page.

### 3. Verify it's live

```shell
curl -s https://tw-calc.net/script/TW-Calc.user.js | grep -m1 '@version'   # expect the target version
```

The rollout reaches users via the in-game update dialog.

## Notes

-   Why local works: the publish endpoint is fronted by WEDOS Global Protection, which challenges datacenter/cloud IPs (every GitHub-hosted runner) with an ALTCHA proof-of-work page; a normal residential IP isn't challenged. Sanity-check your IP reaches the app (not a challenge) before publishing:

    ```shell
    curl -s -o /dev/null -w '%{http_code}\n' --form apiKey=x --form version=v0 \
      https://tw-calc.net/service/userscript-publish   # an app error (e.g. 500) = OK; an HTML/WEDOS challenge = you're blocked too
    ```

-   `dist/` is git-ignored, so building never touches the working tree.
