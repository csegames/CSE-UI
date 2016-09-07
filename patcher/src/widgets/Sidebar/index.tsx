/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';

import {thunkMiddleware, loggingMiddleware, crashReporterMiddleware} from '../../lib/reduxUtils';

import reducer from './services/session';
import SideBarDisplay from './components/SideBarDisplay';

let store = createStore(reducer, applyMiddleware(thunkMiddleware, loggingMiddleware, crashReporterMiddleware));

export interface SidebarProps {
  onLogIn: () => void;
}

class SidebarContainer extends React.Component<SidebarProps, {}> {
  render() {
    return (
      <Provider store={store}>
        <SideBarDisplay {...this.props} />
      </Provider>
    )
  }
}

export default SidebarContainer;
