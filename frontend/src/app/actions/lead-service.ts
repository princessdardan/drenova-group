import type { EmailConfig, EmailConfigResult } from "@/lib/email/env";
import type { SendEmailMessageResult } from "@/lib/email/mailer";
import type {
  EmailMessagePayload,
  LeadEmailContext,
  LeadTemplateRenderResult,
  SafeListingEmailContext,
} from "@/lib/email/types";
import { isPrivacyMarketingConsentGranted } from "@/lib/forms/server-consent";

export type LeadSource = LeadEmailContext["source"];

interface LeadResult {
  success: boolean;
  error?: string;
}

interface LeadWriteClient {
  create(document: LeadSubmissionDocument): Promise<unknown>;
}

export interface LeadActionDependencies {
  writeClient: LeadWriteClient;
  getEmailConfig(): EmailConfigResult;
  renderLeadEmailTemplates(context: LeadEmailContext): LeadTemplateRenderResult;
  getPrivacyMarketingConsentText(): Promise<string>;
  sendEmailMessage(
    message: EmailMessagePayload,
    config?: EmailConfig
  ): Promise<SendEmailMessageResult>;
  hasSanityWriteToken(): boolean;
}

type LeadSubmissionDocument = {
  _type: "leadSubmission";
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source: LeadSource;
  submittedAt: string;
  privacyMarketingConsent: boolean;
  privacyMarketingConsentAt: string;
  privacyMarketingConsentText: string;
} & Partial<NonListingLeadFields> &
  Partial<SafeListingEmailContext>;

interface NonListingLeadFields {
  addressLine?: string;
  unit?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  notes?: string;
  sourcePath?: string;
}

const genericFailure = "Failed to submit your request. Please try again later.";
const configFailure = "Service is not configured. Please call us directly.";

export async function submitLeadFormWithDependencies(
  formData: FormData,
  dependencies: LeadActionDependencies
): Promise<LeadResult> {
  const submittedSource = stringValue(formData, "source");
  const name = stringValue(formData, "name");
  const submittedFirstName = stringValue(formData, "firstName");
  const submittedLastName = stringValue(formData, "lastName");
  const email = stringValue(formData, "email") ?? "";
  const phone = stringValue(formData, "phone");
  const privacyMarketingConsent = formData.get("privacyMarketingConsent");
  const nameParts = name?.split(/\s+/) ?? [];
  const firstName = submittedFirstName ?? nameParts[0] ?? "";
  const lastName =
    submittedLastName ??
    (submittedSource === "home-evaluation" || submittedSource === "listing-detail"
      ? nameParts.slice(1).join(" ") || "Not provided"
      : "");

  if (submittedSource === "listing-detail" && (!name || !email || !phone)) {
    return { success: false, error: "All fields are required." };
  }

  if (!firstName || !lastName || !email) {
    return { success: false, error: "All fields are required." };
  }

  if (!isPrivacyMarketingConsentGranted(privacyMarketingConsent)) {
    return { success: false, error: "Consent is required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (!isLeadSource(submittedSource)) {
    return { success: false, error: "Invalid form source." };
  }

  if (!dependencies.hasSanityWriteToken()) {
    return { success: false, error: configFailure };
  }

  const emailConfig = dependencies.getEmailConfig();

  if (!emailConfig.ok) {
    return { success: false, error: configFailure };
  }

  const source = submittedSource;
  const isListing = source === "listing-detail";
  const listing = isListing ? getListingContext(formData) : undefined;
  const nonListingFields = isListing ? {} : getNonListingLeadFields(formData);
  const privacyMarketingConsentText = await dependencies.getPrivacyMarketingConsentText();
  const templateContext: LeadEmailContext = {
    source,
    firstName,
    lastName,
    email,
    phone,
    privacyMarketingConsentText,
    ...nonListingFields,
    ...(listing ? { listing } : {}),
  };
  const templates = dependencies.renderLeadEmailTemplates(templateContext);

  try {
    const submittedAt = new Date().toISOString();
    await dependencies.writeClient.create({
      _type: "leadSubmission",
      firstName,
      lastName,
      email,
      phone,
      source,
      privacyMarketingConsent: true,
      privacyMarketingConsentAt: submittedAt,
      privacyMarketingConsentText,
      ...nonListingFields,
      ...listing,
      submittedAt,
    });
  } catch {
    return { success: false, error: genericFailure };
  }

  const userConfirmation = await dependencies.sendEmailMessage(
    templates.userConfirmation,
    {
      ...emailConfig.config,
      contactEmail: email,
    }
  );

  if (!userConfirmation.ok) {
    return { success: false, error: genericFailure };
  }

  const adminNotification = await dependencies.sendEmailMessage(
    templates.adminNotification,
    emailConfig.config
  );

  if (!adminNotification.ok) {
    return { success: false, error: genericFailure };
  }

  return { success: true };
}

function stringValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function numberValue(formData: FormData, key: string): number | undefined {
  const value = stringValue(formData, key);

  if (!value) {
    return undefined;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function isLeadSource(source: string | undefined): source is LeadSource {
  return (
    source === "buyers-guide" ||
    source === "sellers-guide" ||
    source === "homepage" ||
    source === "buy" ||
    source === "sell" ||
    source === "about" ||
    source === "team" ||
    source === "home-evaluation" ||
    source === "generic-page" ||
    source === "listing-detail"
  );
}

function getListingContext(formData: FormData): SafeListingEmailContext {
  return {
    listingSlug: stringValue(formData, "listingSlug"),
    listingMlsNumber: stringValue(formData, "listingMlsNumber"),
    listingTitle: stringValue(formData, "listingTitle"),
    listingPrice: numberValue(formData, "listingPrice"),
    listingUrl: stringValue(formData, "listingUrl"),
    listingCity: stringValue(formData, "listingCity"),
    listingCommunity: stringValue(formData, "listingCommunity"),
    listingPropertyType: stringValue(formData, "listingPropertyType"),
  };
}

function getNonListingLeadFields(formData: FormData): NonListingLeadFields {
  return {
    addressLine: stringValue(formData, "addressLine"),
    unit: stringValue(formData, "unit"),
    city: stringValue(formData, "city"),
    province: stringValue(formData, "province"),
    postalCode: stringValue(formData, "postalCode"),
    sourcePath: stringValue(formData, "sourcePath"),
    notes: stringValue(formData, "notes"),
  };
}
