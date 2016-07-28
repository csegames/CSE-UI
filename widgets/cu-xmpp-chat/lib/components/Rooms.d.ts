/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import ChatRoomInfo from './ChatRoomInfo';
import RoomId from './RoomId';
export declare class RoomsState {
}
export declare class RoomsProps {
    key: string;
    rooms: ChatRoomInfo[];
    current: RoomId;
    select: (roomId: RoomId) => void;
    leave: (roomId: RoomId) => void;
}
declare class Rooms extends React.Component<RoomsProps, RoomsState> {
    constructor(props: RoomsProps);
    render(): JSX.Element;
}
export default Rooms;
