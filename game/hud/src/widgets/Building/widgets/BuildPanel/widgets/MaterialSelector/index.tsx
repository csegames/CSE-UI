/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import reducer from './services/session/reducer';
import {initialize} from './services/session/materials-by-type';
import {BuildPaneProps} from '../../lib/BuildPane';

import TabbedPane from '../../components/TabbedPane';
import MaterialSelector from './components/MaterialSelector';
import MaterialPreview from './components/MaterialPreview';
import {Anchor} from '../../../SavedDraggable';

const store = createStore(reducer, applyMiddleware(thunk));

initialize(store.dispatch);

interface ContainerState {
}

class Container extends React.Component<BuildPaneProps, ContainerState> {
  constructor(props: BuildPaneProps) {
    super(props);
  }

  public render() {
    return (
      <Provider store={store}>
        <TabbedPane name='materials' tabs={['Materials']} className='material-selector'
          defaultX={[405, Anchor.TO_END]}
          defaultY={[20, Anchor.TO_START]}
          defaultSize={[200, 750]}
        >
          <MaterialSelector />
          <MaterialPreview />
        </TabbedPane>
      </Provider>
    );
  }
}

export default Container;
