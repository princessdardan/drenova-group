/**
 * Diagnose AMPRE Media availability for specific listing keys.
 *
 * Queries AMPRE Media for individual listing keys (one at a time)
 * to isolate whether missing images are a data issue or a batching issue.
 *
 * Usage:
 *   node scripts/diagnose-media.mjs                    # 5 random keys from property.json
 *   node scripts/diagnose-media.mjs W12888752 X12888750  # specific keys
 *
 * Output: Per-key media count, size variants, and sample URLs.
 */

import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

async function loadEnv() {
  const envPath = resolve(projectRoot, "frontend/.env.local");
  const content = await readFile(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    env[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim();
  }
  return env;
}

async function fetchMediaForKey(baseUrl, token, listingKey) {
  const query = [
    `$select=MediaKey,ResourceRecordKey,MediaURL,ImageSizeDescription,Order`,
    `$filter=ResourceRecordKey eq '${listingKey}'`,
    `$orderby=Order asc`,
    `$count=true`,
  ].join("&");

  const url = `${baseUrl}/Media?${query}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    return { error: `HTTP ${res.status} ${res.statusText}`, records: [], count: 0 };
  }

  const data = await res.json();
  return {
    records: data.value || [],
    count: data["@odata.count"] ?? data.value?.length ?? 0,
  };
}

async function run() {
  const env = await loadEnv();
  const baseUrl = (env.AMPRE_API_BASE_URL || "").replace(/\/$/, "");
  const token = env.AMPRE_API_TOKEN;

  if (!baseUrl || !token) {
    throw new Error("Missing AMPRE_API_BASE_URL or AMPRE_API_TOKEN in frontend/.env.local");
  }

  // Get listing keys from args or pick random from property.json
  let keys = process.argv.slice(2);
  if (keys.length === 0) {
    try {
      const data = JSON.parse(
        await readFile(resolve(__dirname, "data/property.json"), "utf-8")
      );
      const properties = data.value || data;
      // Pick 5 random keys
      const shuffled = properties.sort(() => Math.random() - 0.5);
      keys = shuffled.slice(0, 5).map((p) => p.ListingKey);
      console.log(`Using 5 random keys from property.json\n`);
    } catch {
      throw new Error(
        "No listing keys provided and scripts/data/property.json not found.\n" +
        "Usage: node scripts/diagnose-media.mjs <key1> <key2> ..."
      );
    }
  }

  console.log(`Querying AMPRE Media for ${keys.length} listing keys...\n`);
  console.log("─".repeat(80));

  let totalWithMedia = 0;
  let totalRecords = 0;

  for (const key of keys) {
    const result = await fetchMediaForKey(baseUrl, token, key);

    if (result.error) {
      console.log(`${key}: ERROR — ${result.error}`);
      console.log("─".repeat(80));
      continue;
    }

    const records = result.records;
    totalRecords += records.length;

    if (records.length === 0) {
      console.log(`${key}: No media found`);
    } else {
      totalWithMedia++;
      // Count by size
      const sizes = {};
      for (const m of records) {
        const s = m.ImageSizeDescription || "(null)";
        sizes[s] = (sizes[s] || 0) + 1;
      }

      // Unique photos (by Order)
      const uniqueOrders = new Set(records.map((m) => m.Order));

      console.log(`${key}: ${records.length} records, ${uniqueOrders.size} unique photos`);
      console.log(`  Sizes: ${Object.entries(sizes).map(([k, v]) => `${k}=${v}`).join(", ")}`);
      console.log(`  Sample URL: ${records[0]?.MediaURL?.slice(0, 80)}...`);
    }
    console.log("─".repeat(80));
  }

  console.log(`\nSummary: ${totalWithMedia}/${keys.length} keys have media (${totalRecords} total records)`);

  if (totalWithMedia === 0) {
    console.log("\nNo media found for ANY key. Possible causes:");
    console.log("  1. AMPRE genuinely has no photos for these listings");
    console.log("  2. Media is linked by a different key than ListingKey");
    console.log("  3. The API token lacks Media resource permissions");
  } else if (totalWithMedia < keys.length) {
    console.log(`\n${keys.length - totalWithMedia} keys had no media — likely not uploaded to AMPRE yet`);
  }
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
