/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from 'linaria/react';

import ParallaxBG from './ParallaxBG';
import { ProgressBar } from './ProgressBar';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const LoadingMessage = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-family: 'TitilliumWeb';
  font-size: 24px;
`;

const Overlay = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
`;

const ProgressBarWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const TrademarkWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  right: 0;
  padding: 10px;
  color: #aaa;
  text-align: right;
  font-family: 'TitilliumWeb';
  font-size: 14px;
`;

const TriRealm = styled.h3`
  margin: 0;
`;

const Logo = styled.div`
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%) scale(0.75);
  width: 462px;
  height: 171px;
  background: url(/hud-new/images/logo.png);
  background-repeat: no-repeat;
`;

const PoweredBy = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 453px;
  height: 88px;
  background: url(/hud-new/images/poweredby.png);
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
    this.loadingStateEventHandle = game.loadingState.onUpdated(this.loadingStateChanged);
  }

  public render() {
    const { percent, message, visible } = game.loadingState;

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
          <ProgressBarWrapper>
            <ProgressBar progress={percent} />
          </ProgressBarWrapper>
          <TrademarkWrapper>
            <TriRealm>A TriRealm™ MMORPG</TriRealm>
            Camelot Unchained and TriRealm are trademarks of City State Entertainment, LLC.
          </TrademarkWrapper>
          <Logo />
          <PoweredBy />
          <LoadingMessage>{message}</LoadingMessage>
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
