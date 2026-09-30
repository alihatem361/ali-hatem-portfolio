/**
 * One-time import of the legacy JSON content into Sanity.
 *
 * English is the canonical record (same rule the site already applies in
 * src/data/mergeProjects.js): it supplies order, visibility and every
 * language-neutral field, while the Arabic file contributes title and
 * description only.
 *
 * Safe to re-run — documents are matched by slug and patched rather than
 * duplicated, and each image uploads once per source path.
 *
 * Usage:
 *   node scripts/migrate-to-sanity.js --dry-run
 *   node scripts/migrate-to-sanity.js
 *   node scripts/migrate-to-sanity.js --dataset=staging
 */
import { readFile } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createClient } from "@sanity/client";
import { createSlug } from "../src/helpers/index.js";
import {
  rootDir,
  readSanityEnv,
  collectionIdForTitle,
  normaliseImagePath,
} from "./sanity-shared.js";

const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const datasetOverride = args
  .find((a) => a.startsWith("--dataset="))
  ?.split("=")[1];

/** True only when this file is executed directly, not when imported. */
const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

// --- load legacy content ------------------------------------------------

export const loadJson = async (relativePath) =>
  JSON.parse(await readFile(path.join(rootDir, relativePath), "utf8"));

/** Pairs each English project with its Arabic counterpart. */
export const buildPairs = (enProjects, arProjects) => {
  const byDemo = new Map();
  const byImage = new Map();

  for (const p of arProjects) {
    const demo = (p.demo || "").trim();
    const image = normaliseImagePath(p.image);
    if (demo && !byDemo.has(demo)) byDemo.set(demo, p);
    if (image && !byImage.has(image)) byImage.set(image, p);
  }

  return enProjects.map((en) => ({
    en,
    ar:
      byDemo.get((en.demo || "").trim()) ||
      byImage.get(normaliseImagePath(en.image)),
  }));
};

// --- document builders --------------------------------------------------

const localeString = (en, ar) => {
  const value = {};
  if (en) value.en = en;
  if (ar) value.ar = ar;
  return Object.keys(value).length ? { _type: "localeString", ...value } : undefined;
};

const localeText = (en, ar) => {
  const value = {};
  if (en) value.en = en;
  if (ar) value.ar = ar;
  return Object.keys(value).length ? { _type: "localeText", ...value } : undefined;
};

/**
 * @param {object} pair       - { en, ar } legacy project entries
 * @param {number} index      - position, used for display order
 * @param {Function} resolveImage - maps a legacy image path to an image value
 */
export const buildProjectDoc = async ({ en, ar }, index, resolveImage) => {
  const uploadImage = resolveImage;
  const slug = createSlug(en.title);
  if (!slug) throw new Error(`Cannot derive a slug from title: ${en.title}`);

  const doc = {
    _type: "project",
    title: localeString(en.title, ar?.title),
    slug: { _type: "slug", current: slug },
    description: localeText(en.description, ar?.description),
    technology: Array.isArray(en.technology) ? en.technology : [],
    mainImage: await uploadImage(en.image),
    demo: en.demo || undefined,
    github: en.github || undefined,
    codeStatus: en.codeStatus === "PRIVATE" ? "private" : "public",
    videoUrl: en.video || undefined,
    loomVideo: en.loomVideo || undefined,
    isVisible: !en.hidden,
    order: index * 10,
    projectType: en.type === "mobile" ? "mobile" : "web",
    collectionId: collectionIdForTitle(en.title),
  };

  if (doc.projectType === "mobile") {
    doc.tagline = localeString(en.tagline, ar?.tagline);
    doc.platform = Array.isArray(en.platform) ? en.platform : undefined;

    if (Array.isArray(en.gallery) && en.gallery.length) {
      const gallery = [];
      for (const item of en.gallery) {
        const image = await uploadImage(item);
        if (image) gallery.push({ ...image, _key: createSlug(item).slice(0, 24) });
      }
      doc.gallery = gallery.length ? gallery : undefined;
    }

    if (Array.isArray(en.features) && en.features.length) {
      const features = [];
      for (const feature of en.features) {
        features.push({
          _type: "projectFeature",
          _key: feature.key,
          key: feature.key,
          icon: feature.icon,
          title: localeString(feature.title),
          description: localeText(feature.description),
          image: await uploadImage(feature.image),
        });
      }
      doc.features = features;
    }
  }

  // Drop undefined keys so patches don't clear existing values.
  return Object.fromEntries(
    Object.entries(doc).filter(([, v]) => v !== undefined),
  );
};

export const buildSocialDocs = (enSocials, arSocials) => {
  const arByName = new Map((arSocials || []).map((s) => [s.id, s]));

  return (enSocials || []).map((social, index) => ({
    _type: "social",
    _id: `social-${social.name}`,
    platform: social.name,
    name: localeString(social.name, arByName.get(social.id)?.name),
    url: social.link,
    order: (index + 1) * 10,
    isVisible: true,
  }));
};

