/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GameInterface, DevGameInterface } from './GameInterface';
import { DeepImmutable } from '../../_baseGame/types/DeepImmutable';
export interface HordeTestModel {
  game: DeepImmutable<GameInterface>;
  _devGame: DevGameInterface;
}
