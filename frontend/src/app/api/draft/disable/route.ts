import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getRequestOrigin } from "../../_lib/redirects";

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();
  return NextResponse.redirect(new URL("/", getRequestOrigin(request)));
}
