import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
export const rootDir = path.resolve(path.dirname(__filename), "..");

/**
 * Loads env files, nearest-wins.
 *
 * `.env` is tracked in git in this repo, so secrets belong in `.env.local`,
 * which is not. `.env.local` is loaded first and values already present in the
 * environment are never overwritten, so real CI/Vercel variables always win.
 */
const loadEnvFiles = () => {
  for (const file of [".env.local", ".env"]) {
    const filePath = path.join(rootDir, file);
    if (!existsSync(filePath)) continue;
    try {
      process.loadEnvFile(filePath);
    } catch {
      // A malformed or unreadable env file should not break the build;
      // the missing-variable errors below are clearer.
    }
  }
};

loadEnvFiles();

/**
 * Reads Sanity connection settings from the environment.
 *
 * The dataset is public, so reads need no token. Writes (the migration) do.
 */
export const readSanityEnv = ({ requireToken = false } = {}) => {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId) {
    throw new Error(
      "SANITY_PROJECT_ID is not set. Add it to .env (see .env.example).",
    );
  }

  if (requireToken && !token) {
    throw new Error(
      "SANITY_API_WRITE_TOKEN is not set. Create an Editor token at " +
        "sanity.io/manage → API → Tokens, then add it to .env.",
    );
  }

  return { projectId, dataset, token };
};

/** Collection membership, currently matched by project title in the app. */
export const COLLECTION_TITLES = {
  "teachers-collection": [
    "Mr Mohamed",
    "Mr Abdullah",
    "Mr Ahmed",
    "Alshaatir Academy",
    "Hadafik Altaelimia",
  ],
  "mps-collection": [
    "mohammed-al-huwaila",
    "thamer-al-suwait",
    "saoud-al-asfour",
    "abdullah-mutlaq-awad-al-mutairi",
  ],
  "e3mel-landing-collection": [
    "Saudi National Day",
    "EBU Certificate",
    "shahadat alhadaf",
  ],
};

/** Reverse lookup: lowercased title -> collection id. */
export const collectionIdForTitle = (title) => {
  const needle = (title || "").trim().toLowerCase();
  for (const [id, titles] of Object.entries(COLLECTION_TITLES)) {
    if (titles.some((t) => t.trim().toLowerCase() === needle)) return id;
  }
  return undefined;
};

/** Normalises an image reference from the legacy JSON to a repo-relative path. */
export const normaliseImagePath = (imagePath) =>
  (imagePath || "").trim().replace(/^\/+/, "");
