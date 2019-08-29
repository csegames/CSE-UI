/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


// Import definitions first to init a whole bunch of globals
import './webAPI/definitions';

export * from './utils';
// utils
import * as utils from './utils';
export {
  utils,
};

// Creates the global game and __devGame objects that are attached to the window object when the engine is ready
import initializeGame from './game';
initializeGame();

export * from './game';

// The below exports are available on the global game object. They are exported here so they may be used standalone for
// non game applications as well.

import * as webAPI from './webAPI';
export {
  webAPI,
};

import * as signalr from './signalR';
export {
  signalr,
};
