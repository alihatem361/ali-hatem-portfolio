/**
 * The single definition of how Sanity documents become app content.
 *
 * Both consumers share this file:
 *   - scripts/fetch-sanity-content.js (build time, writes content.json)
 *   - src/data/devLiveContent.js      (development only, live refresh)
 *
 * Because they use the same query AND the same mapping, the development
 * and production content shapes cannot drift apart.
 *
 * This module must stay free of Node built-ins — it is bundled for the
 * browser in development.
 */

/**
 * Published content, in the order the CMS sets.
 *
 * Kept here rather than in the fetch script so the dev provider cannot
 * query a different projection.
 */
export const CONTENT_QUERY = /* groq */ `{
  "projects": *[_type == "project" && defined(slug.current)] | order(order asc, title.en asc) {
    "slug": slug.current,
    title,
    description,
    technology,
    "image": mainImage.asset->url,
    demo,
    github,
    codeStatus,
    videoUrl,
    loomVideo,
    isVisible,
    order,
    projectType,
    collectionId,
    featured,
    caseStudy,
    tagline,
    platform,
    "gallery": gallery[].asset->url,
    "features": features[]{
      key,
      icon,
      title,
      description,
      "image": image.asset->url
    }
  },
  "socials": *[_type == "social" && isVisible != false] | order(order asc) {
    "id": _id,
    platform,
    name,
    url
  },
  "siteSettings": *[_type == "siteSettings"][0] {
    name,
    bio,
    roles,
    "headerImage": headerImage.asset->url,
    "footerImage": footerImage.asset->url,
    cvUrl
  }
}`;

/** Extracts the 11-character YouTube id from any common URL shape. */
export const youtubeIdFromUrl = (url) => {
  if (!url) return undefined;
  const match = String(url).match(
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
  );
  return match && match[2]?.length === 11 ? match[2] : undefined;
};

/** Drops undefined/null/empty values so the generated file stays readable. */
export const compact = (object) =>
  Object.fromEntries(
    Object.entries(object).filter(
      ([, v]) =>
        v !== undefined &&
        v !== null &&
        !(Array.isArray(v) && v.length === 0) &&
        !(
          typeof v === "object" &&
          !Array.isArray(v) &&
          Object.keys(v).length === 0
        ),
    ),
  );

export const locale = (value) =>
  value ? compact({ en: value.en, ar: value.ar }) : undefined;

/**
 * One spelling per technology. The CMS had grown several for the same thing
 * (ReactJs / React, Tailwind / Tailwind CSS, HTML / HTML5, JS / JavaScript),
 * which doubled the filter pills on /projects and split their counts.
 * Keys are lowercase; anything not listed keeps its CMS spelling.
 */
const TECHNOLOGY_ALIASES = {
  reactjs: "React",
  "react.js": "React",
  react: "React",
  nextjs: "Next.js",
  "next js": "Next.js",
  "next.js": "Next.js",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  "tailwind css": "Tailwind CSS",
  html: "HTML",
  html5: "HTML",
  css: "CSS",
  css3: "CSS",
  js: "JavaScript",
  javascript: "JavaScript",
  typescript: "TypeScript",
  api: "REST API",
  "rest api": "REST API",
  framermotion: "Framer Motion",
  "framer motion": "Framer Motion",
  "shadcn-ui": "shadcn/ui",
  shadcn: "shadcn/ui",
  "shadcn/ui": "shadcn/ui",
  swiperjs: "Swiper",
  swiper: "Swiper",
  materialui: "Material UI",
  "material ui": "Material UI",
  mui: "Material UI",
  nodejs: "Node.js",
  "node.js": "Node.js",
  expressjs: "Express",
  express: "Express",
  sass: "Sass",
  contextapi: "Context API",
  angular: "Angular",
};

export const canonicalTechnology = (name) => {
  const trimmed = String(name || "").trim();
  return TECHNOLOGY_ALIASES[trimmed.toLowerCase()] || trimmed;
};

