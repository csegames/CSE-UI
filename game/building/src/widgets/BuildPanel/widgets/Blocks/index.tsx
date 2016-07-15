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
import {loadMaterials} from './services/session/materials';
import {BuildPaneProps} from '../../lib/BuildPane';

import TabbedPane from '../../components/TabbedPane';
import MaterialAndShapePane from './components/MaterialAndShapePane';
import MaterialReplace from './components/MaterialReplace';

const store = createStore(reducer, applyMiddleware(thunk));

loadMaterials(store.dispatch);

interface ContainerState {
}

class Container extends React.Component<BuildPaneProps, ContainerState> {
  constructor(props: BuildPaneProps) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <TabbedPane tabs={['Blocks', 'Replace']}>
          <MaterialAndShapePane onItemSelect={this.props.onItemSelect} minimized={this.props.minimized}/>
          <MaterialReplace minimized={this.props.minimized}/>
        </TabbedPane>
      </Provider>
    )
  }
}

export default Container;
