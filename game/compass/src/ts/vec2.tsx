/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
class vec2 {

  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  lengthSquared() {
    return this.x * this.x + this.y + this.y;
  }

  length() {
    let l2 = this.lengthSquared();
    return l2 > 0 ? Math.sqrt(l2) : 0;
  }

  normalized() {
    let l = this.length();
    return l > 0 ? new vec2(this.x / l, this.y / l) : new vec2();
  }

  normalize() {
    let l = this.length();
    if (l > 0) {
      this.x = this.x / l;
      this.y = this.y / l;
    } else {
      this.x = this.y = 0;
    }
  }

  dot(v: vec2) {
    return this.x * v.x + this.y * v.y;
  }

  subtract(v: vec2) {
    return new vec2(this.x - v.x, this.y - v.y);
  }
}

export default vec2;
