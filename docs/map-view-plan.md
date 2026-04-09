# Map View Feature: Technical Analysis & Implementation Plan

> **Version:** 1.0  
> **Date:** April 8, 2026  
> **Status:** Analysis Complete — Ready for Implementation Planning  
> **Parent PRD:** `prd.md` (Drenova Group — Real Estate Website)

---

## Executive Summary

This document provides a comprehensive analysis and implementation plan for adding an interactive map view to the Drenova Group listings page. The map view will allow users to browse property listings geographically by selecting pins on the map, with seamless integration between the map and existing list/grid views.

**Key Findings:**
- ✅ **Location data IS available** in AMPRE API (`latitude`/`longitude` fields)
- ⚠️ **Data quality concern:** Many AMPRE records have null coordinates (geocoding may be required)
- ✅ **Compliance handled:** Coordinates are properly suppressed when `addressSuppressed=true`
- 🎯 **Recommended API:** Mapbox GL JS (best balance of cost, customization, and performance)

---

## 1. Data Sufficiency Analysis

### 1.1 Current AMPRE Data Structure

The AMPRE API provides the following location-related fields:

```typescript
// From frontend/src/lib/ampre/types.ts
interface AmpreProperty {
  // Location (null for many records — may need separate geocoding)
  Latitude?: number | null;
  Longitude?: number | null;
  
  // Address fields
  UnparsedAddress?: string;
  StreetNumber?: string;
  StreetName?: string;
  StreetSuffix?: string;
  City: string;
  StateOrProvince: string;
  PostalCode: string;
  Country?: string;
}
```

### 1.2 Mapped Listing Type

The current `Listing` type already includes coordinate fields:

```typescript
// From frontend/src/types/listing.ts
interface Listing {
  latitude?: number | null;
  longitude?: number | null;
  addressSuppressed?: boolean;
  // ... other fields
}
```

### 1.3 Data Quality Assessment

| Aspect | Status | Details |
|--------|--------|---------|
| **Coordinates Available** | ✅ Yes | `Latitude` and `Longitude` fields exist in AMPRE schema |
| **Data Completeness** | ⚠️ Partial | Many records have null coordinates (exact percentage TBD) |
| **Geocoding Required** | 🔶 Likely | May need to geocode addresses for listings without coordinates |
| **Compliance** | ✅ Handled | Coordinates suppressed when `InternetAddressDisplayYN=false` |

### 1.4 Data Flow

```
AMPRE API → Redis Cache → Listing Type → Map Component
     ↓
Latitude/Longitude (when available)
     ↓
Mapper sets null when address suppressed (compliance)
```

### 1.5 Recommendation: Data Strategy

**Option A: Use Available Coordinates Only (Recommended for MVP)**
- Display only listings with valid coordinates
- Show count of "X properties with map locations"
- Fallback to list view for all properties
- **Pros:** Simple, no additional API costs, immediate implementation
- **Cons:** Some listings won't appear on map

**Option B: Geocode Missing Coordinates (Future Enhancement)**
- Use Mapbox Geocoding API or Google Geocoding API
- Cache geocoded results in Redis
- Batch process during AMPRE sync
- **Pros:** 100% coverage, better UX
- **Cons:** Additional cost (~$0.50/1000 requests), complexity, rate limits

**Decision:** Start with Option A. Implement Option B only if user feedback indicates need.

---

## 2. Map API Comparison & Recommendation

### 2.1 Candidate APIs

| API | Free Tier | Paid Cost | Customization | Performance | Best For |
|-----|-----------|-----------|---------------|-------------|----------|
| **Mapbox GL JS** | 50,000 loads/mo | $5/1000 loads | Excellent | Fast | Custom styling, real estate |
| **Google Maps JS** | $200 credit/mo | $7/1000 loads | Good | Very fast | Places data, routing |
| **MapLibre GL** | Free (self-hosted) | Hosting costs | Excellent | Fast | Full control, open source |
| **Leaflet + OSM** | Free | Tile server costs | Good | Moderate | Simple maps, low budget |

### 2.2 Detailed Comparison

#### Mapbox GL JS (Recommended)

**Pros:**
- **Generous free tier:** 50,000 web map loads/month
- **Superior customization:** Full control over map styling via Mapbox Studio
- **Real estate optimized:** Clean, modern base maps perfect for property listings
- **React integration:** Excellent `react-map-gl` library support
- **Clustering built-in:** Native marker clustering for dense areas
- **Performance:** WebGL-based, smooth interactions
- **Geocoding available:** If we need to geocode missing addresses later

