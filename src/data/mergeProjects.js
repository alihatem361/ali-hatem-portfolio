import content from "./content.json";

/**
 * Reads the generated content file produced from Sanity.
 *
 * Content is authored once per project, with `title` and `description` carrying
 * both languages. That removes the whole class of drift the two hand-edited
 * JSON files used to suffer from — differing project sets, orders and hidden
 * flags between English and Arabic — because there is now a single record per
 * project rather than two that had to be kept in step.
 *
 * English is still the fallback for any missing Arabic translation.
 */

const isArabic = (language) => language === "ar";

/** Picks one language out of a { en, ar } value, falling back to English. */
const pickLocale = (value, language) => {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return value;
  return (isArabic(language) ? value.ar : value.en) ?? value.en ?? "";
};

const localiseFeature = (feature, language) => ({
  ...feature,
  title: pickLocale(feature.title, language),
  description: pickLocale(feature.description, language),
});

/** Flattens a project's localized fields for the requested language. */
const localiseProject = (project, language) => {
  const localised = {
    ...project,
    title: pickLocale(project.title, language),
    description: pickLocale(project.description, language),
  };

  if (project.tagline) {
    localised.tagline = pickLocale(project.tagline, language);
  }

  if (project.features) {
    localised.features = project.features.map((feature) =>
      localiseFeature(feature, language),
    );
  }

  return localised;
};

/**
 * Every project, in the order set in the CMS, including hidden ones.
 */
export const getProjectsForLanguage = (language) =>
  content.projects.map((project) => localiseProject(project, language));

/**
 * Visible projects only, in the order set in the CMS.
 */
export const getVisibleProjectsForLanguage = (language) =>
  getProjectsForLanguage(language).filter((project) => !project.hidden);

/**
 * Social links. `name` is the platform key the icon map keys off; `label` holds
 * the translated accessible name.
 */
export const getSocialsForLanguage = (language) =>
  content.socials.map((social) => ({
    ...social,
    label: pickLocale(social.label, language),
  }));

/**
 * Hero / about block. Returned as a single-element array because callers read
 * it as `data[0][0]`.
 */
export const getAboutmeForLanguage = (language) => {
  const { name, bio, roles, ...rest } = content.aboutme;

  return [
    {
      ...rest,
      name: pickLocale(name, language),
      bio: (bio || []).map((paragraph) => pickLocale(paragraph, language)),
      roles: (roles || []).map((role) => pickLocale(role, language)),
    },
  ];
};
