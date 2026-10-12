/**
 * Generates the downloadable CV PDFs from src/data/cvData.js:
 *   public/cv/Ali-Hatem-Ramadan-Frontend-Developer-CV.pdf  (English)
 *   public/cv/Ali-Hatem-Ramadan-CV-AR.pdf                  (Arabic)
 *
 * Uses a locally installed Chrome/Edge in headless mode, so the PDF contains
 * real, selectable text (ATS-readable) and working links. Run it after editing
 * cvData.js and commit the PDFs — it is NOT part of `npm run build`, because
 * Vercel has no browser.
 *
 * Usage: npm run cv:build   (set CHROME_PATH to override browser detection)
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { cvDataEN, cvDataAR } from "../src/data/cvData.js";
import { renderCVDocument, CV_FILES } from "../src/data/cvTemplate.js";

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const browser = candidates.find((candidate) => existsSync(candidate));
if (!browser) {
  console.error("build-cv: no Chrome/Edge found. Set CHROME_PATH.");
  process.exit(1);
}

const root = process.cwd();
const tmp = mkdtempSync(path.join(os.tmpdir(), "cv-"));

try {
  for (const [lang, data] of [
    ["en", cvDataEN],
    ["ar", cvDataAR],
  ]) {
    const htmlPath = path.join(tmp, `cv-${lang}.html`);
    writeFileSync(htmlPath, renderCVDocument(data, lang), "utf8");

    const pdfPath = path.join(root, "public", CV_FILES[lang]);
    mkdirSync(path.dirname(pdfPath), { recursive: true });

    execFileSync(
      browser,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        `--user-data-dir=${path.join(tmp, "profile")}`,
        `--print-to-pdf=${pdfPath}`,
        pathToFileURL(htmlPath).href,
      ],
      { stdio: "ignore" },
    );

    if (!existsSync(pdfPath)) throw new Error(`PDF not written: ${pdfPath}`);
    console.log(`build-cv: wrote ${path.relative(root, pdfPath)}`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
