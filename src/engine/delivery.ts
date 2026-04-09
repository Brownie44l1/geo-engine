import type { Location, Rider } from "../types.ts";
import { haversine } from "./haversine.ts";
import { isWithinPolygon } from "./geofence.ts";

// Step 1 — Filter riders who are available and inside the delivery zone
export function findRidersInZone(riders: Rider[], zone: Location[]): Rider[] {
  return riders.filter(
    (rider) => rider.isAvailable && isWithinPolygon(rider.location, zone)
  );
}

// Step 2 — From a filtered list, find the nearest rider to the customer
export function findNearestRider(riders: Rider[], customer: Location): Rider | null {
  if (riders.length === 0) return null;

  let nearestRider: Rider | null = null;
  let shortestDistance = Infinity;

  for (const rider of riders) {
    const distance = haversine(rider.location, customer).value;
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestRider = rider;
    }
  }

  return nearestRider;
}

// Step 3 — Main function that combines everything
export function assignRider(allRiders: Rider[], customer: Location, zone: Location[] ): Rider | null {
  const ridersInZone = findRidersInZone(allRiders, zone);

  if (ridersInZone.length === 0) {
    console.log("No available riders in this zone.");
    return null;
  }

  return findNearestRider(ridersInZone, customer);
}
