import { defineField, defineType } from "sanity";

export const localizedText = defineType({
  name: "localizedText",
  title: "Localized long text",
  type: "object",
  fields: [
    defineField({
      name: "sv",
      title: "Swedish",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().error("Swedish text is required."),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().error("English text is required."),
    }),
  ],
  preview: {
    select: { title: "sv", subtitle: "en" },
  },
});
