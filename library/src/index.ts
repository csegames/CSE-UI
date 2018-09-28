/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Import definitions first to init a whole bunch of globals
import './webAPI/definitions';

// Creates the global game and __devGame objects that are attached to the window object when the engine is ready
import initializeGame from './game';
initializeGame();

export * from './game';

// web api
import * as webAPI from './webAPI';

export {
  webAPI,
};

// ------------------------------------------------------ //
// ------------------------------------------------------ //
// OLD STUFF - TODO: Audit and update / remove excess     //
// ------------------------------------------------------ //
// ------------------------------------------------------ //

import * as signalr from './signalR';

export * from './slashCommands';
import * as slashCommandsExports from './slashCommands';

// utils
import * as utils from './utils';

// graphql
import * as ql from './graphql';


// components
import * as components from './components';

export * from './components';

export default {
  components,
  ...slashCommandsExports,
};

export {
  // cu
  utils,

  // misc
  signalr,

  ql,
};
