"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "@/components/sections/mobile-menu";
import { DEFAULT_NAV_LINKS, NavLinkItem, NavLinkList } from "@/components/sections/nav-link-list";

interface HeaderProps {
  navigationLinks?: NavLinkItem[];
  phone?: string;
  email?: string;
}

export function Header({ navigationLinks, phone, email }: HeaderProps) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(!isHomepage);

  const allLinks = navigationLinks ?? DEFAULT_NAV_LINKS;

  useEffect(() => {
    // Only track scroll on homepage; other pages always show scrolled state
    if (!isHomepage) return;

    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomepage]);

  return (
    <>
      <header
        className={`fixed z-40 transition-all duration-300 ease-out ${
          scrolled
            ? "glass-nav top-4 left-4 right-4 rounded-2xl max-w-[calc(100%-2rem)] mx-auto"
            : "top-0 left-0 right-0 text-white"
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
            <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
              <NavLinkList links={allLinks} variant="header" />
            </nav>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="p-2 cursor-pointer lg:hidden hover:text-accent transition-colors duration-200"
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
