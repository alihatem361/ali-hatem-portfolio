import {defineType, defineField} from 'sanity'
import {StarIcon} from '@sanity/icons/Star'

/**
 * A highlighted capability shown on mobile-app project pages.
 * `icon` maps to FEATURE_ICON_MAP in src/pages/MobileProjectDetails.jsx —
 * adding a value here needs a matching entry there.
 */
export const projectFeature = defineType({
  name: 'projectFeature',
  title: 'Feature',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      description: 'Stable identifier, e.g. "auth", "payments".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          {title: 'Shield', value: 'shield'},
          {title: 'Card', value: 'card'},
          {title: 'Wrench', value: 'wrench'},
          {title: 'Bell', value: 'bell'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'title', title: 'Title', type: 'localeString'}),
    defineField({name: 'description', title: 'Description', type: 'localeText'}),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {title: 'title.en', subtitle: 'key', media: 'image'},
  },
})
