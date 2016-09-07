/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {events} from 'camelot-unchained';

import {Channel, ChannelStatus, patcher} from '../../../../services/patcher';
import {ServersState, ServerType, PatcherServer, AccessType, selectServer, initServers} from '../../services/session/servers';

import Animate from '../../../../lib/Animate';
import {clone} from '../../../../lib/reduxUtils';


export enum ServerStatus {
  OFFLINE,
  ONLINE,
  STARTING
}

export interface SelectServerProps {
  selectServer: (server: PatcherServer) => void;
  serversState: ServersState;
}

export interface SelectServerState {
  showList: boolean;
}

class SelectServer extends React.Component<SelectServerProps, SelectServerState> {

  constructor(props: SelectServerProps) {
    super(props);

    this.state = {
      showList: false,
    };
  }

  renderList() {
    return (
      <div className='ServerList_container card-panel no-padding'>
        {this.props.serversState.servers.map((i: any) => this.renderItem(i, true))}
      </div>
    )
  }

  onSelectedServerChanged = (server: PatcherServer) => {
    events.fire('play-sound', 'select');
    this.props.selectServer(server);
    this.setState({
      showList: false
    } as any);
  }

  renderItem(server: PatcherServer, hideSelected:boolean) {
    if (server.type == ServerType.CUGAME) {
      //const totalPlayers = (server.serverInfo.arthurians|0) + (server.serverInfo.tuathaDeDanann|0) + (server.serverInfo.vikings|0);
      const status = server.maxPlayers > 0 ? 'online' : 'offline';
            //<h6 className='server-players'>Players Online: {totalPlayers}/{server.serverInfo.playerMaximum}</h6>

      return (
        <div className='server-select' onClick={() => this.onSelectedServerChanged(server)} key={server.id}>
          <div className='server-details'>
            <h5 className='server'>{server.name} ({AccessType[server.accessLevel]})</h5>
          </div>
          <div className='server-status'><div className={'indicator ' + status} data-position='right'
            data-delay='150' data-tooltip={status} /></div>
        </div>
      );
    } else {
      return (
        <div className='server-select' onClick={() => this.onSelectedServerChanged(server)} key={server.id}>
          <div className='server-details'>
            <h5 className='server'>{server.name} ({AccessType[server.accessLevel]})</h5>
          </div>
        </div>
      );
    }    
  }

  render() {
    const {ready, servers, selectedServer} = this.props.serversState;

    if (!ready || !servers) return <div>fetching servers...</div>;

    let list: any = null;
    if (this.state.showList) list = this.renderList();

    return (
      <div className='server-selected'> 
        <div onClick={() => this.setState({showList: !this.state.showList} as any)}>
          <h5 className='label'>SELECT SERVER</h5>
          {this.renderItem(selectedServer, false)}
        </div>
        <Animate animationEnter='fadeIn' animationLeave='fadeOut' durationEnter={500} durationLeave={500}>
          {list}
        </Animate>
      </div>
    )
  }
}

export default SelectServer;
