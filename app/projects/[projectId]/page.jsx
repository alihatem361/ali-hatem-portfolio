import ProjectDetail from "../../../src/views/ProjectDetail";
import { client } from "../../../sanity/lib/client";
import { allProjectsQuery } from "../../../sanity/lib/queries";
import { createSlug } from "../../../src/helpers";
import { getRequestLocale } from "../../lib/locale";

const FALLBACK_METADATA = {
  en: {
    title: "Project Details",
    description:
      "Detailed view of a Flutter mobile application project by Abdulrahman Hatem.",
    openGraphLocale: "en_US",
  },
  ar: {
    title: "تفاصيل المشروع",
    description: "عرض تفصيلي لمشروع تطبيق Flutter للهواتف من عبدالرحمن حاتم.",
    openGraphLocale: "ar_EG",
  },
};

const getLocaleFallback = (locale) =>
  FALLBACK_METADATA[locale] || FALLBACK_METADATA.en;

const getProjectSlugValue = (project) => {
  if (!project) return "";

  if (typeof project.title === "string") return project.title;

  return project.title?.en || project.title?.ar || "";
};

const getLocalizedValue = (value, locale) => {
  if (!value) return "";

  if (typeof value === "string") return value;

  return value?.[locale] || value?.en || value?.ar || "";
};

const buildMetaDescription = (value, fallbackDescription) => {
  if (!value) return fallbackDescription;
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= 160) return normalized;
  return `${normalized.slice(0, 157).trim()}...`;
};

export async function generateMetadata({ params }) {
  const locale = await getRequestLocale();
  const fallback = getLocaleFallback(locale);
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams?.projectId || "");
  const baseMetadata = {
    title: fallback.title,
    description: fallback.description,
    alternates: {
      canonical: slug ? `/projects/${slug}` : "/projects",
    },
    openGraph: {
      title: fallback.title,
      description: fallback.description,
      url: slug ? `/projects/${slug}` : "/projects",
      type: "article",
      locale: fallback.openGraphLocale,
    },
    twitter: {
      card: "summary",
      title: fallback.title,
      description: fallback.description,
    },
  };

  if (!slug) {
    return baseMetadata;
  }

  try {
    const projects = await client.fetch(allProjectsQuery);
    const project = (projects || []).find((item) => {
      const titleValue = getProjectSlugValue(item);
      return createSlug(titleValue || "") === slug;
    });

    if (!project) {
      return baseMetadata;
    }

    const projectTitle =
      getLocalizedValue(project.title, locale) || fallback.title;
    const description = buildMetaDescription(
      getLocalizedValue(project.description, locale),
      fallback.description,
    );
    const ogImage = project.mainImageUrl || "/favicon.ico";
    const twitterCard = project.mainImageUrl
      ? "summary_large_image"
      : "summary";

    return {
      title: projectTitle,
      description,
      alternates: {
        canonical: `/projects/${slug}`,
      },
      openGraph: {
        title: projectTitle,
        description,
        url: `/projects/${slug}`,
        type: "article",
        locale: fallback.openGraphLocale,
        images: [
          {
            url: ogImage,
            alt: project.mainImageAlt || projectTitle,
          },
        ],
      },
      twitter: {
        card: twitterCard,
        title: projectTitle,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    return baseMetadata;
  }
}

export default async function ProjectDetailPage({ params }) {
  const resolvedParams = await params;
  const projectId = resolvedParams?.projectId || "";

  return <ProjectDetail projectId={decodeURIComponent(projectId)} />;
}
