import { defineType, defineField, defineArrayMember } from "sanity";
import { PinIcon } from "@sanity/icons";
import {
  orderAscOrdering,
  orderField,
  requiredStringField,
} from "../helpers/fields";

export const coverageArea = defineType({
  name: "coverageArea",
  title: "Coverage Area",
  type: "document",
  icon: PinIcon,
  fields: [
    requiredStringField({
      name: "state",
      title: "State",
    }),
    defineField({
      name: "cities",
      title: "Cities",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    orderField(),
  ],
  orderings: [orderAscOrdering()],
  preview: {
    select: { title: "state", cities: "cities" },
    prepare: ({ title, cities }) => ({
      title,
      subtitle: cities?.join(", "),
    }),
  },
});
