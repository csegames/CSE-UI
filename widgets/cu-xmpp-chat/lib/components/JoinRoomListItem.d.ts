/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import { Room } from '../lib/CSEChat';
export interface JoinRoomListItemProps {
    room: Room;
    selectRoom: (room: Room) => void;
}
export interface JoinRoomListItemState {
}
declare class JoinRoomListItem extends React.Component<JoinRoomListItemProps, JoinRoomListItemState> {
    constructor(props: JoinRoomListItemProps);
    selectRoom: () => void;
    render(): JSX.Element;
}
export default JoinRoomListItem;
