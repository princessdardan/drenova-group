import { defineType, defineField, defineArrayMember } from "sanity";
import { BasketIcon } from "@sanity/icons";

export const buyPage = defineType({
  name: "buyPage",
  title: "Buy Page",
  type: "document",
  icon: BasketIcon,
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
      title: "Buying Process Steps",
      type: "array",
      of: [defineArrayMember({ type: "processStep" })],
    }),
    defineField({
      name: "processHeading",
      title: "Process Section Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "coverageHeading",
      title: "Coverage Section Heading",
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
    prepare: () => ({ title: "Buy Page" }),
  },
});
