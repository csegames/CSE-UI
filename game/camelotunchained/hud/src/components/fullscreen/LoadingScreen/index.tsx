/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import ParallaxBG from 'shared/ParallaxBG';
import { LoadingAnimIcon } from './LoadingAnimIcon';
// import { ProgressBar } from './ProgressBar';

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  z-index: 9999;
`;

const Overlay = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
`;

// const ProgressBarWrapper = styled.div`
//   position: absolute;
//   bottom: 0;
//   width: 100%;
// `;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
`;

const TriRealm = styled.h3`
  margin: 0;
  color: #aaa;
  text-align: center;
  font-family: 'TitilliumWeb';
  font-size: 18px;
`;

const Logo = styled.div`
  width: 347px;
  height: 128px;
  background: url(../images/logo.png);
  background-repeat: no-repeat;
  background-size: contain;
`;

const Trademark = styled.div`
  margin-top: 50px;
  margin-bottom: 20px;
  color: #aaa;
  text-align: center;
  font-family: 'TitilliumWeb';
  font-size: 14px;
`;

const PoweredBy = styled.div`
  position: absolute;
  left: 20px;
  bottom: 0px;
  width: 262px;
  height: 142px;
  background: url(../images/poweredby-stacked.png);
`;

const LoadingWrapper = styled.div`
  position: absolute;
  right: 40px;
  bottom: 0px;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingMessage = styled.h3`
  color: white;
  font-family: 'TitilliumWeb';
  font-size: 18px;
  margin-top: -70px;
`;

export class LoadingScreen extends React.PureComponent<{}> {

  private faction: Faction;
  private class: Archetype;
  private race: Race;

  private loadingStateEventHandle: EventHandle;

  constructor(props: {}) {
    super(props);

    const randSelect = Math.floor(Math.random() * 3);
    switch (randSelect) {
      case 0: // Arthurian
        this.faction = Faction.Arthurian;
        this.class = Archetype.BlackKnight;
        this.race = Race.HumanMaleA;
        break;
      case 1: // TDD
        this.faction = Faction.TDD;
        this.class = Archetype.Fianna;
        this.race = Race.HumanMaleT;
        break;
      case 2: // Viking
        this.faction = Faction.Viking;
        this.class = Archetype.WintersShadow;
        this.race = Race.HumanMaleV;
        break;
    }

    // Hook up to listen for loading state changes
    this.loadingStateEventHandle = camelotunchained.game.loadingState.onUpdated(this.loadingStateChanged);
  }

  public render() {
    const { message, visible } = camelotunchained.game.loadingState;

    if (!visible) {
      // nothing to render here when the loading screen is not visible;
      return null;
    }

    return (
      <Container>
        <ParallaxBG
          selectedClass={{ id: this.class }}
          selectedFaction={{ id: this.faction }}
          selectedRace={{ id: this.race }}
          hidden={false}
        />

        <Overlay>
          {/* <ProgressBarWrapper>
            <ProgressBar progress={percent} />
          </ProgressBarWrapper> */}
          <LogoWrapper>
            <Logo />
            <TriRealm>A TriRealm™ MMORPG</TriRealm>
            <Trademark>Camelot Unchained and TriRealm are trademarks of City State Entertainment, LLC.</Trademark>
          </LogoWrapper>
          <PoweredBy />
          <LoadingWrapper>
            <LoadingAnimIcon />
            <LoadingMessage>{message}</LoadingMessage>
          </LoadingWrapper>
        </Overlay>

      </Container>
    );
  }

  public componentWillUnmount() {
    this.loadingStateEventHandle && this.loadingStateEventHandle.clear();
  }

  private loadingStateChanged = () => {
    this.forceUpdate();
  }
}
