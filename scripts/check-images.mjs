import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  readFileSync(join(ROOT, ".env.local"), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => l.split("=").map((s) => s.trim().replace(/^"|"$/g, ""))),
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: env.SANITY_API_WRITE_TOKEN,
});

const projects = await client.fetch(
  `*[_type == "project"] | order(order asc) { _id, title, "mainImageUrl": mainImage.asset->url }`,
);

console.log(`Total projects: ${projects.length}`);
projects.forEach((p) => {
  const title = p.title?.en || JSON.stringify(p.title);
  if (!p.mainImageUrl) {
    console.log(`  ❌ MISSING IMAGE: "${title}" (${p._id})`);
  } else {
    console.log(`  ✅ "${title}"`);
  }
});
