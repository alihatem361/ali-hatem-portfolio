#!/usr/bin/env node
/**
 * scripts/seed-sanity.mjs
 *
 * Reads src/data/projects.json (EN) + projectsAR.json (AR), merges them,
 * uploads local images to Sanity's asset pipeline, and creates/replaces:
 *   - 1 hero-singleton document
 *   - N social link documents
 *   - N project documents (one per project with bilingual fields)
 *
 * Usage:
 *   node scripts/seed-sanity.mjs
 *
 * Requirements in .env.local:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=...
 *   NEXT_PUBLIC_SANITY_DATASET=production
 *   SANITY_API_WRITE_TOKEN=...   ← needs Editor or above permissions
 */

import { createClient } from "@sanity/client";
import { createReadStream, existsSync } from "fs";
import { readFile } from "fs/promises";
import { resolve, join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─── Load .env.local (no dotenv dependency needed) ───────────────────────────
async function loadEnv() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  const text = await readFile(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed
      .slice(eqIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

await loadEnv();

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;

if (!PROJECT_ID || PROJECT_ID === "your_project_id_here") {
  console.error(
    "❌  NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local\n" +
      "    Run: npx sanity@latest init --env  to generate your project.",
  );
  process.exit(1);
}
if (!TOKEN) {
  console.error(
    "❌  SANITY_API_WRITE_TOKEN is not set in .env.local\n" +
      "    Create one at: https://sanity.io/manage → API → Tokens\n" +
      "    Required permissions: Editor (or higher)",
  );
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  token: TOKEN,
  useCdn: false,
});

// ─── Load source JSON files ──────────────────────────────────────────────────
const enRaw = JSON.parse(
  await readFile(join(ROOT, "src/data/projects.json"), "utf8"),
);
const arRaw = JSON.parse(
  await readFile(join(ROOT, "src/data/projectsAR.json"), "utf8"),
);

const enProjects = enRaw.Projects;
const arProjects = arRaw.Projects;
const enAbout = enRaw.aboutme[0];
const arAbout = arRaw.aboutme[0];
const socials = enRaw.socials;

// ─── Image upload (deduped with a local cache) ───────────────────────────────
const uploadCache = new Map();

async function uploadImage(imagePath) {
  if (!imagePath) return null;
  if (uploadCache.has(imagePath)) return uploadCache.get(imagePath);

  let asset;

  if (imagePath.startsWith("http")) {
    // External URL (e.g. raw.githubusercontent.com)
    try {
      const res = await fetch(imagePath);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      const filename = imagePath.split("/").pop().split("?")[0] || "image.jpg";
      asset = await client.assets.upload("image", buffer, { filename });
    } catch (err) {
      console.warn(
        `    ⚠ Could not fetch external image (${imagePath}): ${err.message}`,
      );
      return null;
    }
  } else {
    // Local file in /public/
    const absPath = join(ROOT, "public", imagePath);
    if (!existsSync(absPath)) {
      console.warn(`    ⚠ Image not found locally: ${absPath}`);
      return null;
    }
    const filename = imagePath.split("/").pop();
    asset = await client.assets.upload("image", createReadStream(absPath), {
      filename,
    });
  }

  const ref = {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
  uploadCache.set(imagePath, ref);
  return ref;
}

// ─── Technology normalisation map ───────────────────────────────────────────
// Maps every raw JSON variant → the canonical value used in the schema list.
const TECH_MAP = {
  flutter: "Flutter",
  bloc: "Bloc",
  ".net": ".NET",
  api: "REST APIs",
  apis: "REST APIs",
  "restful apis": "REST APIs",
  audio_service: "Audio Service",
  just_audio: "Just Audio",
  "vedio player": "Video Player",
  webview: "WebView",
  wobsocket: "WebSocket",
  "moview apis": "Movie APIs",
  "youtube player flutter": "YouTube Player Flutter",
  "local notification": "Local Notifications",
  "payment process": "Payment",
  "firebase authentication": "Firebase Auth",
  "firebase core": "Firebase Core",
  "firebase firestore": "Firebase Firestore",
  "firebase messaging": "Firebase Messaging",
  "firebase storage": "Firebase Storage",
  "chat-bot": "Chatbot",
  "qr generator & scanner": "QR Code",
  "shared preferences": "Shared Preferences",
  "google geocoding": "Google Geocoding",
  ui: "UI/UX",
  "paymob sdk": "Paymob",
};

function normalizeTech(raw) {
  const key = raw.trim().toLowerCase();
  return TECH_MAP[key] ?? raw.trim(); // keep as-is if not in map
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
/** Make a deterministic, ASCII-only Sanity document _id from a string + index */
function makeId(prefix, title, index) {
  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // ASCII alphanumeric only — strips Arabic/Unicode
      .replace(/^-|-$/g, "")
      .slice(0, 50) || String(index); // fallback to index if title is all non-ASCII
  return `${prefix}-${slug}-${index}`;
}

// ─── Hero Singleton ──────────────────────────────────────────────────────────
async function seedHero() {
  console.log("\n📸  Seeding Hero section…");

  const heroImage = await uploadImage(enAbout.heaaderimag);

  const titleParts = (enAbout.title || "").split("|");
  const jobTitleEn = titleParts.slice(1).join(" ").trim() || "Mobile Developer";
  const jobTitleAr = arAbout.title || "مطور تطبيقات المحمول";

  const doc = {
    _id: "hero-singleton",
    _type: "hero",
    name: {
      en: enAbout.name,
      ar: arAbout.name,
    },
    jobTitle: {
      en: jobTitleEn,
      ar: jobTitleAr,
    },
    bio: {
      en: Array.isArray(enAbout.bio)
        ? enAbout.bio.join("\n\n")
        : String(enAbout.bio),
      ar: Array.isArray(arAbout.bio)
        ? arAbout.bio.join("\n\n")
        : String(arAbout.bio),
    },
    ...(heroImage && { heroImage }),
  };

  await client.createOrReplace(doc);
  console.log("  ✓ hero-singleton");
}

// ─── Social Links ─────────────────────────────────────────────────────────────
const PLATFORM_MAP = {
  facebook: "Other",
  twitter: "Twitter",
  github: "GitHub",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  youtube: "YouTube",
  email: "Email",
  phone: "Other",
  whatsapp: "WhatsApp",
};

async function seedSocials() {
  console.log("\n🔗  Seeding Social Media links…");

  for (const [i, s] of socials.entries()) {
    if (!s.link) continue;
    const doc = {
      _id: `social-${s.id || i + 1}`,
      _type: "social",
      platform: PLATFORM_MAP[s.name?.toLowerCase()] || "Other",
      url: s.link,
      order: i + 1,
    };
    await client.createOrReplace(doc);
    console.log(`  ✓ ${s.name} → ${s.link.slice(0, 50)}`);
  }
}

// ─── Projects ─────────────────────────────────────────────────────────────────
async function seedProjects() {
  console.log(`\n🚀  Seeding ${enProjects.length} projects…`);

  for (const [i, en] of enProjects.entries()) {
    const ar = arProjects[i] ?? {};
    process.stdout.write(
      `  [${String(i + 1).padStart(2)}/${enProjects.length}] ${en.title.slice(0, 45).padEnd(45)} `,
    );

    const mainImage = await uploadImage(en.imeg);

    // ── Resolve links ──────────────────────────────────────────────────────
    const googlePlayLink =
      [en.android, en.demo].find((l) => l && l.includes("play.google.com")) ||
      null;
    const appStoreLink =
      [en.ios].find((l) => l && l.includes("apps.apple.com")) || null;
    const demoLink =
      en.demo && !en.demo.includes("play.google") && !en.demo.includes("youtu")
        ? en.demo
        : null;
    const githubLink = en.github || null;
    const videoUrl = en.video || null;

    const doc = {
      _id: makeId("project", en.title, i),
      _type: "project",

      title: {
        en: en.title,
        ar: ar.title || en.title,
      },
      description: {
        en: (en.description || "").replace(/\\n/g, "\n"),
        ar: (ar.description || en.description || "").replace(/\\n/g, "\n"),
      },

      technologies: (en.technology ?? []).filter(Boolean).map(normalizeTech),
      codeStatus: en.codeStatus === "PRIVATE" ? "PRIVATE" : "PUBLIC",

      ...(googlePlayLink && { googlePlayLink }),
      ...(appStoreLink && { appStoreLink }),
      ...(demoLink && { demoLink }),
      ...(githubLink && { githubLink }),
      ...(videoUrl && { videoUrl }),

      isVisible: true,
      order: i + 1,

      ...(mainImage && { mainImage }),
    };

    await client.createOrReplace(doc);
    console.log("✓");
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────
console.log(
  `\n🌱  Seeding Sanity — project: ${PROJECT_ID}  dataset: ${DATASET}\n`,
);

try {
  await seedHero();
  await seedSocials();
  await seedProjects();
  console.log(
    `\n✅  Done! Open your Studio to review:\n` +
      `    http://localhost:3000/studio\n`,
  );
} catch (err) {
  console.error("\n❌  Seeding failed:", err.message);
  if (err.statusCode === 401 || err.statusCode === 403) {
    console.error(
      "    → Check that SANITY_API_WRITE_TOKEN has Editor (or higher) permissions.",
    );
  }
  process.exit(1);
}
