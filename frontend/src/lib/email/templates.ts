import type {
  ContactEmailContext,
  ContactEmailTemplateKey,
  ContactTemplateRenderResult,
  EmailMessagePayload,
  EmailTemplateKey,
  LeadEmailContext,
  LeadEmailTemplateKey,
  LeadTemplateRenderResult,
  SafeListingEmailContext,
} from "./types";

export const EMAIL_TEMPLATE_KEYS = [
  "homepage",
  "buy",
  "sell",
  "about",
  "team",
  "team-profile",
  "contact",
  "home-evaluation",
  "buyers-guide",
  "sellers-guide",
  "listing-detail",
] as const satisfies readonly EmailTemplateKey[];

export const LEAD_EMAIL_TEMPLATE_KEYS = [
  "homepage",
  "buy",
  "sell",
  "about",
  "team",
  "home-evaluation",
  "buyers-guide",
  "sellers-guide",
  "listing-detail",
] as const satisfies readonly LeadEmailTemplateKey[];

export const CONTACT_EMAIL_TEMPLATE_KEYS = [
  "contact",
  "team-profile",
] as const satisfies readonly ContactEmailTemplateKey[];

interface LeadTemplateCopy {
  label: string;
  subject: string;
  body: (context: LeadEmailContext) => string;
}

const leadCopy = {
  homepage: {
    label: "Homepage Inquiry",
    subject: "Thank You for Contacting Drenova Group",
    body: () =>
      "Thank you for reaching out to Drenova Group. A member of our team will be in touch with you shortly to assist with your real estate needs.",
  },
  buy: {
    label: "Buy Page",
    subject: "Your Buying Consultation Request - Drenova Group",
    body: () =>
      "Thank you for reaching out about buying a home. A member of our team will follow up with guidance on your search, financing readiness, and next steps.",
  },
  sell: {
    label: "Sell Page",
    subject: "Your Selling Consultation Request - Drenova Group",
    body: () =>
      "Thank you for reaching out about selling your home. A member of our team will follow up to discuss pricing, preparation, and your ideal timeline.",
  },
  about: {
    label: "About Page",
    subject: "Thank You for Connecting with Drenova Group",
    body: () =>
      "Thank you for connecting with Drenova Group. A member of our team will follow up to learn more about your goals and how we can help.",
  },
  team: {
    label: "Team Page",
    subject: "Your Team Inquiry - Drenova Group",
    body: () =>
      "Thank you for reaching out to our team. A member of Drenova Group will follow up shortly to connect you with the right advisor.",
  },
  "home-evaluation": {
    label: "Home Evaluation",
    subject: "Your Home Evaluation Request - Drenova Group",
    body: () =>
      "Thank you for requesting a home evaluation. A member of our team will review your property details and be in touch with you shortly.",
  },
  "buyers-guide": {
    label: "Buyer's Guide",
    subject: "Your Buyer's Guide from Drenova Group",
    body: () =>
      "Thank you for requesting our Buyer's Guide. A member of our team will follow up with practical next steps for your home search.",
  },
  "sellers-guide": {
    label: "Seller's Guide",
    subject: "Your Seller's Guide from Drenova Group",
    body: () =>
      "Thank you for requesting our Seller's Guide. A member of our team will follow up with selling guidance tailored to your next move.",
  },
  "listing-detail": {
    label: "Listing Detail",
    subject: "Your Listing Inquiry - Drenova Group",
    body: (context) =>
      `You expressed interest in ${getPropertyLabel(context.listing)}. We will reach out soon.`,
  },
} satisfies Record<LeadEmailTemplateKey, LeadTemplateCopy>;

const contactLabels = {
  contact: "Contact Page",
  "team-profile": "Team Profile",
} satisfies Record<ContactEmailTemplateKey, string>;

export function renderLeadEmailTemplates(
  context: LeadEmailContext
): LeadTemplateRenderResult {
  const copy = leadCopy[context.source];
  const fullName = formatName(context.firstName, context.lastName);
  const body = copy.body(context);
  const userText = [
    `Hi ${context.firstName},`,
    "",
    body,
    "",
    "In the meantime, feel free to browse our listings at https://drenovagroup.com/listings or contact us directly.",
    "",
    "Best regards,",
    "The Drenova Group Team",
    "semir@drenova.ca",
  ];
  const adminText = buildLeadAdminText(context, copy.label, fullName);

  return {
    userConfirmation: {
      subject: copy.subject,
      text: userText.join("\n"),
      html: documentHtml(copy.subject, userText),
      tags: [`template:${context.source}`, "audience:user"],
    },
    adminNotification: {
      subject: `[${copy.label}] New lead from ${fullName}`,
      text: adminText.join("\n"),
      html: documentHtml(`[${copy.label}] New lead`, adminText),
      tags: [`template:${context.source}`, "audience:admin"],
    },
  };
}

