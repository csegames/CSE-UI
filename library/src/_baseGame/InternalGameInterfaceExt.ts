/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { BaseGameInterface } from './BaseGameInterface';
import { Resolvable } from './clientTasks';

/**
 * This is an Extension of GameInterface for internal library use, mocking, and direct client communication
 *
 * **DO NOT USE OUTSIDE OF LIBRARY DEVELOPMENT**
 */
export interface BaseInternalGameInterfaceExt extends BaseGameInterface {
  _activeTasks: { [id: number]: Resolvable<any> };
}
