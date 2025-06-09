/// <reference types="node" />
import { F1Parser } from '../F1Parser';
import { PacketFinalClassificationData } from './types';
export declare class PacketFinalClassificationDataParser extends F1Parser {
    data: PacketFinalClassificationData;
    constructor(buffer: Buffer, packetFormat: number);
}
