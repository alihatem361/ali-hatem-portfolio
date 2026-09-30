import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure, isSingleton} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

if (!projectId) {
  throw new Error(
    'SANITY_STUDIO_PROJECT_ID is not set. Copy studio/.env.example to studio/.env and fill it in.',
  )
}

export default defineConfig({
  name: 'default',
  title: 'Ali Hatem Portfolio',
  projectId,
  dataset,

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // Keep singletons out of the global "create new document" menu.
    templates: (prev) => prev.filter(({schemaType}) => !isSingleton(schemaType)),
  },

  document: {
    actions: (prev, {schemaType}) =>
      isSingleton(schemaType)
        ? prev.filter(({action}) => action !== 'duplicate' && action !== 'delete')
        : prev,
  },
})
