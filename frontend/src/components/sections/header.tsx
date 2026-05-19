"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "@/components/sections/mobile-menu";
import { DEFAULT_NAV_LINKS, NavLinkItem, NavLinkList } from "@/components/sections/nav-link-list";

interface HeaderProps {
  navigationLinks?: NavLinkItem[];
  phone?: string;
  email?: string;
}

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getScrollSnapshot() {
  return window.scrollY > 50;
}

function getServerScrollSnapshot() {
  return false;
}

export function Header({ navigationLinks, phone, email }: HeaderProps) {
  const pathname = usePathname();
  const isListingRoute = pathname === "/listings" || pathname.startsWith("/listings/");
  const hasScrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    getServerScrollSnapshot
  );
  const isSolidHeader = isListingRoute || hasScrolled;

  const [menuOpen, setMenuOpen] = useState(false);

  const allLinks = navigationLinks ?? DEFAULT_NAV_LINKS;

  return (
    <>
      <header
        className={`fixed z-40 transition-all duration-300 ease-out ${
          isSolidHeader
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
              className="p-3 -mr-3 cursor-pointer lg:hidden hover:text-accent transition-colors duration-200"
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
