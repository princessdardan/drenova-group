import { NextRequest } from "next/server";

export function hasValidSecret(secret: string | null, envName: string) {
  return Boolean(secret && secret === process.env[envName]);
}

export function hasValidHeaderSecret(
  request: NextRequest,
  headerName: string,
  envName: string
) {
  return hasValidSecret(request.headers.get(headerName), envName);
}
