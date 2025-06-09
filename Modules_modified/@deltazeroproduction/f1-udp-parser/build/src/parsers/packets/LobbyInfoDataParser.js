"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LobbyInfoDataParser = void 0;
const F1Parser_1 = require("../F1Parser");
class LobbyInfoDataParser extends F1Parser_1.F1Parser {
    constructor(packetFormat) {
        super();
        this.uint8('m_aiControlled').uint8('m_teamId').uint8('m_nationality');
        if (packetFormat === 2023 || packetFormat === 2024) {
            this.uint8('m_platform');
        }
        this.string('m_name', { length: 48, stripNull: true }).uint8('m_carNumber');
        if (packetFormat === 2024) {
            this.uint8('m_yourTelemetry')
                .uint8('m_showOnlineNames')
                .uint16le('m_techLevel');
        }
        this.uint8('m_readyStatus');
    }
}
exports.LobbyInfoDataParser = LobbyInfoDataParser;
//# sourceMappingURL=LobbyInfoDataParser.js.map