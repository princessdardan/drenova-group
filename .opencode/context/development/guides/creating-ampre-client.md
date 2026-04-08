<!-- Context: development/guides/creating-ampre-client | Priority: high | Version: 1.0 | Updated: 2026-04-08 -->

# Guide: Creating the AMPRE Client

**Core Idea**: Build a minimal HTTP client for the AMPRE OData API with Bearer auth, error handling, and pagination support. Used exclusively by the sync route — never by pages directly.

**Implementation**:

**1. Client Setup** (`frontend/src/lib/ampre/client.ts`):
```typescript
const AMPRE_API_BASE_URL = process.env.AMPRE_API_BASE_URL;
const AMPRE_API_TOKEN = process.env.AMPRE_API_TOKEN;

class AmpreError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
  }
}
```

**2. Fetch with Pagination**:
```typescript
export async function fetchAmpreProperties(
  query: string
): Promise<AmpreProperty[]> {
  const results: AmpreProperty[] = [];
  let nextLink: string | undefined = 
    `${AMPRE_API_BASE_URL}/Property?${query}`;
  
  while (nextLink) {
    const response = await fetch(nextLink, {
      headers: {
        Authorization: `Bearer ${AMPRE_API_TOKEN}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new AmpreError(
        `AMPRE API error: ${response.status}`,
        response.status
      );
    }
    
    const data: AmpreResponse = await response.json();
    results.push(...data.value);
    nextLink = data["@odata.nextLink"];
  }
  
  return results;
}
```

**3. Types** (`frontend/src/lib/ampre/types.ts`):
```typescript
export interface AmpreResponse {
  "@odata.context"?: string;
  "@odata.count"?: number;
  "@odata.nextLink"?: string;
  value: AmpreProperty[];
}

export interface AmpreProperty {
  ListingKey: string;
  ListPrice: number;
  // ... 26 more fields
}
```

**Key Rules**:
- `cache: "no-store"` on every fetch (prevent Next.js caching)
- Response bodies **never logged** (§4 confidentiality)
- Client imported **only** by sync route
- All user reads go through Redis via `lib/ampre/fetch.ts`

**Reference**: [AMPRE Integration PRD](/Users/dardan/Documents/drenova-group/docs/ampre-integration-prd.md)

**Related**:
- [odata-query-builder.md](../concepts/odata-query-builder.md) — Query construction
- [data-mapping.md](../concepts/data-mapping.md) — Property transformation
