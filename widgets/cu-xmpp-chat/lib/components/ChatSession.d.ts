/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Room } from '../lib/CSEChat';
import { ChatMessage } from './ChatMessage';
import { UserInfo } from './User';
import ChatRoomInfo from './ChatRoomInfo';
import RoomId from './RoomId';
import ChatClient from '../lib/ChatClient';
declare class ChatSession {
    SCROLLBACK_THRESHOLD: number;
    SCROLLBACK_PAGESIZE: number;
    rooms: ChatRoomInfo[];
    currentRoom: RoomId;
    reconnecting: boolean;
    connected: boolean;
    client: ChatClient;
    me: string;
    latency: number;
    windowActive: boolean;
    constructor();
    diagnostics: () => void;
    connect(username: string, password: string): void;
    connectWithToken(loginToken: string): void;
    onping(ping: any): void;
    onconnect(): void;
    onconnectfailed(): void;
    ondisconnect(): void;
    onchat(args: any): void;
    reconnect(): void;
    simulateDisconnect(): void;
    getRooms(): void;
    onrooms(items: Room[]): void;
    broadcast(message: ChatMessage): void;
    recv(message: ChatMessage): void;
    presence(type: number, user: UserInfo): void;
    setCurrentRoom(roomId: RoomId): void;
    findRoom(roomId: RoomId): ChatRoomInfo;
    getRoom(roomId: RoomId, add?: boolean): ChatRoomInfo;
    deleteRoom(roomId: RoomId): ChatRoomInfo;
    send(text: string, roomName: string): void;
    sendMessage(text: string, user: string): void;
    joinRoom(roomId: RoomId): void;
    leaveRoom(roomId: RoomId): void;
    getAllUsers(): string[];
}
export default ChatSession;
