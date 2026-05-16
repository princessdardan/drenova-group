"use client";

import { useEffect, useRef, useCallback } from "react";
import { DEFAULT_NAV_LINKS, NavLinkItem, NavLinkList } from "@/components/sections/nav-link-list";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationLinks?: NavLinkItem[];
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
    : DEFAULT_NAV_LINKS;

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
      
      <div className="relative flex flex-col h-full px-8 py-6 overflow-y-auto">
        <div className="flex justify-end shrink-0">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="p-3 -mr-3 -mt-3 text-foreground cursor-pointer hover:text-accent transition-colors duration-200"
            aria-label="Close menu"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M7 7l14 14M21 7L7 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        
        <nav className="flex flex-col items-center justify-center flex-1 gap-8">
          <NavLinkList links={navLinks} variant="mobile" onNavigate={onClose} />
        </nav>
        
        <div className="text-center pb-8">
          <p className="text-sm text-muted">{email ?? "info@drenovagroup.com"}</p>
          <p className="text-sm text-muted mt-1">{phone ?? "(555) 123-4567"}</p>
        </div>
      </div>
    </div>
  );
}
