import { defineType, defineField } from "sanity";
import { safeHrefValidation } from "../helpers/home-page-fields";

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
    defineField({
      name: "primaryButtonText",
      title: "Primary Button Text",
      type: "string",
    }),
    defineField({
      name: "primaryButtonHref",
      title: "Primary Button Link",
      type: "string",
      validation: safeHrefValidation,
    }),
    defineField({
      name: "secondaryButtonText",
      title: "Secondary Button Text",
      type: "string",
      description: "Optional secondary CTA (e.g. 'Talk to an Agent')",
    }),
    defineField({
      name: "secondaryButtonHref",
      title: "Secondary Button Link",
      type: "string",
      validation: safeHrefValidation,
    }),
  ],
});
