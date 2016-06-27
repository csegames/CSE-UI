/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {components} from 'camelot-unchained';
let QuickSelect = components.QuickSelect;

import {Server, AccessType} from '../redux/modules/servers';

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
  item: Server;
};

export interface ServerListViewState {};
class ServerListView extends React.Component<ServerListViewProps, ServerListViewState> {
  render() {
    let totalPlayers = (this.props.item.arthurians|0) + (this.props.item.tuathaDeDanann|0) + (this.props.item.vikings|0);
    let status = this.props.item.playerMaximum > 0 ? 'online' : 'offline';
    let accessLevel = AccessType[this.props.item.accessLevel];
    return (
      <div className='server-select quickselect-list'>
        <div>
          <div className='server-status'><div className={'indicator ' + status} data-position='right'
            data-delay='150' data-tooltip={status} /></div>
          <div className='server-details'>
            <h5 className='server'>{this.props.item.name} ({accessLevel})</h5>
            <h6 className='server-players'>Players Online: {totalPlayers}/{this.props.item.playerMaximum}</h6>
          </div>
        </div>
      </div>
    );
  }
}

export interface ServerSelectProps {
  servers: Array<Server>;
  selectedServer: Server;
  onSelectedServerChanged: (server: Server) => void;
};

export interface ServerSelectState {
};

class ServerSelect extends React.Component<ServerSelectProps, ServerSelectState> {
  public name: string = 'cse-patcher-server-select';

  constructor(props: ServerSelectProps) {
    super(props);
  }

  onSelectedServerChanged = (server: any) => {
    this.props.onSelectedServerChanged(server);
  }

  generateActiveView = (server: any) => {
    return <ActiveServerView item={server} />
  }

  generateListView = (server: any) => {
    return <ServerListView item={server} />
  }

  getSelectedIndex = () : number => {
    return this.props.servers.indexOf(this.props.selectedServer);
  }

  render() {
    if (this.props.servers.length == 0) return null;
    return (
        <QuickSelect items={this.props.servers}
          selectedItemIndex={this.getSelectedIndex()}
          activeViewComponentGenerator={this.generateActiveView}
          listViewComponentGenerator={this.generateListView}
          onSelectedItemChanged={this.onSelectedServerChanged} />
    );
  }
}

export default ServerSelect;
