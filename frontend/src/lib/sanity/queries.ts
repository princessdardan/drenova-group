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
