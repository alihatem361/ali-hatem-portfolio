import {defineType, defineField} from 'sanity'

/**
 * A short piece of text in both site languages.
 *
 * English is the canonical value: the site falls back to it when an Arabic
 * translation is missing, and project slugs are derived from it.
 */
export const localeString = defineType({
  name: 'localeString',
  title: 'Localized string',
  type: 'object',
  options: {columns: 2},
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
    }),
    defineField({
      name: 'ar',
      title: 'العربية',
      type: 'string',
    }),
  ],
})
