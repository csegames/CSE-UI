/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Combatant from './Combatant';
import race from '../constants/race';
import archetype from '../constants/archetype';

class Player extends Combatant {

  race: race;
  archetype: archetype;

  constructor(player = <Player>{}) {
    super(player)
    this.race = player.race || race.NONE;
    this.archetype = player.archetype || archetype.NONE;
  }

  setRace(race: race) {
    this.race = race;
  }
    
  setArchetype(archetype: archetype) {
    this.archetype = archetype;
  }

  static create() {
    let a = new Player();
    return a;
  }

}

export default Player;
