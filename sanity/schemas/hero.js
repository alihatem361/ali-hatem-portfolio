export default {
  name: "hero",
  title: "Hero Section",
  type: "document",
  // Singleton — only one document of this type should exist.
  __experimental_actions: ["update", "publish"],
  fields: [
    // ─── Localized Name ───────────────────────────────────────────────────────
    {
      name: "name",
      title: "Full Name",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "string",
          validation: (R) => R.required(),
        },
        { name: "ar", title: "Arabic", type: "string" },
      ],
    },

    // ─── Localized Job Title ─────────────────────────────────────────────────
    {
      name: "jobTitle",
      title: "Job Title",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "string",
          validation: (R) => R.required(),
        },
        { name: "ar", title: "Arabic", type: "string" },
      ],
    },

    // ─── Localized Bio ───────────────────────────────────────────────────────
    {
      name: "bio",
      title: "Bio",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "text",
          rows: 6,
          validation: (R) => R.required(),
        },
        { name: "ar", title: "Arabic", type: "text", rows: 6 },
      ],
    },

    // ─── Hero Image ──────────────────────────────────────────────────────────
    {
      name: "heroImage",
      title: "Hero / Profile Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
    },

    // ─── CV File ────────────────────────────────────────────────────────────
    {
      name: "cvFile",
      title: "CV File (PDF)",
      type: "file",
      options: { accept: ".pdf" },
    },
  ],

  preview: {
    select: { title: "name.en", media: "heroImage" },
  },
};
