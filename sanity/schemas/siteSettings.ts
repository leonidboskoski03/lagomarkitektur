import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "contact", title: "Contact" },
    { name: "social", title: "Social links" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      group: "general",
      initialValue: "Lagom Arkitektur",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short studio description",
      type: "localizedText",
      group: "general",
      description: "Used in general site metadata and fallback descriptions.",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email().warning("Use a valid email address."),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "localizedText",
      group: "contact",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "seoTitle",
      title: "Default SEO title",
      type: "localizedString",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "Default SEO description",
      type: "localizedText",
      group: "seo",
    }),
    defineField({
      name: "shareImage",
      title: "Default social share image",
      type: "projectImage",
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
