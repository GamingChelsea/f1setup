"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketSessionHistoryDataParser = void 0;
const F1Parser_1 = require("../F1Parser");
const LapHistoryDataParser_1 = require("./LapHistoryDataParser");
const TyreStintsHistoryDataParser_1 = require("./TyreStintsHistoryDataParser");
const PacketHeaderParser_1 = require("./PacketHeaderParser");
class PacketSessionHistoryDataParser extends F1Parser_1.F1Parser {
    data;
    constructor(buffer, packetFormat) {
        super();
        this.endianess('little')
            .nest('m_header', {
            type: new PacketHeaderParser_1.PacketHeaderParser(packetFormat),
        })
            .uint8('m_carIdx')
            .uint8('m_numLaps')
            .uint8('m_numTyreStints')
            .uint8('m_bestLapTimeLapNum')
            .uint8('m_bestSector1LapNum')
            .uint8('m_bestSector2LapNum')
            .uint8('m_bestSector3LapNum')
            .array('m_lapHistoryData', {
            length: 100,
            type: new LapHistoryDataParser_1.LapHistoryDataParser(packetFormat),
        })
            .array('m_tyreStintsHistoryData', {
            length: 8,
            type: new TyreStintsHistoryDataParser_1.TyreStintsHistoryDataParser(),
        });
        this.data = this.fromBuffer(buffer);
    }
}
exports.PacketSessionHistoryDataParser = PacketSessionHistoryDataParser;
//# sourceMappingURL=PacketSessionHistoryDataParser.js.map