import Link from "next/link";

const navLinks = [
  { href: "/buy", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/listings", label: "Listings" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "#", label: "Instagram" },
  { href: "#", label: "LinkedIn" },
  { href: "#", label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="bg-[#0E1921] dark:bg-[#030910] text-[#F0F3F5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-10">
          <p className="font-display text-lg tracking-wider font-bold uppercase">
            Drenova Group
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-xs uppercase tracking-widest font-medium text-[#8B8E92] mb-4">
              Navigation
            </p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#C5CCD3] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest font-medium text-[#8B8E92] mb-4">
              Contact
            </p>
            <ul className="space-y-2 text-sm text-[#C5CCD3]">
              <li>123 Main Street, Suite 200</li>
              <li>Chicago, IL 60601</li>
              <li>
                <a href="tel:+15551234567" className="hover:text-white transition-colors">
                  (555) 123-4567
                </a>
              </li>
              <li>
                <a href="mailto:info@drenovagroup.com" className="hover:text-white transition-colors">
                  info@drenovagroup.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest font-medium text-[#8B8E92] mb-4">
              Follow Us
            </p>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#C5CCD3] hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2A3440] mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B6E72]">
            &copy; {new Date().getFullYear()} Drenova Group. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#6B6E72]">
            <Link href="/privacy" className="hover:text-[#C5CCD3] transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-[#C5CCD3] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
