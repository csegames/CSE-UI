/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
const thunk = require('redux-thunk').default;

import reducer from './services/session/reducer';
import {initializeBuilding} from './services/session/building';
import {initializeSelections} from './services/session/selection';
import App from './components/BuildingApp';

const store = createStore(reducer, applyMiddleware(thunk));
const root = document.getElementById('cse-ui-building');


// #TODO Reminder: export a has api check from the camelot-unchained lib
// interface for window cuAPI
import {events} from 'camelot-unchained';
interface WindowInterface extends Window {
  cuAPI: any;
  opener: WindowInterface;
}

// declare window implements WindowInterface
declare const window: WindowInterface;

if ((window.opener && window.opener.cuAPI) || window.cuAPI) {
  events.on('init', () => {
    initializeBuilding(store.dispatch);
    initializeSelections(store.dispatch);
    ReactDom.render(
    <Provider store={store}>
      <App />
    </Provider>,
    root)
  });  
} else {

  document.body.style.backgroundImage = "url('./images/cube-bg.jpg')";
  initializeBuilding(store.dispatch);
  initializeSelections(store.dispatch);

  ReactDom.render(
    <Provider store={store}>
      <App />
    </Provider>,
    root);
}
