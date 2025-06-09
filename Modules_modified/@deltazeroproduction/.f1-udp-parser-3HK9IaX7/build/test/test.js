"use strict";
const fs = require('fs');
const { constants, F1TelemetryClient } = require('../build/src/index.js');
const { PACKETS } = constants;
const client = new F1TelemetryClient({
    port: 30500,
});
const initializeClient = () => {
    client.on(PACKETS.event, () => console.log('event'));
    client.on(PACKETS.motion, () => console.log('motion'));
    client.on(PACKETS.carSetups, () => console.log('carSetups'));
    client.on(PACKETS.lapData, () => console.log('lapData'));
    client.on(PACKETS.session, () => console.log('session'));
    client.on(PACKETS.participants, () => console.log('participants'));
    client.on(PACKETS.carTelemetry, () => console.log('carTelemetry'));
    client.on(PACKETS.carStatus, () => console.log('carStatus'));
    client.on(PACKETS.finalClassification, () => console.log('finalClassification'));
    client.on(PACKETS.lobbyInfo, () => console.log('lobbyInfo'));
    client.on(PACKETS.carDamage, () => console.log('carDamage'));
    client.on(PACKETS.sessionHistory, () => console.log('sessionHistory'));
    client.on(PACKETS.tyreSets, () => console.log('tyreSets'));
    client.on(PACKETS.motionEx, () => console.log('motionEx'));
    client.start();
    // stops the client
    [`exit`,
        `SIGINT`,
        `SIGUSR1`,
        `SIGUSR2`,
        `uncaughtException`,
        `SIGTERM`,
    ].forEach((eventType) => {
        process.on(eventType, () => client.stop());
    });
};
initializeClient();
const data = fs.readFileSync('testData.bin');
client.handleMessage(data);
//# sourceMappingURL=test.js.map