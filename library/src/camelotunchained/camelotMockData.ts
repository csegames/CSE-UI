/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PlayerEntityStateModel } from './game/GameClientModels/EntityState';
import { CharacterKind } from './game/types/CharacterKind';
import { Faction } from './webAPI/definitions';

interface CamelotMockDataGenerators {
  // By passing in a Partial object, we can override any fields we want, get defaults for the rest,
  // and not need a long list of individual params in the function signature.  Plus, applying the
  // overrides is a one-line Object.assign() call that works even if the underlying model changes!
  createPlayerEntityState: (overrides?: Partial<PlayerEntityStateModel>) => PlayerEntityStateModel;
}

export const camelotMocks: CamelotMockDataGenerators = {
  createPlayerEntityState: (overrides?: Partial<PlayerEntityStateModel>) => {
    const mockData: PlayerEntityStateModel = {
      type: 'Player',
      characterKind: CharacterKind.User,
      race: 3,
      gender: 1,
      classID: 9,
      wounds: 0,
      resources: {},
      faction: Faction.TDD,
      entityID: 'MOCK',
      name: 'Plei Solder',
      isAlive: true,
      position: { x: 0, y: 0, z: 0 },
      statuses: {},
      objective: null,
      accountID: ''
    };

    if (overrides) {
      Object.assign(mockData, overrides);
    }

    return mockData;
  }
};
