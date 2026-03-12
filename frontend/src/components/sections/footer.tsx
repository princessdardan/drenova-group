import Link from "next/link";
import { getSiteSettings } from "@/lib/sanity/fetch";

const defaultNavLinks = [
  { href: "/buy", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/listings", label: "Listings" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

interface FooterProps {
  navigationLinks?: { label: string; href: string }[];
  officeHours?: string;
}

export async function Footer({ navigationLinks, officeHours }: FooterProps) {
  const settings = await getSiteSettings();

  const companyName = settings?.companyName ?? "Drenova Group";
  const address = settings?.address ?? "123 Main Street, Suite 200, Chicago, IL 60601";
  const phone = settings?.phone;
  const email = settings?.email;
  const social = settings?.socialLinks;
  const navLinks = navigationLinks && navigationLinks.length > 0
    ? navigationLinks
    : defaultNavLinks;

  const socialLinks = [
    social?.facebook ? { href: social.facebook, label: "Facebook" } : null,
    social?.instagram ? { href: social.instagram, label: "Instagram" } : null,
    social?.linkedin ? { href: social.linkedin, label: "LinkedIn" } : null,
    social?.twitter ? { href: social.twitter, label: "Twitter" } : null,
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="bg-footer-bg text-footer-text">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-10">
          <p className="font-display text-lg tracking-wider font-bold uppercase">
            {companyName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <nav aria-label="Footer navigation">
            <p className="text-xs uppercase tracking-widest font-medium text-footer-muted mb-4">
              Navigation
            </p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-footer-link hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs uppercase tracking-widest font-medium text-footer-muted mb-4">
              Contact
            </p>
            <address className="not-italic">
              <ul className="space-y-2 text-sm text-footer-link">
                {address && <li className="whitespace-pre-line">{address}</li>}
                {phone && (
                  <li>
                    <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:text-white transition-colors">
                      {phone}
                    </a>
                  </li>
                )}
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                      {email}
                    </a>
                  </li>
                )}
                {officeHours && (
                  <li className="whitespace-pre-line mt-4 text-footer-muted">
                    {officeHours}
                  </li>
                )}
              </ul>
            </address>
          </div>

          {socialLinks.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest font-medium text-footer-muted mb-4">
                Follow Us
              </p>
              <ul className="space-y-2">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-footer-link hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-footer-border mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-footer-dim">
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-footer-dim">
            <Link href="/privacy" className="hover:text-footer-link transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-footer-link transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
