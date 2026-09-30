import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  /** Deployed at https://ali-hatem-portfolio.sanity.studio */
  studioHost: "ali-hatem-portfolio",
  deployment: {
    /** Studio dependencies update without a redeploy. */
    autoUpdates: true,
  },
})
