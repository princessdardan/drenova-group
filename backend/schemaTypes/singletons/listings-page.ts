import { defineType, defineField, defineArrayMember } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const listingsPage = defineType({
  name: "listingsPage",
  title: "Listings Page",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "overline",
      title: "Overline",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "featuredListingKeys",
      title: "Featured Listing Keys",
      description:
        "AMPRE listing keys to pin at the top of the page. These listings must exist in the daily AMPRE sync.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Listings Page" }),
  },
});
