import assert from "node:assert/strict";
import test from "node:test";
import { getEmailConfig } from "./env";
import {
  sendEmailMessage,
  type EmailTransport,
  type ResendEmailSendInput,
  type ResendEmailSendResult,
} from "./mailer";
import { renderLeadEmailTemplates } from "./templates";
import type { EmailMessagePayload } from "./types";

const originalEnv = { ...process.env };

const message: EmailMessagePayload = {
  subject: "New inquiry from Avery Morgan",
  text: "Avery would like to schedule a consultation.",
  html: "<!doctype html><p>Avery would like to schedule a consultation.</p>",
  tags: ["template:contact", "audience:admin"],
};

const verifiedFromEmail = "Drenova Group <send.info@info.drenova.ca>";
const automatedReplyToEmail = "semir@drenova.ca";

test.afterEach(() => {
  process.env = { ...originalEnv };
});

test("returns a typed config failure when RESEND_API_KEY is missing", () => {
  setEmailEnv({ apiKey: undefined });

  const result = getEmailConfig();

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "missing_api_key");
  assert.doesNotMatch(result.error.message, /secret|key_/i);
});

test("returns a typed config failure when RESEND_FROM_EMAIL is missing", () => {
  setEmailEnv({ fromEmail: "   " });

  const result = getEmailConfig();

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "missing_from_email");
});

test("returns a typed config failure when CONTACT_EMAIL is missing", () => {
  setEmailEnv({ contactEmail: undefined });

  const result = getEmailConfig();

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "missing_contact_email");
});

test("rejects onboarding@resend.dev as a production sender", () => {
  setEmailEnv({ fromEmail: "Drenova Group <onboarding@resend.dev>" });
  setEnvValue("NODE_ENV", "production");

  const result = getEmailConfig();

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "invalid_production_sender");
});

test("returns a safe failure when Resend returns an error result", async () => {
  const originalConsoleError = console.error;
  let logged: unknown[] | undefined;
  const transport = createTransport(async () => ({
    data: null,
    error: {
      name: "invalid_from_address",
      message: "Invalid `from` address",
      statusCode: 422,
      raw: message.text,
      secret: "secret_key",
    },
  }));

  console.error = (...args: unknown[]) => {
    logged = args;
  };

  try {
    const result = await sendEmailMessage(message, validConfig(), transport);

    assert.equal(result.ok, false);
    assert.equal(result.error.code, "provider_error");
    assert.doesNotMatch(result.error.message, /Avery|Invalid `from`|secret/i);
    assert.deepEqual(logged, [
      "Resend provider rejected email:",
      {
        name: "invalid_from_address",
        message: "Invalid `from` address",
        statusCode: 422,
      },
    ]);
    assert.doesNotMatch(JSON.stringify(logged), /Avery|secret_key/i);
  } finally {
    console.error = originalConsoleError;
  }
});

test("sends a message through the injected transport", async () => {
  let sentMessage: ResendEmailSendInput | undefined;
  const transport = createTransport(async (input) => {
    sentMessage = input;
    return { data: { id: "email_123" }, error: null };
  });

  const result = await sendEmailMessage(message, validConfig(), transport);

  assert.deepEqual(result, { ok: true, data: { id: "email_123" } });
  assert.deepEqual(sentMessage, {
    from: verifiedFromEmail,
    to: "info@drenovagroup.com",
    subject: message.subject,
    text: message.text,
    html: message.html,
    replyTo: automatedReplyToEmail,
    tags: [
      { name: "category", value: "template:contact" },
      { name: "category", value: "audience:admin" },
    ],
  });
});

test("maps every lead source message to the final Resend transport payload", async () => {
  const sources = [
    "homepage",
    "buy",
    "sell",
    "about",
    "team",
    "home-evaluation",
    "buyers-guide",
    "sellers-guide",
    "listing-detail",
  ] as const;

  for (const source of sources) {
    const sentMessages: ResendEmailSendInput[] = [];
    const transport = createTransport(async (input) => {
      sentMessages.push(input);
      return { data: { id: `email_${source}` }, error: null };
    });
    const templates = renderLeadEmailTemplates({
      source,
      firstName: "Avery",
      lastName: "Morgan",
      email: "avery@example.com",
      phone: "416-555-0199",
      listing:
        source === "listing-detail"
          ? {
              listingSlug: "ravine-view-home",
              listingMlsNumber: "C9876543",
              listingTitle: "Ravine View Home",
              listingPrice: 1895000,
              listingUrl: "https://drenovagroup.com/listings/ravine-view-home",
              listingCity: "Markham",
              listingCommunity: "Unionville",
              listingPropertyType: "Detached",
            }
          : undefined,
    });

    await sendEmailMessage(
      templates.userConfirmation,
      { ...validConfig(), contactEmail: "avery@example.com" },
      transport
    );
    await sendEmailMessage(templates.adminNotification, validConfig(), transport);

    assert.equal(sentMessages.length, 2);
    assert.equal(sentMessages[0]?.to, "avery@example.com");
    assert.equal(sentMessages[0]?.from, verifiedFromEmail);
    assert.equal(sentMessages[0]?.replyTo, automatedReplyToEmail);
    assert.deepEqual(sentMessages[0]?.tags, [
      { name: "category", value: `template:${source}` },
      { name: "category", value: "audience:user" },
    ]);
    assert.equal(sentMessages[1]?.to, "info@drenovagroup.com");
    assert.equal(sentMessages[1]?.replyTo, automatedReplyToEmail);
    assert.deepEqual(sentMessages[1]?.tags, [
      { name: "category", value: `template:${source}` },
      { name: "category", value: "audience:admin" },
    ]);
  }
});

test("returns a safe failure when the transport throws", async () => {
  const transport = createTransport(async () => {
    throw new Error(`network failure for ${message.text} with secret_key`);
  });

  const result = await sendEmailMessage(message, validConfig(), transport);

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "provider_exception");
  assert.doesNotMatch(result.error.message, /Avery|secret_key|network failure/i);
});

function setEmailEnv(overrides: {
  apiKey?: string;
  fromEmail?: string;
  contactEmail?: string;
}): void {
  setEnvValue("RESEND_API_KEY", "apiKey" in overrides ? overrides.apiKey : "re_test_key");
  setEnvValue(
    "RESEND_FROM_EMAIL",
    "fromEmail" in overrides
      ? overrides.fromEmail
      : verifiedFromEmail
  );
  setEnvValue(
    "CONTACT_EMAIL",
    "contactEmail" in overrides ? overrides.contactEmail : "info@drenovagroup.com"
  );
}

function setEnvValue(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

function validConfig() {
  return {
    apiKey: "re_test_key",
    fromEmail: verifiedFromEmail,
    replyToEmail: automatedReplyToEmail,
    contactEmail: "info@drenovagroup.com",
  };
}

function createTransport(
  send: (input: ResendEmailSendInput) => Promise<ResendEmailSendResult>
): EmailTransport {
  return { send };
}
