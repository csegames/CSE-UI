/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import './worldSpace-styles.scss';
import '../shared/Shared-Styles.scss';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ErrorBoundary } from '@csegames/library/dist/_baseGame/types/ErrorBoundary';
import { WorldUI } from './components';

ReactDom.render(
  <ErrorBoundary>
    <WorldUI />
  </ErrorBoundary>,
  document.getElementById('worldspace-ui')
);
