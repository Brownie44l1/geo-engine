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
