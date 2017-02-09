/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import cu, {client} from 'camelot-unchained';

import {thunkMiddleware, crashReporterMiddleware} from './lib/reduxUtils';

import initialize from './services/initialization';
import HUD from './components/HUD';
import reducer, {apollo, store} from './services/session/reducer';
import {ApolloProvider} from 'react-apollo';

let s = createStore(reducer);

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
      <ApolloProvider store={store} client={apollo}>
        <HUD />
      </ApolloProvider>,
      root);
  });
} else {
  initialize();
  ReactDom.render(
    <ApolloProvider store={store} client={apollo}>
      <HUD />
    </ApolloProvider>,
    root);
}
