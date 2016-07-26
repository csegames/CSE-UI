/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { chatType } from './ChatMessage';
declare class RoomId {
    type: chatType;
    name: string;
    constructor(name: string, type: chatType);
    same(roomId: RoomId): boolean;
}
export default RoomId;
