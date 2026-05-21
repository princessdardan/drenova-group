"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import {
  defaultPrivacyMarketingConsentText,
} from "@/lib/forms/consent";
import { useFormConsentText } from "@/components/sections/form-consent-provider";

const consentPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <span>{children}</span>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const openInNewTab = Boolean(value?.blank);

      return (
        <a
          href={href}
          className="text-accent underline underline-offset-2 transition-colors hover:text-accent-hover"
          {...(openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

interface FormConsentFieldProps {
  text?: PortableTextBlock[];
  error?: string;
}

export function FormConsentField({ text, error }: FormConsentFieldProps) {
  const inheritedText = useFormConsentText();
  const consentText = text?.length
    ? text
    : inheritedText?.length
      ? inheritedText
      : defaultPrivacyMarketingConsentText;

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3 rounded-lg border border-border bg-surface/60 p-4">
        <input
          id="privacyMarketingConsent"
          name="privacyMarketingConsent"
          type="checkbox"
          value="true"
          required
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "privacyMarketingConsent-error" : undefined}
          aria-labelledby="privacyMarketingConsent-label"
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-accent"
        />
        <div
          id="privacyMarketingConsent-label"
          className="text-sm leading-6 text-muted [&_a]:font-medium"
        >
          <PortableText value={consentText} components={consentPortableTextComponents} />
        </div>
      </div>
      {error && (
        <p id="privacyMarketingConsent-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
