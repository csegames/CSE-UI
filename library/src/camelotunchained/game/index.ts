/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import './types';
import './typeExtensions';
import './store';

import { GameInterface, DevGameInterface } from './GameInterface';
import initializeGame from './initializeGame';

// Exports Constants + GameInterface + All interfaces defined for client models
export * from './GameInterface';

export * from './GameClientModels';

// Let anyone including this library know that game and __devGame are globally available.
interface CamelotUnchainedModel {
  game: DeepImmutable<GameInterface>;
  _devGame: DevGameInterface;
}

declare global {
  const camelotunchained: CamelotUnchainedModel;
}

export default initializeGame;
