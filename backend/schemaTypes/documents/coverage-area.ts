import { defineType, defineField, defineArrayMember } from "sanity";
import { PinIcon } from "@sanity/icons";

export const coverageArea = defineType({
  name: "coverageArea",
  title: "Coverage Area",
  type: "document",
  icon: PinIcon,
  fields: [
    defineField({
      name: "state",
      title: "State",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cities",
      title: "Cities",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "state", cities: "cities" },
    prepare: ({ title, cities }) => ({
      title,
      subtitle: cities?.join(", "),
    }),
  },
});
