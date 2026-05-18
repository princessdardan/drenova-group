/**
 * Seed script for Sanity CMS.
 *
 * Dry-run by default:
 *   npm run seed
 *
 * Write the generated payloads:
 *   npm run seed -- --commit
 *
 * The generated payloads are built from currently published Sanity documents.
 * Legacy standalone page-only documents are normalized into the embedded array
 * fields used by the current singleton schemas. Listing documents are never
 * seeded here because the frontend listings flow is AMPRE/Redis-backed.
 */

import { createClient, type SanityClient } from "@sanity/client";

const COMMIT_FLAG = "--commit";
const isCommit = process.argv.includes(COMMIT_FLAG);

const client = createClient({
  projectId: "apggi8zn",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

type SanitySlug = {
  _type?: "slug";
  current?: string;
};

type SourceDocument = {
  _id: string;
  _type: string;
  slug?: SanitySlug;
  order?: number;
  category?: string;
} & Record<string, unknown>;

type SeedDocument = {
  _id: string;
  _type: string;
} & Record<string, unknown>;

type SourcePayload = {
  siteSettings?: SourceDocument;
  homePage?: SourceDocument;
  aboutPage?: SourceDocument;
  buyPage?: SourceDocument;
  sellPage?: SourceDocument;
  contactPage?: SourceDocument;
  teamPage?: SourceDocument;
  listingsPage?: SourceDocument;
  buyersGuidePage?: SourceDocument;
  sellersGuidePage?: SourceDocument;
  homeEvaluationPage?: SourceDocument;
  teamMembers: SourceDocument[];
  testimonials: SourceDocument[];
  faqs: SourceDocument[];
  coverageAreas: SourceDocument[];
  companyValues: SourceDocument[];
  companyStats: SourceDocument[];
  valuePropositions: SourceDocument[];
  legalPages: SourceDocument[];
};

type LiveHomeEvaluationContent = {
  overline: string;
  title: string;
  subtitle: string;
  formHeading: string;
  formDescription: string;
};

type EmbeddedSummary = Record<string, number>;

type BuildSummary = {
  documents: SeedDocument[];
  embeddedCounts: EmbeddedSummary;
  sourceCounts: Record<string, number>;
  excludedCounts: Record<string, number>;
};

const singletonTypes = [
  "siteSettings",
  "homePage",
  "aboutPage",
  "buyPage",
  "sellPage",
  "contactPage",
  "teamPage",
  "listingsPage",
  "buyersGuidePage",
  "sellersGuidePage",
  "homeEvaluationPage",
] as const;

const legacySourceTypes = [
  "teamMember",
  "testimonial",
  "faq",
  "coverageArea",
  "companyValue",
  "companyStat",
  "valueProposition",
] as const;

const publishedDocumentFilter =
  '!(_id in path("drafts.**")) && !(_id in path("versions.**"))';

const sourceQuery = `{
  "siteSettings": *[_id == "siteSettings" && _type == "siteSettings" && ${publishedDocumentFilter}][0],
  "homePage": *[_id == "homePage" && _type == "homePage" && ${publishedDocumentFilter}][0],
  "aboutPage": *[_id == "aboutPage" && _type == "aboutPage" && ${publishedDocumentFilter}][0],
  "buyPage": *[_id == "buyPage" && _type == "buyPage" && ${publishedDocumentFilter}][0],
  "sellPage": *[_id == "sellPage" && _type == "sellPage" && ${publishedDocumentFilter}][0],
  "contactPage": *[_id == "contactPage" && _type == "contactPage" && ${publishedDocumentFilter}][0],
  "teamPage": *[_id == "teamPage" && _type == "teamPage" && ${publishedDocumentFilter}][0],
  "listingsPage": *[_id == "listingsPage" && _type == "listingsPage" && ${publishedDocumentFilter}][0],
  "buyersGuidePage": *[_id == "buyersGuidePage" && _type == "buyersGuidePage" && ${publishedDocumentFilter}][0],
  "sellersGuidePage": *[_id == "sellersGuidePage" && _type == "sellersGuidePage" && ${publishedDocumentFilter}][0],
  "homeEvaluationPage": *[_id == "homeEvaluationPage" && _type == "homeEvaluationPage" && ${publishedDocumentFilter}][0],
  "teamMembers": *[_type == "teamMember" && ${publishedDocumentFilter}] | order(name asc),
  "testimonials": *[_type == "testimonial" && ${publishedDocumentFilter}] | order(order asc, name asc),
  "faqs": *[_type == "faq" && ${publishedDocumentFilter}] | order(order asc, question asc),
  "coverageAreas": *[_type == "coverageArea" && ${publishedDocumentFilter}] | order(order asc, state asc),
  "companyValues": *[_type == "companyValue" && ${publishedDocumentFilter}] | order(order asc, title asc),
  "companyStats": *[_type == "companyStat" && ${publishedDocumentFilter}] | order(order asc, label asc),
  "valuePropositions": *[_type == "valueProposition" && ${publishedDocumentFilter}] | order(order asc, title asc),
  "legalPages": *[_type == "legalPage" && ${publishedDocumentFilter}] | order(slug.current asc, title asc)
}`;

const staleStringMarkers = [
  "info@drenovagroup.com",
  "123 Main Street",
  "Chicago, IL 60601",
  "Illinois, Arizona, Wisconsin, Indiana, and Michigan",
  "Operating across Illinois, Arizona, Wisconsin, Indiana, and Michigan",
  "Semir Drenova",
  "Elena Vasquez",
  "Marcus Chen",
  "Sarah Mitchell",
  "David Okafor",
  "123 Maple Drive",
  "456 Oak Avenue",
  "789 Elm Street",
  "321 Birch Lane",
  "555 Cedar Court",
  "102 Desert Ridge",
  "88 Lakeshore Drive",
  "240 Prairie Path",
  "17 Summit Place",
  "400 River Road",
  "62 Harbor View",
  "905 Michigan Avenue",
  "Sold in Naperville, IL",
  "Sold in Chicago, IL",
  "Purchased in Scottsdale, AZ",
  "Purchased in Evanston, IL",
  "Investment Property, Phoenix, AZ",
  "laws of the State of Illinois, without regard to its conflict of law provisions",
  "Featured Properties",
  "Explore Our Listings",
] as const;

const staleTestimonialDetails = new Set<string>([
  "Sold in Naperville, IL",
  "Sold in Chicago, IL",
  "Purchased in Scottsdale, AZ",
  "Purchased in Evanston, IL",
  "Investment Property, Phoenix, AZ",
]);

const legacyIllinoisGoverningLaw =
  "laws of the State of Illinois, without regard to its conflict of law provisions";

const currentOntarioGoverningLaw =
  "laws of Ontario and the federal laws of Canada applicable therein, without regard to conflict of law provisions";

const liveHomeEvaluationUrl = "https://drenova.ca/home-evaluation";

const staleRegexMarkers = [
  /\(555\)\s?100-000\d/,
  /\(555\)\s?123-4567/,
  /https:\/\/images\.unsplash\.com\//,
  /listing-(?:1|2|3|4|5|6|7|8|9|10|11|12)\b/,
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stripSanityMetadata(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => stripSanityMetadata(item));
  }

  if (!isRecord(value)) {
    return value;
  }

  const clean: Record<string, unknown> = {};

  for (const [key, item] of Object.entries(value)) {
    if (["_createdAt", "_updatedAt", "_rev", "_system"].includes(key)) {
      continue;
    }

    const normalized = stripSanityMetadata(item);
    if (normalized !== undefined) {
      clean[key] = normalized;
    }
  }

  return clean;
}

function stripUndefined(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item)).filter((item) => item !== undefined);
  }

  if (!isRecord(value)) {
    return value;
  }

  const clean: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (item === undefined) {
      continue;
    }

    const normalized = stripUndefined(item);
    if (normalized !== undefined) {
      clean[key] = normalized;
    }
  }

  return clean;
}