**Cons:**
- Costs scale with traffic beyond free tier
- Learning curve for advanced customization

**Pricing:**
- Free: 50,000 loads/month
- $5 per 1,000 loads beyond free tier
- Estimated cost at 100K monthly page views: ~$250/month

#### Google Maps Platform

**Pros:**
- **User familiarity:** Most users already know Google Maps
- **Places database:** Rich business/POI data
- **Street View:** Useful for property context
- **Reliability:** Google's infrastructure

**Cons:**
- **Expensive:** $7 per 1,000 loads (after $200 credit)
- **Limited customization:** Styling restrictions
- **Real estate look:** Default style less premium than Mapbox

**Pricing:**
- $200 free credit monthly (~28,000 loads)
- $7 per 1,000 loads beyond
- Estimated cost at 100K monthly page views: ~$500/month

#### MapLibre GL (Open Source Alternative)

**Pros:**
- **Completely free:** No usage fees
- **Mapbox compatible:** Drop-in replacement for Mapbox GL JS
- **Full control:** Self-hosted tiles

**Cons:**
- **Tile hosting required:** Need to host own vector tiles or use third party
- **Maintenance overhead:** Self-managed infrastructure
- **No geocoding:** Would need separate service

### 2.3 Recommendation: Mapbox GL JS

**Rationale:**
1. **Cost-effective:** 50K free loads covers initial growth
2. **Design flexibility:** Can match Drenova Group's premium brand aesthetic
3. **Real estate focus:** Clean, uncluttered base maps highlight properties
4. **React ecosystem:** `react-map-gl` provides excellent React integration
5. **Future-proof:** Easy to add geocoding later if needed

---

## 3. Technical Implementation Plan

### 3.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Listings Page                            │
│  ┌─────────────────┐  ┌─────────────────────────────────┐  │
│  │  View Toggle    │  │         Map Container           │  │
│  │  [List] [Map]   │  │  ┌─────────────────────────┐   │  │
│  └─────────────────┘  │  │    react-map-gl         │   │  │
│                       │  │  ┌─────────────────┐    │   │  │
│  ┌─────────────────┐  │  │ │  Mapbox GL JS   │    │   │  │
│  │  Filters Panel   │  │  │ │  ┌───────────┐  │    │   │  │
│  │  (Shared)        │──┼──┼─┼─││ Markers   │  │    │   │  │
│  └─────────────────┘  │  │ │ │ └───────────┘  │    │   │  │
│                       │  │ │ │ ┌───────────┐  │    │   │  │
│  ┌─────────────────┐  │  │ │ ││ Clusters  │  │    │   │  │
│  │  Results Info    │  │  │ │ │ └───────────┘  │    │   │  │
│  │  "Showing X of Y"│  │  │ │ └─────────────────┘    │   │  │
│  └─────────────────┘  │  │ └─────────────────────────┘   │  │
│                       │  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Component Structure

```
frontend/src/
├── components/
│   ├── ui/
│   │   ├── listing-filters.tsx          # Existing (shared)
│   │   ├── property-card.tsx            # Existing (for popup)
│   │   ├── view-toggle.tsx              # NEW: List/Map toggle
│   │   ├── map-container.tsx            # NEW: Main map component
│   │   ├── map-marker.tsx               # NEW: Individual marker
│   │   ├── map-cluster.tsx              # NEW: Cluster marker
│   │   └── map-popup.tsx                # NEW: Property popup
│   └── sections/
│       └── listings-grid.tsx            # Modified to support dual view
├── lib/
│   └── mapbox/
│       ├── client.ts                    # NEW: Mapbox config
│       ├── types.ts                   # NEW: Map-specific types
│       └── utils.ts                   # NEW: Geo utilities
└── hooks/
    └── use-map-view.ts                # NEW: Map state management
```

### 3.3 Key Implementation Details

#### Map Container Component

```typescript
// Pseudo-code for map-container.tsx
"use client";

import { useState, useMemo } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl";
import type { Listing } from "@/types/listing";

interface MapContainerProps {
  listings: Listing[];
  onMarkerClick: (listing: Listing) => void;
  selectedListing?: Listing;
}

export function MapContainer({ listings, onMarkerClick }: MapContainerProps) {
  // Filter to listings with coordinates
  const mappableListings = useMemo(() => 
    listings.filter(l => l.latitude && l.longitude),
    [listings]
  );

  // Calculate bounds for initial viewport
  const bounds = useMemo(() => calculateBounds(mappableListings), [mappableListings]);

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{ bounds }}
      style={{ width: "100%", height: "600px" }}
      mapStyle="mapbox://styles/mapbox/light-v11" // Customizable
    >
      <NavigationControl position="top-right" />
      <ClusteredMarkers 
        listings={mappableListings} 
        onMarkerClick={onMarkerClick}
      />
    </Map>
  );
}
```

