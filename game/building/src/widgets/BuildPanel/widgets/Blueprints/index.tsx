/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {loadBlueprints} from './services/session/blueprints';
const thunk = require('redux-thunk').default;

import reducer from './services/session/reducer';
import BlueprintsPane from './components/BlueprintsPane';
import {BuildingItem} from '../../../../lib/BuildingItem'
import {BuildPaneProps} from '../../lib/BuildPane';
import TabbedPane from '../../components/TabbedPane';


const store = createStore(reducer, applyMiddleware(thunk));

loadBlueprints(store.dispatch);

interface ContainerState {
}

class Container extends React.Component<BuildPaneProps, ContainerState> {
  render() {
    return (
      <Provider store={store}>
        <TabbedPane tabs={['Blueprints']}>
          <BlueprintsPane onItemSelect={this.props.onItemSelect} minimized={this.props.minimized}/>
        </TabbedPane>
      </Provider>
    )
  }
}

export default Container;
