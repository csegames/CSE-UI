/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import './index.scss';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import { thunkMiddleware } from './lib/reduxUtils';
import reducer from './services/session';
import PatcherApp from './components/App';
import '@csegames/library/lib/_baseGame';
import '@csegames/library/lib/camelotunchained';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
const root = document.getElementById('Patcher');

ReactDom.render(
  <Provider store={store as any}>
    <PatcherApp />
  </Provider>,
  root,
);
