import { defineType, defineField, defineArrayMember } from "sanity";
import { TagIcon } from "@sanity/icons";

export const sellPage = defineType({
  name: "sellPage",
  title: "Sell Page",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "heroSettings",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
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
            select: { title: "title" },
          },
        }),
      ],
    }),
    defineField({
      name: "benefitsHeading",
      title: "Benefits Section Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "processSteps",
      title: "Selling Process Steps",
      type: "array",
      of: [defineArrayMember({ type: "processStep" })],
    }),
    defineField({
      name: "processHeading",
      title: "Process Section Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "valuation",
      title: "Valuation Section",
      type: "valuationSection",
    }),
    defineField({
      name: "storiesHeading",
      title: "Success Stories Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "faqHeading",
      title: "FAQ Section Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "cta",
      title: "CTA Section",
      type: "ctaSettings",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Sell Page" }),
  },
});
