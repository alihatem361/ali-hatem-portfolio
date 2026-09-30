import {defineType, defineField} from 'sanity'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'

export const social = defineType({
  name: 'social',
  title: 'Social link',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    /**
     * Drives the icon lookup in src/components/SocialMedia/index.jsx.
     * Adding a value here needs a matching entry in that component's icon map.
     */
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          {title: 'LinkedIn', value: 'linkedin'},
          {title: 'GitHub', value: 'github'},
          {title: 'WhatsApp', value: 'whatsapp'},
          {title: 'Email', value: 'email'},
          {title: 'Twitter / X', value: 'twitter'},
          {title: 'YouTube', value: 'youtube'},
          {title: 'Facebook', value: 'facebook'},
          {title: 'Instagram', value: 'instagram'},
          {title: 'Phone', value: 'phone'},
        ],
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'name',
      title: 'Label',
      type: 'localeString',
      description: 'Accessible label, e.g. "LinkedIn" / "لينكد إن".',
    }),

    /**
     * Deliberately a string, not a url: the phone entry stores a bare
     * "+201026159353" and mailto:/wa.me links are also stored here.
     */
    defineField({
      name: 'url',
      title: 'Link',
      type: 'string',
      description: 'Full URL, or mailto:/tel: value. Phone may be a bare number.',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (rule) => rule.required().integer(),
    }),

    defineField({
      name: 'isVisible',
      title: 'Visible',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  orderings: [
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],

  preview: {
    select: {title: 'platform', subtitle: 'url', isVisible: 'isVisible'},
    prepare({title, subtitle, isVisible}) {
      return {
        title: title || '(no platform)',
        subtitle: `${subtitle || ''}${isVisible === false ? ' · hidden' : ''}`,
      }
    },
  },
})
