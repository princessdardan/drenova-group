import assert from "node:assert/strict";
import test from "node:test";
import { renderLeadEmailTemplates } from "@/lib/email/templates";
import type { EmailConfig, EmailConfigResult } from "@/lib/email/env";
import type { SendEmailMessageResult } from "@/lib/email/mailer";
import type { EmailMessagePayload } from "@/lib/email/types";
import {
  submitLeadFormWithDependencies,
  type LeadActionDependencies,
  type LeadSource,
} from "./lead-service";

const leadSources = [
  "homepage",
  "buy",
  "sell",
  "about",
  "team",
  "home-evaluation",
  "buyers-guide",
  "sellers-guide",
  "listing-detail",
] as const satisfies readonly LeadSource[];

const consentText = "I agree to the Privacy Policy.";

test("lead action routes every accepted source through the matching template key", async () => {
  for (const source of leadSources) {
    const dependencies = createDependencies();
    const result = await submitLeadFormWithDependencies(
      formDataForSource(source),
      dependencies
    );

    assert.deepEqual(result, { success: true });
    assert.equal(dependencies.createdDocuments.length, 1);
    assert.equal(dependencies.createdDocuments[0]?.source, source);
    assert.equal(dependencies.sentEmails.length, 2);
    assert.deepEqual(dependencies.sentEmails[0]?.message.tags, [
      `template:${source}`,
      "audience:user",
    ]);
    assert.deepEqual(dependencies.sentEmails[1]?.message.tags, [
      `template:${source}`,
      "audience:admin",
    ]);
  }
});

test("listing-detail submission persists and emails only safe listing context", async () => {
  const dependencies = createDependencies();
  const formData = formDataForSource("listing-detail");

  formData.set("addressLine", "123 Hidden Lane");
  formData.set("unit", "Upper");
  formData.set("street", "Hidden Lane");
  formData.set("postalCode", "L3R 0X0");
  formData.set("latitude", "43.12345");
  formData.set("longitude", "-79.12345");

  const result = await submitLeadFormWithDependencies(formData, dependencies);

  assert.deepEqual(result, { success: true });
  assert.equal(dependencies.createdDocuments.length, 1);
  assert.deepEqual(dependencies.createdDocuments[0], {
    _type: "leadSubmission",
    firstName: "Avery",
    lastName: "Morgan",
    email: "avery@example.com",
    phone: "416-555-0199",
    source: "listing-detail",
    privacyMarketingConsent: true,
    privacyMarketingConsentAt: dependencies.createdDocuments[0]?.privacyMarketingConsentAt,
    privacyMarketingConsentText: consentText,
    listingSlug: "ravine-view-home",
    listingMlsNumber: "C9876543",
    listingTitle: "Ravine View Home",
    listingPrice: 1895000,
    listingUrl: "https://drenova.ca/listings/ravine-view-home",
    listingCity: "Markham",
    listingCommunity: "Unionville",
    listingPropertyType: "Detached",
    submittedAt: dependencies.createdDocuments[0]?.submittedAt,
  });

  const renderedEmailPayloads = dependencies.sentEmails
    .map(({ message }) => [message.subject, message.text, message.html].join("\n"))
    .join("\n");

  for (const allowedValue of [
    "Ravine View Home",
    "C9876543",
    "https://drenova.ca/listings/ravine-view-home",
    "Markham",
    "Unionville",
    "Detached",
    "$1,895,000",
  ]) {
    assert.match(renderedEmailPayloads, escapeRegExp(allowedValue));
  }

  for (const forbidden of [
    "123 Hidden Lane",
    "Upper",
    "Hidden Lane",
    "L3R 0X0",
    "43.12345",
    "-79.12345",
    "Address Line",
    "Unit/Suite",
    "Postal Code",
    "street",
    "latitude",
    "longitude",
  ]) {
    assert.doesNotMatch(renderedEmailPayloads, escapeRegExp(forbidden));
    assert.equal(Object.hasOwn(dependencies.createdDocuments[0] ?? {}, forbidden), false);
  }
});

