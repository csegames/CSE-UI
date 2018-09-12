/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';
import { TabItem } from '@csegames/camelot-unchained';
import { showTooltip, hideTooltip } from 'actions/tooltips';
import { hideContextMenu } from 'actions/contextMenu';

import HudFullScreenView from './HUDFullScreenView';
import InventoryContextProvider from './components/ItemShared/InventoryContext';
import {
  InventoryItem,
  GearSlotDefRef,
  EquippedItem,
  SecureTradeState,
} from 'gql/interfaces';
import { SlotItemDefType, SlotType } from './lib/itemInterfaces';
import ItemTooltipContent, { defaultTooltipStyle } from './components/Tooltip';
import {
  FullScreenNavState,
  FullScreenContext,
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

const TRADE_TAB = {
  name: 'trade-left',
  tab: {
    title: 'Trade',
    temporary: true,
  },
  rendersContent: 'Trade',
};

const CRAFTING_TAB = {
  name: 'crafting-left',
  tab: {
    title: 'Crafting',
    temporary: true,
  },
  rendersContent: 'Crafting',
};

const BackgroundImage = styled.div`
  position: absolute;
  width: 50%;
  height: 100%;
  z-index: 99;
  background: url(../images/inventory/bag-bg.png) repeat-x, black;
  background-size: cover;
  &.left {
    top: 0;
    left: 0;
    bottom: 0;
  }
  &.right {
    top: 0;
    left: 50%;
    bottom: 0;
    box-shadow: inset 0px -100px 120px rgba(0, 0, 0, 0.8);
  }
`;

class HUDFullScreen extends React.Component<FullScreenNavProps, FullScreenNavState> {
  private navigateListener: EventHandle;

  constructor(props: any) {
    super(props);
    this.state = { ...defaultFullScreenState };
  }

  public render() {
    const { visibleComponentLeft, visibleComponentRight } = this.state;
    const leftActiveTabIndex = this.getTabIndex(visibleComponentLeft);
    const rightActiveTabIndex = this.getTabIndex(visibleComponentRight);
    return (
      <FullScreenContext.Provider value={this.state}>
        <InventoryContextProvider
          visibleComponentLeft={visibleComponentLeft}
          visibleComponentRight={visibleComponentRight}>
            <div
              data-input-group='block'
              style={visibleComponentLeft === '' && visibleComponentRight === '' ? { visibility: 'hidden' } : {}}>
              <BackgroundImage className={'left'} />
              <BackgroundImage className={'right'} />
              <HudFullScreenView
                leftActiveTabIndex={leftActiveTabIndex}
                rightActiveTabIndex={rightActiveTabIndex}
                onActiveTabChanged={(i, name) => this.handleTabChange(name)}
                onRightOrLeftItemAction={this.onRightOrLeftItemAction}
                showItemTooltip={this.showItemTooltip}
                hideItemTooltip={this.hideItemTooltip}
                onCloseFullScreen={this.onCloseFullScreen}
                onChangeEquippedItems={this.onChangeEquippedItems}
                onChangeMyTradeItems={this.onChangeMyTradeItems}
                onChangeMyTradeState={this.onChangeMyTradeState}
                onChangeInvBodyDimensions={this.onChangeInvBodyDimensions}
              />
            </div>
        </InventoryContextProvider>
      </FullScreenContext.Provider>
    );
  }

  public componentDidMount() {
    this.navigateListener = game.on('navigate', this.handleNavEvent);
  }

  public componentWillUnmount() {
    this.navigateListener.clear();
  }

  private handleNavEvent = (name: string, shouldOpen?: boolean) => {
    switch (name) {
      case 'inventory': {
        if (this.isAlreadyOpen(name)) {
          this.onCloseFullScreen();
        } else {
          this.setActiveTabs('equippedgear-left', 'inventory-right');
        }
        break;
      }

      case 'character':
      case 'equippedgear': {
        if (this.isAlreadyOpen(name)) {
          this.onCloseFullScreen();
        } else {
          this.setActiveTabs('equippedgear-left', 'character-stats-right');
        }
        break;
      }

      case 'map': {
        if (this.isAlreadyOpen(name)) {
          this.onCloseFullScreen();
        } else {
          this.setActiveTabs('map-left', 'inventory-right');
        }
        break;
      }

      case 'trade': {
        if (typeof shouldOpen === 'boolean') {
          if (shouldOpen) {
            this.handleTemporaryTab({
              tab: {
                ...TRADE_TAB,
                tab: {
                  ...TRADE_TAB.tab,
                  onTemporaryTabClose: () => this.onCloseFullScreen(),
                },
              },
              side: 'left',
              shouldOpen,
              otherTabName: 'inventory-right',
            });
          } else {
            this.handleTemporaryTab({
              tab: TRADE_TAB as any,
              side: 'left',
              shouldOpen: false,
            });
            this.onCloseFullScreen();
          }
          break;
        }
      }

      case 'crafting': {
        if (_.findIndex(this.state.tabsLeft, tab => tab.name === 'crafting-left') === -1) {
          this.handleTemporaryTab({
            tab: {
              ...CRAFTING_TAB,
              tab: {
                ...CRAFTING_TAB.tab,
                onTemporaryTabClose: () => this.onCloseFullScreen(),
              },
            },
            side: 'left',
            shouldOpen: true,
            otherTabName: 'inventory-right',
          });
        } else {
          this.handleTemporaryTab({
            tab: CRAFTING_TAB as any,
            side: 'left',
            shouldOpen: false,
          });
        }
        break;
      }

      default: {
        this.handleTabChange(name);
        break;
      }
    }
  }

  private handleTabChange = (name: string) => {
    // We do this to validate that no two windows are open at the same time
    const { tabsRight, tabsLeft, visibleComponentLeft, visibleComponentRight } = this.state;
    const side = _.includes(name, 'right') ? 'right' : 'left';

    const leftTabIndex = this.getTabIndex(visibleComponentLeft);
    const rightTabIndex = this.getTabIndex(visibleComponentRight);
    const tabs = side === 'right' ? tabsRight : tabsLeft;
    const otherTabs = side === 'right' ? tabsLeft : tabsRight;
    const nextTabIndex = _.findIndex(tabs, tab => tab.name === name);
    const prevTabIndex = side === 'right' ? rightTabIndex : leftTabIndex;
    const otherActiveIndex = side === 'right' ? leftTabIndex : rightTabIndex;

    if (nextTabIndex !== -1) {
      if (nextTabIndex === otherActiveIndex) {
        // Swap windows
        const otherPrevWindowIndex = _.findIndex(otherTabs, (tab) => {
          return this.normalizeName(tab.name) === this.normalizeName(tabs[prevTabIndex].name);
        });
        if (otherPrevWindowIndex !== -1) {
          this.setActiveTabs(name, otherTabs[otherPrevWindowIndex].name);
        }
      } else {
        this.setActiveTabs(name);
      }
    }
  }

  private setActiveTabs = (firstTab: string, secondTab?: string) => {
    let tabsState = {
      ...this.setActiveTab(firstTab),
    };

    if (secondTab) {
      tabsState = {
        ...tabsState,
        ...this.setActiveTab(secondTab),
      };
    }

    this.setState(tabsState as any);
  }

  private setActiveTab = (name: string) => {
    const side = _.includes(name, 'right') ? 'right' : 'left';
    const visibleComponent = side === 'right' ? this.state.visibleComponentRight : this.state.visibleComponentLeft;

    if (name !== '' && !_.includes(visibleComponent, name)) {
      if (side === 'right') {
        return {
          visibleComponentRight: name,
        };
      } else {
        return {
          visibleComponentLeft: name,
        };
      }
    } else {
      if (name === '') {
        return {
          visibleComponentRight: '',
          visibleComponentLeft: '',
        };
      }
    }
  }

  private handleTemporaryTab = (args: {
    tab: ITemporaryTab,
    side: 'left' | 'right',
    shouldOpen: boolean,
    otherTabName?: string,
    fullClose?: boolean,
  }) => {
    const { tab, side, shouldOpen, otherTabName, fullClose } = args;
    if (side === 'left') {
      let tabsLeft = [...this.state.tabsLeft];
      if (shouldOpen) {
        // Only add temporary tab if there is no temporary tab existing
        if (_.findIndex(tabsLeft, tabInfo => tabInfo.name === tab.name) === -1) {
          tabsLeft.push(tab);
          this.setTabsLeft(tabsLeft).then(() =>
            this.setActiveTabs(tab.name, otherTabName));
          return;
        }
      } else {
        tabsLeft = _.filter(tabsLeft, tabInfo => tabInfo.name !== tab.name);
        setTimeout(() => this.setTabsLeft(tabsLeft), 50);
        if (!fullClose) {
          this.setActiveTabs('equipped-left', otherTabName);
        }
      }

      return;
    }

    if (side === 'right') {
      let tabsRight = [...this.state.tabsRight];
      if (shouldOpen) {
        // Only add temporary tab if there is no temporary tab existing
        if (_.findIndex(tabsRight, tabInfo => tabInfo.name === tab.name) === -1) {
          tabsRight.push(tab);
          this.setTabsRight(tabsRight).then(() => this.setActiveTabs(tab.name));
        }
      } else {
        tabsRight = _.filter(tabsRight, tabInfo => tabInfo.name !== tab.name);
        setTimeout(() => this.setTabsRight(tabsRight), 50);
        if (!fullClose) {
          this.setActiveTabs('equipped-right');
        }
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
    game.trigger('navigate', '');
    this.setActiveTabs('');
    hideTooltip();
    hideContextMenu();

    if (this.state.myTradeState !== 'Confirmed' && this.state.myTradeState !== 'None') {
      game.trigger('cancel-trade');
    }

    if (this.temporaryTabsInclude('crafting')) {
      this.handleTemporaryTab({
        tab: CRAFTING_TAB as any,
        side: 'left',
        shouldOpen: false,
        fullClose: true,
      });
    }
  }

  private temporaryTabsInclude = (name: string) => {
    const { tabsLeft, tabsRight } = this.state;
    return _.find(tabsLeft, tab => _.includes(tab.name, name)) || _.find(tabsRight, tab => _.includes(tab.name, name));
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

    const content = <ItemTooltipContent
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

  private hideItemTooltip = () => {
    hideTooltip();
  }

  private onChangeEquippedItems = (equippedItems: EquippedItem.Fragment[]) => {
    this.setState({ equippedItems });
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
