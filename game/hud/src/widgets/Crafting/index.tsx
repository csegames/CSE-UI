/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import reducer from './services/session/reducer';
import App from './components/App';

const store = createStore(reducer, applyMiddleware(thunk));

export const Crafting = () =>
  <Provider store={store}>
    <App/>
  </Provider>;

export default Crafting;