test("lead action requires consent for every accepted source", async () => {
  for (const source of leadSources) {
    const formData = formDataForSource(source);
    formData.delete("privacyMarketingConsent");
    const dependencies = createDependencies();

    const result = await submitLeadFormWithDependencies(formData, dependencies);

    assert.deepEqual(result, { success: false, error: "Consent is required." });
    assert.equal(dependencies.createdDocuments.length, 0);
    assert.equal(dependencies.sentEmails.length, 0);
  }
});

test("lead action rejects explicitly false consent", async () => {
  const formData = formDataForSource("homepage");
  formData.set("privacyMarketingConsent", "false");
  const dependencies = createDependencies();

  const result = await submitLeadFormWithDependencies(formData, dependencies);

  assert.deepEqual(result, { success: false, error: "Consent is required." });
  assert.equal(dependencies.createdDocuments.length, 0);
  assert.equal(dependencies.sentEmails.length, 0);
});

test("user confirmation failure prevents admin notification", async () => {
  const dependencies = createDependencies({
    sendEmailMessage: async (_message, _config, callIndex) =>
      callIndex === 0 ? failureResult("provider_error") : successResult(),
  });

  const result = await submitLeadFormWithDependencies(
    formDataForSource("homepage"),
    dependencies
  );

  assert.deepEqual(result, {
    success: false,
    error: "Failed to submit your request. Please try again later.",
  });
  assert.equal(dependencies.createdDocuments.length, 1);
  assert.equal(dependencies.sentEmails.length, 1);
  assert.deepEqual(dependencies.sentEmails[0]?.message.tags, [
    "template:homepage",
    "audience:user",
  ]);
});

test("admin notification failure returns a safe failure after confirmation send", async () => {
  const dependencies = createDependencies({
    sendEmailMessage: async (_message, _config, callIndex) =>
      callIndex === 1 ? failureResult("provider_error") : successResult(),
  });

  const result = await submitLeadFormWithDependencies(
    formDataForSource("about"),
    dependencies
  );

  assert.deepEqual(result, {
    success: false,
    error: "Failed to submit your request. Please try again later.",
  });
  assert.equal(dependencies.createdDocuments.length, 1);
  assert.deepEqual(dependencies.events, ["sanity:create", "email:0", "email:1"]);
});

test("Sanity write failure attempts no emails", async () => {
  const dependencies = createDependencies({ rejectSanityWrite: true });

  const result = await submitLeadFormWithDependencies(
    formDataForSource("sell"),
    dependencies
  );

  assert.deepEqual(result, {
    success: false,
    error: "Failed to submit your request. Please try again later.",
  });
  assert.equal(dependencies.createdDocuments.length, 0);
  assert.equal(dependencies.sentEmails.length, 0);
});

test("missing email or Sanity configuration returns a safe failure", async () => {
  const missingEmailConfig = createDependencies({
    emailConfig: {
      ok: false,
      error: {
        code: "missing_contact_email",
        message: "secret recipient detail",
      },
    },
  });
  const missingSanityConfig = createDependencies({ hasSanityWriteToken: false });

  const missingEmailResult = await submitLeadFormWithDependencies(
    formDataForSource("buy"),
    missingEmailConfig
  );
  const missingSanityResult = await submitLeadFormWithDependencies(
    formDataForSource("buy"),
    missingSanityConfig
  );

  assert.deepEqual(missingEmailResult, {
    success: false,
    error: "Service is not configured. Please call us directly.",
  });
  assert.deepEqual(missingSanityResult, {
    success: false,
    error: "Service is not configured. Please call us directly.",
  });
  assert.equal(missingEmailConfig.createdDocuments.length, 0);
  assert.equal(missingEmailConfig.sentEmails.length, 0);
  assert.equal(missingSanityConfig.createdDocuments.length, 0);
  assert.equal(missingSanityConfig.sentEmails.length, 0);
});

