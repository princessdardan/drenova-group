import { defineType, defineField, defineArrayMember } from "sanity";
import { HomeIcon } from "@sanity/icons";
import { heroField, imageWithAltField } from "../helpers/fields";
import { fixedTitlePreview } from "../helpers/previews";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  fields: [
    heroField(),
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
        imageWithAltField({
          name: "image",
          title: "Portrait Photo",
          description:
            "Portrait photo of the agent/team for the about section.",
        }),
      ],
    }),
    defineField({
      name: "valuePropositions",
      title: "Value Propositions",
      type: "array",
      of: [defineArrayMember({ type: "valueProposition" })],
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
        imageWithAltField({
          name: "image",
          title: "Card Image",
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
        defineField({
          name: "buttonText",
          title: "Button Text",
          type: "string",
          initialValue: "Get Started",
        }),
        defineField({
          name: "buttonHref",
          title: "Button Link",
          type: "string",
          initialValue: "#contact",
        }),
      ],
    }),
    defineField({
      name: "ctaCard2",
      title: "CTA Card 2 (Buying)",
      type: "object",
      fields: [
        imageWithAltField({
          name: "image",
          title: "Card Image",
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
        defineField({
          name: "buttonText",
          title: "Button Text",
          type: "string",
          initialValue: "Get Started",
        }),
        defineField({
          name: "buttonHref",
          title: "Button Link",
          type: "string",
          initialValue: "#contact",
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
  preview: fixedTitlePreview("Home Page"),
});
