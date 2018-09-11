/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import { thunkMiddleware } from '../../lib/reduxUtils';
import { Routes } from '../../services/session/routes';

import reducer from './services/session';
import ControllerDisplay from './components/ControllerDisplay';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

export interface ControllerProps {
  onLogIn: () => void;
  activeRoute: Routes;
}

class ControllerContainer extends React.Component<ControllerProps, {}> {
  public render() {
    return (
      <Provider store={store}>
        <ControllerDisplay {...this.props} />
      </Provider>
    );
  }
}

export default ControllerContainer;
