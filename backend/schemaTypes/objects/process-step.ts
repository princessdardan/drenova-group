import { defineType, defineField } from "sanity";

export const processStep = defineType({
  name: "processStep",
  title: "Process Step",
  type: "object",
  fields: [
    defineField({
      name: "stepNumber",
      title: "Step Number",
      type: "string",
      description: "Display number (e.g. '01', '02')",
      validation: (rule) => rule.required(),
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
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "stepNumber" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? `Step ${subtitle}` : undefined,
    }),
  },
});
