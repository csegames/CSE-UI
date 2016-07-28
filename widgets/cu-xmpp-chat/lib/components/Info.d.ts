/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import ChatSession from './ChatSession';
import RoomId from './RoomId';
export declare class InfoState {
    currentTab: string;
}
export interface InfoProps {
    chat: ChatSession;
    currentRoom: RoomId;
    selectRoom: (roomId: RoomId) => void;
    leaveRoom: (roomId: RoomId) => void;
}
declare class Info extends React.Component<InfoProps, InfoState> {
    state: InfoState;
    constructor(props: InfoProps);
    getRooms(): void;
    render(): JSX.Element;
    select(tab: string): void;
}
export default Info;
