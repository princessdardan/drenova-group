"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const defaultNavLinks = [
  { href: "/buy", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/listings", label: "Listings" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationLinks?: { label: string; href: string }[];
  phone?: string;
  email?: string;
}

export function MobileMenu({
  isOpen,
  onClose,
  navigationLinks,
  phone,
  email,
}: MobileMenuProps) {
  const navLinks = navigationLinks && navigationLinks.length > 0
    ? navigationLinks
    : defaultNavLinks;

  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && containerRef.current) {
        const focusable = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  return (
    <div
      id="mobile-menu"
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className="fixed inset-0 z-50 transition-transform duration-300 ease-out"
      style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      aria-hidden={!isOpen}
    >
      {/* Glass background */}
      <div className="absolute inset-0 glass-strong" />
      
      <div className="relative flex flex-col h-full px-8 py-6">
        <div className="flex justify-end">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="p-2 text-foreground cursor-pointer hover:text-accent transition-colors duration-200"
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
              className="font-display text-3xl lg:text-4xl font-bold tracking-tight hover:text-accent transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="text-center pb-8">
          <p className="text-sm text-muted">{email ?? "info@drenovagroup.com"}</p>
          <p className="text-sm text-muted mt-1">{phone ?? "(555) 123-4567"}</p>
        </div>
      </div>
    </div>
  );
}
