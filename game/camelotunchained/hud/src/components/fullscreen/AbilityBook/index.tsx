/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext, useEffect } from 'react';
import { styled } from '@csegames/linaria/react';

import { AbilityBookContext, Routes } from '../../context/AbilityBookContext';
import { SideNav } from './SideNav';
import { AbilityPage } from './AbilityPage';
import { AbilityComponents } from './AbilityComponents';
import { Header } from './Header';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  background-color: black;
`;

// #region PageContainer constants
const PAGE_CONTAINER_PADDING_TOP = 60;
const PAGE_CONTAINER_MARGIN_LEFT = 160;
const PAGE_CONTAINER_RIP_WIDTH = 60;
// #endregion
const PageContainer = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  padding-top: ${PAGE_CONTAINER_PADDING_TOP}px;
  margin-left: ${PAGE_CONTAINER_MARGIN_LEFT}px;
  background-image: url(../images/abilitybook/uhd/ability-book-paper-bg.jpg);
  -webkit-mask-image: url(../images/abilitybook/uhd/paper-mask-x-repeat.png);
  -webkit-mask-size: cover;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: ${PAGE_CONTAINER_RIP_WIDTH}px;
    background-image: url(../images/abilitybook/uhd/paper-left-rip.png);
    background-size: contain;
    background-repeat: repeat-y;
  }

  @media (max-width: 2560px) {
    padding-top: ${PAGE_CONTAINER_PADDING_TOP * MID_SCALE}px;
    margin-left: ${PAGE_CONTAINER_MARGIN_LEFT * MID_SCALE}px;
    &:before {
      width: ${PAGE_CONTAINER_RIP_WIDTH * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    padding-top: ${PAGE_CONTAINER_PADDING_TOP * HD_SCALE}px;
    margin-left: ${PAGE_CONTAINER_MARGIN_LEFT * HD_SCALE}px;
    background-image: url(../images/abilitybook/hd/ability-book-paper-bg.jpg);
    -webkit-mask-image: url(../images/abilitybook/hd/paper-mask-x-repeat.png);

    &:before {
      width: ${PAGE_CONTAINER_RIP_WIDTH * HD_SCALE}px;
      background-image: url(../images/abilitybook/hd/paper-left-rip.png);
    }
  }
`;

// tslint:disable-next-line:function-name
export function AbilityBook() {
  const abilityBookContext = useContext(AbilityBookContext);

  useEffect(() => {
    return function() {
      abilityBookContext.resetState();
    };
  }, []);

  function onRouteClick(route: Routes) {
    abilityBookContext.setActiveRoute(route);
  }

  function getHeaderTitle() {
    switch (abilityBookContext.activeRoute) {
      case Routes.Components: {
        return 'Abilities | Components';
      }
      case Routes.Magic: {
        return 'Abilities | Magic';
      }
      case Routes.Melee: {
        return 'Abilities | Melee';
      }
      case Routes.Shout: {
        return 'Abilities | Shout';
      }
      case Routes.Throwing: {
        return 'Abilities | Throwing';
      }
      case Routes.Misc: {
        return 'Abilities | Miscellaneous';
      }
      case Routes.Archery: {
        return 'Abilities | Archery';
      }
      case Routes.Song: {
        return 'Abilities | Song';
      }
      default: {
        return 'Abilities';
      }
    }
  }

  function renderSelectedPage() {
    switch (abilityBookContext.activeRoute) {
      case Routes.Main: {
        return null;
      }
      case Routes.Components: {
        return <AbilityComponents />;
      }
      default: {
        return <AbilityPage />;
      }
    }
  }

  return (
    <Container>
      <Header title={getHeaderTitle()} />
      <Content>
        <SideNav
          activeRoute={abilityBookContext.activeRoute}
          onRouteClick={onRouteClick}
          abilityNetworkNames={Object.keys(abilityBookContext.abilityNetworks)}
        />
        <PageContainer>
          {!abilityBookContext.loading && renderSelectedPage()}
        </PageContainer>
      </Content>
    </Container>
  );
}
