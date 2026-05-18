import { defineType, defineField } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "object",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Headshot",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Biography",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image" },
  },
});
