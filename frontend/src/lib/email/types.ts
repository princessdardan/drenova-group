export type EmailTemplateKey =
  | "homepage"
  | "buy"
  | "sell"
  | "about"
  | "team"
  | "team-profile"
  | "contact"
  | "home-evaluation"
  | "buyers-guide"
  | "sellers-guide"
  | "listing-detail";

export type LeadEmailTemplateKey = Exclude<
  EmailTemplateKey,
  "contact" | "team-profile"
>;

export type ContactEmailTemplateKey = Extract<
  EmailTemplateKey,
  "contact" | "team-profile"
>;

export interface EmailMessagePayload {
  subject: string;
  text: string;
  html: string;
  tags?: string[];
}

export interface SafeListingEmailContext {
  listingSlug?: string;
  listingMlsNumber?: string;
  listingTitle?: string;
  listingPrice?: number;
  listingUrl?: string;
  listingCity?: string;
  listingCommunity?: string;
  listingPropertyType?: string;
}

export interface LeadEmailContext {
  source: LeadEmailTemplateKey;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addressLine?: string;
  unit?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  notes?: string;
  listing?: SafeListingEmailContext;
}

export interface ContactEmailContext {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  sourcePath?: string;
  agentName?: string;
  agentRole?: string;
  agentSlug?: string;
}

export interface LeadTemplateRenderResult {
  userConfirmation: EmailMessagePayload;
  adminNotification: EmailMessagePayload;
}

export interface ContactTemplateRenderResult {
  adminContact: EmailMessagePayload;
}

export type TemplateRenderResult =
  | LeadTemplateRenderResult
  | ContactTemplateRenderResult;
