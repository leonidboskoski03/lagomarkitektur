import { defineArrayMember, defineField, defineType } from "sanity";

const blockMembers = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "Heading", value: "h3" },
      { title: "Quote", value: "blockquote" },
    ],
    lists: [],
    marks: {
      decorators: [
        { title: "Strong", value: "strong" },
        { title: "Emphasis", value: "em" },
      ],
      annotations: [],
    },
  }),
];

export const localizedBlockContent = defineType({
  name: "localizedBlockContent",
  title: "Localized rich text",
  type: "object",
  fields: [
    defineField({
      name: "sv",
      title: "Swedish",
      type: "array",
      of: blockMembers,
      validation: (rule) => rule.required().min(1).error("Swedish text is required."),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: blockMembers,
      validation: (rule) => rule.required().min(1).error("English text is required."),
    }),
  ],
});
