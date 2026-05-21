"use server";

import { getEmailConfig } from "@/lib/email/env";
import { sendEmailMessage } from "@/lib/email/mailer";
import { renderLeadEmailTemplates } from "@/lib/email/templates";
import { getPrivacyMarketingConsentTextSnapshot } from "@/lib/forms/server-consent";
import { writeClient } from "@/lib/sanity/client";
import { submitLeadFormWithDependencies } from "./lead-service";

interface LeadResult {
  success: boolean;
  error?: string;
}

export async function submitLeadForm(
  formData: FormData
): Promise<LeadResult> {
  return submitLeadFormWithDependencies(formData, {
    writeClient,
    getEmailConfig,
    renderLeadEmailTemplates,
    getPrivacyMarketingConsentText: getPrivacyMarketingConsentTextSnapshot,
    sendEmailMessage,
    hasSanityWriteToken: () => Boolean(process.env.SANITY_API_WRITE_TOKEN?.trim()),
  });
}
