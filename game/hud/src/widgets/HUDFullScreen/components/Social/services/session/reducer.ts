/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { crashReporterMiddleware, thunkMiddleware } from '../../../../../../lib/reduxUtils';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import navigation, { NavigationState } from './navigation';


const reducer = combineReducers({
  navigation,
});

export default reducer;

export interface SessionState {
  navigation: NavigationState;
}

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(reducer, composeEnhancers(applyMiddleware(thunkMiddleware, crashReporterMiddleware)));

