"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketCarStatusDataParser = void 0;
const F1Parser_1 = require("../F1Parser");
const CarStatusDataParser_1 = require("./CarStatusDataParser");
const PacketHeaderParser_1 = require("./PacketHeaderParser");
class PacketCarStatusDataParser extends F1Parser_1.F1Parser {
    data;
    constructor(buffer, packetFormat) {
        super();
        this.endianess('little')
            .nest('m_header', {
            type: new PacketHeaderParser_1.PacketHeaderParser(packetFormat),
        })
            .array('m_carStatusData', {
            length: 22,
            type: new CarStatusDataParser_1.CarStatusDataParser(packetFormat),
        });
        this.data = this.fromBuffer(buffer);
    }
}
exports.PacketCarStatusDataParser = PacketCarStatusDataParser;
//# sourceMappingURL=PacketCarStatusDataParser.js.map