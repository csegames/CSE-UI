import { Client, Element } from 'node-xmpp-client';
import Config from './Config';
import EventEmitter from './EventEmitter';
import Message from './Message';
interface Room {
    name: string;
    jid: string;
}
declare class CSEChat {
    client: xmpp.Client;
    config: Config;
    eventEmitter: EventEmitter;
    private _reconnect;
    private _idCounter;
    private _iqc;
    private _msgs;
    private _inFlight;
    private _pings;
    private _pingsInFlight;
    private _pinger;
    constructor(config?: Config);
    _nextId(prefix: string): string;
    connect(): Client;
    disconnect(): void;
    sendMessageToRoom(message: string, roomName: string): void;
    sendMessageToUser(message: string, userName: string): void;
    joinRoom(roomName: string): void;
    leaveRoom(roomName: string): void;
    getRooms(): void;
    on(event: string, callback: (data: any) => void): any;
    once(event: string, callback: (data: any) => void): any;
    removeListener(event: any): void;
    _initializeEvents(): void;
    _keepalive(): void;
    _ping(pong: (ping: any) => void): void;
    _pong(stanza: Element): void;
    _processStanza(stanza: Element): void;
    _gotRooms(id: string, stanza: Element): void;
    _parseMessageGroup(stanza: Element): Message;
    _parseMessageChat(stanza: Element): Message;
    _parsePresence(stanza: Element): Message;
}
export { Config, CSEChat, Room };
export default CSEChat;
