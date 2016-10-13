/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-07 11:19:16
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-19 14:32:44
 */

import {combineReducers} from 'redux';

// import serversReducer, {ServersState} from './servers';
// let servers = serversReducer;

// import alertsReducer, {AlertsState} from './alerts';
// let alerts = alertsReducer;

import controllerReducer, {ControllerState} from './controller';
let controller = controllerReducer;

export default combineReducers({
  controller,
});

export interface GlobalState {
  controller: ControllerState;
}
