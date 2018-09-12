/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'font-awesome/css/font-awesome.css';
import './third-party/animate.css';
import 'ol/ol.css';
import './third-party/toastr.min.css';
import './index.scss';

// TODO: AUDIT IF WE NEED THESE
import 'core-js/es6/map';
import 'core-js/es6/weak-map';
import 'core-js/es6/set';
// --------------------------
import '@csegames/camelot-unchained';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ErrorBoundary } from '@csegames/camelot-unchained/lib/components/ErrorBoundary';

import HUD from './components/HUD';
import { apollo, store } from './services/session/reducer';
import { ApolloProvider } from 'react-apollo';

if (process.env.CUUI_HUD_ENABLE_WHY_DID_YOU_UPDATE) {
  // tslint:disable
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
  // tslint:enable
}

const root = document.getElementById('hud');

game.on('ready', () => {
  ReactDom.render(
    <ErrorBoundary outputErrorToConsole>
        <ApolloProvider store={store} client={apollo}>
        <HUD />
      </ApolloProvider>
    </ErrorBoundary>,
    root);
});
