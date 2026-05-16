export const SINGLETON_TYPES = [
  "siteSettings",
  "homePage",
  "aboutPage",
  "buyPage",
  "sellPage",
  "contactPage",
  "teamPage",
  "listingsPage",
  "buyersGuidePage",
  "sellersGuidePage",
  "homeEvaluationPage",
] as const;

export type SingletonType = (typeof SINGLETON_TYPES)[number];
