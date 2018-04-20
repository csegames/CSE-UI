/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client, webAPI } from '@csegames/camelot-unchained';

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
    return <div style={{ marginTop: '30px' }}>
      <h1>ZONE: {this.state.name}</h1>
    </div>;
  }
}
