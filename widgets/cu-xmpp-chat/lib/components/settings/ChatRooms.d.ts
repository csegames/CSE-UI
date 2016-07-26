/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
export interface ChatRoomsProps {
}
export interface ChatRoomsState {
    rooms: Array<string>;
}
declare class ChatRooms extends React.Component<ChatRoomsProps, ChatRoomsState> {
    constructor(props: ChatRoomsProps);
    initializeState: () => ChatRoomsState;
    render(): JSX.Element;
}
export default ChatRooms;
