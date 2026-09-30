# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Vite dev server — serves on :3000 (see caveat below)
npm run build            # Full pipeline: prebuild -> vite build -> postbuild
npm run preview          # Serve the production build
npm run content:fetch    # Pull Sanity -> src/data/content.json (also run by prebuild)
npm run content:migrate  # One-time legacy JSON -> Sanity import (see Migration)
npm run studio:dev       # Sanity Studio on :3333
npm run studio:deploy    # Deploy Studio to ali-hatem-portfolio.sanity.studio
```

**There is no test framework, linter, or formatter configured.** Verification means: run `npm run dev`, exercise the page in a browser, and confirm `npm run build` completes with react-snap's snapshot checks passing.

`.claude/launch.json` declares port 5173, but `vite.config.js` sets `server.port: 3000`. The dev server actually listens on **3000** — navigate there, not to the port the launch config reports.

The Studio is a **separate npm package** with its own `node_modules` (`studio/`). It runs React 19 and requires Node >= 22.12, while the app runs React 18. Run `npm install` inside `studio/` separately.

## Content architecture

Content lives in **Sanity CMS** (project `ca2s0qsl`, dataset `production`, public reads). The flow is build-time, not runtime:

```
Sanity  --fetch-sanity-content.js-->  src/data/content.json  -->  mergeProjects.js  -->  components
                                      (generated, committed)
```

- **Never hand-edit `src/data/content.json`** — it is generated and overwritten by every build.
- **`src/data/projects.json` and `projectsAR.json` are dead** — kept only as a pre-migration record. Nothing at runtime reads them. The README's "add a project by editing both JSON files" instructions are obsolete; projects are now added in the Studio.
- `src/data/mergeProjects.js` is the **only** module the app uses to read content. Its four exports (`getProjectsForLanguage`, `getVisibleProjectsForLanguage`, `getSocialsForLanguage`, `getAboutmeForLanguage`) are consumed by every component either directly or via the `GetAllData()` hook in `src/data/projects.jsx`. Keeping that API stable means content-source changes need no component edits.
- `src/data/index.js` re-exports `content.technologies`, which drives the filter pills on `/projects`. It is derived from the data — do not reintroduce a hand-maintained list.

### Localization model

**English is canonical.** Sanity stores one document per project with `title`/`description` as `{en, ar}` objects; `mergeProjects.js` flattens them per language and falls back to English when a translation is missing. Order, visibility and every language-neutral field come from the English side only.

This replaced two independently-edited JSON files that had drifted apart (different project sets, orders and `hidden` flags per language). Do not reintroduce per-language content files.

UI chrome strings are separate, in `src/locale/en.json` and `ar.json` — **both must be updated together**. There are no `/ar` routes; language switches in place at the same URL and `App.jsx` flips `document.documentElement.dir`.

## Build pipeline gotchas

- **`prebuild` rewrites `package.json`.** `fetch-sanity-content.js` regenerates `reactSnap.include` from live content, so `package.json` shows up modified after any build. That is expected, and it is why the route list must never be hand-edited.
- **All 51 projects are prerendered, including hidden ones**, because no SPA rewrite is configured for the deployment — without a static file a direct link to a hidden project would 404. The **sitemap contains only the 27 visible ones**. Keep that split.
- **react-snap is skipped on CI/Vercel** (`scripts/run-react-snap.js` exits early when `VERCEL` or `CI` is set, as Chromium is unavailable). Production therefore ships whatever prerendered HTML is committed in `build/` — which is why `build/` is tracked in git. After changing content or markup, rebuild locally and commit `build/` or the deployed HTML goes stale.
- The build **fails loudly** if Sanity returns zero projects or a project lacks a main image, rather than publishing an empty site.

## Conventions that prevent known bugs

**Two different image-URL helpers, both in `src/helpers/index.js`** — images are absolute `cdn.sanity.io` URLs, so naive string concatenation corrupts them:

- `getImagePath(path)` — for `src` attributes. Passes absolute URLs through untouched.
- `getAbsoluteImageUrl(path, fallback)` — for `og:image` and JSON-LD.

Never build those as `BASE_URL + "/" + project.image` — that produced `alihatem.me/https://cdn.sanity.io/...` across 54 prerendered files.

**Use `getProjectSlug(project)` for project URLs**, not `createSlug(project.title)`. Projects carry a language-neutral `slug` from the CMS; deriving slugs from the title gave the same project a different URL per language, so Arabic visitors could not open English links. `createSlug` survives only as a fallback for previously-shared Arabic URLs.

**CSS keyframes and class names are global.** Component stylesheets are plain CSS imported per component, and the production build concatenates all of them. Name component-specific keyframes distinctively (`heroShimmer`, `skillSheen`, `swiperPulse`) — a duplicated `@keyframes shimmer` once made the hero heading animate at `opacity: 0`. Scope collision-prone classes under a component root.

**Sanity values drive hardcoded maps.** Adding a new `platform` value on `social`, a `feature.icon`, or a mobile `technology` requires a matching entry in the corresponding map (`src/components/SocialMedia/index.jsx`, `FEATURE_ICON_MAP` / `TECH_ICON_MAP` in `src/pages/MobileProjectDetails.jsx`). Social links render even without an icon match; feature icons do not.

## Environment variables

**`.env` is tracked by git, so `.gitignore` does not apply to it.** Secrets belong in `.env.local`, which is ignored.

| Variable | File | Notes |
|---|---|---|
| `SANITY_PROJECT_ID`, `SANITY_DATASET` | `.env` | Public identifiers |
| `SANITY_API_WRITE_TOKEN` | `.env.local` | **Secret.** Migration only, never builds |
| `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET` | `studio/.env` | Ignored by git |

`scripts/sanity-shared.js` loads `.env.local` first, then `.env`, and never overwrites variables already set — so real Vercel/CI values always win.

Deploying the Studio needs a token with the `deployStudio` grant (**Administrator**); an Editor token can write content but cannot deploy.

## Migration script

`npm run content:migrate` reads the legacy JSON and writes to Sanity. It is idempotent (projects matched by slug and patched), but **re-running it overwrites Studio edits with legacy values**. Treat it as a rollback tool, not a routine command. Supports `--dry-run` and `--dataset=<name>`.

## Still hardcoded (not in the CMS)

Only projects, social links and the hero/about singleton are CMS-managed. These remain in code:

- `src/data/cvData.js` — feeds the Experience and Certifications sections plus the generated CV PDF (`src/components/Auth/PreviewCvModal.jsx`). Two full language copies.
- The Skills carousel array in `src/components/Skills/index.jsx`. Note that skills are currently defined in **three** independent places (here, `cvData.skills`, and the derived `content.technologies`).
- Collection names and descriptions, duplicated in `src/pages/CollectionPage.jsx` and `src/components/projects/index.jsx`. Only *membership* is CMS-driven, via the `collectionId` field on `project`.

## Working in the Claude Code browser pane

The Browser pane often runs without compositing (`document.hidden === true`), which **freezes CSS transitions and animations mid-flight**. Measurements can then be stable but wrong — e.g. a carousel's inline transform reading `69px` while the computed value is stuck at `419px`, making a correctly-centred slide look 349px off.

Before concluding a layout bug is real, set `element.style.transition = "none"` and re-measure. Lazy-loaded images also never mount (IntersectionObserver does not fire), so `<img>` counts read as 0. Use `new Image()` with `onload` to verify image URLs — `fetch()` against `cdn.sanity.io` fails CORS from localhost and is not evidence of a broken URL.
