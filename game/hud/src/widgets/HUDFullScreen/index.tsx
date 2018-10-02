/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { TabPanel, TabItem } from '@csegames/camelot-unchained';
import { showTooltip, hideTooltip } from 'actions/tooltips';

import HudFullScreenView from './HUDFullScreenView';
import { ContainerIdToDrawerInfo } from './components/ItemShared/InventoryBase';
import {
  InventoryItem,
  GearSlotDefRef,
  EquippedItem,
  SecureTradeState,
} from 'gql/interfaces';
import { SlotItemDefType, SlotType } from './lib/itemInterfaces';
import TooltipContent, { defaultTooltipStyle } from './components/Tooltip';
import {
  FullScreenNavState,
  FullScreenContext,
  HUDFullScreenTabData,
  defaultFullScreenState,
  isRightOrLeftItem,
} from './lib/utils';

/* tslint:disable:interface-name */
export interface ITemporaryTab {
  name: string;
  tab: {
    title: string;
    [key: string]: any;
    temporary: boolean;
    onTemporaryTabClose: () => void;
  };
  rendersContent: string;
}

export interface FullScreenNavProps {
}

const BackgroundImage = styled('div')`
  position: absolute;
  width: 50%;
  height: 100%;
  z-index: 99;
  box-shadow: inset 0px -100px 120px rgba(0, 0, 0, 0.8);
  background: url(images/inventory/bag-bg.png) repeat-x, linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  &.left {
    top: 0;
    left: 0;
    bottom: 0;
  }
  &.right {
    top: 0;
    left: 50%;
    bottom: 0;
  }
`;

class HUDFullScreen extends React.Component<FullScreenNavProps, FullScreenNavState> {
  private navigateListener: EventHandle;
  private shouldKeydownListener: EventHandle;
  private tabPanelLeftRef: TabPanel<ITemporaryTab | HUDFullScreenTabData>;
  private tabPanelRightRef: TabPanel<ITemporaryTab | HUDFullScreenTabData>;

  constructor(props: any) {
    super(props);
    this.state = { ...defaultFullScreenState };
  }

  public render() {
    const { visibleComponentLeft, visibleComponentRight } = this.state;
    return (
      <FullScreenContext.Provider value={this.state}>
        <div
          style={visibleComponentLeft === '' && visibleComponentRight === '' ? { visibility: 'hidden' } : {}}>
          <BackgroundImage className={'left'} />
          <BackgroundImage className={'right'} />
          <HudFullScreenView
            getLeftRef={r => this.tabPanelLeftRef = r}
            getRightRef={r => this.tabPanelRightRef = r}
            onActiveTabChanged={(i, name) => this.handleTabChange(name)}
            onRightOrLeftItemAction={this.onRightOrLeftItemAction}
            showItemTooltip={this.showItemTooltip}
            hideItemTooltip={this.hideItemTooltip}
            onCloseFullScreen={this.onCloseFullScreen}
            onChangeInventoryItems={this.onChangeInventoryItems}
            onChangeEquippedItems={this.onChangeEquippedItems}
            onChangeMyTradeItems={this.onChangeMyTradeItems}
            onChangeContainerIdToDrawerInfo={this.onChangeContainerIdToDrawerInfo}
            onChangeStackGroupIdToItemIDs={this.onChangeStackGroupIdToItemIDs}
            onChangeMyTradeState={this.onChangeMyTradeState}
            onChangeInvBodyDimensions={this.onChangeInvBodyDimensions}
          />
        </div>
      </FullScreenContext.Provider>
    );
  }

  public componentDidMount() {
    this.navigateListener = game.on('hudnav--navigate', this.handleNavEvent);
    this.shouldKeydownListener = game.on('hudfullscreen-shouldListenKeydown', this.handleShouldKeydownEvent);
  }

