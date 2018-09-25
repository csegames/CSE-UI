/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export class ChatState {
  public state: any = {};
  public set = (name: string, value: any): void => {
    this.state[name] = value;
  }
  public get = (name: string): any => {
    return this.state[name];
  }
}

export const chatState = new ChatState();
