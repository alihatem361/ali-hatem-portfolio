import {defineType, defineField} from 'sanity'

/**
 * A multi-line piece of text in both site languages.
 * English is the canonical value — see localeString.
 */
export const localeText = defineType({
  name: 'localeText',
  title: 'Localized text',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'ar',
      title: 'العربية',
      type: 'text',
      rows: 6,
    }),
  ],
})
