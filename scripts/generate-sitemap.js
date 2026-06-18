import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSlug } from "../src/helpers/index.js";

const BASE_URL = "https://www.alihatem.me";
const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0", includeAlternates: true },
  { path: "/projects", changefreq: "weekly", priority: "0.9" },
  {
    path: "/collection/teachers-collection",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/collection/mps-collection",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/collection/e3mel-landing-collection",
    changefreq: "monthly",
    priority: "0.8",
  },
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const projectsEnPath = path.join(rootDir, "src", "data", "projects.json");
const projectsArPath = path.join(rootDir, "src", "data", "projectsAR.json");
const outputPath = path.join(rootDir, "public", "sitemap.xml");

const toIsoDateStartOfDayUTC = () => {
  const datePart = new Date().toISOString().slice(0, 10);
  return `${datePart}T00:00:00+00:00`;
};

const xmlEscape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toAbsoluteUrl = (routePath) => `${BASE_URL}${routePath}`;

const parseProjects = async (filePath) => {
  const raw = await readFile(filePath, "utf8");
  const json = JSON.parse(raw);
  return Array.isArray(json?.Projects) ? json.Projects : [];
};

const extractProjectRoutes = (projects) => {
  const uniqueRoutes = new Set();

  for (const project of projects) {
    const title = project?.title;
    if (!title) continue;

    const slug = createSlug(title);
    if (!slug) continue;

    uniqueRoutes.add(`/project/${slug}`);
  }

  return Array.from(uniqueRoutes)
    .sort((a, b) => a.localeCompare(b))
    .map((routePath) => ({
      path: routePath,
      changefreq: "monthly",
      priority: "0.7",
    }));
};

const buildUrlEntry = (route, lastmod) => {
  const lines = [
    "<url>",
    `  <loc>${xmlEscape(toAbsoluteUrl(route.path))}</loc>`,
    `  <lastmod>${lastmod}</lastmod>`,
    `  <changefreq>${route.changefreq}</changefreq>`,
    `  <priority>${route.priority}</priority>`,
  ];

  if (route.includeAlternates) {
    lines.push(
      `  <xhtml:link rel=\"alternate\" hreflang=\"en\" href=\"${xmlEscape(toAbsoluteUrl(route.path))}\" />`,
      `  <xhtml:link rel=\"alternate\" hreflang=\"ar\" href=\"${xmlEscape(`${BASE_URL}/ar`)}\" />`,
    );
  }

  lines.push("</url>");
  return lines.join("\n");
};

const generateSitemapXml = (routes) => {
  const lastmod = toIsoDateStartOfDayUTC();

  const body = routes
    .map((route) => buildUrlEntry(route, lastmod))
    .join("\n\n");

  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset\n      xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"\n      xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n      xmlns:xhtml=\"http://www.w3.org/1999/xhtml\"\n      xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9\n            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\">\n\n${body}\n\n</urlset>\n`;
};

const run = async () => {
  const [projectsEn, projectsAr] = await Promise.all([
    parseProjects(projectsEnPath),
    parseProjects(projectsArPath),
  ]);

  const allProjects = [...projectsEn, ...projectsAr];
  const projectRoutes = extractProjectRoutes(allProjects);

  // Static routes first, then all discovered project routes.
  const allRoutes = [...STATIC_ROUTES, ...projectRoutes];

  const sitemapXml = generateSitemapXml(allRoutes);
  await writeFile(outputPath, sitemapXml, "utf8");

  console.log(`Sitemap generated: ${outputPath}`);
  console.log(`Total URLs: ${allRoutes.length}`);
};

run().catch((error) => {
  console.error("Failed to generate sitemap:", error);
  process.exitCode = 1;
});
