import { defineType, defineField } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

const sourceTitles: Record<string, string> = {
  "buyers-guide": "Buyers Guide",
  "sellers-guide": "Sellers Guide",
  homepage: "Homepage",
  buy: "Buy Page",
  sell: "Sell Page",
  about: "About Page",
  team: "Team Page",
  "home-evaluation": "Home Evaluation",
  "listing-detail": "Listing Detail",
};

export const leadSubmission = defineType({
  name: "leadSubmission",
  title: "Lead Submission",
  type: "document",
  icon: EnvelopeIcon,
  readOnly: true,
  fieldsets: [
    {
      name: "listingContext",
      title: "Listing Context",
      options: { collapsible: true, collapsed: false },
    },
  ],
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
          { title: "Buy Page", value: "buy" },
          { title: "Sell Page", value: "sell" },
          { title: "About Page", value: "about" },
          { title: "Team Page", value: "team" },
          { title: "Home Evaluation", value: "home-evaluation" },
          { title: "Listing Detail", value: "listing-detail" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "privacyMarketingConsent",
      title: "Privacy and Marketing Consent",
      type: "boolean",
      readOnly: true,
    }),
    defineField({
      name: "privacyMarketingConsentAt",
      title: "Consent Captured At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "privacyMarketingConsentText",
      title: "Consent Text Snapshot",
      type: "text",
      rows: 3,
      readOnly: true,
    }),
    defineField({
      name: "listingSlug",
      title: "Listing Slug",
      type: "string",
      fieldset: "listingContext",
      description: "Safe listing identifier captured from listing-detail inquiries.",
    }),
    defineField({
      name: "listingMlsNumber",
      title: "Listing MLS Number",
      type: "string",
      fieldset: "listingContext",
      description: "MLS number only; does not include suppressed address details.",
    }),
    defineField({
      name: "listingTitle",
      title: "Listing Title",
      type: "string",
      fieldset: "listingContext",
      description: "Public-safe listing title shown on the listing detail page.",
    }),
    defineField({
      name: "listingPrice",
      title: "Listing Price",
      type: "number",
      fieldset: "listingContext",
      description: "Listing price at the time the inquiry was submitted.",
    }),
    defineField({
      name: "listingUrl",
      title: "Listing URL",
      type: "url",
      fieldset: "listingContext",
      description: "Public listing detail URL for quick follow-up.",
    }),
    defineField({
      name: "listingCity",
      title: "Listing City",
      type: "string",
      fieldset: "listingContext",
      description: "City-level context only; street address and postal code are intentionally omitted.",
    }),
    defineField({
      name: "listingCommunity",
      title: "Listing Community",
      type: "string",
      fieldset: "listingContext",
      description: "Public-safe community or neighbourhood context when available.",
    }),
    defineField({
      name: "listingPropertyType",
      title: "Listing Property Type",
      type: "string",
      fieldset: "listingContext",
      description: "Public-safe property type context for the listing inquiry.",
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
      subtitle: `${sourceTitles[source] ?? "Unknown"} — ${date ? new Date(date).toLocaleDateString() : "No date"}`,
    }),
  },
});
