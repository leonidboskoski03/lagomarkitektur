import { defineField, defineType } from "sanity";

export const projectImage = defineType({
  name: "projectImage",
  title: "Project image",
  type: "image",
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Short description for accessibility. Example: Warm oak kitchen and dining area.",
      validation: (rule) => rule.required().warning("Alt text helps the website stay accessible."),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional caption shown only where the design needs it.",
    }),
  ],
  preview: {
    select: {
      title: "alt",
      subtitle: "caption",
      media: "asset",
    },
  },
});
