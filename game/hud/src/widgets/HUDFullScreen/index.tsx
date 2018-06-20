/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled, { css } from 'react-emotion';
import { events, client, TabPanel, TabItem, ContentItem } from '@csegames/camelot-unchained';
import { SecureTradeState } from '@csegames/camelot-unchained/lib/graphql/schema';

import Map from './components/Map';
import Inventory from './components/Inventory';
import PaperDoll from './components/PaperDoll';
import CharacterInfo from './components/CharacterInfo';
import TradeWindow from './components/TradeWindow';
import { ContainerIdToDrawerInfo } from './components/ItemShared/InventoryBase';
import { InventoryItemFragment, EquippedItemFragment } from '../../gqlInterfaces';

export interface HUDFullScreenStyle {
  hudFullScreen: string;
  navigationContainer: string;
  contentContainer: string;
  navTab: string;
  activeNavTab: string;
}

const Container = styled('div')`
  position: fixed;
  display: flex;
  justify-content: space-between;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  user-select: none;
  -webkit-user-select: none;
  z-index: 9998;
`;

const Close = styled('div')`
  position: fixed;
  top: 5px;
  right: 5px;
  color: #CDCDCD;
  font-size: 20px;
  margin-right: 5px;
  cursor: pointer;
  user-select: none;
  z-index: 9999;
  &:hover: {
    color: #BBB,
  }
`;

const defaultHUDFullScreenStyle: HUDFullScreenStyle = {
  hudFullScreen: css`
    width: 50%;
    height: 100%;
  `,
  navigationContainer: css`
    display: flex;
    align-items: center;
    height: 35px;
    width: 100%;
    background-color: #151515;
    z-index: 10;
  `,
  contentContainer: css`
    height: 100%;
    width: 100%;
    background-color: #333333;
  `,
  navTab: css`
    min-width: 100px;
    color: #4C4C4C;
    border-right: 1px solid #4C4C4C;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: white;
    }
    &:active {
      text-shadow: 0px 0px 5px #fff;
    }
  `,
  activeNavTab: css`
    min-width: 100px;
    color: #E5E5E5;
    border-right: 1px solid #4C4C4C;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: white;
    }
  `,
};

export interface FullScreenNavState {
  visibleComponentLeft: string;
  visibleComponentRight: string;
  initial: boolean;
  inventoryItems: InventoryItemFragment[];
  equippedItems: EquippedItemFragment[];
  myTradeItems: InventoryItemFragment[];
  myTradeState: SecureTradeState;
  containerIdToDrawerInfo: ContainerIdToDrawerInfo;
  stackGroupIdToItemIDs: {[id: string]: string[]};
}

export interface FullScreenNavProps {
  styles?: Partial<HUDFullScreenStyle>;
}

class HUDFullScreen extends React.Component<FullScreenNavProps, FullScreenNavState> {
  private navigateListener: number;
  private tabPanelLeftRef: TabPanel;
  private tabPanelRightRef: TabPanel;

  constructor(props: any) {
    super(props);
    this.state = {
      visibleComponentLeft: '',
      visibleComponentRight: '',
      initial: true,
      inventoryItems: null,
      equippedItems: null,
      myTradeItems: [],
      myTradeState: 'None',
      containerIdToDrawerInfo: {},
      stackGroupIdToItemIDs: {},
    };
  }

