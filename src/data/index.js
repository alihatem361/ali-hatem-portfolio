import content from "./content.json";

/**
 * Technologies that appear on at least one visible project, most-used first.
 *
 * Generated from the CMS at build time. This was previously a hand-maintained
 * list that had drifted from the data: three entries matched no visible project
 * (so those filters returned nothing), while 22 technologies in use had no
 * filter at all.
 */
export const techSkills = content.technologies || [];
