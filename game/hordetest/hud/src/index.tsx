/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import './index.css';
import './third-party/coherent/coherent.mock.style.css';

import 'core-js/es6/map';
import 'core-js/es6/weak-map';
import 'core-js/es6/set';
import '@csegames/library/lib/_baseGame';
import '@csegames/library/lib/hordetest';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as Sentry from '@sentry/browser';

import initialize from './services/initialization';
import { ErrorBoundary } from 'cseshared/components/ErrorBoundary';
import { HUD } from 'components/HUD';
import { SharedContextProviders } from 'context/index';
import { LoadingScreen } from './components/fullscreen/LoadingScreen';
import { MiddleModal } from 'components/fullscreen/MiddleModal';

if (process.env.CUUI_LS_ENABLE_WHY_DID_YOU_UPDATE) {
  // tslint:disable
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
  // tslint:enable
}

function readyCheck() {
  if (game.accessToken === 'developer' && game.isClientAttached) {
    setTimeout(readyCheck, 100);
    return;
  }

  initialize();
  initializeSentry();

  ReactDom.render(
    <ErrorBoundary outputErrorToConsole>
      <SharedContextProviders>
        <HUD />
        <LoadingScreen />
        <MiddleModal/>
      </SharedContextProviders>
    </ErrorBoundary>,
  document.getElementById('hordetest'));
}

function initializeSentry() {
  // Error reporting service
  if (game.isPublicBuild) {
    Sentry.init({
      dsn: 'https://2f9671b9d7bd4d81b623974447ac7a6f@sentry.io/2068594',
      attachStacktrace: true,
    });

    Sentry.setUser({ characterID: game.characterID });
  }
}

readyCheck();
