<!-- Context: development/navigation | Priority: critical | Version: 1.0 | Updated: 2026-04-08 -->

# Development Context

**Purpose**: Coding patterns, implementation details, and development workflows for the Drenova Group Next.js + Sanity codebase.

---

## Quick Navigation

### Concepts
| File | Description | Priority |
|------|-------------|----------|
| [server-components.md](concepts/server-components.md) | Next.js App Router patterns | critical |
| [odata-query-builder.md](concepts/odata-query-builder.md) | AMPRE OData query construction | high |
| [data-mapping.md](concepts/data-mapping.md) | AMPRE-to-Listing transformation | high |
| [filtering-pattern.md](concepts/filtering-pattern.md) | In-memory filter/sort/paginate | medium |

### Examples
| File | Description | Priority |
|------|-------------|----------|
| [listing-filters-component.md](examples/listing-filters-component.md) | Client-side filter state management | high |
| [property-card.md](examples/property-card.md) | Listing card rendering | medium |
| [sync-route-handler.md](examples/sync-route-handler.md) | API route implementation | high |

### Guides
| File | Description | Priority |
|------|-------------|----------|
| [creating-ampre-client.md](guides/creating-ampre-client.md) | Building the AMPRE HTTP client | high |
| [implementing-filters.md](guides/implementing-filters.md) | Adding listing filters | medium |
| [type-migration.md](guides/type-migration.md) | Canadian locale field updates | medium |

### Lookup
| File | Description | Priority |
|------|-------------|----------|
| [type-definitions.md](lookup/type-definitions.md) | Listing and AMPRE types | critical |
| [select-fields.md](lookup/select-fields.md) | OData $select field list | medium |
| [filter-mapping.md](lookup/filter-mapping.md) | URL params to OData filters | medium |

### Errors
| File | Description | Priority |
|------|-------------|----------|
| [type-mismatches.md](errors/type-mismatches.md) | Common type issues | medium |
| [odata-errors.md](errors/odata-errors.md) | Query builder mistakes | medium |

---

## Loading Strategy

**For AMPRE client work**:
1. Load concepts/server-components.md
2. Load guides/creating-ampre-client.md
3. Load lookup/type-definitions.md

**For filter implementation**:
1. Load concepts/filtering-pattern.md
2. Load examples/listing-filters-component.md
3. Load lookup/filter-mapping.md

**For data mapping**:
1. Load concepts/data-mapping.md
2. Load lookup/select-fields.md
