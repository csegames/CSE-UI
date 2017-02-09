/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-16 16:06:24
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-21 18:55:04
 */

import {client} from 'camelot-unchained';
import {crashReporterMiddleware, thunkMiddleware} from '../../../../lib/reduxUtils';
import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import navigation, {NavigationState} from './navigation';


const reducer = combineReducers({
  navigation,
});

export default reducer;

export interface SessionState {
  navigation : NavigationState,
}

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(reducer, composeEnhancers(applyMiddleware(thunkMiddleware, crashReporterMiddleware)));

