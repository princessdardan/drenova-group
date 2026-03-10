import { defineType, defineField } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const listing = defineType({
  name: "listing",
  title: "Listing",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Internal title for the listing (e.g. '123 Maple Drive')",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "address",
      title: "Street Address",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "zip",
      title: "ZIP Code",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "beds",
      title: "Bedrooms",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "baths",
      title: "Bathrooms",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "sqft",
      title: "Square Feet",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "image",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "Active" },
          { title: "Pending", value: "Pending" },
          { title: "Sold", value: "Sold" },
        ],
        layout: "radio",
      },
      initialValue: "Active",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "propertyType",
      title: "Property Type",
      type: "string",
      options: {
        list: [
          { title: "Single Family", value: "Single Family" },
          { title: "Condo", value: "Condo" },
          { title: "Townhouse", value: "Townhouse" },
          { title: "Multi-Family", value: "Multi-Family" },
          { title: "Land", value: "Land" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "address", subtitle: "city", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle,
      media,
    }),
  },
});
