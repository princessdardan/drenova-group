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
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
