import { Resend } from "resend";
import { getEmailConfig, type EmailConfig, type EmailConfigError } from "./env";
import type { EmailMessagePayload } from "./types";

export interface ResendEmailSendInput {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}

export interface ResendEmailSendResult {
  data: { id?: string } | null;
  error: unknown;
}

interface ResendProviderErrorLog {
  name?: string;
  message?: string;
  statusCode?: number | null;
}

export interface EmailTransport {
  send(message: ResendEmailSendInput): Promise<ResendEmailSendResult>;
}

export type SendEmailMessageErrorCode =
  | EmailConfigError["code"]
  | "provider_error"
  | "provider_exception";

export interface SendEmailMessageError {
  code: SendEmailMessageErrorCode;
  message: string;
}

export type SendEmailMessageResult =
  | { ok: true; data: { id?: string } | null }
  | { ok: false; error: SendEmailMessageError };

export async function sendEmailMessage(
  message: EmailMessagePayload,
  config?: EmailConfig,
  transport?: EmailTransport
): Promise<SendEmailMessageResult> {
  assertServerRuntime();

  const configResult = config ? { ok: true as const, config } : getEmailConfig();

  if (!configResult.ok) {
    return {
      ok: false,
      error: configResult.error,
    };
  }

  const resolvedConfig = configResult.config;

  const emailTransport = transport ?? createResendTransport(resolvedConfig.apiKey);

  try {
    const result = await emailTransport.send({
      from: resolvedConfig.fromEmail,
      to: resolvedConfig.contactEmail,
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo: resolvedConfig.replyToEmail,
      tags: toResendTags(message.tags),
    });

    if (result.error) {
      console.error(
        "Resend provider rejected email:",
        sanitizeResendProviderError(result.error)
      );

      return {
        ok: false,
        error: {
          code: "provider_error",
          message: "Email provider rejected the message.",
        },
      };
    }

    return {
      ok: true,
      data: result.data,
    };
  } catch {
    return {
      ok: false,
      error: {
        code: "provider_exception",
        message: "Email provider could not be reached.",
      },
    };
  }
}

function createResendTransport(apiKey: string): EmailTransport {
  assertServerRuntime();

  const resend = new Resend(apiKey);

  return {
    async send(message) {
      return resend.emails.send(message);
    },
  };
}

function toResendTags(
  tags: EmailMessagePayload["tags"]
): ResendEmailSendInput["tags"] {
  return tags?.map((tag) => ({ name: "category", value: tag }));
}

function sanitizeResendProviderError(error: unknown): ResendProviderErrorLog {
  if (!isRecord(error)) {
    return {};
  }

  const sanitized: ResendProviderErrorLog = {};
  const name = error.name;
  const message = error.message;
  const statusCode = error.statusCode;

  if (typeof name === "string") {
    sanitized.name = name;
  }

  if (typeof message === "string") {
    sanitized.message = message;
  }

  if (typeof statusCode === "number" || statusCode === null) {
    sanitized.statusCode = statusCode;
  }

  return sanitized;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function assertServerRuntime(): void {
  if (typeof window !== "undefined") {
    throw new Error("Email delivery is server-only.");
  }
}
