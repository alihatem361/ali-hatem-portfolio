export const handleDownloadCv = (CvLink, CVName) => {
  fetch(CvLink, {
    headers: {
      Origin: window.location.origin,
    },
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = CVName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => console.error(error));
};

/**
 * Creates a URL-friendly slug from a project title
 * Supports both English and Arabic characters
 * @param {string} title - The project title
 * @returns {string} - URL-friendly slug
 */
export const createSlug = (title) => {
  if (!title) return "";

  return title
    .toLowerCase() // Convert to lowercase (works for Latin chars)
    .trim() // Remove leading/trailing whitespace
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // Remove special chars, keep letters (any language), numbers, spaces, hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

/** The site's public origin, used to build absolute URLs for metadata. */
export const SITE_URL = "https://www.alihatem.me";

/**
 * Builds the absolute image URL used in og:image and JSON-LD.
 *
 * Images are served from the Sanity CDN and are already absolute. Prefixing
 * those with the site origin produced
 * "https://www.alihatem.me/https://cdn.sanity.io/..." — which broke every
 * social share preview. Relative paths (anything still served from /public)
 * still get the origin prepended.
 *
 * @param {string} imagePath - absolute URL or repo-relative path
 * @param {string} [fallback] - used when imagePath is empty
 * @returns {string|undefined}
 */
export const getAbsoluteImageUrl = (imagePath, fallback) => {
  const value = (imagePath || "").trim();
  if (!value) return fallback;
  if (/^(https?:)?\/\//i.test(value)) return value;
  return `${SITE_URL}/${value.replace(/^\/+/, "")}`;
};

/**
 * The canonical URL segment for a project.
 *
 * Projects now carry an explicit, language-neutral `slug` from the CMS. Slugs
 * used to be derived from the title at render time, which gave the same project
 * a different URL in each language, so Arabic visitors could not open or share
 * an English link. `createSlug` remains as a fallback for any record without
 * one.
 *
 * @param {object} project
 * @returns {string}
 */
export const getProjectSlug = (project) =>
  project?.slug || createSlug(project?.title);

/**
 * Normalizes a project image reference for use in a src attribute.
 *
 * Handles three shapes:
 *   - Fully qualified URLs (Sanity CDN, or any other host) — returned as-is.
 *     Prefixing these with "/" would produce "/https://cdn.sanity.io/..." and
 *     break every image served from the CMS.
 *   - Root-relative paths ("/images/foo.png") — returned as-is.
 *   - Bare relative paths ("images/foo.png") — prefixed with "/".
 *
 * @param {string} imagePath - image URL or path
 * @returns {string} - a usable src value
 */
export const getImagePath = (imagePath) => {
  if (!imagePath) return "";
  if (/^(https?:)?\/\//i.test(imagePath) || imagePath.startsWith("data:")) {
    return imagePath;
  }
  return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
};

/**
 * Sized, format-negotiated variant of a Sanity CDN image. Sanity serves the
 * original upload by default (the hero photo is 3317×3101), so anything shown
 * small should go through this. Non-Sanity URLs pass through untouched.
 */
export const sanityImage = (url, { width, height, quality = 80 } = {}) => {
  if (!url || !/^https:\/\/cdn\.sanity\.io\//.test(url)) return url || "";
  const params = new URLSearchParams({ auto: "format", q: String(quality) });
  if (width) params.set("w", String(width));
  if (height) params.set("h", String(height));
  if (width && height) params.set("fit", "crop");
  return `${url}${url.includes("?") ? "&" : "?"}${params}`;
};

/** srcset of Sanity variants at the given widths (square when `square`). */
export const sanitySrcSet = (url, widths, { square = false } = {}) =>
  widths
    .map(
      (w) =>
        `${sanityImage(url, { width: w, height: square ? w : undefined })} ${w}w`,
    )
    .join(", ");
