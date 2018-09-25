/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
class Population {

  public arthurians: number;
  public tuathaDeDanann: number;
  public vikings: number;
  public max: number;

  constructor(population = <Population> {}) {

    // Population limit
    this.max = population.max || 0;

    // Current Population by realm
    this.arthurians = population.arthurians || 0;
    this.tuathaDeDanann = population.tuathaDeDanann || 0;
    this.vikings = population.vikings || 0;
  }

  public static create() {
    const a = new Population();
    return a;
  }

}

export default Population;
