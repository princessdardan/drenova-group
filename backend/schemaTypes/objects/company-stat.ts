import { defineType } from "sanity";
import { BarChartIcon } from "@sanity/icons";
import { requiredStringField } from "../helpers/fields";
import { titleSubtitlePreview } from "../helpers/previews";

export const companyStat = defineType({
  name: "companyStat",
  title: "Company Stat",
  type: "object",
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
  ],
  preview: titleSubtitlePreview("label", "value"),
});
