type Location = {
    latitude: number;
    longitude: number;
};

type Distance = {
  value: number;
  unit: "km" | "m" | "miles";
};

function haversine(pointA: Location, pointB: Location): Distance {
  //Convert degrees to radians
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180; //arrow function

  const latA = toRadians(pointA.latitude);
  const lonA = toRadians(pointA.longitude);
  const latB = toRadians(pointB.latitude);
  const lonB = toRadians(pointB.longitude);

  //Difference between the two points
  const dLat = latB - latA;
  const dLon = lonB - lonA;

  //Haversine formula (it accounts for the curvature of the Earth)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(latA) * Math.cos(latB) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = 6371 * c; // Earth's radius in kilometers

  return { value: distance, unit: "km" };
}


//TESTING THE FUNCTION
const pointA: Location = { latitude: 6.5244, longitude: 3.3792 }; // Lagos
const pointB: Location = { latitude: 6.6018, longitude: 3.3515 }; // Ikeja

const distance = haversine(pointA, pointB);
console.log(`Distance between Lagos and Ikeja: ${distance.value.toFixed(2)} ${distance.unit}`);


function pathDistance(points: Location[]): Distance {
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

//TESTING THE PATH DISTANCE FUNCTION
const pathPoints: Location[] = [
    { latitude: 6.5244, longitude: 3.3792 }, // Lagos
    { latitude: 6.6018, longitude: 3.3515 }, // Ikeja
    { latitude: 6.4654, longitude: 3.4064 }  // Victoria Island
];

const totalPathDistance = pathDistance(pathPoints);
console.log(`Total distance for the path: ${totalPathDistance.value.toFixed(2)} ${totalPathDistance.unit}`);

// Geofencing functions --------------------------------------------------------------

// Radius based 
type Circle = {
  center: Location;
  radius: number; // in km
};

function isWithinCircle(point: Location, circle: Circle): boolean {
  const distanceToCenter = haversine(point, circle.center).value;
  return distanceToCenter <= circle.radius;
}

//TESTING THE IS WITHIN CIRCLE FUNCTION
const circle: Circle = {
  center: { latitude: 6.5244, longitude: 3.3792 }, // Lagos
  radius: 10 // 10 km radius
};

const testPoint: Location = { latitude: 6.6018, longitude: 3.3515 }; // Ikeja

const isInsideCircle = isWithinCircle(testPoint, circle);
console.log(`Is the point within the circle? ${isInsideCircle ? "Yes" : "No"}, The km is ${haversine(testPoint, circle.center).value.toFixed(2)} km from the center of the circle.`);


// Rectangle based
type Rectangle = {
  topLeft: Location;
  bottomRight: Location;
};

function isWithinRectangle(point: Location, rectangle: Rectangle): boolean {
  const { latitude, longitude } = point;
  const { topLeft, bottomRight } = rectangle;

  return (
    latitude <= topLeft.latitude &&
    latitude >= bottomRight.latitude &&
    longitude >= topLeft.longitude &&
    longitude <= bottomRight.longitude
  );
}

//TESTING THE IS WITHIN RECTANGLE FUNCTION
const rectangle: Rectangle = {
  topLeft: { latitude: 6.5244, longitude: 3.3792 }, // Lagos
  bottomRight: { latitude: 6.4654, longitude: 3.4064 } // Victoria Island
};

const testPoint2: Location = { latitude: 6.6018, longitude: 3.3515 }; // Ikeja

const isInsideRectangle = isWithinRectangle(testPoint2, rectangle);
console.log(`Is the point within the rectangle? ${isInsideRectangle ? "Yes" : "No"}, The point is at latitude ${testPoint2.latitude} and longitude ${testPoint2.longitude}. The rectangle's top left corner is at latitude ${rectangle.topLeft.latitude} and longitude ${rectangle.topLeft.longitude}, while the bottom right corner is at latitude ${rectangle.bottomRight.latitude} and longitude ${rectangle.bottomRight.longitude}.`);


// Point in Polygon
function isWithinPolygon(point: Location, polygon: Location[]): boolean {
  let isInside = false;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const pi = polygon[i];
    const pj = polygon[j];

    if (!pi || !pj) continue; // safety guard

    const xi = pi.latitude, yi = pi.longitude;
    const xj = pj.latitude, yj = pj.longitude;

    const intersect =
      yi > point.longitude !== yj > point.longitude &&
      point.latitude < ((xj - xi) * (point.longitude - yi)) / (yj - yi) + xi;

    if (intersect) isInside = !isInside;
  }

  return isInside;
}

//TESTING THE IS WITHIN POLYGON FUNCTION
const polygon: Location[] = [
  { latitude: 6.5244, longitude: 3.3792 }, // Lagos
  { latitude: 6.6018, longitude: 3.3515 }, // Ikeja
  { latitude: 6.4654, longitude: 3.4064 }  // Victoria Island
];

const testPoint3: Location = { latitude: 6.5500, longitude: 3.3700 }; // A point within the polygon

const isInsidePolygon = isWithinPolygon(testPoint3, polygon);
console.log(`Is the point within the polygon? ${isInsidePolygon ? "Yes" : "No"}, The point is at latitude ${testPoint3.latitude} and longitude ${testPoint3.longitude}. The polygon vertices are at: ${polygon.map(p => `(${p.latitude}, ${p.longitude})`).join(", ")}.`);