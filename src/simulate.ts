import { WebSocket } from "ws";

const socket = new WebSocket("ws://localhost:8080");

// Three simulated riders
const riders = [
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
    name: "Sola",
    location: { latitude: 6.518, longitude: 3.382 },
    isAvailable: true,
  },
];

socket.on("open", () => {
  console.log("Simulator connected to server");

  // Every 2 seconds, send a location update for each rider
  // We slightly move each rider to simulate movement
  setInterval(() => {
    riders.forEach((rider) => {
      // Nudge location slightly to simulate movement
      rider.location.latitude += (Math.random() - 0.5) * 0.001;
      rider.location.longitude += (Math.random() - 0.5) * 0.001;

      socket.send(
        JSON.stringify({
          type: "rider_update",
          ...rider,
        })
      );
    });
  }, 2000);
});

socket.on("error", (err) => console.error("Simulator error:", err));
