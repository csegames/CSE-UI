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

export interface Props {
  onReady: () => void;
}

export function StartScreen(props: Props) {
  const [selectedRoute, setSelectedRoute] = useState(StartScreenRoute.Play);

  function onSelectRoute(route: StartScreenRoute) {
    setSelectedRoute(route);
  }

  function renderRoute() {
    switch (selectedRoute) {
      case StartScreenRoute.Play: {
        return (
          <PlayContainer>
            <Play onReady={props.onReady} />
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

      default: return null;
    }
  }

  return (
    <Container>
      {renderRoute()}
      <TopSection>
        <Hamburger />
        <NavMenu selectedRoute={selectedRoute} onSelectRoute={onSelectRoute} />
      </TopSection>
    </Container>
  );
}
