/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {combineReducers} from 'redux';

import warbandReducer, {WarbandState} from './warband';
export * from './warband';
const warband = warbandReducer as any;

export default combineReducers({
  warband,
});

export interface WarbandSessionState {
  warband: WarbandState;
}
