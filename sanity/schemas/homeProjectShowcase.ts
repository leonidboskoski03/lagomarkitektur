import { defineArrayMember, defineField, defineType } from "sanity";

function hasDuplicateProjectReferences(value: unknown) {
  if (!Array.isArray(value)) return false;

  const references = value
    .map((item) => {
      if (!item || typeof item !== "object" || !("project" in item)) return undefined;
      const project = (item as { project?: { _ref?: string } }).project;
      return project?._ref;
    })
    .filter((reference): reference is string => Boolean(reference));

  return new Set(references).size !== references.length;
}

export const homeProjectShowcase = defineType({
  name: "homeProjectShowcase",
  title: "Homepage — Selected work",
  type: "document",
  groups: [
    { name: "intro", title: "Intro", default: true },
    { name: "projects", title: "Selected projects" },
  ],
  fields: [
    defineField({
      name: "introTitle",
      title: "Section title",
      type: "string",
      group: "intro",
      initialValue: "Selected work",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "introTags",
      title: "Left intro details",
      type: "array",
      group: "intro",
      description: "Displayed at the top left, separated by centered dots.",
      of: [defineArrayMember({ type: "string" })],
      initialValue: ["Lagom Arkitektur", "Selected work", "Spatial portfolio"],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      name: "introProperties",
      title: "Right intro details",
      type: "array",
      group: "intro",
      description: "Disciplines and year range displayed at the top right.",
      of: [defineArrayMember({ type: "string" })],
      initialValue: ["Architecture", "Interiors", "2022-2026"],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      name: "introBackground",
      title: "Intro background",
      type: "projectImage",
      group: "intro",
      description: "The full-screen image behind the 00 — Selected work frame.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projects",
      title: "Selected projects",
      type: "array",
      group: "projects",
      description:
        "Choose five published projects and drag them into the order in which they should appear.",
      of: [
        defineArrayMember({
          name: "showcaseProject",
          title: "Showcase project",
          type: "object",
          fields: [
            defineField({
              name: "project",
              title: "Project",
              type: "reference",
              to: [{ type: "project" }],
              options: {
                disableNew: true,
                filter: "isPublished != false",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "backgroundImage",
              title: "Background override",
              type: "projectImage",
              description:
                "Optional. When empty, the project's main image becomes the full-screen background.",
            }),
            defineField({
              name: "primaryImage",
              title: "First animated image",
              type: "projectImage",
              description: "The first image revealed by the clip-path animation.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "secondaryImage",
              title: "Second animated image",
              type: "projectImage",
              description: "The second image revealed behind the first image.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "project.title",
              subtitle: "project.location",
              media: "primaryImage",
            },
            prepare: ({ title, subtitle, media }) => ({
              title: title || "Choose a project",
              subtitle: subtitle || "Selected work",
              media,
            }),
          },
        }),
      ],
      validation: (rule) =>
        rule
          .required()
          .length(5)
          .custom((value) =>
            hasDuplicateProjectReferences(value)
              ? "Each project can appear only once."
              : true,
          ),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Homepage — Selected work",
      subtitle: "Five ordered projects",
    }),
  },
});
