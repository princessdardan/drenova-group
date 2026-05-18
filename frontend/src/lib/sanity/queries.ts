import { groq } from "next-sanity";

import {
  benefitsProjection,
  documentProjection,
  guidePageProjection,
  processStepsProjection,
  teamMemberProjection,
} from "./query-fragments";

// ─── Singleton queries ───────────────────────────────────────────────

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  ${documentProjection},
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
  ${documentProjection},
  hero,
  aboutSection {
    title,
    description,
    buttonText,
    buttonHref,
    image
  },
  valuePropositions[] {
    _key,
    _type,
    title,
    description
  },
  workWithUsHeading,
  ctaCard1 {
    image,
    title,
    subtitle,
    buttonText,
    buttonHref
  },
  ctaCard2 {
    image,
    title,
    subtitle,
    buttonText,
    buttonHref
  },
  contactForm {
    heading,
    subtitle
  }
}`;

export const aboutPageQuery = groq`*[_type == "aboutPage"][0] {
  ${documentProjection},
  hero,
  storyContent,
  storyOverline,
  storyTitle,
  storyImage,
  valuesHeading,
  values[] {
    _key,
    _type,
    title,
    description
  },
  coverageHeading,
  coverageAreas[] {
    _key,
    _type,
    state,
    cities
  },
  stats[] {
    _key,
    _type,
    label,
    value
  },
  cta
}`;

export const buyPageQuery = groq`*[_type == "buyPage"][0] {
  ${documentProjection},
  hero,
  ${benefitsProjection},
  benefitsHeading,
  ${processStepsProjection},
  processHeading,
  coverageHeading,
  coverageAreas[] {
    _key,
    _type,
    state,
    cities
  },
  faqHeading,
  faqs[] {
    _key,
    _type,
    question,
    answer
  },
  cta
}`;

export const sellPageQuery = groq`*[_type == "sellPage"][0] {
  ${documentProjection},
  hero,
  ${benefitsProjection},
  benefitsHeading,
  ${processStepsProjection},
  processHeading,
  valuation,
  storiesHeading,
  testimonials[] {
    _key,
    _type,
    quote,
    name,
    detail
  },
  faqHeading,
  faqs[] {
    _key,
    _type,
    question,
    answer
  },
  cta
}`;

export const contactPageQuery = groq`*[_type == "contactPage"][0] {
  ${documentProjection},
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
  ${documentProjection},
  hero,
  members[] ${teamMemberProjection},
  cta
}`;

export const listingsPageQuery = groq`*[_type == "listingsPage"][0] {
  ${documentProjection},
  overline,
  title,
  featuredListingKeys
}`;

export const legalPageBySlugQuery = groq`*[_type == "legalPage" && slug.current == $slug][0] {
  ${documentProjection},
  title,
  "slug": slug.current,
  lastUpdated,
  body
}`;

// ─── Guide page queries ─────────────────────────────────────────────

export const buyersGuidePageQuery = groq`*[_type == "buyersGuidePage"][0] ${guidePageProjection}`;

export const sellersGuidePageQuery = groq`*[_type == "sellersGuidePage"][0] ${guidePageProjection}`;

export const homeEvaluationPageQuery = groq`*[_type == "homeEvaluationPage"][0] {
  ${documentProjection},
  hero,
  formHeading,
  formDescription
}`;
