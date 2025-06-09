"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const { PACKETS } = __1.constants;
const client = new __1.F1TelemetryClient({
    port: 30500,
    testModeActive: false,
});
client.start();
// stops the client
[
    `exit`,
    `SIGINT`,
    `SIGUSR1`,
    `SIGUSR2`,
    `uncaughtException`,
    `SIGTERM`,
].forEach((eventType) => {
    process.on(eventType, () => client.stop());
});
//# sourceMappingURL=index.js.map