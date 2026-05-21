import { getSiteSettings } from "@/lib/sanity/fetch";
import { portableTextToPlainText } from "@/lib/forms/consent";

export async function getPrivacyMarketingConsentTextSnapshot(): Promise<string> {
  try {
    const siteSettings = await getSiteSettings();
    return portableTextToPlainText(siteSettings?.privacyMarketingConsentText);
  } catch {
    return portableTextToPlainText(undefined);
  }
}

export function isPrivacyMarketingConsentGranted(value: FormDataEntryValue | null): boolean {
  return value === "true";
}
