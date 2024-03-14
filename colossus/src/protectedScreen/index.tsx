/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './ProtectedScreen-Styles.scss';
import '../shared/Shared-Styles.scss';

import { game } from '@csegames/library/dist/_baseGame';
import { PerfHud } from '@csegames/library/dist/perfHud/index';
import { DevUI } from './components/DevUI';

ReactDOM.render(
  <>
    <PerfHud />
    <DevUI game={game} />
  </>,
  document.getElementById('perfhud')
);
