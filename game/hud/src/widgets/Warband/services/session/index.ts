/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {combineReducers} from 'redux';

import layoutReducer, {LayoutState} from './layout';
export * from './layout';
let layout = layoutReducer;

import warbandReducer, {WarbandState} from './warband';
export * from './warband';
let warband = warbandReducer;

export default combineReducers({
  layout,
  warband,
});

export interface WarbandSessionState {
  layout: LayoutState,
  warband: WarbandState,
}
