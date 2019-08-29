/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import layout, { LayoutState } from './layout';
import invites, { InvitesState } from './invites';
import { crashReporterMiddleware, thunkMiddleware } from '../../lib/reduxUtils';


const reducer =  combineReducers({
  layout,
  invites: invites as any,
});
export default reducer;

export interface SessionState {
  apollo: any;
  layout: LayoutState;
  invites: InvitesState;
}

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store =
  createStore(reducer, composeEnhancers(applyMiddleware(thunkMiddleware, crashReporterMiddleware)));
