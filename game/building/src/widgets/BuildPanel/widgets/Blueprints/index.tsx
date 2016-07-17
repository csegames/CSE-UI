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
  previewIcon: string
}

class Container extends React.Component<BuildPaneProps, ContainerState> {
  render() {

    let preview: JSX.Element = null;
    if (this.state && this.state.previewIcon != null) {
      preview = ( <div className="blueprint-preview-panel"><img src={`data:image/png;base64, ${this.state.previewIcon}`} /></div> )
    }

    return (
      <Provider store={store}>
        <TabbedPane name="blueprints" 
          tabs={['Blueprints']}
          defaultPositionInPercentages={{x:85, y:33 }} 
          defaultSizeInPercentages={{ width: 15, height: 40, scale: 1 }} 
        >
          <BlueprintsPane minimized={this.props.minimized} handlePreviewIcon={(icon: string) =>this.setState({ previewIcon: icon})}/>
          {preview} 
        </TabbedPane>
      </Provider>
    )
  }
}

export default Container;
