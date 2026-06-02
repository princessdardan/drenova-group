import { stegaClean } from "next-sanity";

const safeHrefPattern = /^(\/(?!\/)[A-Za-z0-9/_#?=&.%+-]*|#[A-Za-z0-9_-]+|https:\/\/[^\s]+|mailto:[^\s@]+@[^\s@]+\.[^\s@]+|tel:\+?[0-9()\-\s]+)$/;

export function safeHref(href: string | undefined, fallback: string): string {
  if (!href) return fallback;
  const cleanHref = stegaClean(href);
  return safeHrefPattern.test(cleanHref) ? cleanHref : fallback;
}
