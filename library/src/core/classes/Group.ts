/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Player from './Player';
import Character from './Character';

class Group {
  public self: Character;
  public members: Player[];

  constructor(group = <Group> {}) {
    group.self = group.self || new Character();
    group.members = group.members || <Player[]> [];
  }

  public static create() {
    const a = new Group();
    return a;
  }
}

export default Group;
