/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
declare enum chatType {
    AVAILABLE = 1,
    UNAVAILABLE = 2,
    PRIVATE = 3,
    GROUP = 4,
    SYSTEM = 5,
    BROADCAST = 6,
}
declare class ChatMessage {
    type: number;
    roomName: string;
    nick: string;
    text: string;
    isCSE: boolean;
    when: Date;
    private _newDay;
    constructor(type: number, roomName: string, nick?: string, text?: string, isCSE?: boolean, time?: Date);
    isNewDay(): boolean;
    checkIsNewDay(prev: Date): void;
}
export { ChatMessage, chatType };
