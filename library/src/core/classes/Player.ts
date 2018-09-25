/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Combatant from './Combatant';
import { Race, Archetype } from '../..';

class Player extends Combatant {

  public race: Race;
  public archetype: Archetype;

  constructor(player = <Player> {}) {
    super(player);
    this.race = player.race;
    this.archetype = player.archetype;
  }

  public setRace(race: Race) {
    this.race = race;
  }

  public setArchetype(archetype: Archetype) {
    this.archetype = archetype;
  }

  public static create() {
    const a = new Player();
    return a;
  }

}

export default Player;
