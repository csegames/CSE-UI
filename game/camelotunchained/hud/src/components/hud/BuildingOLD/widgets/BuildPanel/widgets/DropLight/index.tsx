/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import reducer from './services/session/reducer';
import { loadLights } from './services/session/lights';
import { BuildPaneProps } from '../../lib/BuildPane';
import TabbedPane from '../../components/TabbedPane';

import DroplightPane from './components/DroplightPane';
import LightSelector from './components/LightSelector';
import { Anchor } from '../../../SavedDraggable';

const store = createStore(reducer, applyMiddleware(thunk));

loadLights(store.dispatch);

export interface ContainerState {
}

class Container extends React.Component<BuildPaneProps, ContainerState> {
  constructor(props: BuildPaneProps) {
    super(props);
  }

  public render() {
    return (
      <Provider store={store}>
        <TabbedPane name='droplights' className='drop-light' tabs={[this.props.minimized ? 'Light' : 'Drop Light']}
          defaultX={[0, Anchor.TO_END]}
          defaultY={[600, Anchor.TO_START]}
          defaultSize={[200, 200]}
          >
          <DroplightPane />
          <LightSelector />
        </TabbedPane>
      </Provider>
    );
  }
}

export default Container;
