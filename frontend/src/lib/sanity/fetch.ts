import { draftMode } from "next/headers";
import { client, previewClient } from "./client";
import {
  allListingsQuery,
  activeListingsQuery,
  listingBySlugQuery,
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
} from "./queries";
import type { Listing } from "@/types/listing";
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

// ─── Listing fetchers ────────────────────────────────────────────────

export function getListings(): Promise<Listing[]> {
  return sanityFetch<Listing[]>(allListingsQuery, ["listing"]);
}

export function getActiveListings(): Promise<Listing[]> {
  return sanityFetch<Listing[]>(activeListingsQuery, ["listing"]);
}

export function getListingBySlug(slug: string): Promise<Listing | null> {
  return sanityFetch<Listing | null>(listingBySlugQuery, ["listing"], { slug });
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
  return sanityFetch<HomePage | null>(homePageQuery, ["homePage", "listing"]);
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