  public render() {
    const tabsLeft: TabItem[] = [
      { name: 'equippedgear-left', tab: { render: () => <span>Equipped</span> }, rendersContent: 'Equipped Gear' },
      { name: 'inventory-left', tab: { render: () => <span>Inventory</span> }, rendersContent: 'Inventory' },
      { name: 'character-stats-left', tab: { render: () => <span>Stats</span> }, rendersContent: 'CharacterStats' },
      { name: 'map-left', tab: { render: () => <span>Map</span> }, rendersContent: 'Map' },
      // { name: 'social-left', tab: { render: () => <span>Social</span> }, rendersContent: 'Social' },
      { name: 'trade-left', tab: { render: () => <span>Trade</span> }, rendersContent: 'Trade' },
    ];

    const tabsRight: TabItem[] = [
      { name: 'equippedgear-right', tab: { render: () => <span>Equipped</span> }, rendersContent: 'Equipped Gear' },
      { name: 'inventory-right', tab: { render: () => <span>Inventory</span> }, rendersContent: 'Inventory' },
      { name: 'character-stats-right', tab: { render: () => <span>Stats</span> }, rendersContent: 'CharacterStats' },
      { name: 'map-right', tab: { render: () => <span>Map</span> }, rendersContent: 'Map' },
      // { name: 'social-right', tab: { render: () => <span>Social</span> }, rendersContent: 'Social' },
      // { name: 'trade-right', tab: { render: () => <span>Trade</span> }, rendersContent: 'Trade' },
    ];

    const content: ContentItem[] = [
      { name: 'Equipped Gear', content: { render: this.renderEquipped } },
      { name: 'Inventory', content: { render: this.renderInventory } },
      { name: 'CharacterStats', content: { render: this.renderCharacterStats } },
      { name: 'Map', content: { render: this.renderMap } },
      { name: 'Trade', content: { render: this.renderTrade } },
    ];

    const { visibleComponentLeft, visibleComponentRight } = this.state;
    return (
      <div style={visibleComponentLeft === '' && visibleComponentRight === '' ? { visibility: 'hidden' } : {}}>
        <Container>
          <TabPanel
            ref={ref => this.tabPanelLeftRef = ref}
            tabs={tabsLeft}
            content={content}
            styles={{
              tabPanel: defaultHUDFullScreenStyle.hudFullScreen,
              tabs: defaultHUDFullScreenStyle.navigationContainer,
              tab: defaultHUDFullScreenStyle.navTab,
              activeTab: defaultHUDFullScreenStyle.activeNavTab,
              content: defaultHUDFullScreenStyle.contentContainer,
            }}
            onActiveTabChanged={this.onActiveTabChanged}
          />
          <TabPanel
            ref={ref => this.tabPanelRightRef = ref}
            tabs={tabsRight}
            content={content}
            styles={{
              tabPanel: defaultHUDFullScreenStyle.hudFullScreen,
              tabs: defaultHUDFullScreenStyle.navigationContainer,
              tab: defaultHUDFullScreenStyle.navTab,
              activeTab: defaultHUDFullScreenStyle.activeNavTab,
              content: defaultHUDFullScreenStyle.contentContainer,
            }}
            onActiveTabChanged={this.onActiveTabChanged}
          />
        </Container>
        <Close onClick={() => this.onCloseFullScreen()}>
          <i className='fa fa-times click-effect'></i>
        </Close>
      </div>
    );
  }

  public componentDidMount() {
    this.navigateListener = events.on('hudnav--navigate', this.handleNavigation);
    this.tabPanelRightRef.activeTabIndex = 1;
    client.OnOpenUI((name: string) => {
      // a VERY hacky way to close widget with ESC. focus() does not work
      // and window doesn't pick up keydown events unless window is focused.
      // will need to change this one day
      if (name === 'gamemenu' && (this.state.visibleComponentLeft !== '' || this.state.visibleComponentRight !== '')) {
        events.fire('hudnav--navigate', 'gamemenu');
        this.onCloseFullScreen();
      }
    });
  }

  public componentWillUnmount() {
    events.off(this.navigateListener);
  }

  private renderInventory = () => {
    return (
      <Inventory
        inventoryItems={this.state.inventoryItems}
        equippedItems={this.state.equippedItems}
        myTradeItems={this.state.myTradeItems}
        containerIdToDrawerInfo={this.state.containerIdToDrawerInfo}
        stackGroupIdToItemIDs={this.state.stackGroupIdToItemIDs}
        onChangeInventoryItems={this.onChangeInventoryItems}
        onChangeContainerIdToDrawerInfo={this.onChangeContainerIdToDrawerInfo}
        onChangeStackGroupIdToItemIDs={this.onChangeStackGroupIdToItemIDs}
        visibleComponent={this.state.visibleComponentRight}
        myTradeState={this.state.myTradeState}
      />
    );
  }

  private renderEquipped = () => {
    return (
      <PaperDoll
        inventoryItems={this.state.inventoryItems}
        equippedItems={this.state.equippedItems}
        onEquippedItemsChange={this.onChangeEquippedItems}
        visibleComponent={this.state.visibleComponentLeft}
        myTradeState={this.state.myTradeState}
      />
    );
  }

  private renderCharacterStats = () => {
    return (
      <CharacterInfo />
    );
  }

  private renderMap = (prop: { active: boolean }) => {
    return <Map />;
  }

  private renderTrade = () => {
    return (
      <TradeWindow
        isVisible={_.includes(this.state.visibleComponentLeft, 'trade') ||
          _.includes(this.state.visibleComponentRight, 'trade')}
        inventoryItems={this.state.inventoryItems}
        containerIdToDrawerInfo={this.state.containerIdToDrawerInfo}
        stackGroupIdToItemIDs={this.state.stackGroupIdToItemIDs}
        myTradeItems={this.state.myTradeItems}
        onMyTradeItemsChange={this.onMyTradeItemsChange}
        onCloseFullScreen={this.onCloseFullScreen}
        myTradeState={this.state.myTradeState}
        onMyTradeStateChange={this.onMyTradeStateChange}
      />
    );
  }