  public componentDidUpdate(prevProps: FullScreenNavProps, prevState: FullScreenNavState) {
    if ((prevState.visibleComponentLeft === '' && this.state.visibleComponentLeft !== '') ||
        (prevState.visibleComponentRight === '' && this.state.visibleComponentRight !== '')) {
      window.addEventListener('keydown', this.handleKeydownEvent);
    }
  }

  public componentWillUnmount() {
    game.off(this.navigateListener);
    game.off(this.shouldKeydownListener);
  }

  private handleKeydownEvent = (e: KeyboardEvent) => {
    switch (e.key.toUpperCase()) {
      case 'ESCAPE': {
        // Close full screen UI
        this.onCloseFullScreen();
        break;
      }
      case 'I': {
        // Open/Close inventory
        game.trigger('hudnav--navigate', 'inventory');
        break;
      }
      case 'C': {
        // Open/Close paperdoll
        game.trigger('hudnav--navigate', 'equippedgear');
        break;
      }
      case 'M': {
        // Open/Close map
        game.trigger('hudnav--navigate', 'map');
        break;
      }
      default: break;
    }
  }

  private handleShouldKeydownEvent = (shouldListen: boolean) => {
    if (shouldListen) {
      window.addEventListener('keydown', this.handleKeydownEvent);
    } else {
      window.removeEventListener('keydown', this.handleKeydownEvent);
    }
  }

  private handleNavEvent = (name: string, shouldOpen?: boolean) => {
    switch (name) {
      case 'inventory': {
        if (this.isAlreadyOpen(name)) {
          this.onCloseFullScreen();
        } else {
          this.setActiveTab('equippedgear-left');
          this.setActiveTab('inventory-right');
        }
        break;
      }

      case 'character':
      case 'equippedgear': {
        if (this.isAlreadyOpen(name)) {
          this.onCloseFullScreen();
        } else {
          this.setActiveTab('equippedgear-left');
          this.setActiveTab('character-stats-right');
        }
        break;
      }

      case 'map': {
        if (this.isAlreadyOpen(name)) {
          this.onCloseFullScreen();
        } else {
          this.setActiveTab('map-left');
          this.setActiveTab('inventory-right');
        }
        break;
      }

      case 'trade': {
        if (typeof shouldOpen === 'boolean') {
          const tradeTab = {
            name: 'trade-left',
            tab: {
              title: 'Trade',
              temporary: true,
            },
            rendersContent: 'Trade',
          };
          if (shouldOpen) {
            this.setActiveTab('inventory-right');
            this.handleTemporaryTab({
              ...tradeTab,
              tab: {
                ...tradeTab.tab,
                onTemporaryTabClose: () => this.onCloseFullScreen(),
              },
            }, 'left', shouldOpen);
          } else {
            this.handleTemporaryTab(tradeTab as any, 'left', false);
            this.onCloseFullScreen();
          }
          break;
        }
      }

      default: {
        this.handleTabChange(name);
        break;
      }
    }
  }

  private handleTabChange = (name: string) => {
    // We do this to validate that no two windows are open at the same time
    const { tabsRight, tabsLeft } = this.state;
    const side = _.includes(name, 'right') ? 'right' : 'left';
    if ((side === 'right' && !this.tabPanelRightRef) || (side === 'left' && !this.tabPanelLeftRef)) {
      return;
    }

    const tabs = side === 'right' ? tabsRight : tabsLeft;
    const otherTabs = side === 'right' ? tabsLeft : tabsRight;
    const nextTabIndex = _.findIndex(tabs, tab => tab.name === name);
    const prevTabIndex = side === 'right' ? this.tabPanelRightRef.activeTabIndex :
      this.tabPanelLeftRef.activeTabIndex;
    const otherActiveIndex = side === 'right' ? this.tabPanelLeftRef.activeTabIndex :
      this.tabPanelRightRef.activeTabIndex;

    if (nextTabIndex !== -1) {
      if (nextTabIndex === otherActiveIndex) {
        // Swap windows
        const otherPrevWindowIndex = _.findIndex(otherTabs, (tab) => {
          return this.normalizeName(tab.name) === this.normalizeName(tabs[prevTabIndex].name);
        });
        if (otherPrevWindowIndex !== -1) {
          this.setActiveTab(name);
          this.setActiveTab(otherTabs[otherPrevWindowIndex].name);
        }
      }
      this.setActiveTab(name);
    }
  }

