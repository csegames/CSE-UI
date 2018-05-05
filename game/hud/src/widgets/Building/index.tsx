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


// #TODO Reminder: export a has api check from the camelot-unchained lib
// interface for window cuAPI
import { on } from '@csegames/camelot-unchained/lib/events';
interface WindowInterface extends Window {
  cuAPI: any;
  opener: WindowInterface;
}

// declare window implements WindowInterface
declare const window: WindowInterface;

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
    if (window.opener && !window.opener.cuAPI || !window.cuAPI) {
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
    on('hudnav--navigate', (name: string) => {
      if (name === 'building') {
        this.setState((state, props) => {
          if (state.visible) return { visible: false };
          if (!state.visible) return { visible: true };
        });
      }
    });
    if (window.opener && window.opener.cuAPI || window.cuAPI) {
      initializeBuilding(store.dispatch);
      initializeSelections(store.dispatch);
    }
  }
}

export default Building;
