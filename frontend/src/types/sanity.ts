import type { PortableTextBlock } from "@portabletext/types";

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
  overline?: string;
  title: string;
  subtitle?: string;
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
  _id: string;
  _type: "faq";
  question: string;
  answer: string;
  category: "buyer" | "seller";
  order: number;
}

export interface CoverageArea {
  _id: string;
  _type: "coverageArea";
  state: string;
  cities: string[];
  order: number;
}

export interface CompanyStat {
  _id: string;
  _type: "companyStat";
  label: string;
  value: string;
  order: number;
}

export interface CompanyValue {
  _id: string;
  _type: "companyValue";
  title: string;
  description: string;
  order: number;
}

export interface ValueProposition {
  _id: string;
  _type: "valueProposition";
  title: string;
  description: string;
  order: number;
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
  featuredListings?: import("./listing").Listing[];
  featuredListingsHeading?: SectionHeading;
  aboutSectionOverline?: string;
  aboutSectionTitle?: string;
  aboutSectionContent?: string;
  aboutSectionImage?: SanityImage;
  valuePropsHeading?: SectionHeading;
  cta?: CtaSettings;
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
  coverageHeading?: SectionHeading;
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
  faqHeading?: SectionHeading;
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
  faqHeading?: SectionHeading;
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
  cta?: CtaSettings;
}

export interface ListingsPage {
  _id: string;
  _type: "listingsPage";
  overline?: string;
  title?: string;
}
