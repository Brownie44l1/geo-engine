# geo-engine

A domain-agnostic distance tracking engine built in TypeScript.

## What it does

Computes geodesic distance between two geographic coordinates using the Haversine formula, accounting for the curvature of the Earth.

## Core types

```typescript
type Location = {
  latitude: number;
  longitude: number;
};

type Distance = {
  value: number;
  unit: "km" | "m" | "miles";
};
```

## Usage

```typescript
const pointA: Location = { latitude: 6.5244, longitude: 3.3792 }; // Lagos
const pointB: Location = { latitude: 6.6018, longitude: 3.3515 }; // Ikeja

const result = haversine(pointA, pointB);
console.log(`${result.value.toFixed(2)} ${result.unit}`); // 9.33 km
```

## Stack

- TypeScript
- Node.js

## Roadmap

- [x] Day 1 — Core coordinate model & Haversine distance
- [x] Day 2 — Path distance (total distance across multiple points)
- [x] Day 3 — Bounding box & geofence primitives
- [ ] Day 4 — Location storage
- [ ] Day 5 — Trace retrieval
- [ ] Day 6 — Snapshot vs history read patterns