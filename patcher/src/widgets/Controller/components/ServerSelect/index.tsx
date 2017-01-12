/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {webAPI, utils} from 'camelot-unchained';

import {patcher, ChannelStatus, PatchPermissions, canAccessChannel} from '../../../../services/patcher';
import QuickSelect from '../../../../components/QuickSelect';
import {ServerType, PatcherServer} from '../../services/session/controller';


class ActiveServerView extends React.Component<{server: PatcherServer}, {}> {
  render() {
    const {server} = this.props;
    switch(server.type) {

      default:
        return (
          <div className='ActiveServerView'>
            <div className='ActiveServerView__details'>
              {server.name}
            </div>
          </div>
        );

      case ServerType.CUGAME:
        return (
          <div className='ActiveServerView'>
            <div className='ActiveServerView__status'>
              <div className={`simptip-position-right simptip-fade ${server.available ? 'online' : 'offline'}`} data-tooltip={server.available ? 'online' : 'offline'}><i className='fa fa-power-off' aria-hidden='true'></i></div>
            </div>
            <div className='ActiveServerView__details'>
              {server.name}
              {server.characterCount ? <div className='ActiveServerView__access'>{server.characterCount} Characters</div> : null}
              {server.accessLevel ? <div className='ActiveServerView__access'>{webAPI.accessLevelString(server.accessLevel)} Access Only </div> : null}
            </div>
          </div>
        );
    }
  }
}

class ServerListView extends React.Component<{server: PatcherServer}, {}> {
  render() {
    const {server} = this.props;
    switch(server.type) {

      default:
        return (
          <div className='ActiveServerView'>
            <div className='ActiveServerView__details'>
              {server.name}
            </div>
            <div className='ActiveServerView__controls'>
              {server.channelStatus == ChannelStatus.NotInstalled ? ' ' : (
                <span className='simptip-position-left simptip-fade' data-tooltip='uninstall'
                      onClick={() => patcher.uninstallChannel(server.channelID)}>
                  <i className="fa fa-times" aria-hidden="true"></i>
                </span>
              )}
            </div>
          </div>
        );

      case ServerType.CUGAME:
        return (
          <div className='ActiveServerView'>
            <div className='ActiveServerView__status'>
              <div className={`simptip-position-right simptip-fade ${server.available ? 'online' : 'offline'}`} data-tooltip={server.available ? 'online' : 'offline'}><i className="fa fa-power-off" aria-hidden="true"></i></div>
            </div>
            <div className='ActiveServerView__details'>
              {server.name}
              {server.characterCount ? <div className='ActiveServerView__access'>{server.characterCount} Characters</div> : null}
              {server.accessLevel ? <div className='ActiveServerView__access'>{webAPI.accessLevelString(server.accessLevel)} Access Only</div> : null}
            </div>
            <div className='ActiveServerView__controls'>
              <span className='simptip-position-left simptip-fade' data-tooltip='coming soon'>
                <i className="fa fa-line-chart" aria-hidden="true"></i>
              </span>
              {server.channelStatus == ChannelStatus.NotInstalled ? ' ' : (
                <span className='simptip-position-left simptip-fade' data-tooltip='uninstall'
                      onClick={() => patcher.uninstallChannel(server.channelID)}>
                  <i className="fa fa-times" aria-hidden="true"></i>
                </span>
              )}
            </div>
          </div>
        );
    }
  }
}

export interface ServerSelectProps {
  selectServer: (server: PatcherServer) => void;
  servers: utils.Dictionary<PatcherServer>;
  serverType: ServerType;
  initialServer: PatcherServer;
}

export interface ServerSelectState {
  selectedServer: PatcherServer;
}

class ServerSelect extends React.Component<ServerSelectProps, ServerSelectState> {

  constructor(props: ServerSelectProps) {
    super(props);

    this.state = {
      selectedServer: props.initialServer,
    };
  }

  selectServer = (server: PatcherServer) => {
    this.props.selectServer(server);
    this.setState({selectedServer: server} as any);
  }

  render() {
    const {servers} = this.props;

    if (this.props.serverType != ServerType.CUGAME && this.props.serverType != ServerType.CHANNEL) {
      return null;
    }

    if (!servers || Object.keys(servers).length == 0) {
      // TODO: Better error message & a spinner or some shit
      return <div className='ServerSelect ServerSelect--fetching'>
        <div className='wave-text'><i>|</i><i>|</i><i>|</i><i>|</i><i>|</i><i>|</i><i>|</i></div>
        Fetching Servers
      </div>;
    }

    let values: PatcherServer[] = [];
    for (const key in servers) {
      if (servers[key].type == this.props.serverType && canAccessChannel(patcher.getPermissions(), servers[key].channelPatchPermissions)) {
         values.push(servers[key]);
      }
    }

    if (values.length == 0) {
      return <div className='ServerSelect'> No Servers Available </div>;
    }

    let {selectedServer} = this.state;
    if (selectedServer === null || typeof selectedServer === 'undefined' || selectedServer.type != this.props.serverType) {
      // get from local storage or use the first in the list.
      selectedServer = values[0];
      this.selectServer(selectedServer);
    }

    return <QuickSelect items={values}
                        containerClass='ServerSelect'
                        selectedItemIndex={utils.findIndexWhere(values, s => s.name === selectedServer.name)}
                        activeViewComponentGenerator={s => <ActiveServerView server={s} />}
                        listViewComponentGenerator={s => <ServerListView server={s} />}
                        itemHeight={67}
                        onSelectedItemChanged={this.selectServer} />;
  }
}

export default ServerSelect;
