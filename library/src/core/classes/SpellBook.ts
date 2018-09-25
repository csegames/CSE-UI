/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Ability from './Ability';

class SpellBook {
  public abilities: Ability[];

  constructor(spellbook = <SpellBook> {}) {
    spellbook.abilities = spellbook.abilities || <Ability[]> [];
  }

  public static create() {
    const a = new SpellBook();
    return a;
  }

}

export default SpellBook;
