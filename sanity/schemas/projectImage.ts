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
      type: "localizedString",
      description: "Short description for accessibility. Example: Warm oak kitchen and dining area.",
      validation: (rule) => rule.required().error("Swedish and English alt text are required."),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "localizedString",
      description: "Optional caption shown only where the design needs it.",
    }),
  ],
  preview: {
    select: {
      title: "alt.sv",
      subtitle: "caption.sv",
      media: "asset",
    },
  },
});