function normalizeKey(value: string, fallback: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return normalized || fallback;
}

function hasCurrentSlug(value: unknown): value is { current: string } {
  return isRecord(value) && typeof value.current === "string" && value.current.length > 0;
}

function documentKey(document: SourceDocument, fallbackPrefix: string): string {
  const slug = hasCurrentSlug(document.slug) ? document.slug.current : undefined;
  const base = slug ?? document._id.replace(/^drafts\./, "");
  return normalizeKey(base, `${fallbackPrefix}-${normalizeKey(document._id, "source")}`);
}

function ensureSourceDocument(
  payload: SourcePayload,
  type: (typeof singletonTypes)[number]
): SourceDocument {
  const document = payload[type];
  if (!document) {
    throw new Error(`Published singleton ${type} was not found in Sanity.`);
  }

  return document;
}

function cloneAsSeedDocument(source: SourceDocument, id: string, type: string): SeedDocument {
  const stripped = stripSanityMetadata(source);
  if (!isRecord(stripped)) {
    throw new Error(`Unable to normalize source document ${source._id}.`);
  }

  return stripUndefined({ ...stripped, _id: id, _type: type }) as SeedDocument;
}

function buildSeedDocument(
  source: SourceDocument,
  id: string,
  type: string,
  fields: readonly string[]
): SeedDocument {
  const document: SeedDocument = { _id: id, _type: type };

  for (const field of fields) {
    if (field in source) {
      document[field] = stripSanityMetadata(source[field]);
    }
  }

  return stripUndefined(document) as SeedDocument;
}

