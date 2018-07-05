/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

enum chatType {
  AVAILABLE = 1,
  UNAVAILABLE = 2,
  PRIVATE = 3,
  GROUP = 4,
  SYSTEM = 5,
  BROADCAST = 6,
  COMBAT = 7,
}

class ChatMessage {
  public type: number;
  public roomName: string;
  public nick: string;
  public text: string;
  public isCSE: boolean;
  public when: Date;
  private _newDay: boolean;

  constructor(type: number, roomName: string, nick: string = null,
      text: string = null, isCSE: boolean = false, time: Date = new Date()) {
    this.type = type;
    this.roomName = roomName.toLowerCase();
    this.nick = nick.toLowerCase();
    this.text = text;
    this.isCSE = isCSE;
    this.when = time;
    this._newDay = false;      // we don't know yet, assumed not
  }

  public isNewDay(): boolean {
    return this._newDay;
  }

  public checkIsNewDay(prev: Date): void {
    if (!prev || prev.toLocaleDateString() !== this.when.toLocaleDateString()) {
      // message is for a new day, flag it as such
      // first message in a room is always flagged as a new day
      this._newDay = true;
    }
  }
}

export {
  ChatMessage,
  chatType,
};
