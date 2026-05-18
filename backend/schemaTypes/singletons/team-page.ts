import { defineType, defineField, defineArrayMember } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const teamPage = defineType({
  name: "teamPage",
  title: "Team Page",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "heroSettings",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "members",
      title: "Team Members",
      type: "array",
      of: [defineArrayMember({ type: "teamMember" })],
    }),
    defineField({
      name: "cta",
      title: "CTA Section",
      type: "ctaSettings",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Team Page" }),
  },
});
