import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

const SINGLETON_TYPES = [
  "siteSettings",
  "homePage",
  "aboutPage",
  "buyPage",
  "sellPage",
];

export default defineConfig({
  name: "drenova-group",
  title: "Drenova Group",

  projectId: "apggi8zn",
  dataset: "production",

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) => !SINGLETON_TYPES.includes(schemaType),
      ),
  },
});
