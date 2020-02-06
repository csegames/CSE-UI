/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  class Vec3fExt {
    public static equals(a: Vec3f, b: Vec3f): boolean;
    public static distance(a: Vec3f, b: Vec3f): number;
    public static distanceSquared(a: Vec3f, b: Vec3f): number;
  }
  interface Window {
    Vec3fExt: typeof Vec3fExt;
  }
}

export class Vec3fExt {
  public static equals(a: Vec3f, b: Vec3f) {
    if (Object.is(a, b)) {
      return true;
    }
    return Math.equals(a.x, b.x) && Math.equals(a.y, b.y) && Math.equals(a.z, b.z);
  }

  public static distance(a: Vec3f, b: Vec3f) {
    return Math.sqrt(Vec3fExt.distanceSquared(a, b));
  }

  public static distanceSquared(a: Vec3f, b: Vec3f) {
    if (!a || !b) return 0;
    return Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2) + Math.pow(b.z - a.z, 2);
  }
}
window.Vec3fExt = Vec3fExt;
