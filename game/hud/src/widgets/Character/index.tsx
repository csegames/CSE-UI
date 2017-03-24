/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-23 15:22:45
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-12 16:24:45
 */

import * as React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { ApolloClient } from 'apollo-client';
import { graphql, InjectedGraphQLProps } from 'react-apollo';
import { Provider, connect } from 'react-redux';
import { client, ql, events, hasClientAPI, jsKeyCodes } from 'camelot-unchained';
import CharacterMain from './components/CharacterMain';
import thunk from 'redux-thunk';

import { ItemInfo } from './services/types/inventoryTypes';
import {
  CharacterSheetState,
  initializeEquippedItems,
  initializeInventoryItems,
  initializeValidItems,
} from './services/session/character';
import { TabPanelState, setTabIndex } from './services/session/tabpanel';
import reducer from './services/session/reducer';

// tslint:disable
import testData from './testItems';
import testCharacterData from './testCharacterItems';
// tslint:enable

const store = createStore(reducer, applyMiddleware(thunk as any));

function select(state: any): any {
  return {
    tabPanelState: state.tabPanel,
    characterSheetState: state.characterSheet,
  };
}

export interface CharacterContainerProps {
  styles?: any;
  characterSheetState?: CharacterSheetState;
  tabPanelState?: TabPanelState;
  dispatch?: (action: any) => void;
}

export interface CharacterContainerState {
  visible : boolean;
}

class CharacterContainer extends React.Component<CharacterContainerProps, CharacterContainerState> {

  private initialized = false;
  private mainRef: any = null;
  private itemSlotRef: any = null;

  constructor(props : CharacterContainerProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  public render() {
    const { dispatch } = this.props;
    return this.state.visible
      ? (
        // <Provider store={store}>
          <CharacterMain
            ref={r => this.mainRef = r}
            characterSheetState={this.props.characterSheetState}
            tabPanelState={this.props.tabPanelState}
            dispatch={this.props.dispatch}
          />
        // </Provider>
      )
      : null;
  }

  private componentWillMount() {
    this.props.dispatch(initializeInventoryItems({ items: testData.data.myInventoryItems }));
    this.props.dispatch(initializeEquippedItems({ items: testCharacterData.data.myEquippedItems }));
    this.props.dispatch(initializeValidItems({ items: testData.data.myInventoryItems }));
  }

  private componentDidMount() {
    if (!this.initialized) {
      this.initialized = true;
    }
    events.on('hudnav--navigate', (name : string) => {
      if (name === 'character') {
        if (this.state.visible) {
          this.hide();
        } else {
          this.show();
          // if (this.mainRef !== null) this.mainRef.refresh();
        }
      }
      if (name === 'equippedgear') {
        if (this.state.visible) {
          this.hide();
        } else {
          this.show();
          // if (this.mainRef !== null) this.mainRef.refresh();
        }
      }
      if (name === 'inventory') {
        if (this.state.visible) {
          this.hide();
        } else {
          this.show();
          this.props.dispatch(setTabIndex({ tabIndex: 1 }));
        }
      }
    });
    window.addEventListener('keydown', this.onKeyDown);
  }

  private componentWillUnmount() {
    events.off('hudnav--navigate');
    window.removeEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown = (e : KeyboardEvent) => {
    if (e.which === jsKeyCodes.ESC && this.state.visible) {
      client.ReleaseInputOwnership();
      this.hide();
    }
  }

  private show = () => {
    if (typeof client.RequestInputOwnership === 'function') 
      client.RequestInputOwnership();
    this.setState({visible: true});
  }

  private hide = () => {
    if (typeof client.ReleaseInputOwnership === 'function') 
      client.ReleaseInputOwnership();
    this.setState({visible: false});
  }
}

// const CharacterContainerWithQL = graphql(ql.queries.MyEquippedItems, {
//   options: {
//   },
// })(CharacterContainer);

const ConnectedCharacterContainer =
  connect<CharacterContainerProps, {}, CharacterContainerProps>(select)(CharacterContainer);

class Container extends React.Component<CharacterContainerProps, {}> {
  public render() {
    return (
      <Provider store={store}>
        <ConnectedCharacterContainer {...this.props} />
      </Provider>
    );
  }
}

export default Container;
