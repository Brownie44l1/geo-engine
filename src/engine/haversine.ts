import type { Location, Distance } from "../types.ts";

export function haversine(pointA: Location, pointB: Location): Distance {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const latA = toRadians(pointA.latitude);
  const lonA = toRadians(pointA.longitude);
  const latB = toRadians(pointB.latitude);
  const lonB = toRadians(pointB.longitude);

  const dLat = latB - latA;
  const dLon = lonB - lonA;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(latA) * Math.cos(latB) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return { value: 6371 * c, unit: "km" };
}

export function pathDistance(points: Location[]): Distance {
  let totalDistance = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const pointA = points[i];
    const pointB = points[i + 1];
    if (pointA && pointB) {
      totalDistance += haversine(pointA, pointB).value;
    }
  }

  return { value: totalDistance, unit: "km" };
}
