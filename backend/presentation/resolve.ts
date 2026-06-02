import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

interface SlugDocumentSelection {
  title?: string;
  slug?: string;
}

const singletonPages = {
  homePage: { title: "Home Page", href: "/" },
  aboutPage: { title: "About Page", href: "/about" },
  buyPage: { title: "Buy Page", href: "/buy" },
  sellPage: { title: "Sell Page", href: "/sell" },
  contactPage: { title: "Contact Page", href: "/contact" },
  teamPage: { title: "Team Page", href: "/team" },
  listingsPage: { title: "Listings Page", href: "/listings" },
  buyersGuidePage: { title: "Buyers Guide Page", href: "/buyers-guide" },
  sellersGuidePage: { title: "Sellers Guide Page", href: "/sellers-guide" },
  homeEvaluationPage: { title: "Home Evaluation Page", href: "/home-evaluation" },
} as const;

function singletonLocation(title: string, href: string) {
  return defineLocations({
    locations: [{ title, href }],
  });
}

function slugLocation(documentLabel: string) {
  return defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: (document: SlugDocumentSelection | null) => {
      if (!document?.slug) {
        return {
          message: `Add a slug to preview this ${documentLabel}.`,
          tone: "caution" as const,
        };
      }

      return {
        locations: [
          {
            title: document.title || `Untitled ${documentLabel}`,
            href: `/${document.slug}`,
          },
        ],
      };
    },
  });
}

export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: defineDocuments([
    { route: "/", type: "homePage" },
    { route: "/about", type: "aboutPage" },
    { route: "/buy", type: "buyPage" },
    { route: "/sell", type: "sellPage" },
    { route: "/contact", type: "contactPage" },
    { route: "/team", type: "teamPage" },
    { route: "/team/:slug", type: "teamPage" },
    { route: "/listings", type: "listingsPage" },
    { route: "/buyers-guide", type: "buyersGuidePage" },
    { route: "/sellers-guide", type: "sellersGuidePage" },
    { route: "/home-evaluation", type: "homeEvaluationPage" },
    {
      route: "/:slug",
      resolve: ({ params }) => {
        const slug = params.slug;

        if (slug === "privacy" || slug === "terms") {
          return {
            filter: `_type == "legalPage" && slug.current == $slug`,
            params: { slug },
          };
        }

        return {
          filter: `_type == "genericPage" && slug.current == $slug`,
          params: { slug },
        };
      },
    },
  ]),
  locations: {
    siteSettings: defineLocations({
      message: "Used in the global header, footer, and consent text across the site.",
      tone: "caution",
    }),
    homePage: singletonLocation(singletonPages.homePage.title, singletonPages.homePage.href),
    aboutPage: singletonLocation(singletonPages.aboutPage.title, singletonPages.aboutPage.href),
    buyPage: singletonLocation(singletonPages.buyPage.title, singletonPages.buyPage.href),
    sellPage: singletonLocation(singletonPages.sellPage.title, singletonPages.sellPage.href),
    contactPage: singletonLocation(singletonPages.contactPage.title, singletonPages.contactPage.href),
    teamPage: singletonLocation(singletonPages.teamPage.title, singletonPages.teamPage.href),
    listingsPage: singletonLocation(singletonPages.listingsPage.title, singletonPages.listingsPage.href),
    buyersGuidePage: singletonLocation(
      singletonPages.buyersGuidePage.title,
      singletonPages.buyersGuidePage.href,
    ),
    sellersGuidePage: singletonLocation(
      singletonPages.sellersGuidePage.title,
      singletonPages.sellersGuidePage.href,
    ),
    homeEvaluationPage: singletonLocation(
      singletonPages.homeEvaluationPage.title,
      singletonPages.homeEvaluationPage.href,
    ),
    genericPage: slugLocation("generic page"),
    legalPage: slugLocation("legal page"),
  },
};
