/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';

import {Channel, ChannelStatus, patcher} from '../api/patcherAPI';
import {Server, AccessType} from '../redux/modules/servers';
import * as events from '../../lib/events';

import {changeChannel, requestChannels, ChannelState} from '../redux/modules/channels';
import {fetchServers, changeServer, ServersState} from '../redux/modules/servers';
import {fetchCharacters, selectCharacter} from '../redux/modules/characters';

import Animate from '../../lib/Animate';

export enum ServerStatus {
  OFFLINE,
  ONLINE,
  STARTING
}

function select(state: any): any {
  return {
    channelsState: state.channels,
    serversState: state.servers
  }
}

export interface SelectServerProps {
  dispatch?: (action: any) => void;
  channelsState?: ChannelState;  
  serversState?: ServersState;
}

export interface SelectServerState {
  showList: boolean;
}

class SelectServer extends React.Component<SelectServerProps, SelectServerState> {

  private mergedServerList: {[key:string]: any} = {};
  
  private listAsArray: any[] = null;
  
  constructor(props: SelectServerProps) {
    super(props);

    this.state = {
      showList: false,
    };
  }

  renderList() {
    return (
      <div className='ServerList_container card-panel no-padding'>
        {this.listAsArray.map((i: any) => this.renderItem(i))}
      </div>
    )
  }

  onSelectedServerChanged = (server: any) => {
    const {dispatch} = this.props;

    events.fire('play-sound', 'select');

    //is there a required order here?
    dispatch(changeChannel(server.channelInfo));
    dispatch(changeServer(server.serverInfo));
    dispatch(fetchCharacters());
    dispatch(selectCharacter(null));
    dispatch(fetchServers());
    dispatch(requestChannels());
    this.setState({
      showList: false
    } as any);
  }

  renderItem(item: any) {
    if (item.serverInfo) {

      const totalPlayers = (item.serverInfo.arthurians|0) + (item.serverInfo.tuathaDeDanann|0) + (item.serverInfo.vikings|0);
      const status = item.serverInfo.playerMaximum > 0 ? 'online' : 'offline';
      const accessLevel = AccessType[item.serverInfo.accessLevel];

      return (
        <div className='server-select' onClick={() => this.onSelectedServerChanged(item)}>
          <div className='server-details'>
            <h5 className='server'>{item.displayName} ({accessLevel})</h5>
            <h6 className='server-players'>Players Online: {totalPlayers}/{item.serverInfo.playerMaximum}</h6>
          </div>
          <div className='server-status'><div className={'indicator ' + status} data-position='right'
            data-delay='150' data-tooltip={status} /></div>
        </div>
      );
    } else {
      return (
        <div className='server-select' onClick={() => this.onSelectedServerChanged(item)}>
          <div className='server-details'>
            <h5 className='server'>{item.channelInfo.channelName}</h5>
          </div>
        </div>
      );
    }    
  }

  mergeServerChannelLists(servers:Array<Server>, channels:Array<Channel>) : any {

    let filteredServers:Array<Server> = servers.filter((s) => { return s.name != 'localhost'; });

    filteredServers.forEach(s => {
      this.mergedServerList[s.channelID] = this.mergedServerList[s.channelID] || { displayName: s.name, serverInfo: null, channelInfo:null };
      this.mergedServerList[s.channelID].serverInfo = s;
      this.mergedServerList[s.channelID].displayName = s.name;
    });

    channels.forEach(c => {
      this.mergedServerList[c.channelID] = this.mergedServerList[c.channelID] || { displayName: c.channelName, serverInfo: null, channelInfo:null };
      this.mergedServerList[c.channelID].channelInfo = c;
      this.mergedServerList[c.channelID].displayName = c.channelName;
    });

    let dictToArray:any[] = [];
    Object.keys(this.mergedServerList).forEach(key => { dictToArray.push(this.mergedServerList[key]) });
    return dictToArray;
  }

  getSelectedIndex = () : number => {
    const {currentServer} = this.props.serversState;
    const {selectedChannel} = this.props.channelsState;
    if (!currentServer && !selectedChannel) return 0;

    return this.listAsArray.indexOf(this.listAsArray.find((i: any) => {
      if (i.serverInfo && currentServer) return i.serverInfo.channelID == currentServer.channelID
      else if (i.channelInfo && selectedChannel) return i.channelInfo.channelID == selectedChannel.channelID
      return false;
    }));
  }
  
  render() {

    const {servers} = this.props.serversState;
    const {channels} = this.props.channelsState;

    if (!servers && !channels) return null;

    this.listAsArray = this.mergeServerChannelLists(servers, channels);

    var list: any = null;
    if (this.state.showList) list = this.renderList();

    return (
      <div className='server-selected'> 
        <div onClick={() => this.setState({showList: !this.state.showList} as any)}>
          <h5 className='label'>SELECT SERVER</h5>
          {this.renderItem(this.listAsArray[this.getSelectedIndex()])}
        </div>
        <Animate animationEnter='fadeIn' animationLeave='fadeOut' durationEnter={500} durationLeave={500}>
          {list}
        </Animate>
      </div>
    )
  }
}

export default connect(select)(SelectServer);
