/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-07 12:07:38
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-31 16:04:17
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {webAPI, events, utils} from 'camelot-unchained';

import {patcher, Channel, ChannelStatus, PatchPermissions} from '../../../../services/patcher';
import {CSENormalizeString} from '../../../../lib/CSENormalizeString';

import Animate from '../../../../lib/Animate';

import LayeredDiv from '../LayeredDiv';
import EualaModal from '../EualaModal';
import CommandLineArgsModal from '../CommandLineArgsModal';
import UninstallButton from '../UninstallButton';
import {ServerType, PatcherServer} from '../../services/session/controller';

import {Progress} from '../../lib/Progress';

export interface PatchButtonProps {
  servers: utils.Dictionary<PatcherServer>;
  selectedServer: PatcherServer;
  selectedCharacter: webAPI.SimpleCharacter;
}

export interface PatchButtonState {
  showEuala: boolean;
};

class PatchButton extends React.Component<PatchButtonProps, PatchButtonState> {
  private startDownload: number;
  private commands: string = '';
  private installingChannel: number;
  private installingChannelName: string;

  constructor(props: PatchButtonProps) {
    super(props);
    this.state = {
      showEuala: false,
    };
  }

  componentWillReceiveProps(nextProps: PatchButtonProps) {
    for (const key in nextProps.servers) {
      const s = nextProps.servers[key];
      if (s.channelStatus === ChannelStatus.Updating) {
        if (this.installingChannel !== s.channelID) this.startDownload = undefined;
        this.installingChannel = s.channelID;
        this.installingChannelName = s.name;
        return;
      }
    }
    this.installingChannel = -1;
    this.startDownload = undefined;    
  }

  playSound = (sound: string) => {
    events.fire('play-sound', sound);
  }

  playOffline = (evt: React.MouseEvent) => {
    if (evt.altKey) return this.playNow(evt);
    alert('Server is offline! - Hold alt + click Play Offline to pass command line arguments.');
  }

  playNow = (evt: React.MouseEvent) => {
    const {selectedServer} = this.props;

    if (evt.altKey) {
      const serverName: string = selectedServer ? selectedServer.name : 'cube';
      let channelCommand: string = localStorage.getItem('CSE_COMMANDS_' + serverName) || '';
      channelCommand = window.prompt('Please enter your command line parameters for ' + serverName, channelCommand);
      localStorage.setItem('CSE_COMMANDS_' + serverName, channelCommand);
      if (!channelCommand) {
        localStorage.removeItem('CSE_COMMANDS_' + serverName);
      }
      this.commands = channelCommand;
    } else {
      this.commands = '';
    }

    
    // Save selected channel, server, and character
    const lastPlay = {
      channelID: selectedServer.channelID as number,
      serverName: null as string,
      characterID: null as string
    };
    if (selectedServer) lastPlay.serverName = selectedServer.name;
    if (selectedServer.selectedCharacter) lastPlay.characterID = selectedServer.selectedCharacter.id;
    localStorage.setItem('cse-patcher-lastplay', JSON.stringify(lastPlay));

    // Display EULA if CU game
    if (selectedServer.type != ServerType.CHANNEL) {
      this.setState({ showEuala: true } as any);
      this.playSound('select');
    } else {
      this.launchClient();
    }
  }

  closeEualaModal = () => {
    this.setState({ showEuala: false } as any);
  }

  launchClient = () => {
    const {selectedServer, selectedCharacter} = this.props;
    if (!selectedServer) return;

    this.setState({ showEuala: false } as any);
    let launchString = this.commands.toLowerCase();
    if (selectedCharacter && selectedCharacter.id !== '' && selectedServer.channelID != 27) {
      if (!launchString.includes('servershardid') && !launchString.includes('server')) launchString += ` servershardid=${selectedServer.shardID}`;
      if (!launchString.includes('character')) launchString += ` character=${selectedCharacter.id}`;
      launchString += ' autoconnect=1';
    }
    patcher.launchChannelfunction(selectedServer.channelID | 0, launchString);
    this.playSound('launch-game');
  }

  install = () => {
    const {selectedServer} = this.props;
    patcher.installChannel(selectedServer.channelID | 0);
    this.startDownload = undefined;
    this.playSound('select');
  }

  uninstall = () => {
    const {selectedServer} = this.props;
    patcher.uninstallChannel(selectedServer.channelID | 0);
    this.playSound('select');
  }

