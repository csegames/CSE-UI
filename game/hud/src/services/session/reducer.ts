/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {combineReducers} from 'redux';

import layoutReducer, {LayoutState} from './layout';
let layout = layoutReducer;

import invitesReducer, {InvitesState} from './invites';
let invites = invitesReducer;

export default combineReducers({
  layout,
  invites,
});

export interface HUDSessionState {
  layout: LayoutState;
  invites: InvitesState;
}
