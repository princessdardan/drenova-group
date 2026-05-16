import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { SINGLETON_TYPES } from "./schemaTypes/constants";
import { structure } from "./structure";

const singletonTypes: readonly string[] = SINGLETON_TYPES;

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
        ({ schemaType }) => !singletonTypes.includes(schemaType),
      ),
  },
});
