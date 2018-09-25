/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class Injury {
  public part: number;
  public health: number;
  public maxHealth: number;
  public wounds: number;
  public empty: boolean; // placeholder

  constructor(injury = <Injury> {}) {
    this.refresh(injury);
  }

  public refresh(injury = <Injury> {}) {
    this.part = injury.part || 0;
    this.health = injury.health || 0;
    this.maxHealth = injury.maxHealth || 0;
    this.wounds = injury.wounds || 0;
    this.empty = (this.maxHealth === 0);
  }

  public static create() {
    const a = new Injury();
    return a;
  }
}

export default Injury;
