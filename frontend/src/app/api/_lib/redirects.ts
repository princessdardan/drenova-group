import { NextRequest } from "next/server";

const unsafeRedirectPathPattern = /[\\\u0000-\u001f\u007f]|%5c/i;

export function getRequestOrigin(request: NextRequest) {
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");

  if (!host) {
    return request.nextUrl.origin;
  }

  const protocol = forwardedProto || request.nextUrl.protocol.replace(":", "");
  return `${protocol}://${host}`;
}

export function getSafeRedirectUrl(request: NextRequest, redirectTo: string | null) {
  const origin = getRequestOrigin(request);
  const path =
    redirectTo?.startsWith("/") &&
    !redirectTo.startsWith("//") &&
    !unsafeRedirectPathPattern.test(redirectTo)
      ? redirectTo
      : "/";
  const url = new URL(path, origin);

  return url.origin === origin ? url : new URL("/", origin);
}
