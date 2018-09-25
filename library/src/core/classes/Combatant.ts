/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Race, Archetype } from '../..';

export interface Injury {
  part: number;
  health: number;
  maxHealth: number;
  wounds: number;
}

class Combatant {

  public name: string;
  public health: number;
  public maxHealth: number;
  public stamina: number;
  public maxStamina: number;

  public injuries: Injury[];

  constructor(combatant = <Combatant> {}) {
    this.name = combatant.name || '';
    this.health = combatant.health || 0;
    this.maxHealth = combatant.maxHealth || 0;
    this.stamina = combatant.stamina || 0;
    this.maxStamina = combatant.maxStamina || 0;
    this.injuries = combatant.injuries || <Injury[]> [];
  }

  /**
   *  Reset combatant state to nil [for when not got a target]
   */
  public reset() {
    this.name = '';
    this.health = 0;
    this.maxHealth = 0;
    this.stamina = 0;
    this.maxStamina = 0;
    this.injuries = <Injury[]> [];
  }

  public setRace(race: Race) {
  } // override to support race
  public setArchetype(archetype: Archetype) {
  } /// override to support archetype

  public setName(name: string) {
    this.name = name;
  }

  public setHealth(health: number, maxHealth: number) {
    this.health = health;
    this.maxHealth = maxHealth;
  }

  public setStamina(stamina: number, maxStamina: number) {
    this.stamina = stamina;
    this.maxStamina = maxStamina;
  }

  public setInjury(part: number, health: number, maxHealth: number, wounds: number) {
    const injury = this.injuries[part] = this.injuries[part] || <Injury> {};
    injury.part = part;
    injury.health = health;
    injury.maxHealth = maxHealth;
    injury.wounds = wounds;
  }

  public static create() {
    const a = new Combatant();
    return a;
  }

}

export default Combatant;
