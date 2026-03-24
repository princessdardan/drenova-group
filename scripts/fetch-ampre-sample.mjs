/**
 * Fetch sample data from the AMPRE OData API — SAFE, metadata-validated.
 *
 * IMPORTANT: AMPRE DLA §3.a limits data retrieval to once per 24 hours.
 * This script validates ALL field names against $metadata BEFORE making
 * any data request, so it can never burn a daily fetch on a bad field name.
 *
 * Flow:
 *   1. Fetch $metadata (schema endpoint — does NOT count as data retrieval)
 *   2. Validate desired $select fields against actual schema
 *   3. ONE data request for Property (active listings + expanded Media)
 *   4. ONE data request for Media (recent records)
 *
 * Usage:  node scripts/fetch-ampre-sample.mjs
 * Output: scripts/data/property.json, scripts/data/media.json, scripts/data/metadata.json
 */

import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

// ─── Load env from frontend/.env.local ───────────────────────────────────────

async function loadEnv() {
  const envPath = resolve(projectRoot, "frontend/.env.local");
  const content = await readFile(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    env[key] = value;
  }
  return env;
}

// ─── Desired fields — corrected against AMPRE $metadata ──────────────────────
// Field mapping notes:
//   LivingArea       → NOT on schema. Use LivingAreaRange (string, e.g. "1100-1500")
//   Media            → Navigation property, requires $expand=Media (not $select)
//   perm_adv         → NOT on schema. Closest: DDFYN, InternetEntireListingDisplayYN
//   disp_addr        → NOT on schema. Closest: InternetAddressDisplayYN
//   YearBuilt        → EXISTS on schema (null for some records)
//   Latitude/Longitude → EXIST on schema (null for some records)

const DESIRED_PROPERTY_FIELDS = [
  // Identity
  "ListingKey",
  "ListingId",
  // Price
  "ListPrice",
  "OriginalListPrice",
  // Address
  "UnparsedAddress",
  "StreetNumber",
  "StreetName",
  "StreetSuffix",
  "City",
  "StateOrProvince",
  "PostalCode",
  "Country",
  // Location
  "Latitude",
  "Longitude",
  // Details
  "BedroomsTotal",
  "BathroomsTotalInteger",
  "LivingAreaRange",       // replaces LivingArea (string range, not number)
  "AboveGradeFinishedArea", // numeric sqft alternative
  "BuildingAreaTotal",      // another numeric sqft alternative
  "LotSizeArea",
  "PropertyType",
  "PropertySubType",
  "YearBuilt",
  "PublicRemarks",
  // Status
  "StandardStatus",
  "MlsStatus",
  "ListingContractDate",
  "ModificationTimestamp",
  // Brokerage
  "ListOfficeName",
  "ListAgentFullName",
  // Compliance — AMPRE equivalents of perm_adv / disp_addr
  "DDFYN",
  "InternetEntireListingDisplayYN",
  "InternetAddressDisplayYN",
];

const DESIRED_MEDIA_FIELDS = [
  "MediaKey",
  "ResourceRecordKey",
  "MediaURL",
  "ImageSizeDescription",
  "MediaModificationTimestamp",
  "MediaStatus",
  "Order",
];

// ─── Pagination helper ───────────────────────────────────────────────────────

/**
 * Fetch all pages of an OData resource by following @odata.nextLink.
 * Logs progress per page. Returns all records + totalCount from @odata.count.
 */
async function fetchAllPages(url, headers, label = "fetch") {
  const records = [];
  let totalCount = null;
  let page = 0;
  let nextUrl = url;

  while (nextUrl) {
    const res = await fetch(nextUrl, { headers });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`${label} failed on page ${page + 1}: ${res.status} ${res.statusText}\n${body}`);
    }

    const data = await res.json();
    records.push(...data.value);
    page++;

    if (totalCount === null && data["@odata.count"] != null) {
      totalCount = data["@odata.count"];
    }

    console.log(
      `[${label.padEnd(5)}] Page ${page}: +${data.value.length} records (${records.length}${totalCount != null ? `/${totalCount}` : ""} accumulated)`
    );

    nextUrl = data["@odata.nextLink"] ?? null;
  }

  return { records, totalCount, pages: page };
}

