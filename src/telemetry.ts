import { F1TelemetryClient, constants } from "@deltazeroproduction/f1-udp-parser";
import { WebSocketServer } from "ws";

const { PACKETS } = constants;
const PORT = 20777;      // UDP-Port (F1-Spiel)
const WS_PORT = 3001;    // WebSocket-Port (Frontend)

const client = new F1TelemetryClient({ port: PORT });
const wss = new WebSocketServer({ port: WS_PORT });

console.log(`F1 Telemetry Client läuft auf UDP-Port ${PORT}.`);
console.log(`WebSocket-Server läuft auf ws://localhost:${WS_PORT}`);

function safeStringify(obj: any) {
  return JSON.stringify(obj, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}

function broadcast(data: any) {
  const msg = safeStringify({ data });
  wss.clients.forEach((ws) => {
    if (ws.readyState === ws.OPEN) ws.send(msg);
  });
}

client.on(PACKETS.lapData, (data) => {
    const localPlayer:number = data.m_header.m_playerCarIndex
    broadcast(data.m_lapData[localPlayer]);
});

//Entferne oder kommentiere die folgende Schleife aus, damit nicht alle Pakete gesendet werden:

//Object.entries(PACKETS).forEach(([key, packetType]) => {
//   client.on(packetType, (data) => {
//    if (key = "lapData"){
//        broadcast(key, data)
//    }
//   });
//});

client.start();