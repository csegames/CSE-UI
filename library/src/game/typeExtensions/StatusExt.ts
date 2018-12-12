/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  class Status {
    public static equals(a: Status, b: Status): boolean;
  }
  class StatusExt {
    public static equals(a: Status, b: Status): boolean;
  }
  interface Window {
    Status: typeof StatusExt;
  }
}

class StatusExt {
  public static equals(a: Status, b: Status) {
    if (Object.is(a, b)) {
      return true;
    }
    return a.id === b.id
      && Math.equals(a.startTime, b.startTime)
      && Math.equals(a.duration, b.duration);
  }
}
window.Status = StatusExt;
