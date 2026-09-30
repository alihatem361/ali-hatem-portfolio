import {defineType, defineField, defineArrayMember} from 'sanity'
import {RocketIcon} from '@sanity/icons/Rocket'

const isNotMobile = ({document}) => document?.projectType !== 'mobile'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: RocketIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'links', title: 'Links'},
    {name: 'settings', title: 'Settings'},
    {name: 'mobile', title: 'Mobile app'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      group: 'content',
      validation: (rule) =>
        rule.required().custom((value) =>
          value?.en ? true : 'An English title is required — it is the canonical name.',
        ),
    }),

    /**
     * Language-neutral. The site used to derive slugs from the title at render
     * time, which gave the same project a different URL per language. This is
     * the single URL for both.
     */
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'The project URL: /project/<slug>. Changing this breaks existing links.',
      options: {
        source: (doc) => doc?.title?.en || '',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
      group: 'content',
    }),

    defineField({
      name: 'technology',
      title: 'Technologies',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      description: 'Also drives the filter pills on the projects page.',
      validation: (rule) => rule.unique(),
    }),

    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'videoUrl',
      title: 'YouTube URL',
      type: 'url',
      group: 'media',
      description: 'Full watch or youtu.be link. The embed ID is derived automatically.',
    }),

    defineField({
      name: 'loomVideo',
      title: 'Loom share URL',
      type: 'url',
      group: 'media',
    }),

    defineField({
      name: 'demo',
      title: 'Live demo URL',
      type: 'url',
      group: 'links',
    }),

    defineField({
      name: 'github',
      title: 'GitHub URL',
      type: 'url',
      group: 'links',
    }),

    defineField({
      name: 'codeStatus',
      title: 'Source code',
      type: 'string',
      group: 'links',
      options: {
        list: [
          {title: 'Public', value: 'public'},
          {title: 'Private', value: 'private'},
        ],
        layout: 'radio',
      },
      initialValue: 'public',
      description: 'Private hides the GitHub link behind a lock on the project page.',
    }),

    defineField({
      name: 'isVisible',
      title: 'Visible on the site',
      type: 'boolean',
      group: 'settings',
      initialValue: true,
      description: 'Hidden projects stay reachable by direct URL but are not listed.',
    }),

    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'settings',
      description: 'Lower numbers appear first.',
      validation: (rule) => rule.required().integer(),
    }),

    defineField({
      name: 'projectType',
      title: 'Project type',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          {title: 'Web', value: 'web'},
          {title: 'Mobile app', value: 'mobile'},
        ],
        layout: 'radio',
      },
      initialValue: 'web',
    }),

    /**
     * Collection membership is matched by hardcoded project *titles* in the app
     * today, so renaming a project here would silently drop it from its
     * collection. This makes membership explicit and rename-proof.
     */
    defineField({
      name: 'collectionId',
      title: 'Collection',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          {title: 'None', value: ''},
          {title: 'Teachers', value: 'teachers-collection'},
          {title: 'MPs', value: 'mps-collection'},
          {title: 'E3mel landing pages', value: 'e3mel-landing-collection'},
        ],
      },
    }),

    // --- Mobile-app only -------------------------------------------------
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'localeString',
      group: 'mobile',
      hidden: isNotMobile,
    }),

    defineField({
      name: 'platform',
      title: 'Platforms',
      type: 'array',
      group: 'mobile',
      hidden: isNotMobile,
      of: [defineArrayMember({type: 'string'})],
      options: {
        layout: 'tags',
        list: [
          {title: 'iOS', value: 'iOS'},
          {title: 'Android', value: 'Android'},
        ],
      },
    }),

    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'mobile',
      hidden: isNotMobile,
      of: [defineArrayMember({type: 'image', options: {hotspot: true}})],
    }),

    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      group: 'mobile',
      hidden: isNotMobile,
      of: [defineArrayMember({type: 'projectFeature'})],
    }),
  ],

  orderings: [
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Title (A–Z)',
      name: 'titleAsc',
      by: [{field: 'title.en', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title: 'title.en',
      slug: 'slug.current',
      media: 'mainImage',
      isVisible: 'isVisible',
      order: 'order',
    },
    prepare({title, slug, media, isVisible, order}) {
      return {
        title: title || '(untitled)',
        subtitle: `${order ?? '—'} · /${slug || '?'}${isVisible === false ? ' · hidden' : ''}`,
        media,
      }
    },
  },
})
