/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';

import {crashReporterMiddleware, thunkMiddleware} from '../../lib/reduxUtils';
import initialize from './services/initialization';
import reducer from './services/session';
import WarbandDisplay from './components/WarbandDisplay';


const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunkMiddleware, crashReporterMiddleware)));

export interface WarbandContainerProps {
  containerClass?: string;
  isMini?: boolean;
}

export interface WarbandContainerState {
}

class WarbandContainer extends React.Component<WarbandContainerProps, WarbandContainerState> {

  constructor(props: WarbandContainerProps) {
    super(props);
    this.state = {};

    initialize();
  }

  public render() {
    // temporary hack until react-redux supports ts 2.4 properly
    const props: any = this.props;
    return (
      <Provider store={store}>
        <WarbandDisplay {...props} />
      </Provider>
    );
  }
}

export default WarbandContainer;
