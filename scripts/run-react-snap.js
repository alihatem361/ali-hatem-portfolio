import { execSync } from "node:child_process";

const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
const isCI = process.env.CI === "1" || process.env.CI === "true";

if (isVercel || isCI) {
  console.log(
    "Skipping react-snap on CI/Vercel (Chromium deps are unavailable).",
  );
  process.exit(0);
}

try {
  execSync("npx react-snap", { stdio: "inherit" });
} catch (error) {
  console.error("react-snap failed:", error.message);
  process.exit(1);
}
