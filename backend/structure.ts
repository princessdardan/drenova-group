import type { StructureResolver } from "sanity/structure";
import {
  CogIcon,
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  CommentIcon,
  HelpCircleIcon,
  PinIcon,
  BarChartIcon,
  StarIcon,
  BulbOutlineIcon,
  BasketIcon,
  TagIcon,
} from "@sanity/icons";

const SINGLETON_TYPES = [
  "siteSettings",
  "homePage",
  "aboutPage",
  "buyPage",
  "sellPage",
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Site Settings singleton
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings"),
        ),

      S.divider(),

      // Pages group
      S.listItem()
        .title("Pages")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem()
                .title("Home Page")
                .icon(HomeIcon)
                .child(
                  S.document()
                    .schemaType("homePage")
                    .documentId("homePage")
                    .title("Home Page"),
                ),
              S.listItem()
                .title("About Page")
                .icon(DocumentTextIcon)
                .child(
                  S.document()
                    .schemaType("aboutPage")
                    .documentId("aboutPage")
                    .title("About Page"),
                ),
              S.listItem()
                .title("Buy Page")
                .icon(BasketIcon)
                .child(
                  S.document()
                    .schemaType("buyPage")
                    .documentId("buyPage")
                    .title("Buy Page"),
                ),
              S.listItem()
                .title("Sell Page")
                .icon(TagIcon)
                .child(
                  S.document()
                    .schemaType("sellPage")
                    .documentId("sellPage")
                    .title("Sell Page"),
                ),
            ]),
        ),

      S.divider(),

      // Collection document lists
      S.documentTypeListItem("listing").title("Listings").icon(HomeIcon),
      S.documentTypeListItem("teamMember").title("Team Members").icon(UsersIcon),
      S.documentTypeListItem("testimonial")
        .title("Testimonials")
        .icon(CommentIcon),
      S.documentTypeListItem("faq").title("FAQs").icon(HelpCircleIcon),
      S.documentTypeListItem("coverageArea")
        .title("Coverage Areas")
        .icon(PinIcon),
      S.documentTypeListItem("companyStat")
        .title("Company Stats")
        .icon(BarChartIcon),
      S.documentTypeListItem("companyValue")
        .title("Company Values")
        .icon(StarIcon),
      S.documentTypeListItem("valueProposition")
        .title("Value Propositions")
        .icon(BulbOutlineIcon),
    ]);
