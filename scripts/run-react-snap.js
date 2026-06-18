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

try {
  execSync("npx react-snap", { stdio: "inherit" });

  const buildDir = path.join(process.cwd(), "build");
  assertNonEmptyRoot(path.join(buildDir, "index.html"));
  assertNonEmptyRoot(
    path.join(buildDir, "project", "novirahealth", "index.html"),
  );
} catch (error) {
  console.error("react-snap failed:", error.message);
  process.exit(1);
}
