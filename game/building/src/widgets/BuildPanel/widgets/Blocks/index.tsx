/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
var thunk = require('redux-thunk').default;

import reducer from './services/session/reducer';
import requester from './services/session/requester';
import {Material} from './lib/Material';
import {loadMaterials, findBlock} from './services/session/materials';
import {Block} from './lib/Block'
import {BuildingItem} from '../../../../lib/BuildingItem'

import MaterialAndShapePane from './components/MaterialAndShapePane';

let store = createStore(reducer, applyMiddleware(thunk));

loadMaterials(store.dispatch);

export interface ContainerProps {
  onItemSelect?: (item: BuildingItem)=>void;
}

export interface ContainerState {
}

class Container extends React.Component<ContainerProps, ContainerState> {
  constructor(props: ContainerProps)
  {
    super(props);
  }
  
  render() {
    return (
      <Provider store={store}>
        <MaterialAndShapePane onItemSelect={this.props.onItemSelect} />
      </Provider>
    )
  }
}

export default Container;