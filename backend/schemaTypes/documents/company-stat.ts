import { defineType, defineField } from "sanity";
import { BarChartIcon } from "@sanity/icons";

export const companyStat = defineType({
  name: "companyStat",
  title: "Company Stat",
  type: "document",
  icon: BarChartIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "E.g. 'Years of Experience'",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      description: "E.g. '15+', '500+'",
      validation: (rule) => rule.required(),
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
    select: { title: "label", subtitle: "value" },
  },
});
