export type Location = {
  latitude: number;
  longitude: number;
};

export type Distance = {
  value: number;
  unit: "km" | "m" | "miles";
};

export type Circle = {
  center: Location;
  radius: number;
};

export type Rectangle = {
  topLeft: Location;
  bottomRight: Location;
};

export type Rider = {
    id: string;
    name: string;
    location: Location;
    isAvailable: boolean;
}