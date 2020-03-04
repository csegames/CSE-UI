/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  class Vec2fExt {
    public static equals(a: Vec2f, b: Vec2f): boolean;
    public static distance(a: Vec2f, b: Vec2f): number;
    public static distanceSquared(a: Vec2f, b: Vec2f): number;
  }
  interface Window {
    Vec2fExt: typeof Vec2fExt;
  }
}

class Vec2fExt {
  public static equals(a: Vec2f, b: Vec2f) {
    if (Object.is(a, b)) {
      return true;
    }
    return Math.equals(a.x, b.x) && Math.equals(a.y, b.y);
  }

  public static distance(a: Vec2f, b: Vec2f) {
    return Math.sqrt(Vec2fExt.distanceSquared(a, b));
  }

  public static distanceSquared(a: Vec2f, b: Vec2f) {
    if (!a || !b) return 0;
    return Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2);
  }
}
window.Vec2fExt = Vec2fExt;