#### Clustering Strategy

Use `supercluster` or `react-map-gl`'s built-in clustering:

```typescript
// Cluster markers when zoomed out
// Show individual pins when zoomed in
// Cluster count indicates number of properties in area
```

#### View State Management

```typescript
// URL-based view state for shareability
// ?view=map&lat=43.65&lng=-79.38&zoom=12
```

### 3.4 Environment Variables

```bash
# .env.local
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiZHJlbm92YS... # Public token
```

### 3.5 Dependencies

```json
{
  "dependencies": {
    "mapbox-gl": "^3.0.0",
    "react-map-gl": "^7.1.0",
    "supercluster": "^8.0.0"
  }
}
```

---

## 4. UI/UX Design Considerations

### 4.1 Layout Options

**Option A: Side-by-Side (Desktop) / Stacked (Mobile)**
```
Desktop:                    Mobile:
┌──────────┬──────────┐     ┌──────────┐
│ Filters  │   Map    │     │ Filters  │
│          │          │     ├──────────┤
│ List     │          │     │ [List/Map Toggle] │
│          │          │     ├──────────┤
│          │          │     │   Map    │
└──────────┴──────────┘     └──────────┘
```

**Option B: Full-Width Toggle (Recommended)**
```
┌─────────────────────────────┐
│  Filters  │  [List] [Map]   │
├─────────────────────────────┤
│                             │
│    Either List OR Map       │
│    (Full Width)             │
│                             │
└─────────────────────────────┘
```

**Decision:** Option B for simplicity and mobile-friendliness.

### 4.2 Map Styling

**Base Map Style:**
- Use Mapbox "Light" or custom branded style
- Remove unnecessary POI layers (businesses, transit) to reduce clutter
- Keep roads, parks, water features for context
- Subdued colors to let property pins stand out

**Marker Design:**
```
┌─────────────┐
│   $1.2M     │  ← Price in marker (optional)
│     📍      │  ← Pin icon
└─────────────┘
     │
     ▼
```

**Cluster Design:**
```
┌─────────────┐
│     12      │  ← Count of properties
│  properties │
└─────────────┘
```

### 4.3 Interactions

| Action | Behavior |
|--------|----------|
| **Click marker** | Show popup with property card preview |
| **Click cluster** | Zoom in to expand cluster |
| **Drag map** | Update URL with new center coordinates |
| **Zoom** | Load more granular markers |
| **Apply filters** | Re-render markers (smooth transition) |
| **Hover marker** | Slight scale-up animation |

### 4.4 Mobile Considerations

- Map height: 50vh minimum
- Bottom sheet for property details (instead of popup)
- Floating filter button
- Touch-optimized marker size (min 44px)

---

## 5. Compliance & Privacy

### 5.1 Data Privacy

- **No additional PII exposure:** Using existing coordinate data
- **Address suppression respected:** Listings with `addressSuppressed=true` won't show on map
- **Geocoding (if implemented):** Would need privacy policy update

### 5.2 Mapbox Privacy

- Mapbox collects usage analytics (map loads)
- No user PII transmitted to Mapbox
- Consider Mapbox's privacy policy in Drenova's privacy policy

### 5.3 Accessibility

- Map must have keyboard navigation
- Screen reader announcements for marker count
- Alternative list view always available
- Respect `prefers-reduced-motion`

---

## 6. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up Mapbox account and obtain API token
- [ ] Add environment variable configuration
- [ ] Install dependencies (`mapbox-gl`, `react-map-gl`)
- [ ] Create basic `MapContainer` component
- [ ] Create `ViewToggle` component (List/Map)

**Deliverable:** Basic map rendering with hardcoded test markers

### Phase 2: Data Integration (Week 1-2)
- [ ] Filter listings to those with valid coordinates
- [ ] Connect real listing data to markers
- [ ] Implement marker clustering
- [ ] Add marker popups with property preview
- [ ] Handle address-suppressed listings

**Deliverable:** Map showing real listings with clustering

### Phase 3: Interactions & Polish (Week 2)
- [ ] URL state synchronization (lat/lng/zoom)
- [ ] Filter synchronization between list and map views
- [ ] Smooth transitions when switching views
- [ ] Mobile-responsive layout
- [ ] Loading states and error handling

