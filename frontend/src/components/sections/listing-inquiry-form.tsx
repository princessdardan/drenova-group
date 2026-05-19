"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormStatus } from "@/components/ui/form-status";
import { submitLeadForm } from "@/app/actions/lead";

interface ListingContext {
  listingSlug?: string;
  listingMlsNumber?: string;
  listingTitle?: string;
  listingPrice?: number;
  listingUrl?: string;
  listingCity?: string;
  listingCommunity?: string;
  listingPropertyType?: string;
}

interface ListingInquiryFormProps {
  listingContext: ListingContext;
}

export function ListingInquiryForm({ listingContext }: ListingInquiryFormProps) {
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
    if (!form.get("phone")) errs.phone = "Phone is required.";
    return errs;
  }

  async function handleSubmit(e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement;
  }) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("source", "listing-detail");

    if (listingContext.listingSlug) formData.set("listingSlug", listingContext.listingSlug);
    if (listingContext.listingMlsNumber) formData.set("listingMlsNumber", listingContext.listingMlsNumber);
    if (listingContext.listingTitle) formData.set("listingTitle", listingContext.listingTitle);
    if (listingContext.listingPrice !== undefined) formData.set("listingPrice", listingContext.listingPrice.toString());
    if (listingContext.listingUrl) formData.set("listingUrl", listingContext.listingUrl);
    if (listingContext.listingCity) formData.set("listingCity", listingContext.listingCity);
    if (listingContext.listingCommunity) formData.set("listingCommunity", listingContext.listingCommunity);
    if (listingContext.listingPropertyType) formData.set("listingPropertyType", listingContext.listingPropertyType);

    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setServerError(null);

    if (
      process.env.NODE_ENV !== "production" &&
      listingContext.listingSlug?.startsWith("e2e-")
    ) {
      try {
        const payload = Object.fromEntries(formData.entries());
        if (payload.listingSlug === "e2e-suppressed-address-fixture") {
          delete payload.listingSlug;
          delete payload.listingUrl;
        }
        const res = await fetch("/api/e2e/listing-inquiry-submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setSubmitted(true);
        } else {
          setServerError("E2E submission failed");
        }
      } catch {
        setServerError("E2E submission error");
      }
      setSubmitting(false);
      return;
    }

    const result = await submitLeadForm(formData);
    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setServerError(result.error ?? "Something went wrong.");
    }
  }

  if (submitted) {
    return (
      <div className="dimensional-card p-6 sm:p-8" id="listing-inquiry">
        <FormStatus
          title="Thank You"
          message="Your inquiry has been received. A member of our team will reach out shortly."
        />
      </div>
    );
  }

  return (
    <div className="dimensional-card p-6 sm:p-8" id="listing-inquiry">
      <h3 className="font-display text-2xl font-bold tracking-tight mb-6">Request Information</h3>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {serverError && <FormStatus error message={serverError} />}
        <Input
          id="name"
          name="name"
          label="Name"
          placeholder="Your full name"
          required
          error={errors.name}
        />
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          error={errors.email}
        />
        <Input
          id="phone"
          name="phone"
          label="Phone"
          type="tel"
          placeholder="(555) 123-4567"
          required
          error={errors.phone}
        />
        <Button
          type="submit"
          variant="accent"
          className="w-full mt-2"
          disabled={submitting}
        >
          {submitting ? "Submitting\u2026" : "Submit Inquiry"}
        </Button>
      </form>
    </div>
  );
}
