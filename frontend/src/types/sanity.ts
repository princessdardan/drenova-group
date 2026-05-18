import type { PortableTextBlock } from "@portabletext/types";
import type { TeamMember } from "./team";
import type { Testimonial } from "./testimonial";

// Type guard to check if a value is a SanityImage object (vs a plain URL string)
export function isSanityImage(
  image: string | SanityImage
): image is SanityImage {
  return typeof image === "object" && image !== null && "_type" in image;
}

// Sanity image reference with optional metadata
export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// --- Object types ---

export interface HeroSettings {
  image: SanityImage;
  backgroundType?: "image" | "video";
  videoUrl?: string;
  overline?: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export interface ProcessStep {
  _key: string;
  _type: "processStep";
  stepNumber: string;
  title: string;
  description: string;
}

export interface Benefit {
  _key: string;
  title: string;
  description: string;
}

export interface SectionHeading {
  overline?: string;
  title: string;
  description?: string;
}

export interface CtaSettings {
  title: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export interface ValuationSection {
  overline?: string;
  title: string;
  description: string;
  image?: SanityImage;
  ctaText?: string;
}

export interface NavigationLink {
  _key: string;
  label: string;
  href: string;
  showInHeader?: boolean;
  showInFooter?: boolean;
}

// --- Document types ---

export interface FAQ {
  _key: string;
  _type: "faq";
  question: string;
  answer: string;
}

export interface CoverageArea {
  _key: string;
  _type: "coverageArea";
  state: string;
  cities: string[];
}

export interface CompanyStat {
  _key: string;
  _type: "companyStat";
  label: string;
  value: string;
}

export interface CompanyValue {
  _key: string;
  _type: "companyValue";
  title: string;
  description: string;
}

export interface ValueProposition {
  _key: string;
  _type: "valueProposition";
  title: string;
  description: string;
}

export interface LegalPage {
  _id: string;
  _type: "legalPage";
  title: string;
  slug: string;
  lastUpdated: string;
  body: PortableTextBlock[];
}

// --- Singleton page types ---

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

export interface SiteSettings {
  _id: string;
  _type: "siteSettings";
  companyName: string;
  tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  officeHours?: string;
  navigationLinks?: NavigationLink[];
  socialLinks?: SocialLinks;
}

export interface HomePage {
  _id: string;
  _type: "homePage";
  hero: HeroSettings;
  aboutSection?: {
    title: string;
    description?: string;
    buttonText?: string;
    buttonHref?: string;
    image?: SanityImage;
  };
  valuePropositions?: ValueProposition[];
  workWithUsHeading?: string;
  ctaCard1?: {
    image?: SanityImage;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonHref?: string;
  };
  ctaCard2?: {
    image?: SanityImage;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonHref?: string;
  };
  contactForm?: {
    heading?: string;
    subtitle?: string;
  };
}

export interface AboutPage {
  _id: string;
  _type: "aboutPage";
  hero: HeroSettings;
  storyContent?: PortableTextBlock[];
  storyOverline?: string;
  storyTitle?: string;
  storyImage?: SanityImage;
  valuesHeading?: SectionHeading;
  values?: CompanyValue[];
  coverageHeading?: SectionHeading;
  coverageAreas?: CoverageArea[];
  stats?: CompanyStat[];
  cta?: CtaSettings;
}

export interface BuyPage {
  _id: string;
  _type: "buyPage";
  hero: HeroSettings;
  benefits?: Benefit[];
  benefitsHeading?: SectionHeading;
  processSteps?: ProcessStep[];
  processHeading?: SectionHeading;
  coverageHeading?: SectionHeading;
  coverageAreas?: CoverageArea[];
  faqHeading?: SectionHeading;
  faqs?: FAQ[];
  cta?: CtaSettings;
}

export interface SellPage {
  _id: string;
  _type: "sellPage";
  hero: HeroSettings;
  benefits?: Benefit[];
  benefitsHeading?: SectionHeading;
  processSteps?: ProcessStep[];
  processHeading?: SectionHeading;
  valuation?: ValuationSection;
  storiesHeading?: SectionHeading;
  testimonials?: Testimonial[];
  faqHeading?: SectionHeading;
  faqs?: FAQ[];
  cta?: CtaSettings;
}

export interface ContactPage {
  _id: string;
  _type: "contactPage";
  hero: HeroSettings;
  quickLinks?: {
    _key: string;
    overline?: string;
    title: string;
    description?: string;
    href: string;
  }[];
}

export interface TeamPage {
  _id: string;
  _type: "teamPage";
  hero: HeroSettings;
  members?: TeamMember[];
  cta?: CtaSettings;
}

export interface ListingsPage {
  _id: string;
  _type: "listingsPage";
  overline?: string;
  title?: string;
  featuredListingKeys?: string[];
}

export interface LeadSubmission {
  _id: string;
  _type: "leadSubmission";
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addressLine?: string;
  unit?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  notes?: string;
  source: "buyers-guide" | "sellers-guide" | "homepage" | "home-evaluation";
  submittedAt: string;
}

export interface BuyersGuidePage {
  _id: string;
  _type: "buyersGuidePage";
  hero: HeroSettings;
  guideTitle?: string;
  guideDescription?: string;
  guideImage?: SanityImage;
  cta?: CtaSettings;
}

export interface SellersGuidePage {
  _id: string;
  _type: "sellersGuidePage";
  hero: HeroSettings;
  guideTitle?: string;
  guideDescription?: string;
  guideImage?: SanityImage;
  cta?: CtaSettings;
}

export interface HomeEvaluationPage {
  _id: string;
  _type: "homeEvaluationPage";
  hero: HeroSettings;
  formHeading?: string;
  formDescription?: string;
}
