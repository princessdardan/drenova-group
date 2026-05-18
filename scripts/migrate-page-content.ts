/**
 * One-off migration for embedding legacy page content documents into singleton arrays.
 *
 * Dry-run by default:
 *   npm run migrate:page-content
 *
 * Write changes and delete migrated standalone documents:
 *   npm run migrate:page-content -- --commit
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

type SanityReference = {
  _type: "reference";
  _ref: string;
};

type SanitySlug = {
  _type?: "slug";
  current?: string;
};

type SanityImage = {
  _type: "image";
  asset?: SanityReference;
  alt?: string;
  hotspot?: unknown;
  crop?: unknown;
};

type PortableTextBlock = {
  _type: string;
  _key?: string;
  style?: string;
  children?: Array<Record<string, unknown>>;
  markDefs?: Array<Record<string, unknown>>;
};

type SourceDocument = {
  _id: string;
  _type: string;
};

type OrderedSourceDocument = SourceDocument & {
  order?: number;
};

type TeamMemberDocument = SourceDocument & {
  slug?: SanitySlug;
  name?: string;
  role?: string;
  image?: SanityImage;
  bio?: PortableTextBlock[];
  phone?: string;
  email?: string;
};

type TeamMemberItem = {
  _key: string;
  _type: "teamMember";
  slug?: SanitySlug;
  name?: string;
  role?: string;
  image?: SanityImage;
  bio?: PortableTextBlock[];
  phone?: string;
  email?: string;
};

type TestimonialDocument = OrderedSourceDocument & {
  quote?: string;
  name?: string;
  detail?: string;
};

type TestimonialItem = {
  _key: string;
  _type: "testimonial";
  quote?: string;
  name?: string;
  detail?: string;
};

type FaqDocument = OrderedSourceDocument & {
  category?: "buyer" | "seller" | string;
  question?: string;
  answer?: string;
};

type FaqItem = {
  _key: string;
  _type: "faq";
  question?: string;
  answer?: string;
};

type CoverageAreaDocument = OrderedSourceDocument & {
  state?: string;
  cities?: string[];
};

type CoverageAreaItem = {
  _key: string;
  _type: "coverageArea";
  state?: string;
  cities?: string[];
};

type CompanyValueDocument = OrderedSourceDocument & {
  title?: string;
  description?: string;
};

type CompanyValueItem = {
  _key: string;
  _type: "companyValue";
  title?: string;
  description?: string;
};

type CompanyStatDocument = OrderedSourceDocument & {
  label?: string;
  value?: string;
};

type CompanyStatItem = {
  _key: string;
  _type: "companyStat";
  label?: string;
  value?: string;
};

type ValuePropositionDocument = OrderedSourceDocument & {
  title?: string;
  description?: string;
};

type ValuePropositionItem = {
  _key: string;
  _type: "valueProposition";
  title?: string;
  description?: string;
};

type MigrationSet = Record<string, Record<string, unknown>>;

const sourceTypes = [
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

function documentKey(document: SourceDocument, fallbackPrefix: string): string {
  const slug = "slug" in document ? document.slug : undefined;
  const base = hasCurrentSlug(slug)
    ? slug.current
    : document._id.replace(/^drafts\./, "");

  const normalized = base
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `${fallbackPrefix}-${document._id.replace(/[^a-zA-Z0-9-]+/g, "-")}`;
}

function hasCurrentSlug(value: unknown): value is { current: string } {
  return (
    value !== null &&
    typeof value === "object" &&
    "current" in value &&
    typeof value.current === "string"
  );
}

function itemKey(document: SourceDocument, fallbackPrefix: string): string {
  return documentKey(document, fallbackPrefix).slice(0, 80);
}

function withoutUndefined<T extends Record<string, unknown>>(item: T): T {
  const entries = Object.entries(item).filter(([, value]) => value !== undefined);
  return Object.fromEntries(entries) as T;
}

async function fetchSource<T>(query: string): Promise<T[]> {
  return client.fetch<T[]>(query);
}

function toTeamMember(document: TeamMemberDocument): TeamMemberItem {
  return withoutUndefined({
    _key: itemKey(document, "team-member"),
    _type: "teamMember",
    slug: document.slug,
    name: document.name,
    role: document.role,
    image: document.image,
    bio: document.bio,
    phone: document.phone,
    email: document.email,
  });
}

function toTestimonial(document: TestimonialDocument): TestimonialItem {
  return withoutUndefined({
    _key: itemKey(document, "testimonial"),
    _type: "testimonial",
    quote: document.quote,
    name: document.name,
    detail: document.detail,
  });
}

function toFaq(document: FaqDocument): FaqItem {
  return withoutUndefined({
    _key: itemKey(document, "faq"),
    _type: "faq",
    question: document.question,
    answer: document.answer,
  });
}

function toCoverageArea(document: CoverageAreaDocument): CoverageAreaItem {
  return withoutUndefined({
    _key: itemKey(document, "coverage-area"),
    _type: "coverageArea",
    state: document.state,
    cities: document.cities,
  });
}

function toCompanyValue(document: CompanyValueDocument): CompanyValueItem {
  return withoutUndefined({
    _key: itemKey(document, "company-value"),
    _type: "companyValue",
    title: document.title,
    description: document.description,
  });
}

function toCompanyStat(document: CompanyStatDocument): CompanyStatItem {
  return withoutUndefined({
    _key: itemKey(document, "company-stat"),
    _type: "companyStat",
    label: document.label,
    value: document.value,
  });
}

function toValueProposition(document: ValuePropositionDocument): ValuePropositionItem {
  return withoutUndefined({
    _key: itemKey(document, "value-proposition"),
    _type: "valueProposition",
    title: document.title,
    description: document.description,
  });
}

async function buildMigrationSet(): Promise<{
  sets: MigrationSet;
  deleteIds: string[];
  counts: Record<string, number>;
}> {
  const [
    teamMembers,
    testimonials,
    faqs,
    coverageAreas,
    companyValues,
    companyStats,
    valuePropositions,
  ] = await Promise.all([
    fetchSource<TeamMemberDocument>(
      `*[_type == "teamMember" && ${publishedDocumentFilter}] | order(name asc){_id,_type,slug,name,role,image,bio,phone,email}`
    ),
    fetchSource<TestimonialDocument>(
      `*[_type == "testimonial" && ${publishedDocumentFilter}] | order(order asc){_id,_type,order,quote,name,detail}`
    ),
    fetchSource<FaqDocument>(
      `*[_type == "faq" && category in ["buyer", "seller"] && ${publishedDocumentFilter}] | order(order asc){_id,_type,order,category,question,answer}`
    ),
    fetchSource<CoverageAreaDocument>(
      `*[_type == "coverageArea" && ${publishedDocumentFilter}] | order(order asc){_id,_type,order,state,cities}`
    ),
    fetchSource<CompanyValueDocument>(
      `*[_type == "companyValue" && ${publishedDocumentFilter}] | order(order asc){_id,_type,order,title,description}`
    ),
    fetchSource<CompanyStatDocument>(
      `*[_type == "companyStat" && ${publishedDocumentFilter}] | order(order asc){_id,_type,order,label,value}`
    ),
    fetchSource<ValuePropositionDocument>(
      `*[_type == "valueProposition" && ${publishedDocumentFilter}] | order(order asc){_id,_type,order,title,description}`
    ),
  ]);

  const buyerFaqs = faqs.filter((faq) => faq.category === "buyer").map(toFaq);
  const sellerFaqs = faqs.filter((faq) => faq.category === "seller").map(toFaq);
  const coverageAreaItems = coverageAreas.map(toCoverageArea);

  const sets: MigrationSet = {
    teamPage: {
      members: teamMembers.map(toTeamMember),
    },
    sellPage: {
      testimonials: testimonials.map(toTestimonial),
      faqs: sellerFaqs,
    },
    buyPage: {
      faqs: buyerFaqs,
      coverageAreas: coverageAreaItems,
    },
    aboutPage: {
      coverageAreas: coverageAreaItems,
      values: companyValues.map(toCompanyValue),
      stats: companyStats.map(toCompanyStat),
    },
    homePage: {
      valuePropositions: valuePropositions.map(toValueProposition),
    },
  };

  const deleteIds = [
    ...teamMembers,
    ...testimonials,
    ...faqs,
    ...coverageAreas,
    ...companyValues,
    ...companyStats,
    ...valuePropositions,
  ].map((document) => document._id);

  const counts = {
    teamMember: teamMembers.length,
    testimonial: testimonials.length,
    faq: faqs.length,
    coverageArea: coverageAreas.length,
    companyValue: companyValues.length,
    companyStat: companyStats.length,
    valueProposition: valuePropositions.length,
  };

  return { sets, deleteIds, counts };
}

function logPlan(sets: MigrationSet, counts: Record<string, number>, deleteIds: string[]) {
  console.log(`Mode: ${isCommit ? "COMMIT" : "DRY RUN"}`);
  console.log("Source document counts:");
  for (const type of sourceTypes) {
    console.log(`  ${type}: ${counts[type] ?? 0}`);
  }

  console.log("Target singleton fields:");
  for (const [documentId, fields] of Object.entries(sets)) {
    for (const [field, value] of Object.entries(fields)) {
      const count = Array.isArray(value) ? value.length : 0;
      console.log(`  ${documentId}.${field}: ${count} item(s)`);
    }
  }

  console.log(`Standalone documents queued for deletion after patches: ${deleteIds.length}`);
}

async function commitMigration(
  sanityClient: SanityClient,
  sets: MigrationSet,
  deleteIds: string[]
) {
  let transaction = sanityClient.transaction();

  for (const [documentId, fields] of Object.entries(sets)) {
    transaction = transaction.patch(documentId, (patch) => patch.set(fields));
  }

  for (const id of deleteIds) {
    transaction = transaction.delete(id);
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

  const { sets, deleteIds, counts } = await buildMigrationSet();
  logPlan(sets, counts, deleteIds);

  if (!isCommit) {
    console.log(`Dry-run complete. Re-run with ${COMMIT_FLAG} to write changes.`);
    return;
  }

  await commitMigration(client, sets, deleteIds);
  console.log("Migration committed: singleton arrays patched and standalone documents deleted.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Migration failed: ${message}`);
  process.exitCode = 1;
});
