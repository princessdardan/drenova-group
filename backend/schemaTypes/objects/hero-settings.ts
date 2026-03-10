import { defineType, defineField } from "sanity";

export const heroSettings = defineType({
  name: "heroSettings",
  title: "Hero Settings",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          validation: (rule) => rule.required(),
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "overline",
      title: "Overline",
      type: "string",
      description: "Small text above the title (e.g. 'Welcome to Drenova Group')",
    }),
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
