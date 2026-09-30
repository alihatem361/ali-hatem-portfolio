import { getContent } from "./contentStore";

/**
 * Technologies that appear on at least one visible project, most-used first.
 *
 * Generated from the CMS at build time. This was previously a hand-maintained
 * list that had drifted from the data: three entries matched no visible project
 * (so those filters returned nothing), while 22 technologies in use had no
 * filter at all.
 *
 * Exposed as a function rather than a const so it is read at render time. As a
 * module-level const it was frozen at import, which meant the development live
 * refresh could never update the filter pills.
 */
export const getTechSkills = () => getContent().technologies || [];