export function renderContactEmailTemplate(
  key: ContactEmailTemplateKey,
  context: ContactEmailContext
): ContactTemplateRenderResult {
  const label = contactLabels[key];
  const text = [
    `Name: ${context.name}`,
    `Email: ${context.email}`,
    ...optionalLine("Phone", context.phone),
    `Subject: ${context.subject}`,
    `Source: ${label}`,
    ...optionalLine("Source Path", context.sourcePath),
    ...optionalLine("Agent Name", context.agentName),
    ...optionalLine("Agent Role", context.agentRole),
    ...optionalLine("Agent Slug", context.agentSlug),
    "",
    "Message:",
    context.message,
  ];

  return {
    adminContact: {
      subject: `[${context.subject}] New inquiry from ${context.name}`,
      text: text.join("\n"),
      html: documentHtml(`[${label}] New inquiry`, text),
      tags: [`template:${key}`, "audience:admin"],
    },
  };
}

export function renderEmailTemplate(
  key: LeadEmailTemplateKey,
  context: Omit<LeadEmailContext, "source">
): LeadTemplateRenderResult;
export function renderEmailTemplate(
  key: ContactEmailTemplateKey,
  context: ContactEmailContext
): ContactTemplateRenderResult;
export function renderEmailTemplate(
  key: EmailTemplateKey,
  context: Omit<LeadEmailContext, "source"> | ContactEmailContext
): LeadTemplateRenderResult | ContactTemplateRenderResult {
  if (isContactTemplateKey(key)) {
    return renderContactEmailTemplate(key, context as ContactEmailContext);
  }

  return renderLeadEmailTemplates({ ...context, source: key } as LeadEmailContext);
}

function buildLeadAdminText(
  context: LeadEmailContext,
  label: string,
  fullName: string
): string[] {
  const isListing = context.source === "listing-detail";
  const listing = context.listing;

  return [
    isListing
      ? `A user expressed interest in ${getPropertyLabel(listing)}. Here is their contact info.`
      : `New lead submission from ${label}:`,
    "",
    `Name: ${fullName}`,
    `Email: ${context.email}`,
    ...optionalLine("Phone", context.phone),
    ...(!isListing ? optionalLine("Address Line", context.addressLine) : []),
    ...(!isListing ? optionalLine("Unit/Suite", context.unit) : []),
    ...(!isListing ? optionalLine("City", context.city) : []),
    ...(!isListing ? optionalLine("Province/State", context.province) : []),
    ...(!isListing ? optionalLine("Postal Code", context.postalCode) : []),
    ...(isListing ? optionalLine("MLS Number", listing?.listingMlsNumber) : []),
    ...(isListing ? optionalLine("Listing URL", listing?.listingUrl) : []),
    ...(isListing ? optionalLine("City", listing?.listingCity) : []),
    ...(isListing ? optionalLine("Community", listing?.listingCommunity) : []),
    ...(isListing
      ? optionalLine("Property Type", listing?.listingPropertyType)
      : []),
    ...(isListing ? optionalLine("Listed Price", formatPrice(listing?.listingPrice)) : []),
    ...(!isListing ? optionalLine("Notes", context.notes) : []),
    `Source: ${label}`,
  ];
}

function documentHtml(title: string, lines: readonly string[]): string {
  const paragraphs = lines
    .join("\n")
    .split("\n\n")
    .map((paragraph) =>
      `<p>${escapeHtml(paragraph).replaceAll("\n", "<br />")}</p>`
    )
    .join("\n");

  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8" />',
    `<title>${escapeHtml(title)}</title>`,
    "</head>",
    '<body style="margin:0;font-family:Arial,Helvetica,sans-serif;color:#111827;background:#ffffff;">',
    '<main style="max-width:640px;margin:0 auto;padding:32px;line-height:1.6;">',
    `<h1 style="font-size:24px;line-height:1.25;margin:0 0 24px;">${escapeHtml(title)}</h1>`,
    paragraphs,
    "</main>",
    "</body>",
    "</html>",
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatName(firstName: string, lastName: string): string {
  return [firstName, lastName].filter(Boolean).join(" ");
}

function optionalLine(label: string, value: string | undefined): string[] {
  return value ? [`${label}: ${value}`] : [];
}

function formatPrice(price: number | undefined): string | undefined {
  return typeof price === "number" ? `$${price.toLocaleString("en-CA")}` : undefined;
}

function getPropertyLabel(listing: SafeListingEmailContext | undefined): string {
  return (
    listing?.listingTitle ??
    listing?.listingMlsNumber ??
    listing?.listingSlug ??
    "this property"
  );
}

function isContactTemplateKey(key: EmailTemplateKey): key is ContactEmailTemplateKey {
  return key === "contact" || key === "team-profile";
}

export type {
  ContactEmailContext,
  ContactEmailTemplateKey,
  ContactTemplateRenderResult,
  EmailMessagePayload,
  EmailTemplateKey,
  LeadEmailContext,
  LeadEmailTemplateKey,
  LeadTemplateRenderResult,
  SafeListingEmailContext,
};
