import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.SANITY_PREVIEW_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/";
  return NextResponse.redirect(new URL(redirectTo, request.url));
}
