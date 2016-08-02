/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
const thunk = require('redux-thunk').default;

import reducer from './services/session/reducer';
import {initialize} from './services/session/materials-by-type';
import {BuildPaneProps} from '../../lib/BuildPane';

import TabbedPane from '../../components/TabbedPane';
import MaterialSelector from './components/MaterialSelector';
import MaterialPreview from './components/MaterialPreview';

const store = createStore(reducer, applyMiddleware(thunk));

initialize(store.dispatch);

interface ContainerState {
}

class Container extends React.Component<BuildPaneProps, ContainerState> {
  constructor(props: BuildPaneProps) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <TabbedPane name="materials" tabs={['Materials']} className="material-selector" 
          defaultPositionInPercentages={{ x: 68, y: 5 }}
          defaultSizeInPercentages={{ width: 15, height: 90, scale: 1 }} 
        >
          <MaterialSelector />
          <MaterialPreview />
        </TabbedPane>
      </Provider>
    )
  }
}

export default Container;
