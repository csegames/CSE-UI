/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import './types';
import './utils';

import { BaseGameInterface, BaseDevGameInterface } from './BaseGameInterface';
import { Engine } from './coherent';

// Exports Constants + GameInterface + All interfaces defined for client models
export * from './BaseGameInterface';
export * from './coherent';

export * from './utils';
// utils
import * as utils from './utils';
export {
  utils,
};

export * from './slashCommands';
export * from './GameClientModels';

import { initializeGame } from './initializeGame';
initializeGame();

// Let anyone including this library know that game and __devGame are globally available.
declare global {
  const game: DeepImmutable<BaseGameInterface>;
  const _devGame: BaseDevGameInterface;
  const engine: Engine;
}

// import { schema } from './graphql';
// declare global {
//   namespace GraphQL {
//     export import Schema = schema;
//   }
// }