const normaliseTechnologies = (list = []) => [
  ...new Set(list.map(canonicalTechnology).filter(Boolean)),
];

/** Localized case-study fields; every one is optional. */
const toCaseStudy = (caseStudy) => {
  if (!caseStudy) return undefined;
  const localeList = (items) =>
    (items || []).map(locale).filter((item) => item?.en);
  return compact({
    role: locale(caseStudy.role),
    period: caseStudy.period || undefined,
    context: locale(caseStudy.context),
    problem: locale(caseStudy.problem),
    contributions: localeList(caseStudy.contributions),
    decisions: localeList(caseStudy.decisions),
    challenge: locale(caseStudy.challenge),
    outcome: locale(caseStudy.outcome),
    codeNote: locale(caseStudy.codeNote),
  });
};

export const toLegacyProject = (project) => {
  const base = {
    slug: project.slug,
    title: locale(project.title),
    description: locale(project.description),
    image: project.image,
    technology: normaliseTechnologies(project.technology),
    demo: project.demo || "",
    github: project.github || "",
    // The app checks `codeStatus === "PRIVATE"`.
    codeStatus: project.codeStatus === "private" ? "PRIVATE" : undefined,
    video: project.videoUrl || undefined,
    videoKey: youtubeIdFromUrl(project.videoUrl),
    loomVideo: project.loomVideo || undefined,
    // The app treats a missing `hidden` as visible.
    hidden: project.isVisible === false ? true : undefined,
    collectionId: project.collectionId || undefined,
    featured: project.featured === true ? true : undefined,
    caseStudy: toCaseStudy(project.caseStudy),
  };

  if (project.projectType === "mobile") {
    base.type = "mobile";
    base.tagline = locale(project.tagline);
    base.platform = project.platform || undefined;
    base.gallery = project.gallery?.filter(Boolean) || undefined;
    base.features = project.features?.map((feature) =>
      compact({
        key: feature.key,
        icon: feature.icon,
        title: locale(feature.title),
        description: locale(feature.description),
        image: feature.image,
      }),
    );
  }

  return compact(base);
};

export const toLegacySocial = (social) =>
  compact({
    id: social.id,
    name: social.platform,
    label: locale(social.name),
    link: social.url,
  });

export const toLegacyAboutme = (settings) =>
  compact({
    name: locale(settings.name),
    bio: (settings.bio || []).map(locale),
    roles: (settings.roles || []).map(locale),
    headerImage: settings.headerImage,
    footer: settings.footerImage,
    cv: settings.cvUrl,
  });

/**
 * The technologies used by at least one visible project, most-used first.
 *
 * These drive the filter pills on the projects page. That list used to be
 * hand-maintained, which let it drift from the data: three pills matched no
 * visible project at all (clicking them returned nothing), while 22 real
 * technologies had no pill.
 */
export const collectTechnologies = (legacyProjects) => {
  const counts = new Map();

  for (const project of legacyProjects) {
    if (project.hidden) continue;
    for (const technology of project.technology || []) {
      const name = String(technology).trim();
      if (!name) continue;
      // Fold case variants onto the first spelling seen.
      const existing = [...counts.keys()].find(
        (k) => k.toLowerCase() === name.toLowerCase(),
      );
      const canonical = existing || name;
      counts.set(canonical, (counts.get(canonical) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => name);
};

export const buildContentFile = ({ projects, socials, siteSettings }) => {
  const legacyProjects = projects.map(toLegacyProject);

  return {
    _comment:
      "GENERATED FILE — do not edit. Produced by scripts/fetch-sanity-content.js. Edit content in Sanity Studio.",
    generatedAt: new Date().toISOString(),
    projects: legacyProjects,
    technologies: collectTechnologies(legacyProjects),
    socials: (socials || []).map(toLegacySocial),
    aboutme: toLegacyAboutme(siteSettings),
  };
};
