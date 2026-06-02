import type { Metadata } from "next";
import { stegaClean } from "next-sanity";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://drenova.ca"
).replace(/\/$/, "");

export function canonicalUrl(path = "/"): string {
  const cleanPath = stegaClean(path);
  const normalizedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function makeMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const cleanTitle = stegaClean(title);
  const cleanDescription = stegaClean(description);
  const url = canonicalUrl(path);

  return {
    title: cleanTitle,
    description: cleanDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      url,
    },
  };
}
