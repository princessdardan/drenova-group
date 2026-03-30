"use server";

import { Resend } from "resend";
import { writeClient } from "@/lib/sanity/client";

interface LeadResult {
  success: boolean;
  error?: string;
}

export async function submitLeadForm(
  formData: FormData
): Promise<LeadResult> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = (formData.get("phone") as string) || undefined;
  const source = formData.get("source") as string;

  if (!firstName || !lastName || !email) {
    return { success: false, error: "All fields are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (
    source !== "buyers-guide" &&
    source !== "sellers-guide" &&
    source !== "homepage"
  ) {
    return { success: false, error: "Invalid form source." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const writeToken = process.env.SANITY_API_WRITE_TOKEN;

  if (!apiKey || !writeToken) {
    console.error("Missing RESEND_API_KEY or SANITY_API_WRITE_TOKEN");
    return {
      success: false,
      error: "Service is not configured. Please call us directly.",
    };
  }

  const guideLabel =
    source === "buyers-guide"
      ? "Buyer's Guide"
      : source === "sellers-guide"
        ? "Seller's Guide"
        : "Homepage Inquiry";
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "Drenova Group <noreply@drenovagroup.com>";
  const contactEmail = process.env.CONTACT_EMAIL ?? "info@drenovagroup.com";

  try {
    // 1. Write lead to Sanity (first — safest failure mode)
    await writeClient.create({
      _type: "leadSubmission",
      firstName,
      lastName,
      email,
      phone,
      source,
      submittedAt: new Date().toISOString(),
    });

    const resend = new Resend(apiKey);

    const isGuide = source !== "homepage";

    // 2. Send confirmation email to user
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: isGuide
        ? `Your ${guideLabel} from Drenova Group`
        : "Thank You for Contacting Drenova Group",
      text: [
        `Hi ${firstName},`,
        "",
        isGuide
          ? `Thank you for your interest in our ${guideLabel}. A member of our team will be in touch with you shortly to assist with your real estate needs.`
          : "Thank you for reaching out to Drenova Group. A member of our team will be in touch with you shortly to assist with your real estate needs.",
        "",
        "In the meantime, feel free to browse our listings at https://drenovagroup.com/listings or contact us directly.",
        "",
        "Best regards,",
        "The Drenova Group Team",
        "info@drenovagroup.com",
      ].join("\n"),
    });

    // 3. Forward lead details to business inbox
    await resend.emails.send({
      from: fromEmail,
      to: contactEmail,
      replyTo: email,
      subject: `[${guideLabel}] New lead from ${firstName} ${lastName}`,
      text: [
        `New lead submission from the ${guideLabel} page:`,
        "",
        `Name: ${firstName} ${lastName}`,
        `Email: ${email}`,
        ...(phone ? [`Phone: ${phone}`] : []),
        `Source: ${guideLabel}`,
      ].join("\n"),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to process lead submission:", error);
    return {
      success: false,
      error: "Failed to submit your request. Please try again later.",
    };
  }
}
