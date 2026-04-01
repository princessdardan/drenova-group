/**
 * AMPRE / PropTx Data License compliance constants and guards.
 *
 * These values are derived from the PropTx Data License Agreement
 * (see docs/ampre-data-license-guidelines.md).
 */

/** Maximum interval between data retrievals from AMPRE (§3.a) */
export const MAX_RETRIEVAL_INTERVAL_HOURS = 24;

/** Maximum days to retain listing data after last sync confirmation (§1.d) */
export const MAX_RETENTION_DAYS = 60;

/**
 * AI/ML Prohibition Notice (§1.e)
 *
 * MLS data retrieved from AMPRE MUST NOT be used to train, fine-tune, or
 * provide input to any artificial intelligence, machine learning, or
 * automated valuation model. This includes but is not limited to:
 * - Training datasets for ML models
 * - Input to LLM prompts or RAG pipelines
 * - Automated property valuation
 * - Predictive analytics on MLS data
 *
 * Violation of this restriction may result in immediate license termination.
 */
export const AI_PROHIBITION_NOTICE =
  "AMPRE/MLS data must not be used for AI/ML training, inference, or automated valuation per §1.e of the PropTx Data License.";

/**
 * Required $select fields that MUST be included in every AMPRE query.
 *
 * The PropTx DLA refers to these as `perm_adv` and `disp_addr`, but
 * AMPRE's OData schema uses RESO-standard names (all booleans):
 *   perm_adv  → DDFYN + InternetEntireListingDisplayYN
 *   disp_addr → InternetAddressDisplayYN
 */
export const REQUIRED_SELECT_FIELDS = [
  "DDFYN",
  "InternetEntireListingDisplayYN",
  "InternetAddressDisplayYN",
] as const;

/** Redis key for the listings array */
export const KV_LISTINGS_KEY = "listings:all";

/** Redis key prefix for sync log entries */
export const KV_SYNC_LOG_PREFIX = "sync:log:";

/** Permitted property types — only residential listings are fetched and stored. */
export const RESIDENTIAL_PROPERTY_TYPES = [
  "Residential Freehold",
  "Residential Condo & Other",
] as const;
