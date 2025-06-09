/// <reference types="node" />
import { F1Parser } from '../F1Parser';
import { PacketCarDamageData } from './types';
export declare class PacketCarDamageDataParser extends F1Parser {
    data: PacketCarDamageData;
    constructor(buffer: Buffer, packetFormat: number);
}
