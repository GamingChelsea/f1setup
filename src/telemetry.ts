import { F1TelemetryClient, constants  } from "@deltazeroproduction/f1-udp-parser";
import { WebSocketServer } from "ws";

const { TEAMS } = constants
const { WEATHER } = constants
const { PACKETS } = constants;
const PORT = 20777;      // UDP-Port (F1-Spiel)
const WS_PORT = 3001;    // WebSocket-Port (Frontend)

const client = new F1TelemetryClient({ port: PORT });
const wss = new WebSocketServer({ port: WS_PORT });

console.log(`F1 Telemetry Client running on UDP-Port ${PORT}.`);
console.log(`WebSocket-Server running on ws://localhost:${WS_PORT}`);

function safeStringify(obj: any) {
  return JSON.stringify(obj, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}

function broadcast(key: string, data: any) {
  const msg = safeStringify({ key, data }); // <-- key wird mitgesendet
  wss.clients.forEach((ws) => {
    if (ws.readyState === ws.OPEN) ws.send(msg);
  });
}

client.on(PACKETS.carSetups, (data) => {
  broadcast("setup", data);
});


client.on(PACKETS.lapData, (data) => {
  const localPlayer:number = data.m_header.m_playerCarIndex
  const localData = data.m_lapData[localPlayer]
  broadcast("localData", localData);
});

client.on(PACKETS.session, (data) => {
  broadcast("session", data);
  broadcast("weather", WEATHER[data.m_weather]);
});

client.on(PACKETS.participants, (data) => {
  const localPlayer:number = data.m_header.m_playerCarIndex
  const localData = data.m_participants[localPlayer]
  const TeamInfo = TEAMS[2024][localData.m_teamId]
  broadcast("TeamInfo", TeamInfo)
  broadcast("localParticipants", localData);
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