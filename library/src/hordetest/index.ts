/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Creates the global game and __devGame objects that are attached to the window object when the engine is ready
import initializeGame from './game';
initializeGame();

export * from './game';
