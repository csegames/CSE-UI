/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { client, webAPI } from '@csegames/camelot-unchained';

const ZoneNameContainer = styled('div')`
  margin-top: 40px;
  height: 32px;
  min-width: 234px;
  background: url("images/zone/zonename-background.png") no-repeat;
  border-left: 3px solid #3b3634;
  h3 {
    font-family: 'Caudex', serif;
    color: #968876;
    font-size: 14px;
    margin: 0;
    padding: 0;
    line-height: 32px;
    margin-left: 10px;
    text-shadow: 1px 1px 1px #000000;
  }
`;

export interface ZoneNameState {
  name: string;
}

export class ZoneName extends React.Component<{}, ZoneNameState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      name: '',
    };
  }

  public componentDidMount() {
    // initializing shardID when component mounts because client.shardID gives me random number onCharacterZoneChanged
    const { shardID } = client;
    client.OnCharacterZoneChanged((id: string) => {
      const _id = id;
      this.setState({ name: '' });

      // CHANGE THIS TO USE GetZoneInfo
      webAPI.ServersAPI.GetAvailableZones(
        webAPI.defaultConfig,
        shardID,
      ).then((res) => {
        if (!res.ok) return;
        const data = JSON.parse(res.data);
        data.forEach((zone: any) => {
          if (zone.ID === _id) {
            this.setState({ name: zone.Name });
          }
        });
      });
    });
  }

  public render() {
    return (
      <ZoneNameContainer>
        <h3>ZONE: {this.state.name}</h3>
      </ZoneNameContainer>
    )
  }
}
