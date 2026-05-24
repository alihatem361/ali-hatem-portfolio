import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { translateWithGemini } from "./sanity/actions/translateWithGemini";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "ali-hatem-portfolio",
  title: "Ali Hatem Portfolio",

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singleton: Hero
            S.listItem()
              .title("Hero Section")
              .id("hero")
              .child(
                S.document().schemaType("hero").documentId("hero-singleton"),
              ),
            S.divider(),
            // List: Projects
            S.documentTypeListItem("project").title("Projects"),
            // List: Social Links
            S.documentTypeListItem("social").title("Social Media Links"),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  // Attach the Gemini translation action to project and hero documents
  document: {
    actions: (prev, context) => {
      if (["project", "hero"].includes(context.schemaType)) {
        return [...prev, translateWithGemini];
      }
      return prev;
    },
  },
});
