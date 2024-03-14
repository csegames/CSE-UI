/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ErrorBoundary } from '@csegames/library/dist/_baseGame/types/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';

import './loadingScreen-styles.scss';
import '../shared/Shared-Styles.scss';

// The loading screen has been updated to not require any game context
// so that it can render before globals have been exported from C++
ReactDom.render(
  <ErrorBoundary>
    <LoadingScreen
      showLogo={false}
      initialMessage={'Initializing UI'}
      backgroundImageURL={'images/fullscreen/loadingscreen/bg-launch.jpg'}
    />
  </ErrorBoundary>,
  document.getElementById('loadingscreen')
);