  renderButton = () => {
    const {selectedServer} = this.props;
    let videoElements: any = document.getElementsByTagName('video');

    // get status for channel this server uses from patcher api directly
    //const channels = patcher.getAllChannels();
    //const index = utils.findIndexWhere(channels, c => c.channelID === selectedServer.channelID);

    switch (selectedServer.channelStatus) {
      
      case ChannelStatus.NotInstalled:
        return <div className='PatchButton__button' onClick={this.install}>Install</div>;
      
      case ChannelStatus.Validating:
        this.startDownload = undefined;
        return <div className='PatchButton__button PatchButton__button--disabled'>Validating</div>;
      
      case ChannelStatus.Updating:

        return <div className='PatchButton__button PatchButton__button--disabled'>Installing</div>;
      
      case ChannelStatus.OutOfDate:
        return <div className='PatchButton__button PatchButton__button--disabled'>Awaiting Update</div>;
      
      case ChannelStatus.Ready:

        for (let vid: any = 0; vid < videoElements.length; vid++) {
          videoElements[vid].play();
        }

        this.startDownload = undefined;

        const permissions = patcher.getPermissions();

        if (selectedServer.type === ServerType.CUGAME) {
          if (!selectedServer.available && (permissions & (PatchPermissions.Devs | PatchPermissions.IT)) == 0) {
            return <div className='PatchButton__button PatchButton__button--disabled'>Server Offline</div>;
          } else if (!selectedServer.available) {
            return <div className='PatchButton__button PatchButton__button--warning' onClick={this.playOffline}>Play Offline</div>;
          } else if (!selectedServer.characterCount || !this.props.selectedCharacter) {
            return <div className='PatchButton__button PatchButton__button--disabled PatchButton__button--smallerText'>No Character Selected</div>;
          } else {
            return <div className='PatchButton__button PatchButton__button--success' onClick={this.playNow}>Play Now</div>;
          }
        }
        
        return <div className='PatchButton__button PatchButton__button--success' onClick={this.playNow}>Play Now</div>;
      
      case ChannelStatus.Launching:
        return <div className='PatchButton__button PatchButton__button--disabled'>Launching</div>;
      
      case ChannelStatus.Running:
        for (let vid: any = 0; vid < videoElements.length; vid++) {
          videoElements[vid].pause();
        }
        return <div className='PatchButton__button PatchButton__button--disabled'>Playing</div>;
      
      case ChannelStatus.Uninstalling:
        this.startDownload = undefined;
        return <div className='PatchButton__button PatchButton__button--disabled'>Uninstalling</div>;
      
      case ChannelStatus.UpdateFailed:
        return <div className='PatchButton__button PatchButton__button--error' onClick={this.install}>Update Failed.</div>;
    }
  }

  renderProgressText = () => {
    
    if (this.installingChannel === -1) return null;

    if (this.startDownload === undefined) this.startDownload = Date.now();

    const downloadRate: number = patcher.getDownloadRate();
    const downloadRemaining: number = patcher.getDownloadRemaining();
    const estimate: number = patcher.getDownloadEstimate();

    const percentDone = estimate ? 100.0 - ((downloadRemaining / estimate) * 100) : 0;
    // bar!
    //layers.push(() => <div className='fill' style={{ width: percentDone + '%', opacity: 1 }} />);

    const downloadDuration: number = (Date.now() - this.startDownload) / 1000;
    const remainingTime: number = percentDone ? ((100 / percentDone) * downloadDuration) - downloadDuration : undefined;
    const time: string = percentDone ? Progress.secondsToString(remainingTime) : 'starting';
    const rate: string = Progress.bypsToString(downloadRate);
    const dataSize: string = Progress.bytesToString(estimate - downloadRemaining) + ' of ' + Progress.bytesToString(estimate);
    const percentDisplay: string = percentDone ? '(' + Math.round(percentDone * 100) / 100.0 + '%)' : '';

    return (
        <div className='PatchButton__updateText'>
          <div>Updating {this.installingChannelName}...</div>
          <div>{time} estimated remaining</div>
          <div>{dataSize} ({rate})</div>
        </div>
    );
  }

  render() {
    const {selectedServer} = this.props;
    if (!selectedServer) {
      return null;
    }
    return (
      <div className='PatchButton'>
        
        <div className='PatchButton__updateGroup'>
          <div>
            {this.renderButton()}
            <label>Updated {selectedServer.channelStatus !== ChannelStatus.NotInstalled && selectedServer.lastUpdated ? selectedServer.lastUpdated : 'never'}.</label>          
          </div>
          {this.renderProgressText()}
        </div>
        
        <Animate animationEnter='slideInUp' animationLeave='slideOutDown' durationEnter={400} durationLeave={500}>
          
          {this.state.showEuala ? (<div className='fullscreen-blackout flex-row' key='accept-euala'>
                                      <EualaModal accept={this.launchClient} decline={this.closeEualaModal} />
                                    </div>) : null}
        
        </Animate>
      </div>
    );
  }
}

export default PatchButton;
