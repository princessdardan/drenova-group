import { defineType, defineField } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";
import { imageWithAltField } from "../helpers/fields";
import { homePageContentFields } from "../helpers/home-page-fields";

const RESERVED_SLUGS = [
  "about",
  "api",
  "buy",
  "buyers-guide",
  "contact",
  "home-evaluation",
  "listings",
  "privacy",
  "sell",
  "sellers-guide",
  "team",
  "terms",
  "robots",
  "sitemap",
  "favicon.ico",
  "opengraph-image",
];

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const genericPage = defineType({
  name: "genericPage",
  title: "Generic Page",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) =>
        rule.required().custom((slug) => {
          const current = slug?.current;
          if (!current) return true;
          if (!slugPattern.test(current)) {
            return "Use lowercase letters, numbers, and single hyphens only.";
          }
          if (RESERVED_SLUGS.includes(current)) {
            return `The slug "${current}" is reserved and cannot be used.`;
          }
          return true;
        }),
    }),
    ...homePageContentFields(),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "SEO Title",
          type: "string",
          description: "Overrides the default page title for search engines.",
        }),
        defineField({
          name: "description",
          title: "SEO Description",
          type: "text",
          rows: 3,
          description: "Meta description for search engines.",
        }),
        imageWithAltField({
          name: "image",
          title: "Open Graph Image",
          description: "Image used when sharing this page on social media.",
        }),
        defineField({
          name: "noIndex",
          title: "Hide from Search Engines",
          type: "boolean",
          initialValue: false,
          description: "If checked, search engines will be instructed not to index this page.",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
    },
    prepare({ title, slug }) {
      return {
        title: title || "Untitled",
        subtitle: slug ? `/${slug}` : "No slug set",
      };
    },
  },
});
