import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { jsonError } from "../../_lib/responses";
import { hasValidSecret } from "../../_lib/secrets";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!hasValidSecret(secret, "SANITY_PREVIEW_SECRET")) {
    return jsonError({ message: "Invalid secret" }, 401);
  }

  const draft = await draftMode();
  draft.enable();

  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/";
  return NextResponse.redirect(new URL(redirectTo, request.url));
}
