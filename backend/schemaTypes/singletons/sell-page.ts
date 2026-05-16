import { defineType, defineField, defineArrayMember } from "sanity";
import { TagIcon } from "@sanity/icons";
import {
  ctaField,
  heroField,
  requiredStringField,
  requiredTextField,
  sectionHeadingField,
} from "../helpers/fields";
import { fixedTitlePreview, titlePreview } from "../helpers/previews";

export const sellPage = defineType({
  name: "sellPage",
  title: "Sell Page",
  type: "document",
  icon: TagIcon,
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
      title: "Selling Process Steps",
      type: "array",
      of: [defineArrayMember({ type: "processStep" })],
    }),
    sectionHeadingField("processHeading", "Process Section Heading"),
    defineField({
      name: "valuation",
      title: "Valuation Section",
      type: "valuationSection",
    }),
    sectionHeadingField("storiesHeading", "Success Stories Heading"),
    sectionHeadingField("faqHeading", "FAQ Section Heading"),
    ctaField(),
  ],
  preview: fixedTitlePreview("Sell Page"),
});
