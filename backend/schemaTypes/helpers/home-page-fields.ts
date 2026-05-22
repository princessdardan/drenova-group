import { defineArrayMember, defineField, type StringRule } from "sanity";
import { heroField, imageWithAltField } from "./fields";

const safeHrefPattern = /^(\/(?!\/)[A-Za-z0-9/_#?=&.%+-]*|#[A-Za-z0-9_-]+|https:\/\/[^\s]+|mailto:[^\s@]+@[^\s@]+\.[^\s@]+|tel:\+?[0-9()\-\s]+)$/;

export function safeHrefValidation(rule: StringRule) {
  return rule.custom((value) => {
    if (!value) return true;
    return safeHrefPattern.test(value)
      ? true
      : "Use a safe internal path, section anchor, HTTPS URL, mailto link, or telephone link.";
  });
}

export function homePageContentFields() {
  return [
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
          validation: safeHrefValidation,
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
          validation: safeHrefValidation,
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
          validation: safeHrefValidation,
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
  ];
}