function buildHomeEvaluationFromLive(content: LiveHomeEvaluationContent): SeedDocument {
  return {
    _id: "homeEvaluationPage",
    _type: "homeEvaluationPage",
    hero: {
      _type: "heroSettings",
      overline: content.overline,
      title: content.title,
      subtitle: content.subtitle,
    },
    formHeading: content.formHeading,
    formDescription: content.formDescription,
  };
}

function pickEmbeddedFields(
  document: SourceDocument,
  objectType: string,
  fallbackPrefix: string,
  fields: readonly string[]
): Record<string, unknown> {
  const item: Record<string, unknown> = {
    _key: documentKey(document, fallbackPrefix),
    _type: objectType,
  };

  for (const field of fields) {
    if (field in document) {
      item[field] = stripSanityMetadata(document[field]);
    }
  }

  return stripUndefined(item) as Record<string, unknown>;
}

function cleanExistingArray(value: unknown, prefix: string): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item, index) => {
    const stripped = stripSanityMetadata(item);
    if (!isRecord(stripped)) {
      return [];
    }

    const key = typeof stripped._key === "string" ? stripped._key : `${prefix}-${index + 1}`;
    return [stripUndefined({ ...stripped, _key: key }) as Record<string, unknown>];
  });
}

function legacyOrExisting(
  legacyItems: Record<string, unknown>[],
  singleton: SourceDocument,
  field: string,
  prefix: string
): Record<string, unknown>[] {
  return legacyItems.length > 0 ? legacyItems : cleanExistingArray(singleton[field], prefix);
}

function normalizeLegalPage(
  document: SourceDocument,
  currentEmail: string | undefined,
  currentPhone: string | undefined
): SeedDocument {
  const cloned = cloneAsSeedDocument(
    document,
    hasCurrentSlug(document.slug) ? `legal-${document.slug.current}` : document._id,
    "legalPage"
  );

  return normalizeKnownLegacyLegalMarkers(cloned, currentEmail, currentPhone) as SeedDocument;
}

function normalizeKnownLegacyLegalMarkers(
  value: unknown,
  currentEmail: string | undefined,
  currentPhone: string | undefined
): unknown {
  if (typeof value === "string") {
    let normalized = value;

    if (currentEmail) {
      normalized = normalized.replace(/info@drenovagroup\.com/g, currentEmail);
    }

    if (currentPhone) {
      normalized = normalized.replace(/\(555\)\s?\d{3}-\d{4}/g, currentPhone);
    }

    normalized = normalized.replace(legacyIllinoisGoverningLaw, currentOntarioGoverningLaw);

    return normalized;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeKnownLegacyLegalMarkers(item, currentEmail, currentPhone));
  }

  if (!isRecord(value)) {
    return value;
  }

  const normalized: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    normalized[key] = normalizeKnownLegacyLegalMarkers(item, currentEmail, currentPhone);
  }

  return normalized;
}

function isStaleLegacyTestimonial(document: SourceDocument): boolean {
  return typeof document.detail === "string" && staleTestimonialDetails.has(document.detail);
}

