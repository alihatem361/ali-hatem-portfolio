import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  readFileSync(join(ROOT, ".env.local"), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => l.split("=").map((s) => s.trim().replace(/^"|"$/g, "")))
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: env.SANITY_API_WRITE_TOKEN,
});

const r = await client.fetch(
  `*[_type=="project" && title.en match "Projeyes*"][0]{ title, "url": mainImage.asset->url, "assetId": mainImage.asset._ref }`
);
console.log("Title:", r?.title?.en);
console.log("Image URL:", r?.url);
console.log("Asset ref:", r?.assetId);
