/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UpdatableSelfPlayerStateModel } from '../game/GameClientModels/PlayerState';
import { GameInterface } from './GameInterface';
import { Resolvable } from '../../_baseGame/clientTasks';

/**
 * This is an Extension of GameInterface for internal library use, mocking, and direct client communication
 *
 * **DO NOT USE OUTSIDE OF LIBRARY DEVELOPMENT**
 */
export interface InternalGameInterfaceExt extends GameInterface {
  _activeTasks: { [id: number]: Resolvable<any> };
  _cse_dev_selfPlayerState: UpdatableSelfPlayerStateModel;
  _cse_dev_defaultSelfPlayerState: UpdatableSelfPlayerStateModel;
}
