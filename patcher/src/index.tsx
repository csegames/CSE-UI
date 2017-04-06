/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-06 16:47:55
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-25 17:07:29
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';

import {thunkMiddleware, loggingMiddleware} from './lib/reduxUtils';
import reducer from './services/session';
import PatcherApp from './components/App';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
const root = document.getElementById('Patcher');

ReactDom.render(
  <Provider store={store}>
    <PatcherApp />
  </Provider>,
  root,
);
