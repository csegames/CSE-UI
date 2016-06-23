/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class LogMessage  {
  category: string;
  level: number;
  time: string;
  process: number;
  thread: number;
  message: string;

  constructor(logMessage = <LogMessage>{}) {
    this.category = logMessage.category;
    this.level = logMessage.level;
    this.time = logMessage.time;
    this.process = logMessage.process;
    this.thread = logMessage.thread;
    this.message = logMessage.message;
  }

  static create() {
    let a = new LogMessage();
    return a;
  }
}

export default LogMessage;
