export default {
  name: "social",
  title: "Social Media Link",
  type: "document",
  fields: [
    {
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "LinkedIn", value: "LinkedIn" },
          { title: "GitHub", value: "GitHub" },
          { title: "WhatsApp", value: "WhatsApp" },
          { title: "Twitter / X", value: "Twitter" },
          { title: "Instagram", value: "Instagram" },
          { title: "YouTube", value: "YouTube" },
          { title: "Email", value: "Email" },
          { title: "Other", value: "Other" },
        ],
      },
      validation: (R) => R.required(),
    },
    {
      name: "url",
      title: "URL",
      type: "url",
      validation: (R) =>
        R.uri({ scheme: ["http", "https", "mailto", "tel"] }).required(),
    },
    {
      name: "icon",
      title: "Custom Icon (optional)",
      type: "image",
      description:
        "Leave empty to use the default platform icon from react-icons.",
    },
    {
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first.",
    },
  ],

  preview: {
    select: { title: "platform", subtitle: "url" },
  },
};
