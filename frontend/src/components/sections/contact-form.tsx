"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormStatus } from "@/components/ui/form-status";
import { submitContactForm } from "@/app/actions/contact";

const subjectOptions = [
  { value: "buying", label: "Buying" },
  { value: "selling", label: "Selling" },
  { value: "general", label: "General Inquiry" },
];

interface ContactFormProps {
  prefilledSubject?: string;
  templateKey?: "contact" | "team-profile";
  sourcePath?: string;
  agentName?: string;
  agentRole?: string;
  agentSlug?: string;
}

export function ContactForm({
  prefilledSubject,
  templateKey,
  sourcePath,
  agentName,
  agentRole,
  agentSlug,
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(form: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.get("name")) errs.name = "Name is required.";
    const email = form.get("email") as string;
    if (!email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email address.";
    if (!form.get("subject")) errs.subject = "Please select a subject.";
    if (!form.get("message")) errs.message = "Message is required.";
    return errs;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setServerError(null);

    const result = await submitContactForm(formData);
    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setServerError(result.error ?? "Something went wrong.");
    }
  }

  if (submitted) {
    return (
      <FormStatus
        title="Thank You"
        message="Your message has been sent. A member of our team will be in touch shortly."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {templateKey && <input type="hidden" name="templateKey" value={templateKey} />}
      {sourcePath && <input type="hidden" name="sourcePath" value={sourcePath} />}
      {agentName && <input type="hidden" name="agentName" value={agentName} />}
      {agentRole && <input type="hidden" name="agentRole" value={agentRole} />}
      {agentSlug && <input type="hidden" name="agentSlug" value={agentSlug} />}
      <Input
        id="name"
        name="name"
        label="Name"
        placeholder="Your full name"
        error={errors.name}
      />
      <Input
        id="email"
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email}
      />
      <Input
        id="phone"
        name="phone"
        label="Phone"
        type="tel"
        placeholder="(555) 000-0000"
      />
      <Select
        id="subject"
        name="subject"
        label="Subject"
        placeholder="Select a subject"
        options={subjectOptions}
        defaultValue={prefilledSubject ?? ""}
        error={errors.subject}
      />
      <Textarea
        id="message"
        name="message"
        label="Message"
        placeholder="How can we help you?"
        error={errors.message}
      />
      {serverError && (
        <FormStatus error message={serverError} />
      )}
      <Button
        type="submit"
        variant="accent"
        className="w-full sm:w-auto mt-2"
        disabled={submitting}
      >
        {submitting ? "Sending\u2026" : "Send Message"}
      </Button>
    </form>
  );
}