interface CreatedLeadDocument {
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
  addressLine?: string;
  unit?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  notes?: string;
  listingSlug?: string;
  listingMlsNumber?: string;
  listingTitle?: string;
  listingPrice?: number;
  listingUrl?: string;
  listingCity?: string;
  listingCommunity?: string;
  listingPropertyType?: string;
}

interface SentEmail {
  message: EmailMessagePayload;
  config?: EmailConfig;
}

interface TestDependencies extends LeadActionDependencies {
  createdDocuments: CreatedLeadDocument[];
  sentEmails: SentEmail[];
  events: string[];
}

interface DependencyOptions {
  emailConfig?: EmailConfigResult;
  hasSanityWriteToken?: boolean;
  rejectSanityWrite?: boolean;
  sendEmailMessage?: (
    message: EmailMessagePayload,
    config: EmailConfig | undefined,
    callIndex: number
  ) => Promise<SendEmailMessageResult>;
}

function createDependencies(options: DependencyOptions = {}): TestDependencies {
  const createdDocuments: CreatedLeadDocument[] = [];
  const sentEmails: SentEmail[] = [];
  const events: string[] = [];
  const dependencies: TestDependencies = {
    createdDocuments,
    sentEmails,
    events,
    writeClient: {
      async create(document) {
        if (options.rejectSanityWrite) {
          throw new Error("Sanity unavailable");
        }

        events.push("sanity:create");
        createdDocuments.push(document);
        return { _id: "lead-submission-test" };
      },
    },
    getEmailConfig: () => options.emailConfig ?? { ok: true, config: validConfig() },
    renderLeadEmailTemplates,
    getPrivacyMarketingConsentText: async () => consentText,
    async sendEmailMessage(message, config) {
      const callIndex = sentEmails.length;
      events.push(`email:${callIndex}`);
      sentEmails.push({ message, config });
      return options.sendEmailMessage
        ? options.sendEmailMessage(message, config, callIndex)
        : successResult();
    },
    hasSanityWriteToken: () => options.hasSanityWriteToken ?? true,
  };

  return dependencies;
}

function formDataForSource(source: LeadSource): FormData {
  const formData = new FormData();
  formData.set("source", source);
  formData.set("email", "avery@example.com");
  formData.set("privacyMarketingConsent", "true");
  formData.set("privacyMarketingConsentText", consentText);

  if (source === "home-evaluation" || source === "listing-detail") {
    formData.set("name", "Avery Morgan");
  } else {
    formData.set("firstName", "Avery");
    formData.set("lastName", "Morgan");
  }

  if (source === "listing-detail") {
    formData.set("phone", "416-555-0199");
    formData.set("listingSlug", "ravine-view-home");
    formData.set("listingMlsNumber", "C9876543");
    formData.set("listingTitle", "Ravine View Home");
    formData.set("listingPrice", "1895000");
    formData.set("listingUrl", "https://drenova.ca/listings/ravine-view-home");
    formData.set("listingCity", "Markham");
    formData.set("listingCommunity", "Unionville");
    formData.set("listingPropertyType", "Detached");
  }

  if (source === "home-evaluation") {
    formData.set("addressLine", "10 King Street West");
    formData.set("unit", "Suite 1400");
    formData.set("city", "Toronto");
    formData.set("province", "ON");
    formData.set("postalCode", "M5H 1A1");
    formData.set("notes", "Interested in a spring move.");
  }

  return formData;
}

function validConfig(): EmailConfig {
  return {
    apiKey: "re_test_key",
    fromEmail: "Drenova Group <send.info@info.drenova.ca>",
    replyToEmail: "semir@drenova.ca",
    contactEmail: "semir@drenova.ca",
  };
}

function successResult(): SendEmailMessageResult {
  return { ok: true, data: { id: "email_test" } };
}

function failureResult(
  code: "provider_error" | "provider_exception"
): SendEmailMessageResult {
  return {
    ok: false,
    error: {
      code,
      message: "Email delivery failed safely.",
    },
  };
}

function escapeRegExp(value: string): RegExp {
  return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
}
