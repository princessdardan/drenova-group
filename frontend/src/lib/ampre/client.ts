import type { AmpreResponse } from "./types";

/**
 * AMPRE OData HTTP client.
 *
 * This client is used EXCLUSIVELY by the daily sync job (`/api/ampre/sync`).
 * It must never be imported by pages or components — all user-facing reads
 * go through Vercel KV via `@/lib/ampre/fetch`.
 *
 * Error messages intentionally omit response bodies to prevent
 * MLS data from leaking into logs (§4 confidentiality).
 */

class AmpreError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = "AmpreError";
  }
}

function getBaseUrl(): string {
  const url = process.env.AMPRE_API_BASE_URL;
  if (!url) throw new AmpreError("AMPRE_API_BASE_URL is not configured");
  return url.replace(/\/$/, "");
}

function getToken(): string {
  const token = process.env.AMPRE_API_TOKEN;
  if (!token) throw new AmpreError("AMPRE_API_TOKEN is not configured");
  return token;
}

/**
 * Fetch properties from AMPRE OData endpoint.
 *
 * Handles pagination via `@odata.nextLink` to retrieve the full result set
 * in a single invocation. This function is called once per day by the sync job.
 */
export async function fetchAmpreProperties(
  query: string
): Promise<AmpreResponse["value"]> {
  const baseUrl = getBaseUrl();
  const token = getToken();
  const allProperties: AmpreResponse["value"] = [];

  let url: string | null = `${baseUrl}/Property?${query}`;

  while (url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      // Do NOT log response body — may contain MLS data (§4)
      throw new AmpreError(
        `AMPRE API returned ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data: AmpreResponse = await response.json();
    allProperties.push(...data.value);

    url = data["@odata.nextLink"] ?? null;
  }

  return allProperties;
}
