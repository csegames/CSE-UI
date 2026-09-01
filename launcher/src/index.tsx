/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import './index.scss';
import './third-party/fontawesome-all.min.css';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import { PatcherApp } from './components/App';
import { store } from './redux/store';

const root = document.getElementById('Patcher');

ReactDom.render(
  <Provider store={store}>
    <PatcherApp />
  </Provider>,
  root
);
