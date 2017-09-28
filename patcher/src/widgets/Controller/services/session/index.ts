/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { combineReducers } from 'redux';

// import serversReducer, {ServersState} from './servers';
// let servers = serversReducer;

// import alertsReducer, {AlertsState} from './alerts';
// let alerts = alertsReducer;

import controllerReducer, {ControllerState} from './controller';
const controller = controllerReducer;

export default combineReducers({
  controller,
});

export interface GlobalState {
  controller: ControllerState;
}
