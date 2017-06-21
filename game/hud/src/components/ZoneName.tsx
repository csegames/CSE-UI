/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-04-28 17:00:11
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-06-21 16:15:09
 */

import * as React from 'react';
import { client, webAPI } from 'camelot-unchained';

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
      console.log(`zone changed ${id}`);
      const _id = id;
      this.setState({ name: '' });
      webAPI.ServerListHelperAPI.getAvailableZones(shardID)
        .then((result) => {
          if (result.ok === false) return;
          result.data.forEach((zone: any) => {
            if (zone.ID === _id) {
              this.setState({
                name: zone.Name,
              });
            }
          });
        });
    });
  }

  public render() {
    return <div style={{marginTop: '30px'}}>
      <h1>ZONE: {this.state.name}</h1>
    </div>;
  }
}
