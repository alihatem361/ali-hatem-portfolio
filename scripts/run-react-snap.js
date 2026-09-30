import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
const isCI = process.env.CI === "1" || process.env.CI === "true";

const assertNonEmptyRoot = (filePath) => {
  if (!existsSync(filePath)) {
    throw new Error(
      `Snapshot verification failed: file not found: ${filePath}`,
    );
  }

  const html = readFileSync(filePath, "utf8");
  const match = html.match(/<div id="root"[^>]*>([\s\S]*?)<\/div>/i);

  if (!match) {
    throw new Error(
      `Snapshot verification failed: #root not found in ${filePath}`,
    );
  }

  const rootInnerHtml = match[1].trim();
  if (!rootInnerHtml) {
    throw new Error(
      `Snapshot verification failed: #root is empty in ${filePath}`,
    );
  }

  console.log(
    `Snapshot check passed for ${path.relative(process.cwd(), filePath)} (root length: ${rootInnerHtml.length})`,
  );
};

if (isVercel || isCI) {
  console.log(
    "Skipping react-snap on CI/Vercel (Chromium deps are unavailable).",
  );
  process.exit(0);
}

/**
 * Verify a real project page, chosen from the generated content rather than
 * hardcoded — the previous fixed "novirahealth" slug would have started
 * failing the build the moment that project was renamed or removed in the CMS.
 */
const firstVisibleProjectSlug = () => {
  const contentPath = path.join(process.cwd(), "src", "data", "content.json");
  if (!existsSync(contentPath)) return null;

  try {
    const { projects } = JSON.parse(readFileSync(contentPath, "utf8"));
    return projects?.find((project) => !project.hidden)?.slug || null;
  } catch {
    return null;
  }
};

try {
  execSync("npx react-snap", { stdio: "inherit" });

  const buildDir = path.join(process.cwd(), "build");
  assertNonEmptyRoot(path.join(buildDir, "index.html"));

  const slug = firstVisibleProjectSlug();
  if (slug) {
    assertNonEmptyRoot(path.join(buildDir, "project", slug, "index.html"));
  } else {
    console.warn("Skipping project-page snapshot check: no content found.");
  }
} catch (error) {
  console.error("react-snap failed:", error.message);
  process.exit(1);
}
