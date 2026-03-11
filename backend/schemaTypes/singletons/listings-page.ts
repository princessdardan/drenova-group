import { defineType, defineField } from "sanity";
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
  ],
  preview: {
    prepare: () => ({ title: "Listings Page" }),
  },
});
