/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class LogMessage {
  public category: string;
  public level: number;
  public time: string;
  public process: number;
  public thread: number;
  public message: string;

  constructor(logMessage = <LogMessage> {}) {
    this.category = logMessage.category;
    this.level = logMessage.level;
    this.time = logMessage.time;
    this.process = logMessage.process;
    this.thread = logMessage.thread;
    this.message = logMessage.message;
  }

  public static create() {
    const a = new LogMessage();
    return a;
  }
}

export default LogMessage;
