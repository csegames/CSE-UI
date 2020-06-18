/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React, { useContext } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { TabPanel, ContentItem } from 'cseshared/components/TabPanel';

import { CloseButton } from 'cseshared/components/CloseButton';
import Tab from '../shared/Tabs/Tab';
import { Map } from 'fullscreen/Map';
import Inventory from 'fullscreen/Inventory';
import PaperDoll from 'fullscreen/PaperDoll';
import CharacterInfo from 'fullscreen/CharacterInfo';
import TradeWindow from 'fullscreen/TradeWindow';
import Crafting from 'fullscreen/Crafting';
import AbilityBuilder from 'fullscreen/AbilityBuilder';
import { HUDFullScreenTabData, FullScreenContext, FullScreenNavState } from 'fullscreen/lib/utils';
import {
  InventoryItem,
  GearSlotDefRef,
  EquippedItem,
  SecureTradeState,
} from 'gql/interfaces';
import { SlotItemDefType } from 'fullscreen/lib/itemInterfaces';
import { AbilityBook } from './AbilityBook';
import { MID_SCALE, HD_SCALE } from './lib/constants';

export interface HUDFullScreenStyle {
  hudFullScreen: string;
  hudFullSingleScreen: string;
  navigationContainer: string;
  rightNavigationContainer: string;
  contentContainer: string;
  navTab: string;
  activeNavTab: string;
}

