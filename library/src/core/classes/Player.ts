/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Combatant from './Combatant';
import {Race, Archetype} from '../..';

class Player extends Combatant {

  race: Race;
  archetype: Archetype;

  constructor(player = <Player>{}) {
    super(player)
    this.race = player.race || Race.Any;
    this.archetype = player.archetype || Archetype.Any;
  }

  setRace(race: Race) {
    this.race = race;
  }
    
  setArchetype(archetype: Archetype) {
    this.archetype = archetype;
  }

  static create() {
    let a = new Player();
    return a;
  }

}

export default Player;
