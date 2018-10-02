/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { webAPI } from '@csegames/camelot-unchained';

const ZoneContainer = styled('div')`
margin-top:40px;
`;

const ZoneNameContainer = styled('div')`
  height: 32px;
  background: url(images/zone/zone_background.png) repeat-x;
  border-left: 3px solid #3b3634;
  float: left;
  h3 {
    font-family: 'Caudex', serif;
    color: #ccb79b;
    font-size: 14px;
    margin: 0;
    padding: 0;
    line-height: 32px;
    margin: 0 10px;
    text-shadow: 1px 1px 1px #000000;
  }
`;

const ZoneNameEnd = styled('div')`
  height: 32px;
  width: 67px;
  float: left;
  background: url(images/zone/zone_background_end.png) repeat-x;
`;

export interface ZoneNameState {
  zoneID: string;
  name: string;
}

export class ZoneName extends React.Component<{}, ZoneNameState> {
  private mounted: boolean = true;
  private eventHandles: EventHandle[] = [];

  constructor(props: {}) {
    super(props);
    this.state = {
      zoneID: '',
      name: '',
    };
  }

  public componentDidMount() {
    // initializing shardID when component mounts because client.shardID gives me random number onCharacterZoneChanged
    const { shardID } = game;
    this.eventHandles.push(game.selfPlayerState.onUpdated(() => {
      if (this.state.zoneID !== game.selfPlayerState.zoneID) {
        this.setState({
          zoneID: game.selfPlayerState.zoneID,
          name: '',
        });
        // CHANGE THIS TO USE GetZoneInfo
        webAPI.ServersAPI.GetAvailableZones(
          webAPI.defaultConfig,
          shardID,
        ).then((res) => {
          if (!res.ok) return;
          const data = JSON.parse(res.data);
          data.forEach((zone: any) => {
            if (zone.ID === game.selfPlayerState.zoneID) {
              if (this.mounted) {
                this.setState({ name: zone.Name });
              }
            }
          });
        });
      }
    }));
  }

  public componentWillUnmount() {
    this.mounted = false;
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }

  public render() {
    return (
      <ZoneContainer>
        <ZoneNameContainer>
          <h3>ZONE: {this.state.name}</h3>
        </ZoneNameContainer>
        <ZoneNameEnd />
      </ZoneContainer>
    );
  }
}
