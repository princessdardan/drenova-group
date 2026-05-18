import { draftMode } from "next/headers";
import { client, previewClient } from "./client";
import {
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
import type {
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

// ─── Team Member fetchers ────────────────────────────────────────────

export async function getTeamMembers(): Promise<TeamMember[]> {
  const teamPage = await getTeamPage();
  return teamPage?.members ?? [];
}

export async function getTeamMemberBySlug(
  slug: string
): Promise<TeamMember | null> {
  const members = await getTeamMembers();
  return members.find((member) => member.slug === slug) ?? null;
}

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
