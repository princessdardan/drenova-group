<!-- Context: development/concepts/filtering-pattern | Priority: medium | Version: 1.0 | Updated: 2026-04-08 -->

# Concept: In-Memory Filtering Pattern

**Core Idea**: All listing filters are applied in-memory after reading the full dataset from Redis — not as OData query parameters. This enables fast, flexible filtering without API round-trips.

**Key Points**:
- **Read full dataset**: `listings:all` JSON array from Redis
- **In-memory processing**: Filter → Sort → Paginate in JavaScript
- **No secondary indexes**: Linear scans on every request
- **Efficient for small datasets**: <500 listings = negligible performance impact
- **Case-insensitive**: All string comparisons normalized to lowercase

**Filter Logic** (`frontend/src/lib/ampre/fetch.ts`):
```typescript
function applyFilters(listings: Listing[], filters: ListingFilters): Listing[] {
  let result = listings;

  if (filters.propertyType)
    result = result.filter(l => 
      l.propertyType.toLowerCase() === filters.propertyType!.toLowerCase()
    );

  if (filters.minBeds)
    result = result.filter(l => l.beds >= filters.minBeds!);

  if (filters.minPrice)
    result = result.filter(l => l.price >= filters.minPrice!);

  if (filters.maxPrice)
    result = result.filter(l => l.price <= filters.maxPrice!);

  if (filters.city)
    result = result.filter(l => 
      l.city.toLowerCase() === filters.city!.toLowerCase()
    );

  return result;
}
```

**Sorting Logic**:
```typescript
function applySort(listings: Listing[], sort?: string): Listing[] {
  const sorted = [...listings];
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      sorted.sort((a, b) => 
        new Date(b.modificationTimestamp).getTime() - 
        new Date(a.modificationTimestamp).getTime()
      );
      break;
  }
  return sorted;
}
```

**Pagination**:
```typescript
const DEFAULT_PAGE_SIZE = 12;
const page = filters.page ?? 1;
const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
const start = (page - 1) * pageSize;
const paginated = sorted.slice(start, start + pageSize);
```

**Why Not OData Filters?**
- User filters change frequently — would require new API calls
- AMPRE API has rate limits (compliance: 1 call per 24 hours)
- Small dataset size makes in-memory filtering efficient
- Enables instant URL-based filter sharing

**Reference**: [Listings Implementation](/Users/dardan/Documents/drenova-group/docs/listings-implementation.md)

**Related**:
- [listing-filters-component.md](../examples/listing-filters-component.md) — UI implementation
- [type-definitions.md](../lookup/type-definitions.md) — Filter interfaces
