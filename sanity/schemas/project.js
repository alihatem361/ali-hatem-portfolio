export default {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    // ─── Localized Title ─────────────────────────────────────────────────────
    {
      name: "title",
      title: "Title",
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

    // ─── Localized Description ───────────────────────────────────────────────
    {
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "text",
          rows: 5,
          validation: (R) => R.required(),
        },
        { name: "ar", title: "Arabic", type: "text", rows: 5 },
      ],
    },

    // ─── Main Image ──────────────────────────────────────────────────────────
    {
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
    },

    // ─── Screenshots Gallery ─────────────────────────────────────────────────
    {
      name: "screenshots",
      title: "Screenshots",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alt text", type: "string" }],
        },
      ],
    },

    // ─── Technologies ─────────────────────────────────────────────────────────
    {
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: ".NET", value: ".NET" },
          { title: "Audio Service", value: "Audio Service" },
          { title: "Bloc", value: "Bloc" },
          { title: "Chat GPT", value: "Chat GPT" },
          { title: "Chatbot", value: "Chatbot" },
          { title: "Dart", value: "Dart" },
          { title: "Dio", value: "Dio" },
          { title: "Firebase", value: "Firebase" },
          { title: "Firebase Auth", value: "Firebase Auth" },
          { title: "Firebase Core", value: "Firebase Core" },
          { title: "Firebase Firestore", value: "Firebase Firestore" },
          { title: "Firebase Messaging", value: "Firebase Messaging" },
          { title: "Firebase Storage", value: "Firebase Storage" },
          { title: "Flutter", value: "Flutter" },
          { title: "Google Geocoding", value: "Google Geocoding" },
          { title: "Google Maps", value: "Google Maps" },
          { title: "Google Places", value: "Google Places" },
          { title: "Hive", value: "Hive" },
          { title: "Just Audio", value: "Just Audio" },
          { title: "Laravel", value: "Laravel" },
          { title: "Local Notifications", value: "Local Notifications" },
          { title: "Movie APIs", value: "Movie APIs" },
          { title: "Paymob", value: "Paymob" },
          { title: "Python", value: "Python" },
          { title: "QR Code", value: "QR Code" },
          { title: "REST APIs", value: "REST APIs" },
          { title: "SQLite", value: "SQLite" },
          { title: "Shared Preferences", value: "Shared Preferences" },
          { title: "UI/UX", value: "UI/UX" },
          { title: "Video Player", value: "Video Player" },
          { title: "WebSocket", value: "WebSocket" },
          { title: "WebView", value: "WebView" },
          { title: "YouTube Player Flutter", value: "YouTube Player Flutter" },
        ],
      },
    },

    // ─── Code Status ─────────────────────────────────────────────────────────
    {
      name: "codeStatus",
      title: "Code Status",
      type: "string",
      options: {
        list: [
          { title: "Public", value: "PUBLIC" },
          { title: "Private", value: "PRIVATE" },
        ],
        layout: "radio",
      },
      initialValue: "PUBLIC",
    },

    // ─── Links ───────────────────────────────────────────────────────────────
    {
      name: "googlePlayLink",
      title: "Google Play Link",
      type: "url",
    },
    {
      name: "appStoreLink",
      title: "App Store Link",
      type: "url",
    },
    {
      name: "githubLink",
      title: "GitHub Link",
      type: "url",
    },
    {
      name: "demoLink",
      title: "Live Demo Link",
      type: "url",
    },
    {
      name: "videoUrl",
      title: "Demo Video URL (YouTube / Loom)",
      type: "url",
    },

    // ─── Project Type ────────────────────────────────────────────────────────
    {
      name: "projectType",
      title: "Project Type",
      type: "string",
      options: {
        list: [
          { title: "Freelance", value: "Freelance" },
          { title: "Company", value: "Company" },
          { title: "Personal", value: "Personal" },
        ],
        layout: "radio",
      },
    },

    // ─── Dates ───────────────────────────────────────────────────────────────
    {
      name: "startDate",
      title: "Start Date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
    },
    {
      name: "endDate",
      title: "End Date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
    },

    // ─── Visibility ──────────────────────────────────────────────────────────
    {
      name: "isVisible",
      title: "Visible on Website",
      type: "boolean",
      initialValue: true,
    },

    // ─── Order ───────────────────────────────────────────────────────────────
    {
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first.",
    },
  ],

  preview: {
    select: {
      title: "title.en",
      media: "mainImage",
      subtitle: "projectType",
    },
  },
};
