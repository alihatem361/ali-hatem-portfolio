import {CogIcon} from '@sanity/icons/Cog'
import {RocketIcon} from '@sanity/icons/Rocket'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'

const SINGLETON_TYPES = ['siteSettings']

export const structure = (S) =>
  S.list()
    .title('Portfolio')
    .items([
      // Singleton: one fixed document, no "create new" affordance.
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site settings'),
        ),

      S.divider(),

      S.listItem()
        .title('Projects')
        .icon(RocketIcon)
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .defaultOrdering([{field: 'order', direction: 'asc'}]),
        ),

      S.listItem()
        .title('Social links')
        .icon(EarthGlobeIcon)
        .child(
          S.documentTypeList('social')
            .title('Social links')
            .defaultOrdering([{field: 'order', direction: 'asc'}]),
        ),
    ])

/** Singletons must not be creatable or deletable from the Studio. */
export const isSingleton = (schemaType) => SINGLETON_TYPES.includes(schemaType)
