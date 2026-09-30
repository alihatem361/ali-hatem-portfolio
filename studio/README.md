# Portfolio Content Studio

The dashboard for editing portfolio content: projects, the hero/about block, and
social links. Everything else (CV, skills carousel, UI strings) still lives in code.

## Current state

**Live.** Project `ca2s0qsl`, dataset `production`. All 51 projects, 9 social
links and the site settings singleton are migrated, with 61 images on the Sanity
CDN. `npm run build` fetches from Sanity automatically via `prebuild`.

Remaining manual steps: deploy the Studio (§A) and wire the publish webhook (§B).

## Configuration

| Variable | Where | Notes |
|---|---|---|
| `SANITY_PROJECT_ID` | `.env` | Public identifier |
| `SANITY_DATASET` | `.env` | `production` |
| `SANITY_API_WRITE_TOKEN` | `.env.local` | **Secret.** Migration only, never builds |
| `SANITY_STUDIO_PROJECT_ID` | `studio/.env` | Public identifier |

> `.env` is **tracked by git** in this repo, so `.gitignore` does not apply to it.
> Secrets belong in `.env.local`, which is ignored. The build scripts load
> `.env.local` first, then `.env`, and never override real environment variables.

Add CORS origins at **Manage → API → CORS origins**: `http://localhost:3333`
(Studio dev) and `http://localhost:3000`.

### A. Deploy the Studio

Set `studioHost` in `sanity.cli.js`, then:

```bash
npm run studio:deploy
```

The Studio lands at `<studioHost>.sanity.studio`.

### B. Publish → redeploy

- Vercel → Project Settings → Git → **Deploy Hooks** → create one, copy the URL
- Sanity → Manage → **API → Webhooks** → create:
  - URL: the Vercel deploy hook
  - Trigger on: create, update, delete
  - Filter: `_type in ["project", "social", "siteSettings"]`

Publishing then rebuilds the site in roughly 1–2 minutes.

Also set `SANITY_PROJECT_ID` and `SANITY_DATASET` in the Vercel project's
environment variables. The build currently reads them from the committed `.env`,
but relying on that is fragile.

## Re-running the import

`npm run content:migrate` is idempotent — projects are matched by slug and
patched rather than duplicated, and each image uploads once. It reads the legacy
`src/data/projects.json` / `projectsAR.json`, which are kept purely as a
pre-migration record. **Re-running it will overwrite Studio edits** with the
legacy values, so treat it as a rollback tool, not a routine command.

## Daily use

```bash
npm run studio:dev        # http://localhost:3333
```

Content model:

| Type | Notes |
|---|---|
| **Project** | Localized title/description; `slug` is the URL and is shared by both languages; `order` controls position; `isVisible` hides without deleting. Mobile-only fields appear when Project type is "Mobile app". |
| **Social link** | `platform` selects the icon; `url` also accepts `mailto:` and bare phone numbers. |
| **Site settings** | Singleton — name, bio paragraphs, rotating hero roles, header/footer images. |

## Gotchas

- **Changing a slug breaks existing links.** Slugs were seeded from the English
  titles so every current URL keeps working.
- **`technology` values drive the filter pills** on the projects page; that list
  is still hardcoded in `src/data/index.js` and needs manual syncing.
- **Collections** are chosen per project via the `collectionId` field, but the
  collection names/descriptions are still hardcoded in
  `src/pages/CollectionPage.jsx` and `src/components/projects/index.jsx`.
- The build **fails loudly** if Sanity returns zero projects, rather than
  publishing an empty site.
