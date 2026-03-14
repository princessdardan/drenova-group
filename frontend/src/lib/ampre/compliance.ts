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
 * `perm_adv` and `disp_addr` are mandatory display-control fields per
 * the PropTx Data License Addendum.
 */
export const REQUIRED_SELECT_FIELDS = [
  "perm_adv",
  "disp_addr",
] as const;

/** Redis key for the listings array */
export const KV_LISTINGS_KEY = "listings:all";

/** Redis key prefix for sync log entries */
export const KV_SYNC_LOG_PREFIX = "sync:log:";
