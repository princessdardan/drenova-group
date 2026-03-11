import { draftMode } from "next/headers";
import { client, previewClient } from "./client";
import {
  allTeamMembersQuery,
  teamMemberBySlugQuery,
  allTestimonialsQuery,
  faqsByCategoryQuery,
  allCoverageAreasQuery,
  allCompanyStatsQuery,
  allCompanyValuesQuery,
  allValuePropositionsQuery,
  siteSettingsQuery,
  homePageQuery,
  aboutPageQuery,
  buyPageQuery,
  sellPageQuery,
  contactPageQuery,
  teamPageQuery,
  listingsPageQuery,
  legalPageBySlugQuery,
} from "./queries";
import type { TeamMember } from "@/types/team";
import type { Testimonial } from "@/types/testimonial";
import type {
  FAQ,
  CoverageArea,
  CompanyStat,
  CompanyValue,
  ValueProposition,
  SiteSettings,
  HomePage,
  AboutPage,
  BuyPage,
  SellPage,
  ContactPage,
  TeamPage,
  ListingsPage,
  LegalPage,
} from "@/types/sanity";

const DEFAULT_REVALIDATE = 3600;

async function sanityFetch<T>(
  query: string,
  tags: string[],
  params?: Record<string, string>
): Promise<T> {
  let isDraftMode = false;
  try {
    const draft = await draftMode();
    isDraftMode = draft.isEnabled;
  } catch {
    // draftMode() throws outside request scope (e.g. generateStaticParams)
  }

  if (isDraftMode) {
    return previewClient.fetch<T>(query, params ?? {});
  }

  return client.fetch<T>(query, params ?? {}, {
    next: { tags, revalidate: DEFAULT_REVALIDATE },
  });
}

// ─── Team Member fetchers ────────────────────────────────────────────

export function getTeamMembers(): Promise<TeamMember[]> {
  return sanityFetch<TeamMember[]>(allTeamMembersQuery, ["teamMember"]);
}

export function getTeamMemberBySlug(
  slug: string
): Promise<TeamMember | null> {
  return sanityFetch<TeamMember | null>(teamMemberBySlugQuery, ["teamMember"], {
    slug,
  });
}

// ─── Testimonial fetchers ────────────────────────────────────────────

export function getTestimonials(): Promise<Testimonial[]> {
  return sanityFetch<Testimonial[]>(allTestimonialsQuery, ["testimonial"]);
}

// ─── FAQ fetchers ────────────────────────────────────────────────────

export function getFaqsByCategory(category: string): Promise<FAQ[]> {
  return sanityFetch<FAQ[]>(faqsByCategoryQuery, ["faq"], { category });
}

// ─── Coverage Area fetchers ──────────────────────────────────────────

export function getCoverageAreas(): Promise<CoverageArea[]> {
  return sanityFetch<CoverageArea[]>(allCoverageAreasQuery, ["coverageArea"]);
}

// ─── Company Stat fetchers ───────────────────────────────────────────

export function getCompanyStats(): Promise<CompanyStat[]> {
  return sanityFetch<CompanyStat[]>(allCompanyStatsQuery, ["companyStat"]);
}

// ─── Company Value fetchers ──────────────────────────────────────────

export function getCompanyValues(): Promise<CompanyValue[]> {
  return sanityFetch<CompanyValue[]>(allCompanyValuesQuery, ["companyValue"]);
}

// ─── Value Proposition fetchers ──────────────────────────────────────

export function getValuePropositions(): Promise<ValueProposition[]> {
  return sanityFetch<ValueProposition[]>(allValuePropositionsQuery, [
    "valueProposition",
  ]);
}

// ─── Singleton fetchers ──────────────────────────────────────────────

export function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityFetch<SiteSettings | null>(siteSettingsQuery, ["siteSettings"]);
}

export function getHomePage(): Promise<HomePage | null> {
  return sanityFetch<HomePage | null>(homePageQuery, ["homePage"]);
}

export function getAboutPage(): Promise<AboutPage | null> {
  return sanityFetch<AboutPage | null>(aboutPageQuery, ["aboutPage"]);
}

export function getBuyPage(): Promise<BuyPage | null> {
  return sanityFetch<BuyPage | null>(buyPageQuery, ["buyPage"]);
}

export function getSellPage(): Promise<SellPage | null> {
  return sanityFetch<SellPage | null>(sellPageQuery, ["sellPage"]);
}

export function getContactPage(): Promise<ContactPage | null> {
  return sanityFetch<ContactPage | null>(contactPageQuery, ["contactPage"]);
}

export function getTeamPage(): Promise<TeamPage | null> {
  return sanityFetch<TeamPage | null>(teamPageQuery, ["teamPage"]);
}

export function getListingsPage(): Promise<ListingsPage | null> {
  return sanityFetch<ListingsPage | null>(listingsPageQuery, ["listingsPage"]);
}

export function getLegalPageBySlug(slug: string): Promise<LegalPage | null> {
  return sanityFetch<LegalPage | null>(legalPageBySlugQuery, ["legalPage"], {
    slug,
  });
}
