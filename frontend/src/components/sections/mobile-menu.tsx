"use client";

import { useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/buy", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/listings", label: "Listings" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 transition-transform duration-300 ease-out"
      style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      aria-hidden={!isOpen}
    >
      <div className="absolute inset-0 bg-background" />
      <div className="relative flex flex-col h-full px-8 py-6">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-foreground cursor-pointer"
            aria-label="Close menu"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M7 7l14 14M21 7L7 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center flex-1 gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="font-display text-3xl lg:text-4xl font-bold tracking-tight hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="text-center pb-8">
          <p className="text-sm text-muted">info@drenovagroup.com</p>
          <p className="text-sm text-muted">(555) 123-4567</p>
        </div>
      </div>
    </div>
  );
}
