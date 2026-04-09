import { haversine, pathDistance } from "./engine/haversine.ts";
import { isWithinCircle, isWithinRectangle, isWithinPolygon } from "./engine/geofence.ts";
import { assignRider } from "./engine/delivery.ts";
import type { Location, Circle, Rectangle, Rider } from "./types.ts";

// --- Haversine test ---
const pointA: Location = { latitude: 6.5244, longitude: 3.3792 }; // Lagos
const pointB: Location = { latitude: 6.6018, longitude: 3.3515 }; // Ikeja
const distance = haversine(pointA, pointB);
console.log(`Distance: ${distance.value.toFixed(2)} ${distance.unit}`);

// --- Path distance test ---
const pathPoints: Location[] = [
  { latitude: 6.5244, longitude: 3.3792 },
  { latitude: 6.6018, longitude: 3.3515 },
  { latitude: 6.4654, longitude: 3.4064 },
];
const totalPath = pathDistance(pathPoints);
console.log(`Path distance: ${totalPath.value.toFixed(2)} ${totalPath.unit}`);

// --- Circle test ---
const circle: Circle = { center: pointA, radius: 10 };
console.log(`Within circle: ${isWithinCircle(pointB, circle)}`);

// --- Rectangle test ---
const rectangle: Rectangle = {
  topLeft: { latitude: 6.5244, longitude: 3.3792 },
  bottomRight: { latitude: 6.4654, longitude: 3.4064 },
};
console.log(`Within rectangle: ${isWithinRectangle(pointB, rectangle)}`);

// --- Polygon test ---
const polygon: Location[] = [
  { latitude: 6.5244, longitude: 3.3792 },
  { latitude: 6.6018, longitude: 3.3515 },
  { latitude: 6.4654, longitude: 3.4064 },
];
const testPoint: Location = { latitude: 6.55, longitude: 3.37 };
console.log(`Within polygon: ${isWithinPolygon(testPoint, polygon)}`);

// Yaba delivery zone (polygon)
const yabaZone: Location[] = [
  { latitude: 6.515, longitude: 3.37 },
  { latitude: 6.53, longitude: 3.36 },
  { latitude: 6.54, longitude: 3.375 },
  { latitude: 6.535, longitude: 3.39 },
  { latitude: 6.52, longitude: 3.395 },
  { latitude: 6.51, longitude: 3.385 },
];

// Customer location inside Yaba
const customer: Location = { latitude: 6.525, longitude: 3.38 };

// 5 riders scattered across Lagos
const riders: Rider[] = [
  {
    id: "R1",
    name: "Emeka",
    location: { latitude: 6.52, longitude: 3.375 },
    isAvailable: true,
  },
  {
    id: "R2",
    name: "Tunde",
    location: { latitude: 6.53, longitude: 3.38 },
    isAvailable: true,
  },
  {
    id: "R3",
    name: "Bola",
    location: { latitude: 6.6018, longitude: 3.3515 },
    isAvailable: true,
  }, // Ikeja — outside zone
  {
    id: "R4",
    name: "Chidi",
    location: { latitude: 6.525, longitude: 3.385 },
    isAvailable: false,
  }, // inside zone but busy
  {
    id: "R5",
    name: "Sola",
    location: { latitude: 6.518, longitude: 3.382 },
    isAvailable: true,
  },
];

const assignedRider = assignRider(riders, customer, yabaZone);

if (assignedRider) {
  const dist = haversine(assignedRider.location, customer).value.toFixed(2);
  console.log(`\nAssigned rider: ${assignedRider.name}`);
  console.log(`Distance from customer: ${dist} km`);
} else {
  console.log("No rider available.");
}