**Deliverable:** Fully functional map view with filters

### Phase 4: Optimization (Week 3)
- [ ] Performance optimization (marker virtualization if needed)
- [ ] Custom map styling in Mapbox Studio
- [ ] Analytics tracking (map interactions)
- [ ] Accessibility audit
- [ ] Browser testing

**Deliverable:** Production-ready map view

### Phase 5: Future Enhancements (Post-MVP)
- [ ] Geocode listings without coordinates
- [ ] Draw-to-search (polygon selection)
- [ ] Neighborhood boundaries overlay
- [ ] School district layers
- [ ] Walk score/transit integration

---

## 7. Cost Estimates

### 7.1 Development Costs

| Item | Estimate |
|------|----------|
| **Development time** | 2-3 weeks (1 developer) |
| **Mapbox API (free tier)** | $0 (up to 50K loads) |
| **Mapbox API (projected)** | $50-250/month at scale |

### 7.2 Mapbox Pricing Scenarios

| Monthly Page Views | Map Loads | Cost |
|-------------------|-----------|------|
| 10,000 | ~10,000 | $0 (within free tier) |
| 50,000 | ~50,000 | $0 (at free tier limit) |
| 100,000 | ~100,000 | ~$250/month |
| 500,000 | ~500,000 | ~$2,250/month |

*Assumes 1 map load per page view. Actual may be lower with caching.*

### 7.3 Alternative: MapLibre (Cost Savings)

If Mapbox costs become prohibitive:
- Switch to MapLibre GL (free, open source)
- Host tiles on MapTiler Cloud (~$25/month for 100K tiles)
- **Savings:** ~$225/month at 100K scale

---

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **High % of listings without coordinates** | Medium | High | Start with available data only; geocode if needed |
| **Mapbox costs exceed budget** | Low | Medium | Monitor usage; have MapLibre migration plan ready |
| **Mobile performance issues** | Medium | Medium | Test on low-end devices; implement virtualization |
| **Accessibility compliance** | Low | High | Test with screen readers; provide list alternative |
| **API rate limiting** | Low | Medium | Implement client-side caching; debounce interactions |
| **Coordinate data accuracy** | Medium | Medium | Validate coordinates; show accuracy disclaimer |

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Map view adoption** | 30% of listing page users | Analytics: view toggle clicks |
| **Marker click rate** | 15% of map users | Analytics: marker interactions |
| **Time on page** | +20% vs list-only | Analytics: session duration |
| **Mobile usability** | 90%+ Lighthouse score | Lighthouse CI |
| **Load performance** | <3s LCP | Web Vitals |

---

## 10. Open Questions

1. **What percentage of current listings have valid coordinates?**
   - Need to query Redis/cache to determine data completeness
   - Will inform decision on geocoding necessity

2. **Should we show price in markers?**
   - Pro: Quick price comparison
   - Con: May look cluttered; privacy concerns

3. **Do we need draw-to-search (polygon selection)?**
   - Nice-to-have for Phase 5
   - Requires more complex spatial queries

4. **Should map view be default on mobile?**
   - Test user preference
   - May depend on market (urban vs rural)

---

## 11. Appendix

### A. Related Documentation

- [AMPRE Integration PRD](./ampre-integration-prd.md)
- [AMPRE Compliance Implementation](./ampre-compliance-implementation.md)
- [Listings Implementation](./listings-implementation.md)
- [CLAUDE.md](../CLAUDE.md) — Technical standards
- [DESIGN.md](../DESIGN.md) — Visual design philosophy

### B. Useful Resources

- [react-map-gl Documentation](https://visgl.github.io/react-map-gl/)
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Mapbox Studio](https://studio.mapbox.com/) — Custom map styling
- [Supercluster](https://github.com/mapbox/supercluster) — Marker clustering

### C. Code References

Current listing data flow:
```
frontend/src/lib/ampre/fetch.ts → getAmpreListings()
frontend/src/lib/ampre/mapper.ts → mapAmpreToListing()
frontend/src/types/listing.ts → Listing interface
frontend/src/app/listings/page.tsx → ListingsPage
```

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-08 | Use Mapbox GL JS | Best balance of cost, customization, and React integration |
| 2026-04-08 | Start with available coordinates only | MVP approach; geocoding can be added later |
| 2026-04-08 | Toggle view (not side-by-side) | Simpler, more mobile-friendly |
| 2026-04-08 | Implement clustering | Essential for dense urban markets |

---

*End of Document*
