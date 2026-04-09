import type { Location, Circle, Rectangle } from "../types.ts";
import { haversine } from "./haversine.ts";

export function isWithinCircle(point: Location, circle: Circle): boolean {
  const distanceToCenter = haversine(point, circle.center).value;
  return distanceToCenter <= circle.radius;
}

export function isWithinRectangle(
  point: Location,
  rectangle: Rectangle
): boolean {
  const { latitude, longitude } = point;
  const { topLeft, bottomRight } = rectangle;

  return (
    latitude <= topLeft.latitude &&
    latitude >= bottomRight.latitude &&
    longitude >= topLeft.longitude &&
    longitude <= bottomRight.longitude
  );
}

export function isWithinPolygon(point: Location, polygon: Location[]): boolean {
  if (polygon.length < 3) return false;

  let isInside = false;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const pi = polygon[i];
    const pj = polygon[j];

    if (!pi || !pj) continue;

    const xi = pi.latitude,
      yi = pi.longitude;
    const xj = pj.latitude,
      yj = pj.longitude;

    const intersect =
      yi > point.longitude !== yj > point.longitude &&
      point.latitude < ((xj - xi) * (point.longitude - yi)) / (yj - yi) + xi;

    if (intersect) isInside = !isInside;
  }

  return isInside;
}
