/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import RoomId from './RoomId';
export interface RoomState {
}
export interface RoomProps {
    key: number;
    roomId: RoomId;
    players: number;
    unread?: number;
    selected?: boolean;
    select: (roomId: RoomId) => void;
    leave: (roomId: RoomId) => void;
}
declare class Room extends React.Component<RoomProps, RoomState> {
    constructor(props: RoomProps);
    render(): JSX.Element;
    select(e: any): void;
    leave(e: any): void;
}
export default Room;
