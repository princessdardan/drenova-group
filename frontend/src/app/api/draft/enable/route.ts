import { draftMode } from "next/headers";
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { NextRequest, NextResponse } from "next/server";

import { getSafeRedirectUrl } from "../../_lib/redirects";
import { jsonError } from "../../_lib/responses";
import { hasValidSecret } from "../../_lib/secrets";
import { client } from "@/lib/sanity/client";

const { GET: enablePresentationDraftMode } = defineEnableDraftMode({
  client: client.withConfig({
    token: process.env.SANITY_API_READ_TOKEN,
  }),
});

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (hasValidSecret(secret, "SANITY_PREVIEW_SECRET")) {
    const draft = await draftMode();
    draft.enable();

    const redirectTo = request.nextUrl.searchParams.get("redirect") || "/";
    return NextResponse.redirect(getSafeRedirectUrl(request, redirectTo));
  }

  if (request.nextUrl.searchParams.has("sanity-preview-secret")) {
    return enablePresentationDraftMode(request);
  }

  return jsonError({ message: "Invalid secret" }, 401);
}
