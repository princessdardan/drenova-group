import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/sections/hero";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Drenova Group. Reach out for buying, selling, or general real estate inquiries.",
};

export default function ContactPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image="https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=1600&q=80"
        imageAlt="Modern office interior"
        title="Get in Touch"
        subtitle="Have a question or ready to get started? We'd love to hear from you."
        size="short"
      />

      {/* ─── Form + Office Info ─── */}
      <section className="bg-background py-16 px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl lg:text-4xl font-bold tracking-tight mb-6">
              Send Us a Message
            </h2>
            <ContactForm />
          </div>

          <div>
            <h2 className="font-display text-2xl lg:text-4xl font-bold tracking-tight mb-6">
              Office Information
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest font-medium text-muted mb-2">
                  Address
                </p>
                <p className="leading-7">
                  123 Main Street, Suite 200
                  <br />
                  Chicago, IL 60601
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-medium text-muted mb-2">
                  Phone
                </p>
                <p>
                  <a href="tel:+15551234567" className="hover:text-accent transition-colors">
                    (555) 123-4567
                  </a>
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-medium text-muted mb-2">
                  Email
                </p>
                <p>
                  <a href="mailto:info@drenovagroup.com" className="hover:text-accent transition-colors">
                    info@drenovagroup.com
                  </a>
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-medium text-muted mb-2">
                  Office Hours
                </p>
                <p className="leading-7">
                  Monday – Friday: 9:00 AM – 6:00 PM
                  <br />
                  Saturday: 10:00 AM – 4:00 PM
                  <br />
                  Sunday: By Appointment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quick Links ─── */}
      <section className="bg-surface py-16 px-6 lg:py-24 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/buy"
            className="group block bg-surface-alt p-8 rounded-lg border border-border hover:shadow-lg transition-shadow"
          >
            <p className="text-xs uppercase tracking-widest font-medium text-accent mb-2">
              For Buyers
            </p>
            <h3 className="font-display text-xl font-bold tracking-tight mb-2">
              Looking to Buy?
            </h3>
            <p className="text-sm text-muted">
              Explore our buying guide and browse available listings.
            </p>
          </Link>
          <Link
            href="/sell"
            className="group block bg-surface-alt p-8 rounded-lg border border-border hover:shadow-lg transition-shadow"
          >
            <p className="text-xs uppercase tracking-widest font-medium text-accent mb-2">
              For Sellers
            </p>
            <h3 className="font-display text-xl font-bold tracking-tight mb-2">
              Ready to Sell?
            </h3>
            <p className="text-sm text-muted">
              Learn about our selling process and request a free home valuation.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
