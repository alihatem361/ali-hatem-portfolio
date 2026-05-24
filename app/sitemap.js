import { client } from "../sanity/lib/client";
import { allProjectsQuery } from "../sanity/lib/queries";
import { createSlug } from "../src/helpers";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://abdulrahman-hatem.vercel.app/";

const toValidDate = (value) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

export default async function sitemap() {
  let projects = [];

  try {
    projects = await client.fetch(allProjectsQuery);
  } catch (error) {
    projects = [];
  }

  const projectEntries = (projects || [])
    .map((project) => {
      const titleValue =
        project.title?.en || project.title?.ar || project.title || "";
      const slug = createSlug(titleValue);

      if (!slug) return null;

      return {
        url: `${SITE_URL}/projects/${slug}`,
        lastModified:
          toValidDate(project.endDate || project.startDate) || new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      };
    })
    .filter(Boolean);

  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...projectEntries,
  ];
}
