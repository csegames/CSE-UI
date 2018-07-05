/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class Sender {
  public id: number;
  public sender: string;
  public senderName: string;
  public isCSE: boolean;

  constructor(id: number, sender: string, senderName: string, isCSE: boolean) {
    this.id = id;
    this.sender = sender;
    this.senderName = senderName;
    this.isCSE = isCSE;
  }
}

export default Sender;
