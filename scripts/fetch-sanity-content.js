/**
 * Pulls published content from Sanity and writes src/data/content.json.
 *
 * Runs in `prebuild`, before the sitemap. The generated file uses the same
 * field names the components already read, so the app layer stays unchanged;
 * localized fields stay as { en, ar } and are flattened per language by
 * src/data/mergeProjects.js.
 *
 * Usage:
 *   node scripts/fetch-sanity-content.js
 *   node scripts/fetch-sanity-content.js --dataset=staging
 */
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";
import { rootDir, readSanityEnv } from "./sanity-shared.js";
import {
  CONTENT_QUERY,
  buildContentFile,
  toLegacyProject,
} from "../src/data/contentShape.js";

const datasetOverride = process.argv
  .slice(2)
  .find((a) => a.startsWith("--dataset="))
  ?.split("=")[1];

/**
 * Rewrites the prerender route list from live content. It was 56 hand-kept
 * routes, which silently drifted whenever a project was added or renamed.
 */
const updateReactSnapRoutes = async (projects) => {
  const pkgPath = path.join(rootDir, "package.json");
  const raw = await readFile(pkgPath, "utf8");
  const pkg = JSON.parse(raw);

  const collectionIds = [
    ...new Set(projects.map((p) => p.collectionId).filter(Boolean)),
  ].sort();

  /**
   * Hidden projects are prerendered too. They stay out of the listings and the
   * sitemap, but they remain reachable by direct link, and there is no SPA
   * rewrite configured for this deployment — so without a static file those
   * URLs would 404 rather than falling back to the app shell.
   */
  const routes = [
    "/",
    "/projects",
    ...collectionIds.map((id) => `/collection/${id}`),
    ...projects.map((p) => `/project/${p.slug}`).sort(),
  ];

  const previous = pkg.reactSnap?.include || [];
  pkg.reactSnap = { ...pkg.reactSnap, include: routes };

  // Preserve the file's original indentation and trailing newline.
  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");

  const added = routes.filter((r) => !previous.includes(r));
  const removed = previous.filter((r) => !routes.includes(r));
  return { count: routes.length, added, removed };
};

const run = async () => {
  const { projectId, dataset } = readSanityEnv();
  const activeDataset = datasetOverride || dataset;

  const client = createClient({
    projectId,
    dataset: activeDataset,
    apiVersion: "2026-02-01",
    // Published content only — drafts must never reach the build.
    perspective: "published",
    // The CDN can lag behind a publish by up to ~60s; the whole point of a
    // rebuild is to pick up the latest edit, so bypass it and hit the API.
    useCdn: false,
  });

  console.log(`Fetching from projectId=${projectId} dataset=${activeDataset}`);

  const data = await client.fetch(CONTENT_QUERY);

  // A misconfigured project id or dataset would otherwise publish an empty site.
  if (!data.projects?.length) {
    throw new Error(
      `No published projects returned from dataset "${activeDataset}". ` +
        "Refusing to write an empty content file.",
    );
  }
  if (!data.siteSettings) {
    throw new Error('No "siteSettings" document found. Run the migration first.');
  }

  const projects = data.projects.map(toLegacyProject);
  const missingImages = projects.filter((p) => !p.image);
  if (missingImages.length) {
    throw new Error(
      `${missingImages.length} project(s) have no main image: ` +
        missingImages.map((p) => p.slug).join(", "),
    );
  }

  const content = buildContentFile({
    projects: data.projects,
    socials: data.socials,
    siteSettings: data.siteSettings,
  });

  const outputPath = path.join(rootDir, "src", "data", "content.json");
  await writeFile(outputPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");

  const visible = projects.filter((p) => !p.hidden).length;
  console.log(
    `Wrote ${path.relative(rootDir, outputPath)}: ` +
      `${projects.length} projects (${visible} visible), ` +
      `${content.socials.length} socials, site settings ✓`,
  );

  const routes = await updateReactSnapRoutes(projects);
  console.log(`Prerender routes: ${routes.count}`);
  if (routes.added.length) console.log(`  added:   ${routes.added.join(", ")}`);
  if (routes.removed.length) console.log(`  removed: ${routes.removed.join(", ")}`);
};

run().catch((error) => {
  console.error("\nFailed to fetch Sanity content:", error.message);
  process.exitCode = 1;
});
