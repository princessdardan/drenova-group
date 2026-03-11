// Objects
import { blockContent } from "./objects/block-content";
import { heroSettings } from "./objects/hero-settings";
import { processStep } from "./objects/process-step";
import { sectionHeading } from "./objects/section-heading";
import { ctaSettings } from "./objects/cta-settings";
import { valuationSection } from "./objects/valuation-section";

// Documents
import { teamMember } from "./documents/team-member";
import { testimonial } from "./documents/testimonial";
import { faq } from "./documents/faq";
import { coverageArea } from "./documents/coverage-area";
import { companyStat } from "./documents/company-stat";
import { companyValue } from "./documents/company-value";
import { valueProposition } from "./documents/value-proposition";
import { legalPage } from "./documents/legal-page";

// Singletons
import { siteSettings } from "./singletons/site-settings";
import { homePage } from "./singletons/home-page";
import { aboutPage } from "./singletons/about-page";
import { buyPage } from "./singletons/buy-page";
import { sellPage } from "./singletons/sell-page";
import { contactPage } from "./singletons/contact-page";
import { teamPage } from "./singletons/team-page";
import { listingsPage } from "./singletons/listings-page";

export const schemaTypes = [
  // Objects (must be registered before types that reference them)
  blockContent,
  heroSettings,
  processStep,
  sectionHeading,
  ctaSettings,
  valuationSection,

  // Documents
  teamMember,
  testimonial,
  faq,
  coverageArea,
  companyStat,
  companyValue,
  valueProposition,
  legalPage,

  // Singletons
  siteSettings,
  homePage,
  aboutPage,
  buyPage,
  sellPage,
  contactPage,
  teamPage,
  listingsPage,
];
