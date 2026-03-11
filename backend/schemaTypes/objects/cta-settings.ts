import { defineType, defineField } from "sanity";

export const ctaSettings = defineType({
  name: "ctaSettings",
  title: "CTA Settings",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 3,
    }),
  ],
});