const Container = styled.div`
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

// #region Divider constants
const DIVIDER_WIDTH = 6;
const DIVIDER_ORNAMENT_TOP_LEFT = -33;
const DIVIDER_ORNAMENT_TOP_WIDTH = 74;
const DIVIDER_ORNAMENT_TOP_HEIGHT = 164;
const DIVIDER_ORNAMENT_BOTTOM_LEFT = -10;
const DIVIDER_ORNAMENT_BOTTOM_WIDTH = 26;
const DIVIDER_ORNAMENT_BOTTOM_HEIGHT = 24;
// #endregion
const Divider = styled.div`
  position: relative;
  height: 100%;
  width: ${DIVIDER_WIDTH}px;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: ${DIVIDER_ORNAMENT_TOP_LEFT}px;
    width: ${DIVIDER_ORNAMENT_TOP_WIDTH}px;
    height: ${DIVIDER_ORNAMENT_TOP_HEIGHT}px;
    background-image: url(../images/tabs/dragon-ornament-top.png);
    background-size: contain;
    z-index: 11;
  }
  &:after {
    content: '';
    position: absolute;
    left: ${DIVIDER_ORNAMENT_BOTTOM_LEFT}px;
    width: ${DIVIDER_ORNAMENT_BOTTOM_WIDTH}px;
    height: ${DIVIDER_ORNAMENT_BOTTOM_HEIGHT}px;
    bottom: 0;
    background-image: url(../images/tabs/dragon-ornament-bottom.png);
    background-size: contain;
    z-index: 11;
  }

  @media (max-width: 2560px) {
    width: ${DIVIDER_WIDTH * MID_SCALE}px;
    &:before {
      left: ${DIVIDER_ORNAMENT_TOP_LEFT * MID_SCALE}px;
      width: ${DIVIDER_ORNAMENT_TOP_WIDTH * MID_SCALE}px;
      height: ${DIVIDER_ORNAMENT_TOP_HEIGHT * MID_SCALE}px;
    }

    &:after {
      left: ${DIVIDER_ORNAMENT_BOTTOM_LEFT * MID_SCALE}px;
      width: ${DIVIDER_ORNAMENT_BOTTOM_WIDTH * MID_SCALE}px;
      height: ${DIVIDER_ORNAMENT_BOTTOM_HEIGHT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    width: ${DIVIDER_WIDTH * HD_SCALE}px;
    &:before {
      left: ${DIVIDER_ORNAMENT_TOP_LEFT * HD_SCALE}px;
      width: ${DIVIDER_ORNAMENT_TOP_WIDTH * HD_SCALE}px;
      height: ${DIVIDER_ORNAMENT_TOP_HEIGHT * HD_SCALE}px;
    }

    &:after {
      left: ${DIVIDER_ORNAMENT_BOTTOM_LEFT * HD_SCALE}px;
      width: ${DIVIDER_ORNAMENT_BOTTOM_WIDTH * HD_SCALE}px;
      height: ${DIVIDER_ORNAMENT_BOTTOM_HEIGHT * HD_SCALE}px;
    }
  }
`;

// #region DividerMidSection constants
const DIVIDER_MID_SECTION_ORNAMENT_BASE_LEFT = -2;
const DIVIDER_MID_SECTION_ORNAMENT_BASE_WIDTH = 10;

const DIVIDER_MID_SECTION_ORNAMENT_MIDDLE_LEFT = -6;
const DIVIDER_MID_SECTION_ORNAMENT_MIDDLE_WIDTH = 18;
const DIVIDER_MID_SECTION_ORNAMENT_MIDDLE_HEIGHT = 730;
// #endregion
const DividerMidSection = styled.div`
  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: ${DIVIDER_MID_SECTION_ORNAMENT_BASE_LEFT}px;
    width: ${DIVIDER_MID_SECTION_ORNAMENT_BASE_WIDTH}px;
    margin: auto;
    background: url(../images/tabs/divider-ornament-middle-base.png);
    z-index: 2;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: ${DIVIDER_MID_SECTION_ORNAMENT_MIDDLE_LEFT}px;
    width: ${DIVIDER_MID_SECTION_ORNAMENT_MIDDLE_WIDTH}px;
    height: ${DIVIDER_MID_SECTION_ORNAMENT_MIDDLE_HEIGHT}px;
    margin: auto;
    background: url(../images/tabs/divider-ornament-middle.png);
    z-index: 2;
  }

  @media (max-width: 2560px) {
    &:before {
      left: ${DIVIDER_MID_SECTION_ORNAMENT_BASE_LEFT * MID_SCALE}px;
      width: ${DIVIDER_MID_SECTION_ORNAMENT_BASE_WIDTH * MID_SCALE}px;
    }

    &:after {
      left: ${DIVIDER_MID_SECTION_ORNAMENT_MIDDLE_LEFT * MID_SCALE}px;
      width: ${DIVIDER_MID_SECTION_ORNAMENT_MIDDLE_WIDTH * MID_SCALE}px;
      height: ${DIVIDER_MID_SECTION_ORNAMENT_MIDDLE_HEIGHT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    &:before {
      left: ${DIVIDER_MID_SECTION_ORNAMENT_BASE_LEFT * HD_SCALE}px;
      width: ${DIVIDER_MID_SECTION_ORNAMENT_BASE_WIDTH * HD_SCALE}px;
    }

    &:after {
      left: ${DIVIDER_MID_SECTION_ORNAMENT_MIDDLE_LEFT * HD_SCALE}px;
      width: ${DIVIDER_MID_SECTION_ORNAMENT_MIDDLE_WIDTH * HD_SCALE}px;
      height: ${DIVIDER_MID_SECTION_ORNAMENT_MIDDLE_HEIGHT * HD_SCALE}px;
    }
  }
`;

// #region CloseButtonClass constants
const CLOSE_BUTTON_CLASS_TOP = 10;
const CLOSE_BUTTON_CLASS_RIGHT = 10;
// #endregion
const CloseButtonClass = css`
  position: absolute;
  top: ${CLOSE_BUTTON_CLASS_TOP}px;
  right: ${CLOSE_BUTTON_CLASS_RIGHT}px;

  @media (max-width: 2560px) {
    top: ${CLOSE_BUTTON_CLASS_TOP * MID_SCALE}px;
    right: ${CLOSE_BUTTON_CLASS_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${CLOSE_BUTTON_CLASS_TOP * HD_SCALE}px;
    right: ${CLOSE_BUTTON_CLASS_RIGHT * HD_SCALE}px;
  }
`;

// #region NavigationContainer constants
const NAVIGATION_CONTAINER_HEIGHT = 50;
// #endregion
const defaultHUDFullScreenStyle: HUDFullScreenStyle = {
  hudFullScreen: css`
    width: 50%;
    height: 100%;
  `,
  hudFullSingleScreen: css`
    width: 100%;
    height: 100%;
  `,
  navigationContainer: css`
    position: relative;
    display: flex;
    align-items: center;
    height: ${NAVIGATION_CONTAINER_HEIGHT}px;
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
      background: url(../images/tabs/tab-bg.png) no-repeat;
      background-size: 100% 100%;
      z-index: -1;
    }

    @media (max-width: 2560px) {
      height: ${NAVIGATION_CONTAINER_HEIGHT * MID_SCALE}px;
    }

    @media (max-width: 1920px) {
      height: ${NAVIGATION_CONTAINER_HEIGHT * HD_SCALE}px;
    }
  `,
  rightNavigationContainer: css`
    position: relative;
    display: flex;
    align-items: center;
    height: ${NAVIGATION_CONTAINER_HEIGHT}px;
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
      background: url(../images/tabs/tab-bg.png) no-repeat;
      background-size: 100% 100%;
      z-index: -1;
    }

    @media (max-width: 2560px) {
      height: ${NAVIGATION_CONTAINER_HEIGHT * MID_SCALE}px;
    }

    @media (max-width: 1920px) {
      height: ${NAVIGATION_CONTAINER_HEIGHT * HD_SCALE}px;
    }
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

interface InjectedProps {
  fullScreenContext: FullScreenNavState;
}

export interface Props {
  shouldSmallScreen: boolean;
  rightActiveTabIndex: number;
  leftActiveTabIndex: number;
  onActiveTabChanged: (tabIndex: number, name: string) => void;
  onCloseFullScreen: () => void;

  onRightOrLeftItemAction: (item: InventoryItem.Fragment, action: (gearSlots: GearSlotDefRef.Fragment[]) => void) => void;
  showItemTooltip: (item: SlotItemDefType, event: MouseEvent) => void;
  hideItemTooltip: () => void;
  onChangeEquippedItems: (equippedItems: EquippedItem.Fragment[]) => void;
  onReadiedWeaponsChange: (slotIDs: string[]) => void;
  onChangeMyTradeItems: (myTradeItems: InventoryItem.Fragment[]) => void;
  onChangeMyTradeState: (myTradeState: SecureTradeState) => void;
  onChangeInvBodyDimensions: (invBodyDimensions: { width: number; height: number; }) => void;
}

class HUDFullScreenViewWithInjectedProps extends React.Component<Props & InjectedProps> {
  private content: ContentItem[];
  constructor(props: Props & InjectedProps) {
    super(props);
    this.content = [
      { name: 'Equipped Gear', content: { render: this.renderEquipped } },
      { name: 'Inventory', content: { render: this.renderInventory } },
      { name: 'CharacterStats', content: { render: this.renderCharacterStats } },
      { name: 'Map', content: { render: this.renderMap } },
      { name: 'Trade', content: { render: this.renderTrade } },
      { name: 'Crafting', content: { render: this.renderCrafting } },
      { name: 'AbilityBuilder', content: { render: this.renderAbilityBuilder } },
      { name: 'AbilityBook', content: { render: this.renderAbilityBook } },
    ];
  }

  public render() {
    const { visibleComponentLeft, visibleComponentRight, tabsLeft, tabsRight } = this.props.fullScreenContext;
    const shouldShow = visibleComponentLeft !== '' || visibleComponentRight !== '';
    const shouldShowSingleScreen = this.props.shouldSmallScreen;
    return (
      <Container style={{ visibility: shouldShow ? 'visible' : 'hidden' }}>
        <TabPanel
          activeTabIndex={this.props.leftActiveTabIndex}
          tabs={tabsLeft}
          renderTab={this.renderTab}
          content={this.content}
          defaultTabIndex={0}
          styles={{
            tabPanel: shouldShowSingleScreen ?
              defaultHUDFullScreenStyle.hudFullSingleScreen : defaultHUDFullScreenStyle.hudFullScreen,
            tabs: defaultHUDFullScreenStyle.navigationContainer,
            tab: defaultHUDFullScreenStyle.navTab,
            activeTab: defaultHUDFullScreenStyle.activeNavTab,
            content: defaultHUDFullScreenStyle.contentContainer,
          }}
          onActiveTabChanged={this.props.onActiveTabChanged}
        />
        {!shouldShowSingleScreen &&
          <Divider>
            <DividerMidSection />
          </Divider>
        }
        {!shouldShowSingleScreen &&
          <TabPanel
            activeTabIndex={this.props.rightActiveTabIndex}
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
        }
        <CloseButton className={CloseButtonClass} onClick={this.props.onCloseFullScreen} />
      </Container>
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
        onChangeInvBodyDimensions={this.props.onChangeInvBodyDimensions}
      />
    );
  }

  private renderEquipped = (props: any) => {
    return (
      <PaperDoll
        onEquippedItemsChange={this.props.onChangeEquippedItems}
        onReadiedWeaponsChange={this.props.onReadiedWeaponsChange}
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
        showItemTooltip={this.props.showItemTooltip}
        hideItemTooltip={this.props.hideItemTooltip}
        onMyTradeItemsChange={this.props.onChangeMyTradeItems}
        onCloseFullScreen={this.props.onCloseFullScreen}
        onMyTradeStateChange={this.props.onChangeMyTradeState}
      />
    );
  }

  private renderCrafting = () => {
    return (
      <Crafting />
    );
  }

  private renderAbilityBuilder = () => {
    return (
      <AbilityBuilder />
    );
  }

  private renderAbilityBook = () => {
    return <AbilityBook />;
  }
}

export function HUDFullScreenView(props: Props) {
  const fullScreenContext = useContext(FullScreenContext);

  return (
    <HUDFullScreenViewWithInjectedProps {...props} fullScreenContext={fullScreenContext} />
  );
}
