import { defineType } from "sanity";
import { StarIcon } from "@sanity/icons";
import {
  orderAscOrdering,
  orderField,
  requiredStringField,
  requiredTextField,
} from "../helpers/fields";
import { titlePreview } from "../helpers/previews";

export const companyValue = defineType({
  name: "companyValue",
  title: "Company Value",
  type: "document",
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
    orderField(),
  ],
  orderings: [orderAscOrdering()],
  preview: titlePreview(),
});