function validateNoStaleSeedContent(documents: SeedDocument[]) {
  const serialized = JSON.stringify(documents);
  const failures: string[] = [];

  for (const marker of staleStringMarkers) {
    if (serialized.includes(marker)) {
      failures.push(marker);
    }
  }

  for (const marker of staleRegexMarkers) {
    if (marker.test(serialized)) {
      failures.push(marker.source);
    }
  }

  const oldCoverageStates = new Set(["Illinois", "Arizona", "Wisconsin", "Indiana", "Michigan"]);
  for (const document of documents) {
    for (const field of ["coverageAreas", "values", "valuePropositions"]) {
      const items = document[field];
      if (!Array.isArray(items)) {
        continue;
      }

      for (const item of items) {
        if (isRecord(item) && typeof item.state === "string" && oldCoverageStates.has(item.state)) {
          failures.push(`${document._id}.${field}.${item.state}`);
        }
      }
    }
  }

  if (failures.length > 0) {
    throw new Error(
      `Generated seed payload still contains known stale seed marker(s): ${failures.join(", ")}`
    );
  }
}

function buildSeedPayload(source: SourcePayload): BuildSummary {
  const siteSettings = buildSeedDocument(
    ensureSourceDocument(source, "siteSettings"),
    "siteSettings",
    "siteSettings",
    [
      "companyName",
      "tagline",
      "phone",
      "email",
      "address",
      "officeHours",
      "navigationLinks",
      "socialLinks",
    ]
  );
  const homePage = buildSeedDocument(ensureSourceDocument(source, "homePage"), "homePage", "homePage", [
    "hero",
    "aboutSection",
    "valuePropositions",
    "workWithUsHeading",
    "ctaCard1",
    "ctaCard2",
    "contactForm",
  ]);
  const aboutPage = buildSeedDocument(ensureSourceDocument(source, "aboutPage"), "aboutPage", "aboutPage", [
    "hero",
    "storyContent",
    "storyOverline",
    "storyTitle",
    "storyImage",
    "valuesHeading",
    "values",
    "coverageHeading",
    "coverageAreas",
    "stats",
    "cta",
  ]);
  const buyPage = buildSeedDocument(ensureSourceDocument(source, "buyPage"), "buyPage", "buyPage", [
    "hero",
    "benefits",
    "benefitsHeading",
    "processSteps",
    "processHeading",
    "coverageHeading",
    "coverageAreas",
    "faqHeading",
    "faqs",
    "cta",
  ]);
  const sellPage = buildSeedDocument(ensureSourceDocument(source, "sellPage"), "sellPage", "sellPage", [
    "hero",
    "benefits",
    "benefitsHeading",
    "processSteps",
    "processHeading",
    "valuation",
    "storiesHeading",
    "testimonials",
    "faqHeading",
    "faqs",
    "cta",
  ]);
  const contactPage = buildSeedDocument(
    ensureSourceDocument(source, "contactPage"),
    "contactPage",
    "contactPage",
    ["hero", "quickLinks"]
  );
  const teamPage = buildSeedDocument(ensureSourceDocument(source, "teamPage"), "teamPage", "teamPage", [
    "hero",
    "members",
    "cta",
  ]);
  const listingsPage = buildSeedDocument(
    ensureSourceDocument(source, "listingsPage"),
    "listingsPage",
    "listingsPage",
    ["overline", "title", "featuredListingKeys"]
  );
  const buyersGuidePage = buildSeedDocument(
    ensureSourceDocument(source, "buyersGuidePage"),
    "buyersGuidePage",
    "buyersGuidePage",
    ["hero", "guideTitle", "guideDescription", "guideImage", "cta"]
  );
  const sellersGuidePage = buildSeedDocument(
    ensureSourceDocument(source, "sellersGuidePage"),
    "sellersGuidePage",
    "sellersGuidePage",
    ["hero", "guideTitle", "guideDescription", "guideImage", "cta"]
  );
  const homeEvaluationPage = buildSeedDocument(
    ensureSourceDocument(source, "homeEvaluationPage"),
    "homeEvaluationPage",
    "homeEvaluationPage",
    ["hero", "formHeading", "formDescription"]
  );

  const teamMembers = source.teamMembers.map((document) =>
    pickEmbeddedFields(document, "teamMember", "team-member", [
      "name",
      "slug",
      "role",
      "image",
      "bio",
      "phone",
      "email",
    ])
  );
  const validTestimonials = source.testimonials.filter(
    (document) => !isStaleLegacyTestimonial(document)
  );
  const excludedStaleTestimonials = source.testimonials.length - validTestimonials.length;
  const testimonials = validTestimonials.map((document) =>
    pickEmbeddedFields(document, "testimonial", "testimonial", ["quote", "name", "detail"])
  );
  const buyerFaqs = source.faqs
    .filter((document) => document.category === "buyer")
    .map((document) => pickEmbeddedFields(document, "faq", "buyer-faq", ["question", "answer"]));
  const sellerFaqs = source.faqs
    .filter((document) => document.category === "seller")
    .map((document) => pickEmbeddedFields(document, "faq", "seller-faq", ["question", "answer"]));
  const coverageAreas = source.coverageAreas.map((document) =>
    pickEmbeddedFields(document, "coverageArea", "coverage-area", ["state", "cities"])
  );
  const companyValues = source.companyValues.map((document) =>
    pickEmbeddedFields(document, "companyValue", "company-value", ["title", "description"])
  );
  const companyStats = source.companyStats.map((document) =>
    pickEmbeddedFields(document, "companyStat", "company-stat", ["label", "value"])
  );
  const valuePropositions = source.valuePropositions.map((document) =>
    pickEmbeddedFields(document, "valueProposition", "value-proposition", ["title", "description"])
  );

  homePage.valuePropositions = legacyOrExisting(
    valuePropositions,
    ensureSourceDocument(source, "homePage"),
    "valuePropositions",
    "value-proposition"
  );
  aboutPage.values = legacyOrExisting(
    companyValues,
    ensureSourceDocument(source, "aboutPage"),
    "values",
    "company-value"
  );
  aboutPage.coverageAreas = legacyOrExisting(
    coverageAreas,
    ensureSourceDocument(source, "aboutPage"),
    "coverageAreas",
    "coverage-area"
  );
  aboutPage.stats = legacyOrExisting(
    companyStats,
    ensureSourceDocument(source, "aboutPage"),
    "stats",
    "company-stat"
  );
  buyPage.coverageAreas = legacyOrExisting(
    coverageAreas,
    ensureSourceDocument(source, "buyPage"),
    "coverageAreas",
    "coverage-area"
  );
  buyPage.faqs = legacyOrExisting(buyerFaqs, ensureSourceDocument(source, "buyPage"), "faqs", "buyer-faq");
  sellPage.testimonials = legacyOrExisting(
    testimonials,
    ensureSourceDocument(source, "sellPage"),
    "testimonials",
    "testimonial"
  );
  sellPage.faqs = legacyOrExisting(sellerFaqs, ensureSourceDocument(source, "sellPage"), "faqs", "seller-faq");
  teamPage.members = legacyOrExisting(
    teamMembers,
    ensureSourceDocument(source, "teamPage"),
    "members",
    "team-member"
  );

  const currentEmail = typeof siteSettings.email === "string" ? siteSettings.email : undefined;
  const currentPhone = typeof siteSettings.phone === "string" ? siteSettings.phone : undefined;
  const legalPages = source.legalPages.map((document) =>
    normalizeLegalPage(document, currentEmail, currentPhone)
  );

  const documents = [
    siteSettings,
    homePage,
    aboutPage,
    buyPage,
    sellPage,
    contactPage,
    teamPage,
    listingsPage,
    buyersGuidePage,
    sellersGuidePage,
    homeEvaluationPage,
    ...legalPages,
  ];

  validateNoStaleSeedContent(documents);

  return {
    documents,
    embeddedCounts: {
      "homePage.valuePropositions": arrayCount(homePage.valuePropositions),
      "aboutPage.values": arrayCount(aboutPage.values),
      "aboutPage.coverageAreas": arrayCount(aboutPage.coverageAreas),
      "aboutPage.stats": arrayCount(aboutPage.stats),
      "buyPage.coverageAreas": arrayCount(buyPage.coverageAreas),
      "buyPage.faqs": arrayCount(buyPage.faqs),
      "sellPage.testimonials": arrayCount(sellPage.testimonials),
      "sellPage.faqs": arrayCount(sellPage.faqs),
      "teamPage.members": arrayCount(teamPage.members),
    },
    sourceCounts: {
      teamMember: source.teamMembers.length,
      testimonial: source.testimonials.length,
      faq: source.faqs.length,
      coverageArea: source.coverageAreas.length,
      companyValue: source.companyValues.length,
      companyStat: source.companyStats.length,
      valueProposition: source.valuePropositions.length,
      legalPage: source.legalPages.length,
    },
    excludedCounts: {
      staleLegacyTestimonials: excludedStaleTestimonials,
    },
  };
}

