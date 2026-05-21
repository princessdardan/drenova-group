import { defineArrayMember, defineField, defineType } from "sanity";

export const formConsentText = defineType({
  name: "formConsentText",
  title: "Form Consent Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
              }),
              defineField({
                name: "blank",
                type: "boolean",
                title: "Open in new tab",
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),
  ],
});
