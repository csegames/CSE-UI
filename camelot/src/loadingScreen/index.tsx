/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';

// These SCSS imports get translated and put into the `dist/css/` folder by
// mini-css-extract-plugin at compile time.  A reference to the final CSS file
// is then automatically added to the HTML for this entry point.
import '../shared/Shared-Styles.scss';
import './LoadingScreen-Styles.scss';

import { ErrorBoundary } from '@csegames/library/dist/_baseGame/types/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';

ReactDom.render(
  <ErrorBoundary>
    <LoadingScreen />
  </ErrorBoundary>,
  document.getElementById('loadingScreen')
);
