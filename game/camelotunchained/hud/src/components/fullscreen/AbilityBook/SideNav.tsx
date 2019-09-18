/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { Routes } from 'services/session/AbilityBookState';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_WIDTH = 170;
// #endregion
const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${CONTAINER_WIDTH}px;
  height: 100%;
  background: linear-gradient(to right, transparent, black), url(../images/abilitybook/uhd/nav-grey-bg.jpg);
  z-index: 1;

  @media (max-width: 2560px) {
    width: ${CONTAINER_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${CONTAINER_WIDTH * HD_SCALE}px;
    background: linear-gradient(to right, transparent, black), url(../images/abilitybook/hd/nav-grey-bg.jpg);
  }
`;

// #region Tab constants
const TAB_HEIGHT = 170;
const TAB_HIGHLIGHT_TOP = -14;
const TAB_HIGHLIGHT_BOTTOM = -10;
const TAB_HIGHLIGHT_RIGHT = -10;
const TAB_HIGHLIGHT_WIDTH = 144;
// #endregion
const Tab = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${TAB_HEIGHT}px;
  cursor: pointer;

  &:hover {
    .tab-icon.not-active {
      filter: grayscale(100%) brightness(150%);
    }
  }

  &.active:before {
    content: '';
    position: absolute;
    top: ${TAB_HIGHLIGHT_TOP}px;
    bottom: ${TAB_HIGHLIGHT_BOTTOM}px;
    right: ${TAB_HIGHLIGHT_RIGHT}px;
    width: ${TAB_HIGHLIGHT_WIDTH}px;
    background-image: url(../images/abilitybook/uhd/icon-highlight.png);
    background-size: 100% 100%;
  }

  @media (max-width: 2560px) {
    height: ${TAB_HEIGHT * MID_SCALE}px;

    &.active:before {
      top: ${TAB_HIGHLIGHT_TOP * MID_SCALE}px;
      bottom: ${TAB_HIGHLIGHT_BOTTOM * MID_SCALE}px;
      right: ${TAB_HIGHLIGHT_RIGHT * MID_SCALE}px;
      width: ${TAB_HIGHLIGHT_WIDTH * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    height: ${TAB_HEIGHT * HD_SCALE}px;

    &.active:before {
      top: ${TAB_HIGHLIGHT_TOP * HD_SCALE}px;
      bottom: ${TAB_HIGHLIGHT_BOTTOM * HD_SCALE}px;
      right: ${TAB_HIGHLIGHT_RIGHT * HD_SCALE}px;
      width: ${TAB_HIGHLIGHT_WIDTH * HD_SCALE}px;
      background-image: url(../images/abilitybook/hd/icon-highlight.png);
      background-size: 100% 100%;
    }
  }
`;

// #region TabIcon constants
const TAB_ICON_FONT_SIZE = 100;
// #endregion
const TabIcon = styled.div`
  font-size: ${TAB_ICON_FONT_SIZE}px;
  color: gray;
  background: linear-gradient(to right, transparent, transparent), url(../images/abilitybook/uhd/icon-gold-texture.png);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  &.not-active {
    filter: grayscale(100%);
  }

  @media (max-width: 2560px) {
    font-size: ${TAB_ICON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TAB_ICON_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region Divider
const DIVIDER_WIDTH = 110;
const DIVIDER_HEIGHT = 20;
// #endregion
const Divider = styled.div`
  background-image: url(../images/abilitybook/uhd/nav-divider.png);
  background-size: 100% 100%;
  width: ${DIVIDER_WIDTH}px;
  height: ${DIVIDER_HEIGHT}px;

  @media (max-width: 2560px) {
    width: ${DIVIDER_WIDTH * MID_SCALE}px;
    height: ${DIVIDER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${DIVIDER_WIDTH * HD_SCALE}px;
    height: ${DIVIDER_HEIGHT * HD_SCALE}px;
    background-image: url(../images/abilitybook/hd/nav-divider.png);
  }
`;

export interface Props {
  activeRoute: Routes;
  onRouteClick: (route: Routes) => void;
  abilityNetworkNames: string[];
}

export class SideNav extends React.Component<Props> {
  public render() {
    return (
      <Container>
        {this.getSortedNetworks().map((networkName) => {
          const route = Routes[networkName];
          return this.renderTab(route);
        })}
        {this.renderTab(Routes.Components)}
      </Container>
    );
  }

  private getSortedNetworks = () => {
    const { abilityNetworkNames } = this.props;
    const sortedNetworks = [];

    if (abilityNetworkNames.includes('Archery')) {
      sortedNetworks.push('Archery');
    }

    if (abilityNetworkNames.includes('Magic')) {
      sortedNetworks.push('Magic');
    }

    if (abilityNetworkNames.includes('Melee')) {
      sortedNetworks.push('Melee');
    }

    if (abilityNetworkNames.includes('Shout')) {
      sortedNetworks.push('Shout');
    }

    if (abilityNetworkNames.includes('Song')) {
      sortedNetworks.push('Song');
    }

    if (abilityNetworkNames.includes('Throwing')) {
      sortedNetworks.push('Throwing');
    }

    if (abilityNetworkNames.includes('Misc')) {
      sortedNetworks.push('Misc');
    }

    return sortedNetworks;
  }

  private renderTab = (route: Routes) => {
    const activeClass = route === this.props.activeRoute ? 'active' : 'not-active';
    return (
      <>
        <Divider />
        <Tab className={activeClass} onClick={() => this.props.onRouteClick(route)}>
          <TabIcon className={`tab-icon ${this.getTabIcon(route)} ${activeClass}`} />
        </Tab>
      </>
    );
  }

  private getTabIcon = (route: Routes) => {
    switch (route) {
      case Routes.Main: {
        return 'icon-spellbook-tab';
      }
      case Routes.Archery: {
        return 'icon-bow-arrow-tab';
      }
      case Routes.Melee: {
        return 'icon-sword-tab';
      }
      case Routes.Magic: {
        return 'icon-magic-tab';
      }
      case Routes.Throwing: {
        return 'icon-thrown-tab';
      }
      case Routes.Shout: {
        return 'icon-shout-tab';
      }
      case Routes.Song: {
        return 'icon-category-food';
      }
      case Routes.Misc: {
        return 'icon-misc-tab';
      }
      case Routes.Components: {
        return 'icon-components-tab';
      }
      default: return '';
    }
  }
}
