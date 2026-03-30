import { defineType, defineField } from "sanity";
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
      name: "aboutSection",
      title: "About Section",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 4,
        }),
        defineField({
          name: "buttonText",
          title: "Button Text",
          type: "string",
          initialValue: "Learn More",
        }),
        defineField({
          name: "buttonHref",
          title: "Button Link",
          type: "string",
          initialValue: "/about",
        }),
        defineField({
          name: "image",
          title: "Portrait Photo",
          type: "image",
          options: { hotspot: true },
          description:
            "Portrait photo of the agent/team for the about section.",
          fields: [
            { name: "alt", type: "string", title: "Alt Text" },
          ],
        }),
      ],
    }),
    defineField({
      name: "workWithUsHeading",
      title: "Work With Us Heading",
      type: "string",
      initialValue: "Work With Us",
    }),
    defineField({
      name: "ctaCard1",
      title: "CTA Card 1 (Selling)",
      type: "object",
      fields: [
        defineField({
          name: "image",
          title: "Card Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt Text" },
          ],
        }),
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "The best selling experience",
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "ctaCard2",
      title: "CTA Card 2 (Buying)",
      type: "object",
      fields: [
        defineField({
          name: "image",
          title: "Card Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt Text" },
          ],
        }),
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "An unparalleled buying experience",
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "contactForm",
      title: "Contact Form Section",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          initialValue: "Start Your Home Journey Today",
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "text",
          rows: 3,
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
