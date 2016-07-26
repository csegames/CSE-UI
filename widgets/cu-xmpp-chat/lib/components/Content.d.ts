/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import ChatRoomInfo from './ChatRoomInfo';
import RoomId from './RoomId';
export interface ContentState {
}
export interface ContentProps {
    room: ChatRoomInfo;
    send: (roomId: RoomId, text: string) => void;
    slashCommand: (command: string) => void;
}
declare class Content extends React.Component<ContentProps, ContentState> {
    send: (text: string) => void;
    scroll: () => void;
    render(): JSX.Element;
}
export default Content;
