import bundledContent from "./content.json";

/**
 * Holds the content object the app currently reads.
 *
 * In production this is always the bundled, build-time generated
 * content.json — nothing ever calls setContent, so behaviour is identical
 * to importing the JSON directly.
 *
 * In development src/data/devLiveContent.js swaps in freshly published
 * Sanity content, and the version bump lets React re-read it.
 */

let activeContent = bundledContent;
let version = 0;

const listeners = new Set();

export const getContent = () => activeContent;

/** The version changes whenever the content is replaced. */
export const getVersion = () => version;

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/**
 * Development only. Replacing the content bumps the version, which the app
 * uses to remount and re-run the effects that hold content in state.
 */
export const setContent = (next) => {
  if (!next) return;
  activeContent = next;
  version += 1;
  for (const listener of listeners) listener();
};
