/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import './third-party/coherent/coherent.mock.style.css';

import 'core-js/es6/map';
import 'core-js/es6/weak-map';
import 'core-js/es6/set';
import '@csegames/library/lib/_baseGame';
import '@csegames/library/lib/hordetest';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ErrorBoundary } from 'cseshared/components/ErrorBoundary';

import { LoadingScreen } from 'components/LoadingScreen';

if (process.env.CUUI_LS_ENABLE_WHY_DID_YOU_UPDATE) {
  // tslint:disable
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
  // tslint:enable
}

ReactDom.render(
  <ErrorBoundary outputErrorToConsole>
    <LoadingScreen />
  </ErrorBoundary>,
  document.getElementById('loadingscreen'));
