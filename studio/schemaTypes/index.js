import {localeString} from './objects/localeString'
import {localeText} from './objects/localeText'
import {projectFeature} from './objects/projectFeature'
import {project} from './documents/project'
import {social} from './documents/social'
import {siteSettings} from './singletons/siteSettings'

export const schemaTypes = [
  // objects
  localeString,
  localeText,
  projectFeature,
  // documents
  project,
  social,
  siteSettings,
]
