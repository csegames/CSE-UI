/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  class Vec3f {
    public static equals(a: Vec3f, b: Vec3f): boolean;
  }
  class Vec3fExt {
    public static equals(a: Vec3f, b: Vec3f): boolean;
  }
  interface Window {
    Vec3f: typeof Vec3fExt;
  }
}

class Vec3fExt {
  public static equals(a: Vec3f, b: Vec3f) {
    if (Object.is(a, b)) {
      return true;
    }
    return Math.equals(a.x, b.x) && Math.equals(a.y, b.y) && Math.equals(a.z, b.z);
  }
}
window.Vec3f = Vec3fExt;
