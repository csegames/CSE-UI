/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import ChatSession from './components/ChatSession';
import ChatRoomInfo from './components/ChatRoomInfo';
import RoomId from './components/RoomId';
import { ChatConfig } from './components/ChatConfig';
export interface ChatState {
    chat: ChatSession;
    now: number;
    config: ChatConfig;
}
export interface ChatProps {
    loginToken: string;
    hideChat: () => void;
}
declare class Chat extends React.Component<ChatProps, ChatState> {
    name: string;
    _eventHandlers: any[];
    constructor(props: ChatProps);
    initialState(): ChatState;
    getCurrentRoom: () => ChatRoomInfo;
    send: (roomId: RoomId, text: string) => void;
    update: (chat: ChatSession) => void;
    optionsUpdated: (config: ChatConfig) => void;
    selectRoom: (roomId: RoomId) => void;
    leaveRoom: (roomId: RoomId) => void;
    joinRoom: (roomName: string) => void;
    slashCommand: (command: string) => boolean;
    close: () => void;
    disconnect: () => void;
    getRooms: () => void;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export default Chat;
