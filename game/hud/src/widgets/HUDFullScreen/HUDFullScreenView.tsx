/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { TabPanel, ContentItem } from '@csegames/camelot-unchained';

import Tab from './components/Tab';
import Map from './components/Map';
import Inventory from './components/Inventory';
import PaperDoll from './components/PaperDoll';
import CharacterInfo from './components/CharacterInfo';
import TradeWindow from './components/TradeWindow';
import { ITemporaryTab } from './index';
import { HUDFullScreenTabData, FullScreenContext } from './lib/utils';
import {
  InventoryItem,
  GearSlotDefRef,
  EquippedItem,
  SecureTradeState,
} from 'gql/interfaces';
import { ContainerIdToDrawerInfo } from './components/ItemShared/InventoryBase';
import { SlotItemDefType } from './lib/itemInterfaces';

export interface HUDFullScreenStyle {
  hudFullScreen: string;
  navigationContainer: string;
  rightNavigationContainer: string;
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
  width: 100%;
  height: 100%;
  user-select: none;
  -webkit-user-select: none;
  z-index: 9998;
`;

const Divider = styled('div')`
  position: relative;
  height: 100%;
  width: 3px;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -16.5px;
    width: 37px;
    height: 82px;
    background: url(images/tabs/dragon-ornament-top.png);
    z-index: 11;
  }
  &:after {
    content: '';
    position: absolute;
    left: -5px;
    bottom: 0;
    width: 13px;
    height: 12px;
    background: url(images/tabs/dragon-ornament-bottom.png);
    z-index: 11;
  }
`;

const DividerMidSection = styled('div')`
  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -1px;
    margin: auto;
    width: 5px;
    background: url(images/tabs/divider-ornament-middle-base.png);
    z-index: 2;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -3px;
    margin: auto;
    width: 9px;
    height: 365px;
    background: url(images/tabs/divider-ornament-middle.png);
    z-index: 2;
  }
