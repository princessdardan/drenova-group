import { groq } from "next-sanity";

// ─── Listing projections ──────────────────────────────────────────────
const listingProjection = groq`{
  "id": _id,
  "slug": slug.current,
  price,
  address,
  city,
  state,
  zip,
  beds,
  baths,
  sqft,
  image,
  status,
  propertyType
}`;

// ─── Listing queries ──────────────────────────────────────────────────
export const allListingsQuery = groq`*[_type == "listing"] ${listingProjection}`;

export const activeListingsQuery = groq`*[_type == "listing" && status == "Active"] ${listingProjection}`;

export const listingBySlugQuery = groq`*[_type == "listing" && slug.current == $slug][0] ${listingProjection}`;

// ─── Team Member queries ──────────────────────────────────────────────
const teamMemberProjection = groq`{
  "slug": slug.current,
  name,
  role,
  image,
  bio,
  phone,
  email
}`;

export const allTeamMembersQuery = groq`*[_type == "teamMember"] | order(name asc) ${teamMemberProjection}`;

export const teamMemberBySlugQuery = groq`*[_type == "teamMember" && slug.current == $slug][0] ${teamMemberProjection}`;

// ─── Testimonial queries ──────────────────────────────────────────────
export const allTestimonialsQuery = groq`*[_type == "testimonial"] {
  quote,
  name,
  detail
}`;

// ─── FAQ queries ──────────────────────────────────────────────────────
export const faqsByCategoryQuery = groq`*[_type == "faq" && category == $category] | order(order asc) {
  _id,
  question,
  answer,
  category,
  order
}`;

// ─── Coverage Area queries ────────────────────────────────────────────
export const allCoverageAreasQuery = groq`*[_type == "coverageArea"] | order(order asc) {
  _id,
  state,
  cities,
  order
}`;

// ─── Company Stat queries ─────────────────────────────────────────────
export const allCompanyStatsQuery = groq`*[_type == "companyStat"] | order(order asc) {
  _id,
  label,
  value,
  order
}`;

// ─── Company Value queries ────────────────────────────────────────────
export const allCompanyValuesQuery = groq`*[_type == "companyValue"] | order(order asc) {
  _id,
  title,
  description,
  order
}`;

// ─── Value Proposition queries ────────────────────────────────────────
export const allValuePropositionsQuery = groq`*[_type == "valueProposition"] | order(order asc) {
  _id,
  title,
  description,
  order
}`;

// ─── Singleton queries ───────────────────────────────────────────────

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  _id,
  _type,
  companyName,
  tagline,
  phone,
  email,
  address,
  officeHours,
  navigationLinks[] {
    _key,
    label,
    href,
    showInHeader,
    showInFooter
  },
  socialLinks
}`;

export const homePageQuery = groq`*[_type == "homePage"][0] {
  _id,
  _type,
  hero,
  featuredListings[]->${listingProjection},
  featuredListingsHeading,
  aboutSectionOverline,
  aboutSectionTitle,
  aboutSectionContent,
  aboutSectionImage,
  valuePropsHeading,
  cta
}`;

export const aboutPageQuery = groq`*[_type == "aboutPage"][0] {
  _id,
  _type,
  hero,
  storyContent,
  storyOverline,
  storyTitle,
  storyImage,
  valuesHeading,
  coverageHeading,
  cta
}`;

export const buyPageQuery = groq`*[_type == "buyPage"][0] {
  _id,
  _type,
  hero,
  benefits[] {
    _key,
    title,
    description
  },
  benefitsHeading,
  processSteps[] {
    _key,
    _type,
    stepNumber,
    title,
    description
  },
  processHeading,
  coverageHeading,
  faqHeading,
  cta
}`;

export const sellPageQuery = groq`*[_type == "sellPage"][0] {
  _id,
  _type,
  hero,
  benefits[] {
    _key,
    title,
    description
  },
  benefitsHeading,
  processSteps[] {
    _key,
    _type,
    stepNumber,
    title,
    description
  },
  processHeading,
  valuation,
  storiesHeading,
  faqHeading,
  cta
}`;

export const contactPageQuery = groq`*[_type == "contactPage"][0] {
  _id,
  _type,
  hero,
  quickLinks[] {
    _key,
    overline,
    title,
    description,
    href
  }
}`;

export const teamPageQuery = groq`*[_type == "teamPage"][0] {
  _id,
  _type,
  hero,
  cta
}`;

export const listingsPageQuery = groq`*[_type == "listingsPage"][0] {
  _id,
  _type,
  overline,
  title
}`;

export const legalPageBySlugQuery = groq`*[_type == "legalPage" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  "slug": slug.current,
  lastUpdated,
  body
}`;
