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
      name: "processSteps",
      title: "Buying Process Steps",
      type: "array",
      of: [defineArrayMember({ type: "processStep" })],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Buy Page" }),
  },
});
