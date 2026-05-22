import { defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";
import { homePageContentFields } from "../helpers/home-page-fields";
import { fixedTitlePreview } from "../helpers/previews";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  fields: homePageContentFields(),
  preview: fixedTitlePreview("Home Page"),
});
