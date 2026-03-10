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
  socialLinks?: SocialLinks;
}

export interface HomePage {
  _id: string;
  _type: "homePage";
  hero: HeroSettings;
  featuredListings?: import("./listing").Listing[];
  aboutSectionTitle?: string;
  aboutSectionContent?: string;
}

export interface AboutPage {
  _id: string;
  _type: "aboutPage";
  hero: HeroSettings;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Portable Text blocks; will be typed as PortableTextBlock[] after US-008
  storyContent?: any[];
  storyImage?: SanityImage;
}

export interface BuyPage {
  _id: string;
  _type: "buyPage";
  hero: HeroSettings;
  benefits?: Benefit[];
  processSteps?: ProcessStep[];
}

export interface SellPage {
  _id: string;
  _type: "sellPage";
  hero: HeroSettings;
  benefits?: Benefit[];
  processSteps?: ProcessStep[];
}
