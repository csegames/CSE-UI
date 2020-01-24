/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { styled } from '@csegames/linaria/react';

import { NavMenu, StartScreenRoute } from './NavMenu';
import { Play } from './Play';
import { ChampionProfile } from './ChampionProfile';
import { Store } from './Store';
import { BattlePass } from './BattlePass';
import { CareerStats } from './CareerStats';
import { Leaderboards } from './Leaderboards';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const TopSection = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  opacity: 0;
  margin-top: -10%;
  animation: slideIn 0.5s forwards ;

  @keyframes slideIn {
    from {
      opacity: 0;
      margin-top: -10%;
    }
    to {
      opacity: 1;
      margin-top: 0;
    }
  }
`;

const Hamburger = styled.div`
  position: absolute;
  top: 25px;
  left: 20px;
  height: 30px;
  width: 30px;
  background-image: url(../images/fullscreen/startscreen/hamburger-menu.png);
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: filter 0.2s;

  &:hover {
    filter: brightness(120%);
  }
`;

const PlayContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const GenericScreenContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 93px);
  top: 93px;
`;

const CareerStatsBGImage = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url(../images/fullscreen/fullscreen-career-bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  z-index: -1;
`;

const StoreBGImage = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url(../images/fullscreen/fullscreen-store-bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  z-index: -1;
`;

export interface Props {
}

export function StartScreen(props: Props) {
  const [selectedRoute, setSelectedRoute] = useState(StartScreenRoute.Play);

  function onSelectRoute(route: StartScreenRoute) {
    if (route !== StartScreenRoute.Play) {
      game.trigger('hide-fullscreen-chat');
    } else {
      game.trigger('show-fullscreen-chat');
    }

    setSelectedRoute(route);
  }

  function onHamburgerClick() {
    game.trigger('show-menu-modal');
  }

  function renderRoute() {
    switch (selectedRoute) {
      case StartScreenRoute.Play: {
        return (
          <PlayContainer>
            <Play />
          </PlayContainer>
        );
      }

      case StartScreenRoute.Champions: {
        return (
          <GenericScreenContainer>
            <ChampionProfile />
          </GenericScreenContainer>
        );
      }

      case StartScreenRoute.Store: {
        return (
          <GenericScreenContainer>
            <StoreBGImage />
            <Store />
          </GenericScreenContainer>
        );
      }

      case StartScreenRoute.BattlePass: {
        return (
          <GenericScreenContainer>
            <BattlePass />
          </GenericScreenContainer>
        );
      }

      case StartScreenRoute.Career: {
        return (
          <GenericScreenContainer>
            <CareerStatsBGImage />
            <CareerStats />
          </GenericScreenContainer>
        );
      }

      case StartScreenRoute.Leaderboards: {
        return (
          <GenericScreenContainer>
            <Leaderboards />
          </GenericScreenContainer>
        );
      }

      default: return null;
    }
  }

  return (
    <Container>
      {renderRoute()}
      <TopSection>
        <Hamburger onClick={onHamburgerClick} />
        <NavMenu selectedRoute={selectedRoute} onSelectRoute={onSelectRoute} />
      </TopSection>
    </Container>
  );
}
