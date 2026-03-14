"use server";

import { Resend } from "resend";

interface ContactResult {
  success: boolean;
  error?: string;
}

export async function submitContactForm(
  formData: FormData
): Promise<ContactResult> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = (formData.get("phone") as string) || "";
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return { success: false, error: "All required fields must be filled." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured — contact form submission dropped");
    return {
      success: false,
      error: "Email service is not configured. Please call us directly.",
    };
  }

  try {
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Drenova Group <noreply@drenovagroup.com>",
      to: process.env.CONTACT_EMAIL ?? "info@drenovagroup.com",
      replyTo: email,
      subject: `[${subject}] New inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return {
      success: false,
      error: "Failed to send your message. Please try again later.",
    };
  }
}
