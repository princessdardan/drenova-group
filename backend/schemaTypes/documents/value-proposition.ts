import { defineType } from "sanity";
import { BulbOutlineIcon } from "@sanity/icons";
import {
  orderAscOrdering,
  orderField,
  requiredStringField,
  requiredTextField,
} from "../helpers/fields";
import { titlePreview } from "../helpers/previews";

export const valueProposition = defineType({
  name: "valueProposition",
  title: "Value Proposition",
  type: "document",
  icon: BulbOutlineIcon,
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
