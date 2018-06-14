/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'core-js/es6/map';
import 'core-js/es6/weak-map';
import 'core-js/es6/set';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { client } from '@csegames/camelot-unchained';
import { ErrorBoundary } from '@csegames/camelot-unchained/lib/components/ErrorBoundary';

import initialize from './services/initialization';
import HUD from './components/HUD';
import { apollo, store } from './services/session/reducer';
import { ApolloProvider } from 'react-apollo';

// Uncomment if you want super easy perf gainzzz https://github.com/garbles/why-did-you-update

// if (client.debug) {
//   // tslint:disable
//   {
//     // @ts-ignore
//     let createClass = React.createClass;
//     Object.defineProperty(React, 'createClass', {
//       set: (nextCreateClass) => {
//         createClass = nextCreateClass;
//       }
//     });
//   }
//   const {whyDidYouUpdate} = require('why-did-you-update');
//   whyDidYouUpdate(React);
// }

const root = document.getElementById('hud');

interface WindowInterface extends Window {
  cuAPI: any;
  opener: WindowInterface;
}

// declare window implements WindowInterface
declare const window: WindowInterface;

if ((window.opener && window.opener.cuAPI) || window.cuAPI) {
  client.OnInitialized(() => {
    initialize();
    ReactDom.render(
      <ErrorBoundary outputErrorToConsole>
        <ApolloProvider store={store} client={apollo}>
          <HUD />
        </ApolloProvider>
      </ErrorBoundary>,
      root);
  });
} else {
  initialize();
  ReactDom.render(
    <ErrorBoundary outputErrorToConsole>
      <ApolloProvider store={store} client={apollo}>
        <HUD />
      </ApolloProvider>
    </ErrorBoundary>,
    root);
}
