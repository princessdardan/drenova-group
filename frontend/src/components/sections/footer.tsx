import Link from "next/link";
import { getSiteSettings } from "@/lib/sanity/fetch";

const socialIcons: Record<string, React.ReactNode> = {
  Facebook: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.092.045 1.541.112v3.217a8 8 0 0 0-.901-.034c-1.278 0-1.773.484-1.773 1.743v2.52h3.593l-.617 3.667h-2.976v8.177A12.008 12.008 0 0 0 12 24c-.471 0-.937-.027-1.399-.079a12 12 0 0 1-1.5-.23" />
    </svg>
  ),
  Instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.668 1.0745-1.3364 1.3802-2.1272.2957-.7642.4957-1.6362.552-2.9141.0564-1.2776.0689-1.6882.0626-4.9471-.0063-3.2588-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8504.6165 19.0891.321 18.2178.1197 16.9402.0645 15.6647.0078 15.2531-.0067 11.9769 0 8.7006.0063 8.2929.021 7.0301.084m.1402 21.6868c-1.1735-.0534-1.8117-.2472-2.2362-.4106-.5624-.2183-.963-.4783-1.3845-.9017-.4215-.4231-.679-.8221-.8962-1.3853-.1625-.4253-.3536-1.0639-.4046-2.2383-.0553-1.2706-.067-1.6531-.0714-4.8748-.0044-3.2218.0076-3.6026.0602-4.877.0533-1.1735.2471-1.8113.4106-2.2362.2189-.5622.4783-.963.9017-1.3843.4233-.4215.8223-.6793 1.3854-.8964.4247-.1628 1.0636-.3537 2.2378-.4049 1.2708-.0555 1.6534-.0672 4.8746-.071 3.2219-.0044 3.6027.0075 4.877.0601 1.1735.0534 1.8114.2472 2.2362.4107.5623.2183.963.4783 1.3845.9018.4215.423.6793.8222.8963 1.3853.1624.4247.3536 1.0638.4044 2.2382.0556 1.2704.068 1.6528.0714 4.8747.0043 3.2218-.0076 3.6024-.06 4.8772-.0534 1.1732-.2471 1.8112-.4107 2.2362-.2183.5622-.4783.963-.9017 1.3843-.4233.4215-.8224.6795-1.3854.8963-.4248.1625-1.0639.354-2.2383.4047-1.2706.0556-1.6528.0673-4.8746.0714-3.2218.0044-3.6025-.0073-4.8773-.06M8.0798 5.8322a1.3942 1.3942 0 1 0 2.27.0 1.3942 1.3942 0 0 0-2.27 0M5.8384 12.012a6.1618 6.1618 0 1 0 12.3236 0 6.1618 6.1618 0 0 0-12.3236 0M8.0198 12.012a3.9802 3.9802 0 1 1 7.9604 0 3.9802 3.9802 0 0 1-7.9604 0" />
    </svg>
  ),
  LinkedIn: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
    </svg>
  ),
  Twitter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  ),
};

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
      <div className="swiss-container section-md">
        {/* Swiss Grid Layout */}
        <div className="swiss-grid items-start">
          {/* Brand Column - Spans 4 columns */}
          <div className="col-span-12 lg:col-span-4">
            <p className="font-display text-lg tracking-wider font-bold uppercase mb-6">
              {companyName}
            </p>
            <p className="text-sm text-footer-muted leading-relaxed max-w-xs">
              Toronto, GTA & surrounding areas real estate. Your trusted partner in buying and selling your home.
            </p>
          </div>

          {/* Navigation Column - Spans 2 columns */}
          <nav className="col-span-6 lg:col-span-2" aria-label="Footer navigation">
            <p className="text-xs uppercase tracking-widest font-medium text-footer-muted mb-4">
              Navigate
            </p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-footer-link hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Column - Spans 3 columns */}
          <div className="col-span-6 lg:col-span-3">
            <p className="text-xs uppercase tracking-widest font-medium text-footer-muted mb-4">
              Contact
            </p>
            <address className="not-italic space-y-3">
              {address && (
                <p className="text-sm text-footer-link whitespace-pre-line">
                  {address}
                </p>
              )}
              {phone && (
                <p>
                  <a 
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`} 
                    className="text-sm text-footer-link hover:text-white transition-colors duration-200"
                  >
                    {phone}
                  </a>
                </p>
              )}
              {email && (
                <p>
                  <a 
                    href={`mailto:${email}`} 
                    className="text-sm text-footer-link hover:text-white transition-colors duration-200"
                  >
                    {email}
                  </a>
                </p>
              )}
              {officeHours && (
                <p className="text-sm text-footer-muted whitespace-pre-line mt-4 pt-4 border-t border-footer-border">
                  {officeHours}
                </p>
              )}
            </address>
          </div>

          {/* Social Column - Spans 3 columns */}
          {socialLinks.length > 0 && (
            <div className="col-span-12 lg:col-span-3">
              <p className="text-xs uppercase tracking-widest font-medium text-footer-muted mb-4">
                Follow
              </p>
              <ul className="flex items-center gap-4">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-footer-link hover:text-white transition-colors duration-200 p-2 -m-2"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                    >
                      {socialIcons[link.label] ?? link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-footer-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-footer-dim">
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-footer-dim">
            <Link 
              href="/privacy" 
              className="hover:text-footer-link transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="hover:text-footer-link transition-colors duration-200"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
