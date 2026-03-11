import { defineType, defineField, defineArrayMember } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "heroSettings",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featuredListings",
      title: "Featured Listings",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "listing" }],
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "featuredListingsHeading",
      title: "Featured Listings Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "aboutSectionOverline",
      title: "About Section Overline",
      type: "string",
    }),
    defineField({
      name: "aboutSectionTitle",
      title: "About Section Title",
      type: "string",
    }),
    defineField({
      name: "aboutSectionContent",
      title: "About Section Content",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "aboutSectionImage",
      title: "About Section Image",
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
      name: "valuePropsHeading",
      title: "Value Propositions Heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "cta",
      title: "CTA Section",
      type: "ctaSettings",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
