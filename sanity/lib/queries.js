import { groq } from "next-sanity";

// ─── Hero ─────────────────────────────────────────────────────────────────────
/**
 * Fetch the singleton Hero document.
 * Returns localised name, jobTitle, bio, the hero image URL,
 * and a direct URL to the uploaded CV file.
 */
export const heroQuery = groq`
  *[_type == "hero" && _id == "hero-singleton"][0] {
    name,
    jobTitle,
    bio,
    "heroImageUrl": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    "cvFileUrl": cvFile.asset->url,
  }
`;

// ─── Projects ─────────────────────────────────────────────────────────────────
/**
 * Fetch all visible projects, sorted by the manual order field.
 */
export const allProjectsQuery = groq`
  *[_type == "project" && isVisible == true] | order(order asc) {
    _id,
    title,
    description,
    "mainImageUrl": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    "screenshots": screenshots[]{
      "url": asset->url,
      "alt": alt,
    },
    technologies,
    codeStatus,
    googlePlayLink,
    appStoreLink,
    githubLink,
    demoLink,
    videoUrl,
    projectType,
    startDate,
    endDate,
  }
`;

/**
 * Fetch a single project by its Sanity document ID.
 */
export const projectByIdQuery = groq`
  *[_type == "project" && _id == $id][0] {
    _id,
    title,
    description,
    "mainImageUrl": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    "screenshots": screenshots[]{
      "url": asset->url,
      "alt": alt,
    },
    technologies,
    codeStatus,
    googlePlayLink,
    appStoreLink,
    githubLink,
    demoLink,
    videoUrl,
    projectType,
    startDate,
    endDate,
  }
`;

// ─── Social Media ─────────────────────────────────────────────────────────────
/**
 * Fetch all social media links, sorted by order.
 */
export const socialLinksQuery = groq`
  *[_type == "social"] | order(order asc) {
    _id,
    platform,
    url,
    "iconUrl": icon.asset->url,
    order,
  }
`;
