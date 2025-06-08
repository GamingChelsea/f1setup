"use client";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [lastPacket, setLastPacket] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setLastPacket(msg);
    };
    return () => ws.close();
  }, []);

  return (
    <main>
      <h1>F1 Telemetrie Live</h1>
      <pre style={{ maxHeight: 600, overflow: "auto", background: "#222", color: "#fff", padding: 16 }}>
        {lastPacket ? JSON.stringify(lastPacket, null, 2) : "Warte auf Daten..."}
      </pre>
    </main>
  );
}