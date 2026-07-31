import { defineField, defineType } from "sanity";

export const localizedString = defineType({
  name: "localizedString",
  title: "Localized text",
  type: "object",
  fields: [
    defineField({
      name: "sv",
      title: "Swedish",
      type: "string",
      validation: (rule) => rule.required().error("Swedish text is required."),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "string",
      validation: (rule) => rule.required().error("English text is required."),
    }),
  ],
  preview: {
    select: { title: "sv", subtitle: "en" },
  },
});