  private setActiveTab = (name: string) => {
    const side = _.includes(name, 'right') ? 'right' : 'left';
    const visibleComponent = side === 'right' ? this.state.visibleComponentRight : this.state.visibleComponentLeft;
    const tabIndex = this.getTabIndex(name);

    if (name !== '' && !_.includes(visibleComponent, name)) {
      window.addEventListener('keydown', this.handleKeydownEvent);
      this.setState((state, props) => {
        if (side === 'right') {
          this.tabPanelRightRef.activeTabIndex = tabIndex;
          return {
            ...state,
            visibleComponentRight: name,

          };
        } else {
          this.tabPanelLeftRef.activeTabIndex = tabIndex;
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
      }
    }
  }

  private handleTemporaryTab = (tab: ITemporaryTab, side: 'left' | 'right', shouldOpen: boolean) => {
    if (side === 'left') {
      let tabsLeft = [...this.state.tabsLeft];
      if (shouldOpen) {
        // Only add temporary tab if there is no temporary tab existing
        if (_.findIndex(tabsLeft, tabInfo => tabInfo.name === tab.name) === -1) {
          tabsLeft.push(tab);
          this.setTabsLeft(tabsLeft).then(() => this.setActiveTab(tab.name));
          return;
        }
      } else {
        tabsLeft = _.filter(tabsLeft, tabInfo => tabInfo.name !== tab.name);
        this.setActiveTab('equipped-left');
        setTimeout(() => this.setTabsLeft(tabsLeft), 50);
      }

      return;
    }

    if (side === 'right') {
      let tabsRight = [...this.state.tabsRight];
      if (shouldOpen) {
        // Only add temporary tab if there is no temporary tab existing
        if (_.findIndex(tabsRight, tabInfo => tabInfo.name === tab.name) === -1) {
          tabsRight.push(tab);
          this.setTabsRight(tabsRight).then(() => this.setActiveTab(tab.name));
        }
      } else {
        tabsRight = _.filter(tabsRight, tabInfo => tabInfo.name !== tab.name);
        this.setActiveTab('equipped-right');
        setTimeout(() => this.setTabsRight(tabsRight), 50);
      }
      return;
    }
  }

  private setTabsLeft = async (newTabsLeft: TabItem<any>[]) => {
    return await new Promise(resolve => this.setState({ tabsLeft: newTabsLeft }, () => resolve()));
  }

  private setTabsRight = async (newTabsRight: TabItem<any>[]) => {
    return await new Promise(resolve => this.setState({ tabsRight: newTabsRight }, () => resolve()));
  }

  private normalizeName = (name: string) => {
    let newName = name;
    if (_.includes(name, 'right')) {
      newName = name.replace('-right', '');
    }

    if (_.includes(name, 'left')) {
      newName = name.replace('-left', '');
    }

    return newName;
  }

  private onCloseFullScreen = () => {
    game.trigger('hudnav--navigate', '');
    this.setActiveTab('');
    window.removeEventListener('keydown', this.handleKeydownEvent);
    hideTooltip();

    if (this.state.myTradeState !== 'Confirmed' && this.state.myTradeState !== 'None') {
      game.trigger('cancel-trade');
    }
  }

  private isAlreadyOpen = (name: string) => {
    const { visibleComponentLeft, visibleComponentRight } = this.state;
    return _.includes(visibleComponentLeft, name) || _.includes(visibleComponentRight, name);
  }

  private onRightOrLeftItemAction = (
    item: InventoryItem.Fragment,
    action: (gearSlots: GearSlotDefRef.Fragment[]) => void) => {
    const { gearSlotSets } = item.staticDefinition;
    if (gearSlotSets) {
      // Dealing with a right or left weapon/piece of armor
      const equippedItemFirstSlot = _.find(this.state.equippedItems, (item) => {
        return item.gearSlots && isRightOrLeftItem(item.gearSlots) &&
          gearSlotSets[0].gearSlots[0].id === item.gearSlots[0].id;
      });
      const equippedItemSecondSlot = _.find(this.state.equippedItems, (item) => {
        return item.gearSlots && isRightOrLeftItem(item.gearSlots) &&
          gearSlotSets[1] && gearSlotSets[1].gearSlots[0].id === item.gearSlots[0].id;
      });

      if (gearSlotSets.length === 2 &&
        equippedItemFirstSlot && !equippedItemSecondSlot && !_.isEqual(equippedItemFirstSlot, equippedItemSecondSlot)) {
        action(gearSlotSets[1].gearSlots);
        return;
      } else {
        action(gearSlotSets[0].gearSlots);
        return;
      }
    }
  }

  private showItemTooltip = (item: SlotItemDefType, event: MouseEvent) => {
    let instructions = 'Right click item for more actions';
    if (item.item && item.item.staticDefinition && item.item.staticDefinition.gearSlotSets.length > 0) {
      instructions = 'Double click to equip | Right click item for more actions';
    } else if (item.slotType === SlotType.CraftingContainer || item.slotType === SlotType.Container) {
      instructions = 'Left click to open container | Right click item for more actions';
    }

    const content = <TooltipContent
      item={item.item || (item.stackedItems && item.stackedItems[0])}
      slotType={item.slotType}
      stackedItems={item.stackedItems}
      equippedItems={this.state.equippedItems}
      instructions={instructions}
    />;
    showTooltip({ content, event, styles: defaultTooltipStyle, shouldAnimate: true });
  }

  private getTabIndex = (tabName: string) => {
    const side = _.includes(tabName, 'right') ? 'right' : 'left';
    let tabIndex: number = 0;
    if (side === 'right') {
      tabIndex = _.findIndex(this.state.tabsRight, tab => tab.name === tabName);
    }

    if (side === 'left') {
      tabIndex = _.findIndex(this.state.tabsLeft, tab => tab.name === tabName);
    }

    return tabIndex === -1 ? 0 : tabIndex;
  }

  private isVisible = () => {
    return this.state.visibleComponentLeft !== '' || this.state.visibleComponentRight !== '';
  }

  private hideItemTooltip = () => {
    hideTooltip();
  }

  private onChangeEquippedItems = (equippedItems: EquippedItem.Fragment[]) => {
    this.setState({ equippedItems });
  }

  private onChangeInventoryItems = (inventoryItems: InventoryItem.Fragment[]) => {
    if (this.isVisible()) {
      this.setState({ inventoryItems });
    }
  }

  private onChangeContainerIdToDrawerInfo = (containerIdToDrawerInfo: ContainerIdToDrawerInfo) => {
    if (this.isVisible()) {
      this.setState({ containerIdToDrawerInfo });
    }
  }

  private onChangeStackGroupIdToItemIDs = (stackGroupIdToItemIDs: {[id: string]: string[]}) => {
    if (this.isVisible()) {
      this.setState({ stackGroupIdToItemIDs });
    }
  }

  private onChangeMyTradeItems = (myTradeItems: InventoryItem.Fragment[]) => {
    this.setState({ myTradeItems });
  }

  private onChangeMyTradeState = (myTradeState: SecureTradeState) => {
    this.setState({ myTradeState });
  }

  private onChangeInvBodyDimensions = (invBodyDimensions: { width: number; height: number; }) => {
    this.setState({ invBodyDimensions });
  }
}

export default HUDFullScreen;