  private handleNavigation = (name: string, shouldOpen?: boolean) => {
    if (name === 'inventory' || name === 'equippedgear' || name === 'character') {
      if (_.includes(this.state.visibleComponentLeft, name) || _.includes(this.state.visibleComponentRight, name)) {
        this.onCloseFullScreen();
      } else {
        this.setActiveTabIndex(0, 'left');
        this.setActiveTabIndex(1, 'right');
        this.setVisibleComponent('equippedgear-left');
        this.setVisibleComponent('inventory-right');
      }
      return;
    }

    if (name === 'trade' && typeof shouldOpen === 'boolean') {
      if (shouldOpen) {
        this.setActiveTabIndex(1, 'right');
        this.setVisibleComponent('inventory-right');
        this.setActiveTabIndex(4, 'left');
        this.setVisibleComponent('trade-left');
      } else {
        this.onCloseFullScreen();
      }
      return;
    }

    switch (name) {
      case 'equippedgear-left': {
        this.setActiveTabIndex(0, 'left');
        this.setVisibleComponent(name);
        break;
      }
      case 'inventory-left': {
        this.setActiveTabIndex(1, 'left');
        this.setVisibleComponent(name);
        break;
      }
      case 'character-stats-left': {
        this.setActiveTabIndex(2, 'left');
        this.setVisibleComponent(name);
        break;
      }
      case 'map-left': {
        this.setActiveTabIndex(3, 'left');
        this.setVisibleComponent(name);
        break;
      }
      case 'trade-left': {
        this.setActiveTabIndex(4, 'left');
        this.setVisibleComponent(name);
        break;
      }
      // case 'social-left': {
      //   this.setActiveTabIndex(4, 'left');
      //   this.setVisibleComponent(name);
      //   break;
      // }

      case 'equippedgear-right': {
        this.setActiveTabIndex(0, 'right');
        this.setVisibleComponent(name);
        break;
      }
      case 'inventory-right': {
        this.setActiveTabIndex(1, 'right');
        this.setVisibleComponent(name);
        break;
      }
      case 'character-stats-right': {
        this.setActiveTabIndex(2, 'right');
        this.setVisibleComponent(name);
        break;
      }
      case 'map-right': {
        this.setActiveTabIndex(3, 'right');
        this.setVisibleComponent(name);
        break;
      }
      case 'trade-right': {
        this.setActiveTabIndex(4, 'right');
        this.setVisibleComponent(name);
        break;
      }
      // case 'social-right': {
      //   this.setActiveTabIndex(4, 'right');
      //   this.setVisibleComponent(name);
      //   break;
      // }
    }
  }

  private onActiveTabChanged = (tabIndex: number, name: string) => {
    events.fire('hudnav--navigate', name);
  }

  private setVisibleComponent = (name: string) => {
    const side = _.includes(name, 'right') ? 'right' : 'left';
    if (this.state.initial) {
      this.setState({ initial: false });
    }
    if (name !== '') {
      this.setState((state, props) => {
        if (side === 'right') {
          return {
            ...state,
            visibleComponentRight: name,
          };
        } else {
          return {
            ...state,
            visibleComponentLeft: name,
          };
        }
      });
    } else {
      if (name === '') {
        this.setState((state, props) => {
          return {
            ...state,
            visibleComponentRight: '',
            visibleComponentLeft: '',
          };
        });
        setTimeout(() => client.ReleaseInputOwnership(), 100);
      }
    }
  }

  private setActiveTabIndex = (tabIndex: number, side: 'left' | 'right') => {
    if (this.state.initial) {
      if (side === 'left') {
        setTimeout(() => this.tabPanelLeftRef.activeTabIndex = tabIndex, 10);
      } else {
        setTimeout(() => this.tabPanelRightRef.activeTabIndex = tabIndex, 10);
      }
    } else {
      if (side === 'left') {
        this.tabPanelLeftRef.activeTabIndex = tabIndex;
      } else {
        this.tabPanelRightRef.activeTabIndex = tabIndex;
      }
    }
  }

  private onCloseFullScreen = (visibleComp?: string) => {
    events.fire('hudnav--navigate', '');
    this.setVisibleComponent('');
  }

  private onChangeEquippedItems = (equippedItems: EquippedItemFragment[]) => {
    this.setState({ equippedItems });
  }

  private onChangeInventoryItems = (inventoryItems: InventoryItemFragment[]) => {
    this.setState({ inventoryItems });
  }

  private onChangeContainerIdToDrawerInfo = (containerIdToDrawerInfo: ContainerIdToDrawerInfo) => {
    this.setState({ containerIdToDrawerInfo });
  }

  private onChangeStackGroupIdToItemIDs = (stackGroupIdToItemIDs: {[id: string]: string[]}) => {
    this.setState({ stackGroupIdToItemIDs });
  }

  private onMyTradeItemsChange = (myTradeItems: InventoryItemFragment[]) => {
    this.setState({ myTradeItems });
  }

  private onMyTradeStateChange = (myTradeState: SecureTradeState) => {
    this.setState({ myTradeState });
  }
}

export default HUDFullScreen;
