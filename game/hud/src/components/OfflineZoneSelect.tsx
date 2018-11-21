/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';

import ParallaxBG from './ParallaxBG';

const Container = styled('div')`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9999;
`;

const SelectMessage = styled('div')`
  color: white;
  font-family: 'TitilliumWeb';
  font-size: 24px;
`;

const Overlay = styled('div')`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ZoneSelectWrapper = styled('div')`
  background: #111;
  min-width: 600px;
`;

const Zone = styled('div')`
  color: #aaa;
  text-align: center;
  font-family: 'TitilliumWeb';
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #222;
  padding: 10px 5px;
  &:hover {
    background-color: #222;
  }
`;

const Logo = styled('div')`
  width: 462px;
  height: 171px;
  background: url(images/logo.png);
  background-repeat: no-repeat;
`;

export class OfflineZoneSelect extends React.PureComponent<{}> {

  private faction: Faction;
  private class: Archetype;
  private race: Race;

  private eventHandle: EventHandle;

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
    this.eventHandle = game.offlineZoneSelectState.onUpdated(this.stateChanged);
  }

  public render() {
    const { zones, visible } = game.offlineZoneSelectState;

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
          <Logo />
          <SelectMessage>Select a zone</SelectMessage>
          <ZoneSelectWrapper>
            {
              Object
                .values(zones)
                .map(z => <Zone
                    key={z.id}
                    data-input-group='block'
                    onClick={() => game.offlineZoneSelectState.selectZone(z.id)}>{z.name}</Zone>)
            }
          </ZoneSelectWrapper>
        </Overlay>

      </Container>
    );
  }

  public componentWillUnmount() {
    this.eventHandle && this.eventHandle.clear();
  }

  private stateChanged = () => {
    this.forceUpdate();
  }
}
