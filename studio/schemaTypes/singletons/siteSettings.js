import {defineType, defineField, defineArrayMember} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

/**
 * Singleton — one document, pinned in the Studio structure with a fixed _id.
 * Replaces the `aboutme` block that lived inside projects.json.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'media', title: 'Media'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'localeString',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'bio',
      title: 'Bio paragraphs',
      type: 'array',
      group: 'hero',
      of: [defineArrayMember({type: 'localeText'})],
      description: 'The hero shows the first paragraph. Others are kept for future use.',
    }),

    /**
     * The rotating typewriter strings in the hero, previously hardcoded in
     * src/components/header/HeaderBio.jsx.
     */
    defineField({
      name: 'roles',
      title: 'Rotating roles',
      type: 'array',
      group: 'hero',
      of: [defineArrayMember({type: 'localeString'})],
      description: 'Cycled by the typewriter effect under your name.',
    }),

    defineField({
      name: 'headerImage',
      title: 'Header image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
    }),

    defineField({
      name: 'footerImage',
      title: 'Footer image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
    }),

    defineField({
      name: 'cvUrl',
      title: 'CV link',
      type: 'url',
      group: 'media',
      description: 'External CV link. The in-app CV is generated from code, not this.',
    }),
  ],

  preview: {
    select: {title: 'name.en', media: 'headerImage'},
    prepare({title, media}) {
      return {title: 'Site settings', subtitle: title || '', media}
    },
  },
})
