/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import RoomId from './RoomId';
import ChatRoomInfo from './ChatRoomInfo';
export declare class ChatTextState {
}
export interface ChatTextProps {
    room: ChatRoomInfo;
}
declare class ChatText extends React.Component<ChatTextProps, ChatTextState> {
    SCROLLBACK_PAGESIZE: number;
    autoScroll: boolean;
    lazyLoadTop: HTMLElement;
    currentRoom: RoomId;
    constructor(props: ChatTextProps);
    autoScrollToBottom(): void;
    componentDidUpdate(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    registerEvents(): void;
    unregisterEvents(): void;
    handleScroll(e: MouseEvent): void;
    handleAutoScroll(): void;
    newRoom(): void;
    render(): JSX.Element;
}
export default ChatText;
