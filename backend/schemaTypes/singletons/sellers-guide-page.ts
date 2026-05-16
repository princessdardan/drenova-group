import { defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";
import {
  ctaField,
  heroField,
  imageWithAltField,
  stringField,
  textField,
} from "../helpers/fields";
import { fixedTitlePreview } from "../helpers/previews";

export const sellersGuidePage = defineType({
  name: "sellersGuidePage",
  title: "Sellers Guide Page",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    heroField(),
    stringField({
      name: "guideTitle",
      title: "Guide Section Title",
      description: "Heading shown above the form (e.g. \"Your Guide to Sold\")",
    }),
    textField({
      name: "guideDescription",
      title: "Guide Description",
      rows: 4,
      description: "Paragraph(s) describing what the guide covers",
    }),
    imageWithAltField({
      name: "guideImage",
      title: "Guide Book Image",
      description: "Book mockup image shown beside the form",
    }),
    ctaField(),
  ],
  preview: fixedTitlePreview("Sellers Guide Page"),
});
