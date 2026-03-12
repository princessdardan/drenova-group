"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MobileMenu } from "@/components/sections/mobile-menu";

const defaultDesktopLinks = [
  { href: "/buy", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/listings", label: "Listings" },
];

interface HeaderProps {
  navigationLinks?: { label: string; href: string }[];
  phone?: string;
  email?: string;
}

export function Header({ navigationLinks, phone, email }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Desktop header shows a subset of links (first 3 by default)
  const desktopLinks = navigationLinks
    ? navigationLinks.slice(0, 3)
    : defaultDesktopLinks;

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
          scrolled
            ? "bg-background/95 backdrop-blur-sm border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 lg:h-20 px-6 lg:px-8">
          <Link
            href="/"
            className="font-display text-lg tracking-wider font-bold uppercase"
          >
            Drenova Group
          </Link>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8" aria-label="Main">
              {desktopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm uppercase tracking-wider font-medium hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="p-2 cursor-pointer"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        navigationLinks={navigationLinks}
        phone={phone}
        email={email}
      />
    </>
  );
}
