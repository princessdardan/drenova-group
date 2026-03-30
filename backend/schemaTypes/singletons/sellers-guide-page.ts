import { defineType, defineField } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const sellersGuidePage = defineType({
  name: "sellersGuidePage",
  title: "Sellers Guide Page",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "heroSettings",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "guideTitle",
      title: "Guide Section Title",
      type: "string",
      description: "Heading shown above the form (e.g. \"Your Guide to Sold\")",
    }),
    defineField({
      name: "guideDescription",
      title: "Guide Description",
      type: "text",
      rows: 4,
      description: "Paragraph(s) describing what the guide covers",
    }),
    defineField({
      name: "guideImage",
      title: "Guide Book Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
      description: "Book mockup image shown beside the form",
    }),
    defineField({
      name: "cta",
      title: "CTA Section",
      type: "ctaSettings",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Sellers Guide Page" }),
  },
});
