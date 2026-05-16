"use client";

import Link from "next/link";

export type NavLinkItem = {
  label: string;
  href: string;
};

export const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { href: "/buy", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/listings", label: "Listings" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

interface NavLinkListProps {
  links: NavLinkItem[];
  variant: "header" | "mobile" | "footer";
  onNavigate?: () => void;
}

const VARIANT_CLASSES = {
  header: "text-sm uppercase tracking-wider font-medium hover:text-accent transition-colors duration-200",
  mobile: "font-display text-3xl lg:text-4xl font-bold tracking-tight hover:text-accent transition-colors duration-200",
  footer: "text-sm text-footer-link hover:text-white transition-colors duration-200",
} as const;

export function NavLinkList({ links, variant, onNavigate }: NavLinkListProps) {
  const className = VARIANT_CLASSES[variant];

  if (variant === "footer") {
    return (
      <>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={className} onClick={onNavigate}>
              {link.label}
            </Link>
          </li>
        ))}
      </>
    );
  }

  return (
    <>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={className} onClick={onNavigate}>
          {link.label}
        </Link>
      ))}
    </>
  );
}
