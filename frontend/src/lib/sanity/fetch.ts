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
  buyersGuidePageQuery,
  sellersGuidePageQuery,
  homeEvaluationPageQuery,
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
  BuyersGuidePage,
  SellersGuidePage,
  HomeEvaluationPage,
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

function collectionFetcher<T>(query: string, tag: string): () => Promise<T[]> {
  return () => sanityFetch<T[]>(query, [tag]);
}

function singletonFetcher<T>(query: string, tag: string): () => Promise<T | null> {
  return () => sanityFetch<T | null>(query, [tag]);
}

function paramFetcher<T>(
  query: string,
  tag: string,
  paramName: string
): (value: string) => Promise<T> {
  return (value: string) => sanityFetch<T>(query, [tag], { [paramName]: value });
}

// ─── Team Member fetchers ────────────────────────────────────────────

export const getTeamMembers = collectionFetcher<TeamMember>(
  allTeamMembersQuery,
  "teamMember"
);

export const getTeamMemberBySlug = paramFetcher<TeamMember | null>(
  teamMemberBySlugQuery,
  "teamMember",
  "slug"
);

// ─── Testimonial fetchers ────────────────────────────────────────────

export const getTestimonials = collectionFetcher<Testimonial>(
  allTestimonialsQuery,
  "testimonial"
);

// ─── FAQ fetchers ────────────────────────────────────────────────────

export const getFaqsByCategory = paramFetcher<FAQ[]>(
  faqsByCategoryQuery,
  "faq",
  "category"
);

// ─── Coverage Area fetchers ──────────────────────────────────────────

export const getCoverageAreas = collectionFetcher<CoverageArea>(
  allCoverageAreasQuery,
  "coverageArea"
);

// ─── Company Stat fetchers ───────────────────────────────────────────

export const getCompanyStats = collectionFetcher<CompanyStat>(
  allCompanyStatsQuery,
  "companyStat"
);

// ─── Company Value fetchers ──────────────────────────────────────────

export const getCompanyValues = collectionFetcher<CompanyValue>(
  allCompanyValuesQuery,
  "companyValue"
);

// ─── Value Proposition fetchers ──────────────────────────────────────

export const getValuePropositions = collectionFetcher<ValueProposition>(
  allValuePropositionsQuery,
  "valueProposition"
);

// ─── Singleton fetchers ──────────────────────────────────────────────

export const getSiteSettings = singletonFetcher<SiteSettings>(
  siteSettingsQuery,
  "siteSettings"
);

export const getHomePage = singletonFetcher<HomePage>(
  homePageQuery,
  "homePage"
);

export const getAboutPage = singletonFetcher<AboutPage>(
  aboutPageQuery,
  "aboutPage"
);

export const getBuyPage = singletonFetcher<BuyPage>(buyPageQuery, "buyPage");

export const getSellPage = singletonFetcher<SellPage>(
  sellPageQuery,
  "sellPage"
);

export const getContactPage = singletonFetcher<ContactPage>(
  contactPageQuery,
  "contactPage"
);

export const getTeamPage = singletonFetcher<TeamPage>(
  teamPageQuery,
  "teamPage"
);

export const getListingsPage = singletonFetcher<ListingsPage>(
  listingsPageQuery,
  "listingsPage"
);

export const getLegalPageBySlug = paramFetcher<LegalPage | null>(
  legalPageBySlugQuery,
  "legalPage",
  "slug"
);

// ─── Guide page fetchers ────────────────────────────────────────────

export const getBuyersGuidePage = singletonFetcher<BuyersGuidePage>(
  buyersGuidePageQuery,
  "buyersGuidePage"
);

export const getSellersGuidePage = singletonFetcher<SellersGuidePage>(
  sellersGuidePageQuery,
  "sellersGuidePage"
);

export const getHomeEvaluationPage = singletonFetcher<HomeEvaluationPage>(
  homeEvaluationPageQuery,
  "homeEvaluationPage"
);
