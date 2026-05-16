import { defineType } from "sanity";
import { BarChartIcon } from "@sanity/icons";
import {
  orderAscOrdering,
  orderField,
  requiredStringField,
} from "../helpers/fields";
import { titleSubtitlePreview } from "../helpers/previews";

export const companyStat = defineType({
  name: "companyStat",
  title: "Company Stat",
  type: "document",
  icon: BarChartIcon,
  fields: [
    requiredStringField({
      name: "label",
      title: "Label",
      description: "E.g. 'Years of Experience'",
    }),
    requiredStringField({
      name: "value",
      title: "Value",
      description: "E.g. '15+', '500+'",
    }),
    orderField(),
  ],
  orderings: [orderAscOrdering()],
  preview: titleSubtitlePreview("label", "value"),
});
