/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {components} from 'camelot-unchained';
import {Channel, ChannelStatus, patcher} from '../api/patcherAPI';
import {Server, AccessType} from '../redux/modules/servers';
import {changeChannel, requestChannels, ChannelState} from '../redux/modules/channels';
import {fetchServers, changeServer, ServersState} from '../redux/modules/servers';
import * as events from '../../../../shared/lib/events';
import {fetchCharacters, selectCharacter} from '../redux/modules/characters';
let QuickSelect = components.QuickSelect;

export enum ServerStatus {
  OFFLINE,
  ONLINE,
  STARTING
}

export interface ActiveServerViewProps {
  item: Server;
};

export interface ActiveServerViewState {};
class ActiveServerView extends React.Component<ActiveServerViewProps, ActiveServerViewState> {
  render() {
    let content: JSX.Element;
    if (this.props.item) {
      let totalPlayers = (this.props.item.arthurians|0) + (this.props.item.tuathaDeDanann|0) + (this.props.item.vikings|0);
      let status = this.props.item.playerMaximum > 0 ? 'online' : 'offline';
      let accessLevel = AccessType[this.props.item.accessLevel];
      content = (
        <div>
          <div className='server-status'><div className={'indicator ' + status} data-position='right'
            data-delay='150' data-tooltip={status} /></div>
          <div className='server-details'>
            <h5 className='server'>{this.props.item.name} ({accessLevel})</h5>
            <h6 className='server-players'>Players Online: {totalPlayers}/{this.props.item.playerMaximum}</h6>
          </div>
        </div>
      );
    }
    return (
      <div className='server-select quickselect-active'>
        <h5 className='label'>SELECT SERVER</h5>
        { content }
      </div>
    );
  }
}

export interface ServerListViewProps {
  item: IServerOption;
};

export interface ServerListViewState {};
class ServerListView extends React.Component<ServerListViewProps, ServerListViewState> {
  render() {
    let totalPlayers = (this.props.item.serverInfo.arthurians|0) + (this.props.item.serverInfo.tuathaDeDanann|0) + (this.props.item.serverInfo.vikings|0);
    let status = this.props.item.serverInfo.playerMaximum > 0 ? 'online' : 'offline';
    let accessLevel = AccessType[this.props.item.serverInfo.accessLevel];

    return (
      <div className='server-select quickselect-list'>
        <div>
          <div className='server-status'><div className={'indicator ' + status} data-position='right'
            data-delay='150' data-tooltip={status} /></div>
          <div className='server-details'>
            <h5 className='server'>{this.props.item.displayName} ({accessLevel})</h5>
            <h6 className='server-players'>Players Online: {totalPlayers}/{this.props.item.serverInfo.playerMaximum}</h6>
          </div>
        </div>
      </div>
    );
  }
}

interface IServerOption {
  displayName: string;
  serverInfo: Server;
  channelInfo: Channel;
}

function mapToProps(state: any): any {
  return {
    channelsState: state.channels,
    serversState: state.servers
  }
}

export interface ServerSelectProps {
  dispatch?: (action: any) => void;
  channelsState?: ChannelState;  
  serversState?: ServersState;
};

export interface ServerSelectState {
};

class ServerSelect extends React.Component<ServerSelectProps, ServerSelectState> {
  public name: string = 'cse-patcher-server-select';
  private mergedServerList: { [key:string] : IServerOption } = {};
  
  private listAsArray:Array<IServerOption> = null;

  constructor(props: ServerSelectProps) {
    super(props);
  }

  onSelectedServerChanged = (server: IServerOption) => {
    const { dispatch } = this.props;

    events.fire('play-sound', 'select');

    //is there a required order here?
    dispatch(changeChannel(server.channelInfo));
    dispatch(changeServer(server.serverInfo));
    dispatch(fetchCharacters());
    dispatch(selectCharacter(null));
  }

  generateActiveView = (server: IServerOption) => {
    if(server.serverInfo)
      return <ActiveServerView item={server.serverInfo} />
     else
    {
      //todo component
      let status = server.channelInfo.channelStatus == 4 ? 'online' : 'offline'; //more than one status should show online...
      let statusDesc = ChannelStatus[server.channelInfo.channelStatus];

       return (
        <div className='server-select quickselect-list'>
          <div>
            <div className='server-status'><div className={'indicator ' + status} data-position='right'
              data-delay='150' data-tooltip='offline' /></div>
            <div className='server-details'>
              <h5 className='server'>{server.channelInfo.channelName} ({statusDesc})</h5>
            </div>
          </div>
        </div>
      );
    }
  }

  generateListView = (server: IServerOption) => {

    if(server.serverInfo)
      return <ServerListView item={server} />
    else
    {
      //todo component
      let status = server.channelInfo.channelStatus == 4 ? 'online' : 'offline'; //more than one status should show online...
      let statusDesc = ChannelStatus[server.channelInfo.channelStatus];

       return (
        <div className='server-select quickselect-list'>
          <div>
            <div className='server-status'><div className={'indicator ' + status} data-position='right'
              data-delay='150' data-tooltip='offline' /></div>
            <div className='server-details'>
              <h5 className='server'>{server.channelInfo.channelName} ({statusDesc})</h5>
            </div>
          </div>
        </div>
      );
    }
  }

  getSelectedIndex = () : number => {
    const { currentServer } = this.props.serversState;
    const { selectedChannel } = this.props.channelsState;
    if(!currentServer && !selectedChannel)
      return 0;

    return this.listAsArray.indexOf(this.listAsArray.find(i => {
      if(i.serverInfo && currentServer)
        return i.serverInfo.channelID == currentServer.channelID
      else if(i.channelInfo && selectedChannel)
        return i.channelInfo.channelID == selectedChannel.channelID
      
      return false;
    }));
  }

  mergeServerChannelLists(servers:Array<Server>, channels:Array<Channel>) : Array<IServerOption> {

    let filteredServers:Array<Server> = servers;
    if(patcher.getScreenName().search(/^cse/i) === -1)
      filteredServers = servers.filter((s) => { return s.name != 'localhost'; });

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

    let dictToArray:Array<IServerOption> = new Array<IServerOption>();
    Object.keys(this.mergedServerList).forEach(key => { dictToArray.push(this.mergedServerList[key]) });
    return dictToArray;
  }

  render() {
    const { servers } = this.props.serversState;
    const { channels } = this.props.channelsState;

    if (!servers && !channels) return null;

    this.listAsArray = this.mergeServerChannelLists(servers, channels);

    return (
        <QuickSelect items={this.listAsArray}
          selectedItemIndex={this.getSelectedIndex()}
          activeViewComponentGenerator={this.generateActiveView}
          listViewComponentGenerator={this.generateListView}
          onSelectedItemChanged={this.onSelectedServerChanged} />
    );
  }
}



export default connect(mapToProps)(ServerSelect);
