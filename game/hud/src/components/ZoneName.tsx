/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-04-28 17:00:11
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-04-28 17:30:20
 */

import * as React from 'react';
import { client, webAPI } from 'camelot-unchained';

export class ZoneName extends React.Component<{}, { id: string, name: string }> {

  constructor(props: {}) {
    super(props);
    this.state = {
      id: '',
      name: '',
    };
  }

  public componentDidMount() {
    console.log('zonename mounted');
    client.OnCharacterZoneChanged((id: string) => {
      console.log(`zone changed ${id}`);
      webAPI.ServerListHelperAPI.getAvailableZones(client.shardID)
        .then((result) => {
          console.log('api zones');
          if (result.ok === false) return;
          console.log('got zones');
          console.log(JSON.stringify(result.data));
          result.data.forEach((zone: any) => {
            if (zone.ID === id) {
              this.setState({
                id: zone.ID,
                name: zone.Name,
              });
            }
          });
        });
    });
  }

  public render() {
    return <h1 style={{marginTop:'30px'}}>ZONE: {this.state.name}</h1>;
  }
}
