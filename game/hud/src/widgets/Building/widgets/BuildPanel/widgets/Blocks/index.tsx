/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import * as events  from '@csegames/camelot-unchained/lib/events';
import reducer from './services/session/reducer';
import { initialize } from './services/session/materials';
import { BuildPaneProps, DEACTIVATE_MATERIAL_SELECTOR } from '../../lib/BuildPane';

import TabbedPane from '../../components/TabbedPane';
import MaterialAndShapePane from './components/MaterialAndShapePane';
import MaterialReplace from './components/MaterialReplace';
import { Anchor } from '../../../SavedDraggable';

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
        <TabbedPane
          name='blocks'
          tabs={['Blocks', 'Replace']}
          onTabChange={(index: number, name: string) => this.onTabChange}
          defaultX={[0, Anchor.TO_END]}
          defaultY={[0, Anchor.TO_START]}
          defaultSize={[200, 200]}
        >
          <MaterialAndShapePane {...this.props}/>
          <MaterialReplace {...this.props}/>
        </TabbedPane>

      </Provider>
    );
  }

  private onTabChange = () => {
    events.fire(DEACTIVATE_MATERIAL_SELECTOR, {});
  }
}

export default Container;
