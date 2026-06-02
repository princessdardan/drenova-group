import { createClient, type FilterDefault } from "next-sanity";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "apggi8zn";
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-01-01";
const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "https://drenova-group.sanity.studio";
const stegaExcludedFields = new Set([
  "backgroundType",
  "buttonHref",
  "email",
  "facebook",
  "href",
  "instagram",
  "linkedin",
  "phone",
  "secondaryButtonHref",
  "slug",
  "twitter",
  "url",
  "videoUrl",
]);

const stegaFilter: FilterDefault = (props) => {
  const sourcePath = props.sourcePath.map(String);

  if (
    sourcePath.some((segment) => stegaExcludedFields.has(segment)) ||
    sourcePath.join(".").includes("slug.current")
  ) {
    return false;
  }

  return props.filterDefault(props);
};

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "drafts",
  resultSourceMap: "withKeyArraySelector",
  stega: {
    enabled: true,
    filter: stegaFilter,
    studioUrl,
  },
});

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
