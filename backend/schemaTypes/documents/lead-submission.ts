import { defineType, defineField } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export const leadSubmission = defineType({
  name: "leadSubmission",
  title: "Lead Submission",
  type: "document",
  icon: EnvelopeIcon,
  readOnly: true,
  fields: [
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lastName",
      title: "Last Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "addressLine",
      title: "Address Line",
      type: "string",
    }),
    defineField({
      name: "unit",
      title: "Unit/Suite",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),
    defineField({
      name: "province",
      title: "Province/State",
      type: "string",
    }),
    defineField({
      name: "postalCode",
      title: "Postal Code",
      type: "string",
    }),
    defineField({
      name: "notes",
      title: "Additional Notes",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "source",
      title: "Source Page",
      type: "string",
      options: {
        list: [
          { title: "Buyers Guide", value: "buyers-guide" },
          { title: "Sellers Guide", value: "sellers-guide" },
          { title: "Homepage", value: "homepage" },
          { title: "Home Evaluation", value: "home-evaluation" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      firstName: "firstName",
      lastName: "lastName",
      source: "source",
      date: "submittedAt",
    },
    prepare: ({ firstName, lastName, source, date }) => ({
      title: `${firstName ?? ""} ${lastName ?? ""}`.trim() || "Unknown",
      subtitle: `${source === "buyers-guide" ? "Buyers Guide" : source === "sellers-guide" ? "Sellers Guide" : source === "homepage" ? "Homepage" : source === "home-evaluation" ? "Home Evaluation" : "Unknown"} — ${date ? new Date(date).toLocaleDateString() : "No date"}`,
    }),
  },
});
