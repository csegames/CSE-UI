/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import reducer from './services/session/reducer';
import { initializeBuilding } from './services/session/building';
import { initializeSelections } from './services/session/selection';
import App from './components/BuildingApp';

const store = createStore(reducer, applyMiddleware(thunk));

export interface BuildingState {
  visible: boolean;
}

export interface BuildingProps {
}

class Building extends React.Component<BuildingProps, BuildingState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  public render() {
    if (process.env.IS_BROWSER) {
      if (this.state.visible) document.body.style.backgroundImage = "url('../../images/building/cube-bg.jpg')";
      if (!this.state.visible) document.body.style.backgroundImage = '';
    }
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }

  public componentDidMount() {
    game.on('hudnav--navigate', (name: string) => {
      if (name === 'building') {
        this.setState((state, props) => {
          if (state.visible) return { visible: false };
          if (!state.visible) return { visible: true };
        });
      }
    });
    initializeBuilding(store.dispatch);
    initializeSelections(store.dispatch);
  }
}

export default Building;
