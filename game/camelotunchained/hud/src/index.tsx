/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'font-awesome/css/font-awesome.css';
import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import 'ol/ol.css';
import './third-party/animate.css';
import './third-party/toastr.min.css';
import './index.scss';
import './services/types';

// TODO: AUDIT IF WE NEED THESE
import 'core-js/es6/map';
import 'core-js/es6/weak-map';
import 'core-js/es6/set';
// ---------------------

import '@csegames/library/lib/_baseGame';
import '@csegames/library/lib/camelotunchained';
import { regMap } from '@csegames/library/lib/_baseGame/engineEvents';
import { CoherentEventHandle } from '@csegames/library/lib/_baseGame/coherent';
import initialize from './services/initialization';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { ErrorBoundary } from 'cseshared/components/ErrorBoundary';

import { HUDView } from 'hud/index';
import { store } from './services/session/reducer';

import './services/session/UIContext';
import { GlobalProviders } from './components/context';

if (process.env.CUUI_HUD_ENABLE_WHY_DID_YOU_UPDATE) {
  // tslint:disable
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
  // tslint:enable
}

// Catch any events that come through before the readyCheck is finished and fire them once we're ready and mounted.
let engineEventQueue = {};
let eventQueueHandles: { [eventName: string]: CoherentEventHandle } = {};
Object.keys(regMap).forEach((eventName) => {
  const handle = engine.on(eventName, (...args) => {
    if (engineEventQueue[eventName]) {
      engineEventQueue[eventName].push(args);
    } else {
      engineEventQueue[eventName] = [args];
    }
  });

  eventQueueHandles[eventName] = handle;
});

function fireEventQueue() {
  setTimeout(() => {
    Object.keys(engineEventQueue).forEach((eventQueued) => {
      engineEventQueue[eventQueued].forEach((args: any[]) => {
        engine.trigger(eventQueued, ...args);
      });
    });

    Object.keys(eventQueueHandles).forEach((eventName) => {
      eventQueueHandles[eventName].clear();
    });

    engineEventQueue = null;
    eventQueueHandles = null;
  }, 500);
}

function readyCheck() {
  if ((!camelotunchained.game.selfPlayerState.characterID ||
        camelotunchained.game.selfPlayerState.characterID === 'unknown') &&
        game.isClientAttached) {
    setTimeout(readyCheck, 20);
    return;
  }

  initialize();

  ReactDom.render(
  <Provider store={store}>
    <ErrorBoundary outputErrorToConsole>
      <GlobalProviders>
        <HUDView />
      </GlobalProviders>
    </ErrorBoundary>
  </Provider>,
  document.getElementById('hud'),
  fireEventQueue);
}

readyCheck();
