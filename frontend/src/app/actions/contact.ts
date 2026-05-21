"use server";

import { renderContactEmailTemplate } from "@/lib/email/templates";
import { sendEmailMessage } from "@/lib/email/mailer";
import type { ContactEmailTemplateKey } from "@/lib/email/types";
import {
  getPrivacyMarketingConsentTextSnapshot,
  isPrivacyMarketingConsentGranted,
} from "@/lib/forms/server-consent";

interface ContactResult {
  success: boolean;
  error?: string;
}

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContactForm(
  formData: FormData
): Promise<ContactResult> {
  const name = getString(formData, "name");
  const email = getString(formData, "email");
  const phone = getString(formData, "phone");
  const subject = getString(formData, "subject");
  const message = getString(formData, "message");
  const privacyMarketingConsent = formData.get("privacyMarketingConsent");
  
  const rawTemplateKey = getString(formData, "templateKey");
  const templateKey: ContactEmailTemplateKey = 
    rawTemplateKey === "team-profile" ? "team-profile" : "contact";

  const sourcePath = getString(formData, "sourcePath") || undefined;
  const agentName = getString(formData, "agentName") || undefined;
  const agentRole = getString(formData, "agentRole") || undefined;
  const agentSlug = getString(formData, "agentSlug") || undefined;

  if (!name || !email || !subject || !message) {
    return { success: false, error: "All required fields must be filled." };
  }

  if (!isPrivacyMarketingConsentGranted(privacyMarketingConsent)) {
    return { success: false, error: "Consent is required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const privacyMarketingConsentText = await getPrivacyMarketingConsentTextSnapshot();

  const templateResult = renderContactEmailTemplate(templateKey, {
    name,
    email,
    phone,
    subject,
    message,
    sourcePath,
    agentName,
    agentRole,
    agentSlug,
    privacyMarketingConsentText,
  });

  const result = await sendEmailMessage(templateResult.adminContact);

  if (!result.ok) {
    console.error("Failed to send contact email:", result.error);
    return {
      success: false,
      error: "Failed to send your message. Please try again later.",
    };
  }

  return { success: true };
}
