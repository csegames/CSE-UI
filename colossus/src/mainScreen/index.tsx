/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import './index.css';
import './mainScreen-styles.scss';
import '../shared/Shared-Styles.scss';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import * as Sentry from '@sentry/browser';

import { ErrorBoundary } from '@csegames/library/dist/_baseGame/types/ErrorBoundary';
import { SharedContextProviders } from './components/context/index';
import { LoadingScreen } from '../loadingScreen/components/LoadingScreen';
import { store } from './redux/store';
import { game } from '@csegames/library/dist/_baseGame';
import LifecycleViews from './components/LifecycleViews';
import TooltipPane from '../shared/components/TooltipPane';
import { VoiceChatOverlay } from './components/loading/VoiceChatOverlay';
import { WarningIcons } from './WarningIcons';

initializeSentry();

ReactDom.render(
  <ErrorBoundary>
    <ReduxProvider store={store}>
      <SharedContextProviders store={store}>
        <LifecycleViews />
        <LoadingScreen showLogo={true} backgroundImageURL={'images/fullscreen/loadingscreen/bg-battle.jpg'}>
          <VoiceChatOverlay />
        </LoadingScreen>
        <WarningIcons />
        <TooltipPane />
      </SharedContextProviders>
    </ReduxProvider>
  </ErrorBoundary>,
  document.getElementById('hordetest')
);

// Error reporting service
function initializeSentry() {
  if (game.isPublicBuild) {
    Sentry.init({
      dsn: 'https://2f9671b9d7bd4d81b623974447ac7a6f@sentry.io/2068594',
      attachStacktrace: true
    });

    Sentry.setUser({ characterID: game.characterID });
  }
}
