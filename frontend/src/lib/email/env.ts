export interface EmailConfig {
  apiKey: string;
  fromEmail: string;
  replyToEmail: string;
  contactEmail: string;
}

export type EmailConfigErrorCode =
  | "missing_api_key"
  | "missing_from_email"
  | "missing_contact_email"
  | "invalid_production_sender";

export interface EmailConfigError {
  code: EmailConfigErrorCode;
  message: string;
}

export type EmailConfigResult =
  | { ok: true; config: EmailConfig }
  | { ok: false; error: EmailConfigError };

export type ProductionFromAddressResult =
  | { ok: true; fromEmail: string }
  | { ok: false; error: EmailConfigError };

const RESEND_TEST_SENDER = "onboarding@resend.dev";
const AUTOMATED_EMAIL_REPLY_TO = "semir@drenova.ca";

export function getEmailConfig(): EmailConfigResult {
  assertServerRuntime();

  const apiKey = readRequiredEnv("RESEND_API_KEY");

  if (!apiKey) {
    return configFailure(
      "missing_api_key",
      "Email service is not configured."
    );
  }

  const fromEmail = readRequiredEnv("RESEND_FROM_EMAIL");

  if (!fromEmail) {
    return configFailure(
      "missing_from_email",
      "Email sender is not configured."
    );
  }

  const contactEmail = readRequiredEnv("CONTACT_EMAIL");

  if (!contactEmail) {
    return configFailure(
      "missing_contact_email",
      "Email recipient is not configured."
    );
  }

  const senderCheck = assertProductionFromAddress(fromEmail);

  if (!senderCheck.ok) {
    return senderCheck;
  }

  return {
    ok: true,
    config: {
      apiKey,
      fromEmail: senderCheck.fromEmail,
      replyToEmail: AUTOMATED_EMAIL_REPLY_TO,
      contactEmail,
    },
  };
}

export function assertProductionFromAddress(
  fromEmail: string
): ProductionFromAddressResult {
  assertServerRuntime();

  const trimmed = fromEmail.trim();

  if (!trimmed) {
    return configFailure(
      "missing_from_email",
      "Email sender is not configured."
    );
  }

  if (
    process.env.NODE_ENV === "production" &&
    trimmed.toLowerCase().includes(RESEND_TEST_SENDER)
  ) {
    return configFailure(
      "invalid_production_sender",
      "Email sender is not configured for production."
    );
  }

  return {
    ok: true,
    fromEmail: trimmed,
  };
}

function readRequiredEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function configFailure(
  code: EmailConfigErrorCode,
  message: string
): { ok: false; error: EmailConfigError } {
  return {
    ok: false,
    error: {
      code,
      message,
    },
  };
}

function assertServerRuntime(): void {
  if (typeof window !== "undefined") {
    throw new Error("Email configuration is server-only.");
  }
}
