/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import { thunkMiddleware } from './lib/reduxUtils';
import reducer from './services/session';
import PatcherApp from './components/App';
import { client } from '@csegames/camelot-unchained';
import { useConfig } from '@csegames/camelot-unchained/lib/graphql/react';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
const root = document.getElementById('Patcher');

useConfig({
  url: `https://hatcheryapi.camelotunchained.com/graphql`,
  requestOptions: {
    headers: {
      loginToken: client.loginToken,
      shardID: `${client.shardID}`,
      characterID: client.characterID,
    },
  },
}, {});

ReactDom.render(
  <Provider store={store}>
    <PatcherApp />
  </Provider>,
  root,
);