function arrayCount(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

async function fetchSource(): Promise<SourcePayload> {
  const source = await client.fetch<SourcePayload>(sourceQuery);

  if (!source.homeEvaluationPage) {
    source.homeEvaluationPage = buildHomeEvaluationFromLive(await fetchLiveHomeEvaluationContent());
  }

  return source;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function htmlToLines(html: string): string[] {
  return decodeHtml(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "\n")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "\n")
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function extractRequiredLine(lines: string[], value: string): string {
  const line = lines.find((item) => item === value);
  if (!line) {
    throw new Error(`Unable to derive required live home evaluation content: ${value}`);
  }

  return line;
}

async function fetchLiveHomeEvaluationContent(): Promise<LiveHomeEvaluationContent> {
  const response = await fetch(liveHomeEvaluationUrl);
  if (!response.ok) {
    throw new Error(
      `Published singleton homeEvaluationPage was not found in Sanity and ${liveHomeEvaluationUrl} returned ${response.status}.`
    );
  }

  const lines = htmlToLines(await response.text());
  return {
    overline: extractRequiredLine(lines, "Home Evaluation"),
    title: extractRequiredLine(lines, "What's Your Home Worth?"),
    subtitle: extractRequiredLine(
      lines,
      "Get a comprehensive, data-driven valuation of your property from our local market experts."
    ),
    formHeading: extractRequiredLine(lines, "Request Your Free Evaluation"),
    formDescription: extractRequiredLine(
      lines,
      "Please provide us with some details about your property. One of our experienced agents will review the information and contact you shortly with a comprehensive market analysis."
    ),
  };
}

function logSummary(
  mode: "DRY RUN" | "COMMIT",
  documents: SeedDocument[],
  embeddedCounts: EmbeddedSummary,
  sourceCounts: Record<string, number>,
  excludedCounts: Record<string, number>
) {
  console.log(`Mode: ${mode}`);
  console.log("Published source counts:");
  for (const type of legacySourceTypes) {
    console.log(`  ${type}: ${sourceCounts[type] ?? 0}`);
  }
  console.log(`  legalPage: ${sourceCounts.legalPage ?? 0}`);
  console.log("Seed documents:");
  for (const document of documents) {
    console.log(`  ${document._id} (${document._type})`);
  }
  console.log("Embedded fields:");
  for (const [field, count] of Object.entries(embeddedCounts)) {
    console.log(`  ${field}: ${count}`);
  }
  console.log(
    `Excluded stale legacy testimonials: ${excludedCounts.staleLegacyTestimonials ?? 0}`
  );
  console.log("Validation: passed stale seed marker checks");
}

async function commitSeed(sanityClient: SanityClient, documents: SeedDocument[]) {
  let transaction = sanityClient.transaction();
  for (const document of documents) {
    transaction = transaction.createOrReplace(document);
  }

  await transaction.commit();
}

async function main() {
  if (isCommit && !process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error("SANITY_API_WRITE_TOKEN is required when using --commit.");
  }

  if (!isCommit && !process.env.SANITY_API_WRITE_TOKEN) {
    console.warn(
      "SANITY_API_WRITE_TOKEN is not set. Dry-run reads may fail if the dataset requires authentication."
    );
  }

  const source = await fetchSource();
  const { documents, embeddedCounts, sourceCounts, excludedCounts } = buildSeedPayload(source);
  logSummary(isCommit ? "COMMIT" : "DRY RUN", documents, embeddedCounts, sourceCounts, excludedCounts);

  if (!isCommit) {
    console.log(`Dry-run complete. Re-run with ${COMMIT_FLAG} to write ${documents.length} document(s).`);
    return;
  }

  await commitSeed(client, documents);
  console.log(`Seed committed: ${documents.length} document(s) createOrReplace'd.`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Seed failed: ${message}`);
  process.exitCode = 1;
});
