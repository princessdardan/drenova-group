import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

import { jsonError, jsonOk } from "../_lib/responses";
import { hasValidHeaderSecret } from "../_lib/secrets";

const TAG_MAP: Record<string, string[]> = {
  listing: ["listing"],
  siteSettings: ["siteSettings"],
  homePage: ["homePage"],
  aboutPage: ["aboutPage"],
  buyPage: ["buyPage"],
  sellPage: ["sellPage"],
  contactPage: ["contactPage"],
  teamPage: ["teamPage"],
  listingsPage: ["listingsPage"],
  legalPage: ["legalPage"],
  buyersGuidePage: ["buyersGuidePage"],
  sellersGuidePage: ["sellersGuidePage"],
  homeEvaluationPage: ["homeEvaluationPage"],
};

export async function POST(request: NextRequest) {
  if (
    !hasValidHeaderSecret(
      request,
      "x-sanity-revalidate-secret",
      "SANITY_REVALIDATE_SECRET"
    )
  ) {
    return jsonError({ message: "Invalid secret" }, 401);
  }

  const body = await request.json();
  const type = body?._type as string | undefined;

  if (!type) {
    return jsonError({ message: "Missing _type in payload" }, 400);
  }

  const tags = TAG_MAP[type];

  if (!tags) {
    return jsonError({ message: `Unknown type: ${type}`, revalidated: false }, 200);
  }

  for (const tag of tags) {
    revalidateTag(tag, { expire: 3600 });
  }

  return jsonOk({ revalidated: true, tags });
}
