/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-07 11:19:16
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-10 11:54:42
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
