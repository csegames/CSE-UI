/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import race from '../constants/race';
import archetype from '../constants/archetype';

export interface Injury {
  part: number;
  health: number;
  maxHealth: number;
  wounds: number;
}

class Combatant {

  name: string;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;

  injuries: Injury[];

  constructor(combatant = <Combatant>{}) {
    this.name = combatant.name || "";
    this.health = combatant.health || 0;
    this.maxHealth = combatant.maxHealth || 0;
    this.stamina = combatant.stamina || 0;
    this.maxStamina = combatant.maxStamina || 0;
    this.injuries = combatant.injuries || <Injury[]>[];
  }

  /**
   *  Reset combatant state to nil [for when not got a target]
   */
  reset() {
    this.name = "";
    this.health = 0;
    this.maxHealth = 0;
    this.stamina = 0;
    this.maxStamina = 0;
    this.injuries = <Injury[]>[];
  }

  setRace(race: race) { } // override to support race
  setArchetype(archetype: archetype)  { } /// override to support archetype

  setName(name: string) {
    this.name = name;
  }

  setHealth(health: number, maxHealth: number) {
    this.health = health;
    this.maxHealth = maxHealth;
  }

  setStamina(stamina: number, maxStamina: number) {
    this.stamina = stamina;
    this.maxStamina = maxStamina;
  }

  setInjury(part: number, health: number, maxHealth: number, wounds: number) {
    let injury = this.injuries[part] = this.injuries[part] || <Injury>{};
    injury.part = part;
    injury.health = health;
    injury.maxHealth = maxHealth;
    injury.wounds = wounds;
  }

  static create() {
    let a = new Combatant();
    return a;
  }

}

export default Combatant;
