/**
 * DEVELOPMENT ONLY — live content refresh.
 *
 * Subscribes to published Sanity mutations and pushes freshly mapped content
 * into src/data/contentStore.js, so editing and publishing in the local Studio
 * updates localhost without a rebuild.
 *
 * This module is loaded through a dynamic import behind an `import.meta.env.DEV`
 * guard, so Rollup drops it — and @sanity/client with it — from the production
 * bundle. Production continues to read the build-time content.json.
 *
 * Read-only by construction: the client is created with NO token. The dataset
 * is public, so published content is readable anonymously, and the write token
 * is never exposed to the browser.
 */
import { CONTENT_QUERY, buildContentFile } from "./contentShape";
import { setContent } from "./contentStore";

// Injected by vite.config.js at dev time only. These are public identifiers.
const projectId = __SANITY_PROJECT_ID__;
const dataset = __SANITY_DATASET__;

const REFETCH_DEBOUNCE_MS = 300;

const log = (...args) => console.info("[sanity-live]", ...args);
const warn = (...args) => console.warn("[sanity-live]", ...args);

/**
 * Re-runs the same projection the build uses and pushes the result.
 *
 * The full query is re-fetched rather than patching in the mutation payload
 * from the listener: listen events include drafts and partial documents,
 * whereas a fetch under `perspective: "published"` is guaranteed to match
 * exactly what a production build would write.
 */
const refetch = async (client) => {
  const data = await client.fetch(CONTENT_QUERY);

  // The build script throws on these. Here we only warn — a half-finished
  // edit in the Studio should not blank the page you are working on.
  if (!data?.projects?.length) {
    warn("Query returned no published projects; keeping previous content.");
    return;
  }
  if (!data.siteSettings) {
    warn('No "siteSettings" document; keeping previous content.');
    return;
  }

  const missingImages = data.projects.filter((p) => !p.image);
  if (missingImages.length) {
    warn(
      `${missingImages.length} project(s) have no main image — a production ` +
        "build would fail on this.",
    );
  }

  setContent(
    buildContentFile({
      projects: data.projects,
      socials: data.socials,
      siteSettings: data.siteSettings,
    }),
  );

  const visible = data.projects.filter((p) => p.isVisible !== false).length;
  log(
    `updated: ${data.projects.length} projects (${visible} visible), ` +
      `${data.socials?.length ?? 0} socials`,
  );
};

let started = false;

export const startLiveContent = async () => {
  if (started) return;
  started = true;

  if (!projectId) {
    warn("SANITY_PROJECT_ID is not set; live refresh disabled.");
    return;
  }

  let createClient;
  try {
    ({ createClient } = await import("@sanity/client"));
  } catch (error) {
    warn("@sanity/client unavailable; live refresh disabled.", error.message);
    return;
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-02-01",
    // Published content only — drafts must never reach the page.
    perspective: "published",
    // The CDN lags a publish by up to ~60s, which would defeat the point.
    useCdn: false,
    // No token: read-only, anonymous access to a public dataset.
    token: undefined,
    withCredentials: false,
  });

  // Prove connectivity up front so CORS or config problems surface as a clear
  // console message rather than silence. On failure the app simply keeps the
  // bundled content.json.
  try {
    await refetch(client);
  } catch (error) {
    warn(
      "Initial fetch failed — falling back to the bundled content.json. " +
        "If this is a CORS error, allow http://localhost:3000 in Sanity " +
        "(Manage → API → CORS origins).",
      error.message,
    );
    return;
  }

  let timer;
  const scheduleRefetch = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      refetch(client).catch((error) => warn("Refetch failed.", error.message));
    }, REFETCH_DEBOUNCE_MS);
  };

  const subscription = client
    .listen(
      CONTENT_QUERY,
      {},
      {
        // Fire only once the mutation is actually queryable, so the refetch
        // cannot race ahead of the change it was triggered by.
        visibility: "query",
        includeResult: false,
      },
    )
    .subscribe({
      next: scheduleRefetch,
      error: (error) =>
        warn("Live subscription error; live refresh stopped.", error.message),
    });

  log(`listening to ${projectId}/${dataset} for published changes`);

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      clearTimeout(timer);
      subscription.unsubscribe();
      started = false;
    });
  }
};
