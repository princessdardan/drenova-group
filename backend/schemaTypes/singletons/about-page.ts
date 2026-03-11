import { defineType, defineField } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
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
      name: "storyContent",
      title: "Our Story",
      type: "blockContent",
    }),
    defineField({
      name: "storyOverline",
      title: "Story Section Overline",
      type: "string",
    }),
    defineField({
      name: "storyTitle",
      title: "Story Section Title",
      type: "string",
    }),
    defineField({
      name: "storyImage",
      title: "Story Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
        },
      ],
    }),
    defineField({
      name: "valuesHeading",
      title: "Values Section Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "coverageHeading",
      title: "Coverage Section Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "cta",
      title: "CTA Section",
      type: "ctaSettings",
    }),
  ],
  preview: {
    prepare: () => ({ title: "About Page" }),
  },
});
