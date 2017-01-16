/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import cu, {client} from 'camelot-unchained';

import {thunkMiddleware, loggingMiddleware, crashReporterMiddleware} from './lib/reduxUtils';

import initialize from './services/initialization';
import reducer from './services/session/reducer';
import HUD from './components/HUD';

let s = createStore(reducer);

let store = client.debug ? createStore(reducer, applyMiddleware(thunkMiddleware, loggingMiddleware, crashReporterMiddleware)) : createStore(reducer, applyMiddleware(thunkMiddleware, crashReporterMiddleware));
let root = document.getElementById('hud');

interface WindowInterface extends Window {
  cuAPI: any;
  opener: WindowInterface;
}

// declare window implements WindowInterface
declare var window: WindowInterface;

if ((window.opener && window.opener.cuAPI) || window.cuAPI) {
  client.OnInitialized(() => {
    initialize();
    ReactDom.render(
      <Provider store={store}>
        <HUD />
      </Provider>,
      root);
  });
} else {
  initialize();
  ReactDom.render(
    <Provider store={store}>
      <HUD />
    </Provider>,
    root);
}
