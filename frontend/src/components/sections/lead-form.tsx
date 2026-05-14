"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitLeadForm } from "@/app/actions/lead";

type LeadSource = "buyers-guide" | "sellers-guide" | "homepage" | "home-evaluation";

interface LeadFormProps {
  source: LeadSource;
  showPhone?: boolean;
}

export function LeadForm({ source, showPhone = false }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(form: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    if (source === "home-evaluation") {
      if (!form.get("name")) errs.name = "Name is required.";
    } else {
      if (!form.get("firstName")) errs.firstName = "First name is required.";
      if (!form.get("lastName")) errs.lastName = "Last name is required.";
    }
    const email = form.get("email") as string;
    if (!email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email address.";
    return errs;
  }

  async function handleSubmit(e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement;
  }) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("source", source);

    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setServerError(null);

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
      <div className="text-center py-12">
        <h3 className="font-display text-2xl font-bold tracking-tight mb-2">
          Thank You
        </h3>
        <p className="text-muted leading-7">
          We&apos;ve received your request. Check your email for a confirmation,
          and a member of our team will reach out shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && (
        <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
      )}
      {source === "home-evaluation" ? (
        <Input
          id="name"
          name="name"
          label="Name"
          placeholder="Your full name"
          required
          error={errors.name}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="firstName"
            name="firstName"
            label="First Name"
            placeholder="First Name"
            required
            error={errors.firstName}
          />
          <Input
            id="lastName"
            name="lastName"
            label="Last Name"
            placeholder="Last Name"
            required
            error={errors.lastName}
          />
        </div>
      )}
      <Input
        id="email"
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        required
        error={errors.email}
      />
      {showPhone && (
        <Input
          id="phone"
          name="phone"
          label="Phone"
          type="tel"
          placeholder="(555) 123-4567"
        />
      )}
      {source === "home-evaluation" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="addressLine"
              name="addressLine"
              label="Address Line"
              placeholder="123 Main St"
            />
            <Input
              id="unit"
              name="unit"
              label="Unit/Suite"
              placeholder="Apt 4B"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              id="city"
              name="city"
              label="City"
              placeholder="Toronto"
            />
            <Input
              id="province"
              name="province"
              label="Province/State"
              placeholder="ON"
            />
            <Input
              id="postalCode"
              name="postalCode"
              label="Postal Code"
              placeholder="M1M 1M1"
            />
          </div>
          <Textarea
            id="notes"
            name="notes"
            label="Additional Notes"
            placeholder="Tell us about any recent renovations, unique features, or specific questions you have."
            rows={4}
          />
        </>
      )}
      <Button
        type="submit"
        variant="primary"
        className="uppercase tracking-widest mt-2"
        disabled={submitting}
      >
        {submitting ? "Submitting\u2026" : "Submit"}
      </Button>
    </form>
  );
}
