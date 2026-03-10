// Objects
import { blockContent } from "./objects/block-content";
import { heroSettings } from "./objects/hero-settings";
import { processStep } from "./objects/process-step";

// Documents
import { listing } from "./documents/listing";
import { teamMember } from "./documents/team-member";
import { testimonial } from "./documents/testimonial";
import { faq } from "./documents/faq";
import { coverageArea } from "./documents/coverage-area";
import { companyStat } from "./documents/company-stat";
import { companyValue } from "./documents/company-value";
import { valueProposition } from "./documents/value-proposition";

// Singletons
import { siteSettings } from "./singletons/site-settings";
import { homePage } from "./singletons/home-page";
import { aboutPage } from "./singletons/about-page";
import { buyPage } from "./singletons/buy-page";
import { sellPage } from "./singletons/sell-page";

export const schemaTypes = [
  // Objects (must be registered before types that reference them)
  blockContent,
  heroSettings,
  processStep,

  // Documents
  listing,
  teamMember,
  testimonial,
  faq,
  coverageArea,
  companyStat,
  companyValue,
  valueProposition,

  // Singletons
  siteSettings,
  homePage,
  aboutPage,
  buyPage,
  sellPage,
];
