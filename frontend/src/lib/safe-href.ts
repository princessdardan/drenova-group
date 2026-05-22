const safeHrefPattern = /^(\/(?!\/)[A-Za-z0-9/_#?=&.%+-]*|#[A-Za-z0-9_-]+|https:\/\/[^\s]+|mailto:[^\s@]+@[^\s@]+\.[^\s@]+|tel:\+?[0-9()\-\s]+)$/;

export function safeHref(href: string | undefined, fallback: string): string {
  if (!href) return fallback;
  return safeHrefPattern.test(href) ? href : fallback;
}
