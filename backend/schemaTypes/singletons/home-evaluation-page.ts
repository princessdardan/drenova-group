import { defineType, defineField } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const homeEvaluationPage = defineType({
  name: "homeEvaluationPage",
  title: "Home Evaluation Page",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "heroSettings",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "formHeading",
      title: "Form Section Heading",
      type: "string",
      description: "Heading shown above the form",
    }),
    defineField({
      name: "formDescription",
      title: "Form Section Description",
      type: "text",
      rows: 4,
      description: "Paragraph(s) describing the home evaluation process",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Evaluation Page" }),
  },
});
