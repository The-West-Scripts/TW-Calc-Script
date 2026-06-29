---
name: new-version
description: Cut and ship a new TW-Calc release — pick the semver bump, run the gates, version + tag, push, and shepherd the draft GitHub release through publish/deploy. Use when the user wants to release, ship, cut a version, or bump the version.
---

# /new-version — release a new version

Releases follow the process documented in `CONTRIBUTING.md` ("Releasing"). The pipeline is:

1. `npm version` bumps `package.json`, commits `vX.Y.Z`, and tags `vX.Y.Z`.
2. Pushing the tag triggers **CI** (`.github/workflows/ci.yml`). On `refs/tags/v*` the `release` job builds `dist/TW_Calc.user.js` and creates a **draft** GitHub release with the userscript attached.
3. A human edits the draft with release notes and **publishes** it.
4. Publishing triggers **Deploy** (`.github/workflows/deploy.yml`), which pushes the update to users (in-game dialog).

`$ARGUMENTS` may be an explicit version (`2.12.0`) or a bump type (`patch` | `minor` | `major`). If empty, propose one from the commits since the last tag.

## Steps

### 1. Preflight (stop if any fails)

-   Be on the default branch and up to date: `git checkout main && git fetch origin && git status -sb`. The working tree MUST be clean and not behind `origin/main` (fast-forward first if it is).
-   Confirm CI is green on `main` before releasing — don't tag a broken main.

### 2. Decide the version

-   Current version: read `version` from `package.json`. Latest tag: `git tag --sort=-v:refname | head -1`.
-   List changes since the last tag: `git log <lastTag>..HEAD --oneline`.
-   Apply semver per `CONTRIBUTING.md`:
    -   any `feat:` → **minor**
    -   only `fix:` / `refactor:` / `perf:` / `chore:` / `docs:` / `style:` / `test:` / `ci:` → **patch**
    -   a breaking change (`!` or `BREAKING CHANGE`) → **major**
-   If `$ARGUMENTS` gave an explicit version or bump type, use it. Otherwise state the proposed version + the reason and **confirm with the user before bumping** (it creates a tag).

### 3. Local gates (fail fast before tagging — CI runs these too)

```shell
npm run lint && npm run tsc && npm test && npm run build
```

All must pass. `npm run build` proves the production bundle compiles (CI's `build`/`release` jobs depend on it).

### 4. Version + tag

Use the documented command (note the `v%s` message format that matches the tag history):

```shell
npm version -m "v%s" <version>      # e.g. npm version -m "v%s" 2.11.4
```

This makes the `vX.Y.Z` commit and tag on `main`. (You can also pass `patch`/`minor`/`major` instead of an explicit version.)

### 5. Push commit + tag

```shell
git push --follow-tags                 # pushes the vX.Y.Z commit and its tag
```

(Equivalent fallback: `git push && git push --tags`.)

### 6. Wait for the draft release

-   The tag push starts CI. Watch it: `gh run watch` (or `gh run list --branch <tag>`). The `release` job only runs on `refs/tags/v*` and needs `build` to pass.
-   When CI is green, a **draft** release `Release refs/tags/vX.Y.Z` appears with `TW_Calc.user.js` attached: `gh release view vX.Y.Z`.
-   If CI fails, diagnose and fix on `main`; you may need to delete the tag (`git push origin :refs/tags/vX.Y.Z` and `git tag -d vX.Y.Z`), fix, and re-tag.

### 7. Release notes + publish — CONFIRM FIRST

-   Draft notes from `git log <lastTag>..<newTag> --oneline`, grouped by type (Features / Fixes / Other). Offer to set them: `gh release edit vX.Y.Z --notes "…" --title "vX.Y.Z"`.
-   **Publishing deploys to all users.** Do NOT publish autonomously — present the notes and get explicit user approval. On approval: `gh release edit vX.Y.Z --draft=false`.

### 8. Deploy

-   Publishing triggers `.github/workflows/deploy.yml`. Confirm it succeeds: `gh run list --workflow=Deploy`. Report the result; the rollout reaches users via the in-game update dialog.

## Guardrails

-   Never tag/push/publish without the working tree clean and on an up-to-date `main`.
-   Treat tag push and especially release publish as outward-facing — confirm the version (step 2) and the publish (step 7) with the user before doing them.
