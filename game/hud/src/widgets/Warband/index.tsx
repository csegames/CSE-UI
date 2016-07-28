/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
const thunk = require('redux-thunk').default;
import {signalr} from 'camelot-unchained';

import initialize from './services/initialization';
import reducer from './services/session';
import WarbandDisplay from './components/WarbandDisplay';

const store = createStore(reducer, applyMiddleware);

// globally initialize SignalR for this module
signalr.initializeSignalR();


export interface WarbandContainerProps {
  containerClass?: string;
  isMini?: boolean;
}

export interface WarbandContainerState {
}

class WarbandContainer extends React.Component<WarbandContainerProps, WarbandContainerState> {

  private initialized = false;
  componentWillMount() {
    if (!this.initialized) {
      initialize();
      this.initialized = true;
    }
  }

  render() {
    return (
      <Provider store={store}>
        <WarbandDisplay {...this.props} />
      </Provider>
    )
  }
}

export default WarbandContainer;
