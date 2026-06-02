import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { SINGLETON_TYPES } from "./schemaTypes/constants";
import { resolve } from "./presentation/resolve";
import { structure } from "./structure";

const singletonTypes: readonly string[] = SINGLETON_TYPES;
const previewOrigin =
  process.env.SANITY_STUDIO_PREVIEW_ORIGIN ||
  (process.env.NODE_ENV === "production" ? "https://drenova.ca" : "http://localhost:3000");

export default defineConfig({
  name: "drenova-group",
  title: "Drenova Group",

  projectId: "apggi8zn",
  dataset: "production",

  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve,
      previewUrl: {
        origin: previewOrigin,
        previewMode: {
          enable: "/api/draft/enable",
          disable: "/api/draft/disable",
        },
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) => !singletonTypes.includes(schemaType),
      ),
  },
});
