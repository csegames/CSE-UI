/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { client } from '@csegames/camelot-unchained';
import { ErrorBoundary } from '@csegames/camelot-unchained/lib/components/ErrorBoundary';

import App from './components/App';

const root = document.getElementById('boilerplate-module');

interface WindowInterface extends Window {
  cuAPI: any;
  opener: WindowInterface;
}

// declare window implements WindowInterface
declare const window: WindowInterface;

if ((window.opener && window.opener.cuAPI) || window.cuAPI) {
  client.OnInitialized(() => {
    ReactDom.render(
      <ErrorBoundary outputErrorToConsole>
        <App />
      </ErrorBoundary>,
      root);
  });
} else {
  ReactDom.render(
    <ErrorBoundary outputErrorToConsole>
      <App />
    </ErrorBoundary>,
  root);
}
