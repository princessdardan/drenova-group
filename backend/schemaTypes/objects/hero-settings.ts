import { defineType, defineField } from "sanity";

export const heroSettings = defineType({
  name: "heroSettings",
  title: "Hero Settings",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          validation: (rule) => rule.required(),
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "backgroundType",
      title: "Background Type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "image",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description:
        "Direct URL to an MP4 video file. The image above serves as the poster/fallback frame.",
      hidden: ({ parent }) => parent?.backgroundType !== "video",
    }),
    defineField({
      name: "overline",
      title: "Overline",
      type: "string",
      description: "Small text above the title (e.g. 'Welcome to Drenova Group')",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      description: "Label for the hero call-to-action button",
    }),
    defineField({
      name: "buttonHref",
      title: "Button Link",
      type: "string",
      description: "URL or path the hero button links to (e.g. /contact)",
    }),
  ],
});
