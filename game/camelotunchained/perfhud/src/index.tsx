/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import './index.scss';
import '@csegames/library/lib/camelotunchained';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import PerfHud from './components/PerfHud';

ReactDOM.render(<PerfHud />, document.getElementById('perfhud'));
