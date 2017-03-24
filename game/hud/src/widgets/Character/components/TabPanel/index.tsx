/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-23 15:57:50
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-11 18:45:25
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { events, client } from 'camelot-unchained';
import { createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk';

import { CharacterSheetState } from '../../services/session/character';
import { TabPanelState, setTabIndex } from '../../services/session/tabpanel';
import { ItemInfo } from '../../services/types/inventoryTypes';
import Inventory from './components/Inventory';

export interface TabPanelStyle extends StyleDeclaration {
  container: React.CSSProperties;
  tabsContainer: React.CSSProperties;
  tab: React.CSSProperties;
  tabText: React.CSSProperties;
  activeTab: React.CSSProperties;
  content: React.CSSProperties;
  close: React.CSSProperties;
}

export const defaultTabPanelStyle: TabPanelStyle = {
  container: {
    flex: '1 1 auto',
    borderLeft: '1px solid #444',
    backgroundColor: '#333',
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
  },

  tabsContainer: {
    display: 'flex',
    flex: '0 0 auto',
    alignSelf: 'flex-start',
    width: '100%',
    paddingTop: '30px',
    backgroundColor: '#4d573e',
  },

  tab: {
    color: '#777',
    backgroundColor: '#333',
    borderTopRightRadius: '5px',
    borderTopLeftRadius: '5px',
    marginRight: '3px',
    cursor: 'pointer',
    width: '200px',
    textAlign: 'center',
  },

  tabText: {
    textAlign: 'center',
    fontSize: '24px',
    margin: 0,
    padding: 0,
  },

  activeTab: {
    borderBottom: '5px inset #74845c',
    boxShadow: '2px 0 5px rgba(0,0,0,0.5), 0 2px 5px rgba(0,0,0,0.5)',
  },

  content: {
    display: 'flex',
    flex: '1 1 auto',
  },

  close: {
    position: 'absolute',
    top: '2px',
    right: '10px',
    color: '#cdcdcd',
    fontSize: '2em',
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      color: '#bbb',
    },
  },
};

export interface TabItemProps {
  selected: boolean;
}

export interface TabItem {
  renderTab: (props: TabItemProps) => JSX.Element;
  renderContent: JSX.Element;
  props: any;
}

export interface TabPanelProps {
  styles?: Partial<TabPanelStyle>;
  dispatch?: any;
  inventoryRef: any;
  characterSheetState: CharacterSheetState;
  tabPanelState: TabPanelState;
}

export interface TabPanelState {
}

export class TabPanel extends React.Component<TabPanelProps, TabPanelState> {
  constructor(props: TabPanelProps) {
    super(props);
  }

  public render() {
    const ss = StyleSheet.create(defaultTabPanelStyle);
    const custom = StyleSheet.create(this.props.styles || {});
  
    const { inventoryItems, stacks, expandedSlots, expandedId } = this.props.characterSheetState;
    const { currentTabIndex } = this.props.tabPanelState;
    const { dispatch, inventoryRef, characterSheetState } = this.props;

    const tabs: TabItem[] = [
      {
        renderTab: (props: any) => this.renderTab('Stats'),
        renderContent: <div id='stat-content'>Stuff for stats</div>,
        props: { },
      },
      {
        renderTab: (props: any) => this.renderTab('Inventory'),
        renderContent:
          <Inventory
            dispatch={dispatch}
            items={inventoryItems}
            stacks={stacks}
            expandedSlots={expandedSlots}
            expandedId={expandedId}
            inventoryRef={inventoryRef}
            characterSheetState={characterSheetState}
          />,
        props: { },
      },
    ];
    const selectedItem = tabs[currentTabIndex];
    return (
      <div id='tab-panel-container' className={css(ss.container, custom.container)}>
        <div className={css(ss.close, custom.close)}>
          <i className='fa fa-times click-effect' onClick={() => events.fire('hudnav--navigate', 'character')}></i>
        </div>
        <div className={css(ss.tabsContainer, custom.tabsContainer)}>
          {tabs.map((item, index) =>
            <span
              key={index}
              className={css(
                ss.tab,
                custom.tab,
                index === currentTabIndex && ss.activeTab,
                index === currentTabIndex && custom.activeTab,
              )}
              onClick={() => this.selectTab(index)}>
              <item.renderTab selected={index === currentTabIndex} {...item.props} />
            </span>,
          )}
        </div>
        <div className={css(ss.content, custom.content)}>
          {selectedItem.renderContent}
        </div>
      </div>
    );
  }
  
  private componentWillMount() {
    events.on('hudnav--navigate', (name: string) => {
      switch (name) {
        case 'inventory': { this.selectTab(1); break; }
        default: this.selectTab(0);
      }
    });
  }

  private componentWillUnmount() {
    events.off('hudnav--navigate');
  }

  private renderTab = (tabName: string) => {
    const ss = StyleSheet.create(defaultTabPanelStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    return <p id={tabName + '-tab'} className={css(ss.tabText, custom.tabText)}>{tabName}</p>;
  }

  private selectTab = (index: number) => {
    this.props.dispatch(setTabIndex({ tabIndex: index }));
  }
}

export default TabPanel;
