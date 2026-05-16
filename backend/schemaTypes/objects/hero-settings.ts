import { defineType, defineField } from "sanity";
import {
  imageWithAltField,
  requiredStringField,
  stringField,
  textField,
} from "../helpers/fields";

export const heroSettings = defineType({
  name: "heroSettings",
  title: "Hero Settings",
  type: "object",
  fields: [
    imageWithAltField({
      name: "image",
      title: "Background Image",
      required: true,
      altRequired: true,
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
    stringField({
      name: "overline",
      title: "Overline",
      description: "Small text above the title (e.g. 'Welcome to Drenova Group')",
    }),
    requiredStringField({
      name: "title",
      title: "Title",
    }),
    textField({
      name: "subtitle",
      title: "Subtitle",
      rows: 3,
    }),
    stringField({
      name: "buttonText",
      title: "Primary Button Text",
      description: "Label for the primary call-to-action button",
    }),
    stringField({
      name: "buttonHref",
      title: "Primary Button Link",
      description: "URL or path the primary button links to (e.g. /contact)",
    }),
    stringField({
      name: "secondaryButtonText",
      title: "Secondary Button Text",
      description: "Optional label for a secondary CTA button (e.g. 'View Listings')",
    }),
    stringField({
      name: "secondaryButtonHref",
      title: "Secondary Button Link",
      description: "URL or path the secondary button links to (e.g. /listings)",
    }),
  ],
});
