import { WebSocketServer, WebSocket } from "ws";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import type { Location, Rider } from "./types.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { assignRider } from "./engine/delivery.ts";

// Yaba delivery zone
const yabaZone: Location[] = [
  { latitude: 6.515, longitude: 3.37 },
  { latitude: 6.53, longitude: 3.36 },
  { latitude: 6.54, longitude: 3.375 },
  { latitude: 6.535, longitude: 3.39 },
  { latitude: 6.52, longitude: 3.395 },
  { latitude: 6.51, longitude: 3.385 },
];

// In-memory rider store — this is our "database" for now
const riders: Map<string, Rider> = new Map();

// Track connected clients (dashboards watching the map)
const dashboards: Set<WebSocket> = new Set();

// --- HTTP server — serves the dashboard HTML ---
const httpServer = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    const filePath = path.join(__dirname, "public", "index.html");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

// --- WebSocket server — attached to the same HTTP server ---
const wss = new WebSocketServer({ server: httpServer });

httpServer.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
  console.log("WebSocket available on ws://localhost:8080");
});

wss.on("connection", (socket) => {
  console.log("New connection established");

  socket.on("message", (raw) => {
    const message = JSON.parse(raw.toString());

    // Two message types: "rider_update" and "dashboard"
    if (message.type === "rider_update") {
      // A rider is sending their live location
      const rider: Rider = {
        id: message.id,
        name: message.name,
        location: message.location,
        isAvailable: message.isAvailable,
      };

      // Update rider in memory
      riders.set(rider.id, rider);
      console.log(
        `Rider ${rider.name} updated location: ${rider.location.latitude}, ${rider.location.longitude}`
      );

      // Broadcast updated rider list to all dashboards
      broadcastToDashboards({
        type: "riders_update",
        riders: Array.from(riders.values()),
      });
    }

    if (message.type === "dashboard") {
      // A dashboard just connected — add to watchers
      dashboards.add(socket);
      console.log("Dashboard connected");

      // Send current rider positions immediately
      socket.send(
        JSON.stringify({
          type: "riders_update",
          riders: Array.from(riders.values()),
        })
      );
    }

    if (message.type === "assign_rider") {
      // Someone wants to assign a rider to a customer
      const customer: Location = message.customer;
      const allRiders = Array.from(riders.values());
      const assigned = assignRider(allRiders, customer, yabaZone);

      socket.send(
        JSON.stringify({
          type: "rider_assigned",
          rider: assigned,
        })
      );
    }
  });

  socket.on("close", () => {
    dashboards.delete(socket);
    console.log("Connection closed");
  });
});

function broadcastToDashboards(data: object) {
  const message = JSON.stringify(data);
  dashboards.forEach((dashboard) => {
    dashboard.send(message);
  });
}
