/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Player from './Player';
import Inventory from './Inventory';
import EquippedGear from './EquippedGear';
import BaneBoon from './BaneBoon';
import SpellBook from './SpellBook';
import Group from './Group';
import Stats from './Stats';


class Character extends Player {

  public inventory: Inventory;
  public banes: BaneBoon[];
  public boons: BaneBoon[];
  public equippedGear: EquippedGear;
  public spellBook: SpellBook;
  public group: Group;
  public stats: Stats;


  constructor(character = <Character> {}) {
    super(character);
    this.inventory = character.inventory || new Inventory();
    this.equippedGear = character.equippedGear || new EquippedGear();
    this.spellBook = character.spellBook || new SpellBook();
    this.banes = character.banes || <BaneBoon[]> [];
    this.banes = character.boons || <BaneBoon[]> [];
    this.group = character.group || null;
    this.stats = character.stats || new Stats();
  }

  public static create() {
    const a = new Character();
    return a;
  }

}

export default Character;