// ─── Main ────────────────────────────────────────────────────────────────────

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function run() {
  const env = await loadEnv();

  const baseUrl = (env.AMPRE_API_BASE_URL || "").replace(/\/$/, "");
  const token = env.AMPRE_API_TOKEN;

  if (!baseUrl || !token) {
    throw new Error(
      "Missing AMPRE_API_BASE_URL or AMPRE_API_TOKEN in frontend/.env.local"
    );
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const dataDir = resolve(__dirname, "data");
  await mkdir(dataDir, { recursive: true });

  // ── Step 1: Fetch $metadata to discover valid field names ──────────────────
  console.log("[meta ] Fetching $metadata (schema only, not a data retrieval)...");

  const metaUrl = `${baseUrl}/$metadata?$format=json`;
  const metaRes = await fetch(metaUrl, { headers });

  if (!metaRes.ok) {
    const body = await metaRes.text();
    throw new Error(`Metadata fetch failed: ${metaRes.status} ${metaRes.statusText}\n${body}`);
  }

  const metadata = await metaRes.json();
  await writeFile(resolve(dataDir, "metadata.json"), JSON.stringify(metadata, null, 2));
  console.log("[meta ] Saved to scripts/data/metadata.json\n");

  // ── Step 2: Parse AMPRE's CSDL JSON structure ─────────────────────────────
  // AMPRE uses OData CSDL 4.01 JSON format: { "$Version": "4.01", "us.ampre.webapi": { "Property": { field: type, ... } } }
  const ns = metadata["us.ampre.webapi"];
  if (!ns) {
    throw new Error("Unexpected metadata format — missing 'us.ampre.webapi' namespace");
  }

  function getSchemaFields(entityName) {
    const entity = ns[entityName];
    if (!entity) return null;
    return new Set(Object.keys(entity).filter((k) => !k.startsWith("$")));
  }

  const propertyFields = getSchemaFields("Property");
  const mediaFields = getSchemaFields("Media");

  console.log(`[meta ] Property: ${propertyFields?.size ?? "?"} fields`);
  console.log(`[meta ] Media: ${mediaFields?.size ?? "?"} fields\n`);

  // ── Step 3: Validate $select fields against schema ────────────────────────
  const validPropertySelect = validateFields("Property", DESIRED_PROPERTY_FIELDS, propertyFields);
  const validMediaSelect = validateFields("Media", DESIRED_MEDIA_FIELDS, mediaFields);

  if (validPropertySelect.length === 0) {
    throw new Error("No valid Property fields — aborting to avoid wasting a data request");
  }

  console.log("");

  // ── Step 4: Property data request (all pages) ──────────────────────────────
  // Media is a separate resource (not a nav prop on Property) — fetched in step 5
  const propertyUrl = encodeURI(
    `${baseUrl}/Property?$select=${validPropertySelect.join(",")}&$filter=StandardStatus eq 'Active'&$orderby=ModificationTimestamp desc&$count=true`
  );

  console.log(`[prop ] GET ${propertyUrl}\n`);
  const { records: properties, totalCount: propCount, pages: propPages } =
    await fetchAllPages(propertyUrl, headers, "prop");

  console.log(`[prop ] Done — ${properties.length} records across ${propPages} page(s) (${propCount} total matching)\n`);

  await writeFile(resolve(dataDir, "property.json"), JSON.stringify(properties, null, 2));

  // ── Step 5: Media data requests (batched by listing key) ──────────────────
  // Fetch media for the properties we just retrieved, using ResourceRecordKey
  // filter (same approach as the production sync). This scopes results to our
  // listings instead of date-filtering the entire MLS media table.
  const mediaSelectParam = validMediaSelect.length > 0
    ? `$select=${validMediaSelect.join(",")}&`
    : "";

  const MEDIA_BATCH_SIZE = 50;
  const listingKeys = properties.map((p) => p.ListingKey);
  const allMedia = [];
  let mediaBatchErrors = 0;

  for (let i = 0; i < listingKeys.length; i += MEDIA_BATCH_SIZE) {
    const batch = listingKeys.slice(i, i + MEDIA_BATCH_SIZE);
    const batchNum = Math.floor(i / MEDIA_BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(listingKeys.length / MEDIA_BATCH_SIZE);
    const keyList = batch.map((k) => `'${k}'`).join(",");

    const mediaUrl = encodeURI(
      `${baseUrl}/Media?${mediaSelectParam}$filter=ResourceRecordKey in (${keyList})&$orderby=ResourceRecordKey asc,Order asc&$count=true`
    );

    console.log(`[media] Batch ${batchNum}/${totalBatches} (${batch.length} listings)`);

    try {
      const { records: batchMedia } = await fetchAllPages(mediaUrl, headers, "media");
      allMedia.push(...batchMedia);
    } catch (err) {
      console.error(`[media] Batch ${batchNum} failed: ${err.message}`);
      mediaBatchErrors++;
    }
  }

  const media = allMedia;
  console.log(`[media] Done — ${media.length} total media records for ${listingKeys.length} listings (${mediaBatchErrors} batch errors)\n`);

  await writeFile(resolve(dataDir, "media.json"), JSON.stringify(media, null, 2));

  // ── Summary ────────────────────────────────────────────────────────────────
  const mediaBatches = Math.ceil(listingKeys.length / MEDIA_BATCH_SIZE);
  const summary = {
    fetchedAt: new Date().toISOString(),
    source: baseUrl,
    metadataRequests: 1,
    property: {
      returned: properties.length,
      totalMatching: propCount,
      pages: propPages,
      fieldsRequested: validPropertySelect,
      note: "Media is a separate resource — join via ResourceRecordKey = ListingKey",
    },
    media: {
      returned: media.length,
      batches: mediaBatches,
      batchErrors: mediaBatchErrors,
      fieldsRequested: validMediaSelect,
    },
    fieldValidation: {
      propertyDropped: DESIRED_PROPERTY_FIELDS.filter((f) => !validPropertySelect.includes(f)),
      mediaDropped: DESIRED_MEDIA_FIELDS.filter((f) => !validMediaSelect.includes(f)),
    },
  };

  await writeFile(resolve(dataDir, "summary.json"), JSON.stringify(summary, null, 2));

  console.log(`[run  ] Done. Files written to scripts/data/`);
  console.log(`        ├── metadata.json  (full OData schema — ${propertyFields?.size} Property fields, ${mediaFields?.size} Media fields)`);
  console.log(`        ├── property.json  (${properties.length} listings across ${propPages} pages)`);
  console.log(`        ├── media.json     (${media.length} media records from ${mediaBatches} batches)`);
  console.log(`        └── summary.json`);
}

/**
 * Validate desired fields against the actual schema.
 * Returns only fields that exist. Logs warnings for dropped fields.
 */
function validateFields(entityName, desired, schemaFields) {
  if (!schemaFields) {
    console.log(`[valid] ${entityName}: no schema found — skipping $select to fetch all fields`);
    return [];
  }

  const valid = [];
  const dropped = [];

  for (const field of desired) {
    if (schemaFields.has(field)) {
      valid.push(field);
    } else {
      dropped.push(field);
    }
  }

  if (dropped.length > 0) {
    console.log(`[valid] ${entityName}: DROPPED ${dropped.length} invalid fields: ${dropped.join(", ")}`);
  }
  console.log(`[valid] ${entityName}: ${valid.length}/${desired.length} fields validated OK`);

  return valid;
}