export const buildSiteSettings = async (enAbout, arAbout, uploadImage) => ({
  _type: "siteSettings",
  _id: "siteSettings",
  name: localeString(enAbout.name, arAbout?.name),
  bio: (enAbout.bio || []).map((paragraph, i) => ({
    ...localeText(paragraph, arAbout?.bio?.[i]),
    _key: `bio-${i}`,
  })),
  roles: [
    ["Front-End Developer", "مطور واجهات أمامية"],
    ["React Specialist", "متخصص React"],
    ["UI/UX Enthusiast", "مهتم بتجربة المستخدم"],
    ["Problem Solver", "حلال مشاكل"],
  ].map(([en, ar], i) => ({ ...localeString(en, ar), _key: `role-${i}` })),
  headerImage: await uploadImage(enAbout.headerImage),
  footerImage: await uploadImage(enAbout.footer),
  cvUrl: enAbout.cv || undefined,
});

// --- run ----------------------------------------------------------------

const run = async () => {
  const { projectId, dataset, token } = readSanityEnv({
    requireToken: !isDryRun,
  });

  const client = createClient({
    projectId,
    dataset: datasetOverride || dataset,
    token,
    apiVersion: "2026-02-01",
    useCdn: false,
  });

  const assetCache = new Map();
  const missingImages = [];
  let uploadCount = 0;

  /**
   * Uploads a file from public/ and returns a Sanity image field value.
   * Repeated paths reuse the first upload.
   */
  const uploadImage = async (imagePath) => {
    const relative = normaliseImagePath(imagePath);
    if (!relative) return undefined;
    if (assetCache.has(relative)) return assetCache.get(relative);

    const absolute = path.join(rootDir, "public", relative);
    if (!existsSync(absolute)) {
      missingImages.push(relative);
      return undefined;
    }

    if (isDryRun) {
      const placeholder = { _type: "image", asset: { _ref: `<${relative}>` } };
      assetCache.set(relative, placeholder);
      uploadCount += 1;
      return placeholder;
    }

    const asset = await client.assets.upload(
      "image",
      createReadStream(absolute),
      { filename: path.basename(absolute) },
    );

    const value = {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    };
    assetCache.set(relative, value);
    uploadCount += 1;
    return value;
  };

  /** Creates the document, or patches the existing one with the same slug. */
  const upsertBySlug = async (doc) => {
    const existingId = await client.fetch(
      `*[_type == "project" && slug.current == $slug][0]._id`,
      { slug: doc.slug.current },
    );

    if (existingId) {
      await client.patch(existingId).set(doc).commit();
      return "patched";
    }

    await client.create(doc);
    return "created";
  };

  const [enData, arData] = await Promise.all([
    loadJson("src/data/projects.json"),
    loadJson("src/data/projectsAR.json"),
  ]);

  const pairs = buildPairs(enData.Projects, arData.Projects);
  const unpaired = pairs.filter((p) => !p.ar).length;

  console.log(
    `Target: projectId=${projectId} dataset=${datasetOverride || dataset}` +
      (isDryRun ? "  [DRY RUN — nothing will be written]" : ""),
  );
  console.log(
    `Projects: ${pairs.length} (${pairs.filter((p) => !p.en.hidden).length} visible, ` +
      `${unpaired} without an Arabic match)`,
  );

  const projectDocs = [];
  for (const [index, pair] of pairs.entries()) {
    projectDocs.push(await buildProjectDoc(pair, index, uploadImage));
  }

  const slugs = projectDocs.map((d) => d.slug.current);
  const duplicateSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (duplicateSlugs.length) {
    throw new Error(`Duplicate slugs would collide: ${duplicateSlugs.join(", ")}`);
  }

  const socialDocs = buildSocialDocs(enData.socials, arData.socials);
  const settingsDoc = await buildSiteSettings(
    enData.aboutme[0],
    arData.aboutme?.[0],
    uploadImage,
  );

  console.log(`Socials: ${socialDocs.length}`);
  console.log(`Images: ${uploadCount} unique uploads`);
  if (missingImages.length) {
    console.warn(
      `\nWARNING: ${missingImages.length} referenced image(s) not found in public/:`,
    );
    for (const m of [...new Set(missingImages)]) console.warn(`  - ${m}`);
  }

  if (isDryRun) {
    console.log("\nSample project document:");
    console.log(JSON.stringify(projectDocs[0], null, 2).slice(0, 1200));
    console.log("\nDry run complete — nothing written.");
    return;
  }

  let created = 0;
  let patched = 0;
  for (const doc of projectDocs) {
    const result = await upsertBySlug(doc);
    result === "created" ? (created += 1) : (patched += 1);
    process.stdout.write(`\rProjects written: ${created + patched}/${projectDocs.length}`);
  }
  process.stdout.write("\n");

  // Socials and settings use fixed ids, so createOrReplace is already idempotent.
  for (const doc of socialDocs) await client.createOrReplace(doc);
  await client.createOrReplace(settingsDoc);

  console.log(
    `Done. Projects created: ${created}, patched: ${patched}. ` +
      `Socials: ${socialDocs.length}. Site settings: 1.`,
  );
};

if (isMain) {
  run().catch((error) => {
    console.error("\nMigration failed:", error.message);
    process.exitCode = 1;
  });
}
