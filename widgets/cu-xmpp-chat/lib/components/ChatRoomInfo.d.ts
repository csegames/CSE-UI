import { UserInfo } from './User';
import { ChatMessage, chatType } from './ChatMessage';
import RoomId from './RoomId';
declare class ChatRoomInfo {
    messages: JSX.Element[];
    users: JSX.Element[];
    key: number;
    roomId: RoomId;
    type: chatType;
    players: number;
    unread: number;
    scrollback: number;
    scrollbackPageSize: number;
    scrollbackThreshold: number;
    constructor(roomId: RoomId, scrollbackThreshold?: number, scrollbackPageSize?: number);
    diagnostics: () => void;
    addUser: (user: UserInfo) => void;
    removeUser: (user: UserInfo) => void;
    add: (message: ChatMessage) => void;
    push: (message: ChatMessage) => void;
    seen: () => void;
    countVisibleMessages: () => number;
    startScrollback: () => void;
    cancelScrollback: () => void;
    nextScrollbackPage: () => void;
}
export default ChatRoomInfo;
