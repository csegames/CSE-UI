/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-30 11:42:19
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-04 17:32:26
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
const thunk = require('redux-thunk').default;

import reducer from './services/session/reducer';
import {initializeBuilding} from './services/session/building';
import {initializeSelections} from './services/session/selection';
import App from './components/BuildingApp';

const store = createStore(reducer, applyMiddleware(thunk));
const root = document.getElementById('cse-ui-building');


// #TODO Reminder: export a has api check from the camelot-unchained lib
// interface for window cuAPI
import {events} from 'camelot-unchained';
interface WindowInterface extends Window {
  cuAPI: any;
  opener: WindowInterface;
}

// declare window implements WindowInterface
declare const window: WindowInterface;

export interface BuildingState {
  visible: boolean;
}

class Building extends React.Component<{}, BuildingState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      visible: false
    }
  }
  componentDidMount() {
    events.on('hudnav--navigate', (name: string) => {
      if (name === 'building') {
        if (!this.state.visible) {
          this.setState((state, props) => ({ visible: true }));
        } else {
          this.setState((state, props) => ({ visible: false }));
        }
      }
    })
  }
  render() {
    if (this.state.visible) {
      if ((window.opener && window.opener.cuAPI) || window.cuAPI) {
        initializeBuilding(store.dispatch);
        initializeSelections(store.dispatch);
        return (
          <Provider store={store}>
            <App />
          </Provider>
        )
      } else {
        document.body.style.backgroundImage = "url('../../images/building/cube-bg.jpg')";
        initializeBuilding(store.dispatch);
        initializeSelections(store.dispatch);
        return (
          <Provider store={store}>
            <App />
          </Provider>
        )
      }
    } else return null;
  }
}

export default Building;