`;

const Close = styled('div')`
  position: fixed;
  top: 5px;
  right: 5px;
  width: 15px;
  height: 15px;
  background: url(images/inventory/close-button-grey.png) no-repeat;
  background-size: contain;
  cursor: pointer;
  user-select: none;
  z-index: 9999;
  &:hover: {
    -webkit-filter: drop-shadow(5px 5px 2px #ccc);
  }
  &:active: {
    -webkit-filter: drop-shadow(5px 5px 2px #fff);
  }
`;

const defaultHUDFullScreenStyle: HUDFullScreenStyle = {
  hudFullScreen: css`
    width: 50%;
    height: 100%;
  `,
  navigationContainer: css`
    position: relative;
    display: flex;
    align-items: center;
    height: 25px;
    width: 100%;
    background-color: #333333;
    z-index: 10;
    &:before {
      content: '""';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: url(images/tabs/tab-bg.png) no-repeat;
      background-size: 100% 100%;
      z-index: -1;
    }
  `,
  rightNavigationContainer: css`
    position: relative;
    display: flex;
    align-items: center;
    height: 25px;
    width: 100%;
    background-color: #333333;
    z-index: 10;
    padding-left: 5px;
    &:before {
      content: '""';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: url(images/tabs/tab-bg.png) no-repeat;
      background-size: 100% 100%;
      z-index: -1;
    },
  `,
  contentContainer: css`
    height: 100%;
    width: 100%;
  `,
  navTab: css`
    height: 100%;
    text-align: center;
    cursor: pointer;
  `,
  activeNavTab: css`
    height: 100%;
    text-align: center;
    cursor: pointer;
  `,
};

export interface Props {
  getLeftRef: (ref: TabPanel<HUDFullScreenTabData | ITemporaryTab>) => void;
  getRightRef: (ref: TabPanel<HUDFullScreenTabData | ITemporaryTab>) => void;
  onActiveTabChanged: (tabIndex: number, name: string) => void;
  onCloseFullScreen: () => void;

  onRightOrLeftItemAction: (item: InventoryItem.Fragment, action: (gearSlots: GearSlotDefRef.Fragment[]) => void) => void;
  showItemTooltip: (item: SlotItemDefType, event: MouseEvent) => void;
  hideItemTooltip: () => void;
  onChangeInventoryItems: (inventoryItems: InventoryItem.Fragment[]) => void;
  onChangeEquippedItems: (equippedItems: EquippedItem.Fragment[]) => void;
  onChangeMyTradeItems: (myTradeItems: InventoryItem.Fragment[]) => void;
  onChangeStackGroupIdToItemIDs: (stackGroupIdToItemIDs: {[id: string]: string[]}) => void;
  onChangeContainerIdToDrawerInfo: (containerIdToDrawerInfo: ContainerIdToDrawerInfo) => void;
  onChangeMyTradeState: (myTradeState: SecureTradeState) => void;
  onChangeInvBodyDimensions: (invBodyDimensions: { width: number; height: number; }) => void;
}

export interface State {
}

class HUDFullScreenView extends React.Component<Props, State> {
  private content: ContentItem[];
  constructor(props: Props) {
    super(props);
    this.content = [
      { name: 'Equipped Gear', content: { render: this.renderEquipped } },
      { name: 'Inventory', content: { render: this.renderInventory } },
      { name: 'CharacterStats', content: { render: this.renderCharacterStats } },
      { name: 'Map', content: { render: this.renderMap } },
      { name: 'Trade', content: { render: this.renderTrade } },
    ];
  }

  public render() {
    return (
      <FullScreenContext.Consumer>
        {(context) => {
          const { visibleComponentLeft, visibleComponentRight, tabsLeft, tabsRight } = context;
          const shouldShow = visibleComponentLeft !== '' || visibleComponentRight !== '';
          return (
            <Container style={{ visibility: shouldShow ? 'visible' : 'hidden' }}>
              <TabPanel
                ref={this.props.getLeftRef}
                tabs={tabsLeft}
                renderTab={this.renderTab}
                content={this.content}
                defaultTabIndex={0}
                styles={{
                  tabPanel: defaultHUDFullScreenStyle.hudFullScreen,
                  tabs: defaultHUDFullScreenStyle.navigationContainer,
                  tab: defaultHUDFullScreenStyle.navTab,
                  activeTab: defaultHUDFullScreenStyle.activeNavTab,
                  content: defaultHUDFullScreenStyle.contentContainer,
                }}
                onActiveTabChanged={this.props.onActiveTabChanged}
              />
              <Divider>
                <DividerMidSection />
              </Divider>
              <TabPanel
                ref={this.props.getRightRef}
                tabs={tabsRight}
                renderTab={this.renderTab}
                content={this.content}
                defaultTabIndex={1}
                styles={{
                  tabPanel: defaultHUDFullScreenStyle.hudFullScreen,
                  tabs: defaultHUDFullScreenStyle.rightNavigationContainer,
                  tab: defaultHUDFullScreenStyle.navTab,
                  activeTab: defaultHUDFullScreenStyle.activeNavTab,
                  content: defaultHUDFullScreenStyle.contentContainer,
                }}
                onActiveTabChanged={this.props.onActiveTabChanged}
              />
              <Close onClick={this.props.onCloseFullScreen} />
            </Container>
          );
        }}
      </FullScreenContext.Consumer>
    );
  }

  private renderTab = (tab: HUDFullScreenTabData, active: boolean) => {
    return (
      <Tab
        title={tab.title}
        active={active}
        temporary={tab.temporary}
        icon={tab.icon}
        onTemporaryTabClose={tab.onTemporaryTabClose}
      />
    );
  }

  private renderInventory = () => {
    return (
      <Inventory
        onRightOrLeftItemAction={this.props.onRightOrLeftItemAction}
        showItemTooltip={this.props.showItemTooltip}
        hideItemTooltip={this.props.hideItemTooltip}
        onChangeInventoryItems={this.props.onChangeInventoryItems}
        onChangeStackGroupIdToItemIDs={this.props.onChangeStackGroupIdToItemIDs}
        onChangeContainerIdToDrawerInfo={this.props.onChangeContainerIdToDrawerInfo}
        onChangeInvBodyDimensions={this.props.onChangeInvBodyDimensions}
      />
    );
  }

  private renderEquipped = () => {
    return (
      <PaperDoll onEquippedItemsChange={this.props.onChangeEquippedItems} />
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
        showItemTooltip={this.props.showItemTooltip}
        hideItemTooltip={this.props.hideItemTooltip}
        onMyTradeItemsChange={this.props.onChangeMyTradeItems}
        onCloseFullScreen={this.props.onCloseFullScreen}
        onMyTradeStateChange={this.props.onChangeMyTradeState}
      />
    );
  }
}

export default HUDFullScreenView;
