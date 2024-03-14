/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// These SCSS imports get translated and put into the `dist/css/` folder by
// mini-css-extract-plugin at compile time.  A reference to the final CSS file
// is then automatically added to the HTML for this entry point.
import '../shared/Shared-Styles.scss';
import './ProtectedScreen-Styles.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

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
