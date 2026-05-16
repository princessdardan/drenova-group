import { defineType, defineField, defineArrayMember } from "sanity";
import { BasketIcon } from "@sanity/icons";
import {
  ctaField,
  heroField,
  requiredStringField,
  requiredTextField,
  sectionHeadingField,
} from "../helpers/fields";
import { fixedTitlePreview, titlePreview } from "../helpers/previews";

export const buyPage = defineType({
  name: "buyPage",
  title: "Buy Page",
  type: "document",
  icon: BasketIcon,
  fields: [
    heroField(),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
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
        }),
      ],
    }),
    sectionHeadingField("benefitsHeading", "Benefits Section Heading"),
    defineField({
      name: "processSteps",
      title: "Buying Process Steps",
      type: "array",
      of: [defineArrayMember({ type: "processStep" })],
    }),
    sectionHeadingField("processHeading", "Process Section Heading"),
    sectionHeadingField("coverageHeading", "Coverage Section Heading"),
    sectionHeadingField("faqHeading", "FAQ Section Heading"),
    ctaField(),
  ],
  preview: fixedTitlePreview("Buy Page"),
});
