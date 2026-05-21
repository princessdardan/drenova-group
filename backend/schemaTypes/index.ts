// Objects
import { blockContent } from "./objects/block-content";
import { formConsentText } from "./objects/form-consent-text";
import { heroSettings } from "./objects/hero-settings";
import { processStep } from "./objects/process-step";
import { sectionHeading } from "./objects/section-heading";
import { ctaSettings } from "./objects/cta-settings";
import { valuationSection } from "./objects/valuation-section";
import { teamMember } from "./objects/team-member";
import { testimonial } from "./objects/testimonial";
import { faq } from "./objects/faq";
import { coverageArea } from "./objects/coverage-area";
import { companyStat } from "./objects/company-stat";
import { companyValue } from "./objects/company-value";
import { valueProposition } from "./objects/value-proposition";

// Documents
import { legalPage } from "./documents/legal-page";
import { leadSubmission } from "./documents/lead-submission";

// Singletons
import { siteSettings } from "./singletons/site-settings";
import { homePage } from "./singletons/home-page";
import { aboutPage } from "./singletons/about-page";
import { buyPage } from "./singletons/buy-page";
import { sellPage } from "./singletons/sell-page";
import { contactPage } from "./singletons/contact-page";
import { teamPage } from "./singletons/team-page";
import { listingsPage } from "./singletons/listings-page";
import { buyersGuidePage } from "./singletons/buyers-guide-page";
import { sellersGuidePage } from "./singletons/sellers-guide-page";
import { homeEvaluationPage } from "./singletons/home-evaluation-page";

export const schemaTypes = [
  // Objects (must be registered before types that reference them)
  blockContent,
  formConsentText,
  heroSettings,
  processStep,
  sectionHeading,
  ctaSettings,
  valuationSection,
  teamMember,
  testimonial,
  faq,
  coverageArea,
  companyStat,
  companyValue,
  valueProposition,

  // Documents
  legalPage,
  leadSubmission,

  // Singletons
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
];
