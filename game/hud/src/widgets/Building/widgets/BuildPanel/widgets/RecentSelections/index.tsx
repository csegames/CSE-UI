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
import {initializeRecents} from './services/session/recents';

import {BuildPaneProps} from '../../lib/BuildPane';
import {BuildingItem} from '../../../../lib/BuildingItem';
import TabbedPane from '../../components/TabbedPane';
import RecentSelections from './components/RecentSelections';
import {Anchor} from '../../../SavedDraggable';

const store = createStore(reducer, applyMiddleware(thunk));

initializeRecents(store.dispatch);

interface ContainerState {
}

class Container extends React.Component<BuildPaneProps, ContainerState> {

  public render() {
    return (
      <Provider store={store}>
        <TabbedPane name='recents'
        tabs={[this.props.minimized ? 'Recent' : 'Recently Used']} 
          defaultX={[0, Anchor.TO_END]} 
          defaultY={[200, Anchor.TO_START]} 
          defaultSize={[200, 100]} 
        >
          <RecentSelections />
        </TabbedPane>
      </Provider>
    );
  }
}

export default Container;
