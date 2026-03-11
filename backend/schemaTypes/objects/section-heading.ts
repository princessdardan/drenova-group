import { defineType, defineField } from "sanity";

export const sectionHeading = defineType({
  name: "sectionHeading",
  title: "Section Heading",
  type: "object",
  fields: [
    defineField({
      name: "overline",
      title: "Overline",
      type: "string",
      description: "Small text above the title (e.g. 'Featured Properties')",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
  ],
});
