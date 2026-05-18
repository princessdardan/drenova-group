import { defineType } from "sanity";
import { StarIcon } from "@sanity/icons";
import { requiredStringField, requiredTextField } from "../helpers/fields";
import { titlePreview } from "../helpers/previews";

export const companyValue = defineType({
  name: "companyValue",
  title: "Company Value",
  type: "object",
  icon: StarIcon,
  fields: [
    requiredStringField({
      name: "title",
      title: "Title",
    }),
    requiredTextField({
      name: "description",
      title: "Description",
      rows: 3,
    }),
  ],
  preview: titlePreview(),
});
