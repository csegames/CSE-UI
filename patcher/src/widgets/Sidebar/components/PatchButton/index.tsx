/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-07 12:07:38
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-09-07 17:50:20
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {Server} from '../../services/session/servers';
import {patcher, Channel, ChannelStatus} from '../../../../services/patcher';
import {CSENormalizeString} from '../../../../lib/CSENormalizeString';
import {restAPI, events} from 'camelot-unchained';

import Animate from '../../../../lib/Animate';

import EualaModal from './components/EualaModal';
import CommandLineArgsModal from './components/CommandLineArgsModal';
import UninstallButton from './components/UninstallButton';
import {ServersState, ServerType} from '../../services/session/servers';

//This should probably live elsewhere, maybe it already does?
enum ChannelID {
    Hatchery = 4,
    Wyrmling = 10,
    WyrmlingPrep = 11,
    CUBE = 27
}

export class Progress {
  constructor(public rate: number = 0, public dataCompleted: number = 0, public totalDataSize: number = 0) { }

  public timeEstimate = () => {
    return Progress.secondsToString((this.remaining() * 8) / this.rate);
  }

  public remaining = () => {
    return this.totalDataSize - this.dataCompleted;
  }

  static bytesToString(bytes: number): string {
    if (bytes >= 1099511627776) {
      // display as TB
      return (bytes / 1099511627776).toFixed(2) + 'TB';
    } else if (bytes >= 1073741824) {
      // display as GB
      return (bytes / 1073741824).toFixed(2) + 'GB';
    } else if (bytes >= 1048576) {
      // display as MB
      return (bytes / 1048576).toFixed(2) + 'MB';
    } else {
      // display rest as KB
      return (bytes / 1024).toFixed(2) + 'KB';
    }
  }

  static bypsToString(bytes: number): string {
    if (bytes >= 1000000000) {
      // display as GB
      return (bytes / 1000000000).toFixed(2) + 'GB/s';
    } else if (bytes >= 1000000) {
      // display as MB
      return (bytes / 1000000).toFixed(2) + 'MB/s';
    } else {
      // display rest as KB
      return (bytes / 1000).toFixed(2) + 'KB/s';
    }
  }

  static secondsToString(val: number): string {
    let days = Math.floor(val / 86400)
    let hours = Math.floor((val % 86400) / 3600);
    let minutes = Math.floor((val % 3600) / 60);
    let seconds = Math.floor(val % 60);
    return (days > 0 ? days + 'd ' : '')
      + (hours > 0 ? hours + 'h ' : '')
      + (minutes < 10 ? '0' + minutes + 'm ' : minutes + 'm ')
      + (seconds < 10 ? '0' + seconds + 's ' : seconds + 's ');
  }
}

function mapToProps(state: any): any {
  return {
    serversState: state.servers,
    channelsState: state.channels,
    charactersState: state.characters
  }
};

export interface PatchButtonProps {
  dispatch?: (action: any) => void;
  serversState?: ServersState;
};

export interface PatchButtonState {
  showEuala: boolean;
  
};

class PatchButton extends React.Component<PatchButtonProps, PatchButtonState> {
  public name: string = 'cse-patcher-patch-button';
  private intervalHandle: any;
  private startDownload: number;
  private unready: boolean;
  private commands: string = '';

  constructor(props: PatchButtonProps) {
    super(props);
    this.state = { showEuala: false };
  }

  componentDidMount() {
    this.intervalHandle = setInterval(() => {
      this.setState({ showEuala: this.state.showEuala });
    }, 500);
  }

  componentDidUnMount() {
    // unregister intervals
    clearInterval(this.intervalHandle);
  }

  onClicked = (event: React.MouseEvent): void => {
    const {selectedServer} = this.props.serversState;

    switch (selectedServer.channelStatus) {
      case ChannelStatus.NotInstalled: this.install(); break;
      case ChannelStatus.Validating: break;
      case ChannelStatus.Updating: break;
      case ChannelStatus.OutOfDate: this.install(); break;
      case ChannelStatus.Ready:
        if (event.altKey) {
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

        this.playNow();
        break;
      case ChannelStatus.Launching: break;
      case ChannelStatus.Running: break;
      case ChannelStatus.Uninstalling: break;
      case ChannelStatus.UpdateFailed: this.install(); break;
    }
  }

  playNow = () => {
    const {selectedServer} = this.props.serversState;
    
    // Save selected channel, server, and character
    const lastPlay = {
      channelID: selectedServer.channelID as number,
      serverName: null as string,
      characterID: null as string
    };
    if (selectedServer) lastPlay.serverName = selectedServer.name;
    if (selectedServer.selectedCharacter) lastPlay.characterID = selectedServer.selectedCharacter.id;
    localStorage.setItem('cse-patcher-lastplay', JSON.stringify(lastPlay));

    // Display EULA
    this.setState({ showEuala: true });
    events.fire('play-sound', 'select');
  }

  closeEualaModal = () => {
    this.setState({ showEuala: false });
  }

  launchClient = () => {
    const {selectedServer} = this.props.serversState;
    if (!selectedServer) return;

    this.setState({ showEuala: false });
    let launchString = this.commands;
    if (selectedServer.selectedCharacter && selectedServer.selectedCharacter.id !== '' && selectedServer.channelID != 27) {
      launchString += ` server=${selectedServer.host} autoconnect=1 character=${CSENormalizeString(selectedServer.selectedCharacter.name)}`
    }
    patcher.launchChannelfunction(selectedServer.channelID | 0, launchString);
    events.fire('play-sound', 'launch-game');
  }

  install = () => {
    const {selectedServer} = this.props.serversState;
    patcher.installChannel(selectedServer.channelID | 0);
    this.startDownload = undefined;
    events.fire('play-sound', 'select');
  }

  uninstall = () => {
    const {selectedServer} = this.props.serversState;
    patcher.uninstallChannel(selectedServer.channelID | 0);
    events.fire('play-sound', 'select');
  }

  generateEualaModal = () => {
    return (
      <div className='fullscreen-blackout flex-row' key='accept-euala'>
        <EualaModal accept={this.launchClient} decline={this.closeEualaModal} />
      </div>
    );
  }

  //The CC on this function is getting out of control it needs to be broken up
  render() {
    const {selectedServer} = this.props.serversState;
    if (!selectedServer) return <div>fetching servers...</div>;
    
    let uninstall: any = null;
    let layer1: any = null;
    let layer2: any = null;
    let layer3: any = null;

    let videoElements: any = document.getElementsByTagName('video');

    switch (this.props.serversState.selectedServer.channelStatus) {
      case ChannelStatus.NotInstalled:
        layer1 = <a className='waves-effect btn install-download-btn uninstalled' onClick={this.onClicked}>Install</a>;
        break;
      case ChannelStatus.Validating:
        layer1 = <a className='waves-effect btn install-download-btn installing'>Validating</a>;
        this.startDownload = undefined;
        break;
      case ChannelStatus.Updating:
        this.unready = true;
        layer1 = <a className='waves-effect btn install-download-btn installing'>Installing</a>;

        if (this.startDownload === undefined) {
          this.startDownload = Date.now();
        }

        const downloadRate: number = patcher.getDownloadRate();
        const downloadRemaining: number = patcher.getDownloadRemaining();
        const estimate: number = patcher.getDownloadEstimate();

        const percentDone = estimate ? 100.0 - ((downloadRemaining / estimate) * 100) : 0;
        layer2 = <div className='fill' style={{ width: percentDone + '%', opacity: 1 }} />;

        const downloadDuration: number = (Date.now() - this.startDownload) / 1000;
        const remainingTime: number = percentDone ? ((100 / percentDone) * downloadDuration) - downloadDuration : undefined;
        const time: string = percentDone ? Progress.secondsToString(remainingTime) : 'starting';
        const rate: string = Progress.bypsToString(downloadRate);
        const dataSize: string = Progress.bytesToString(estimate - downloadRemaining) + '/' + Progress.bytesToString(estimate);
        const percentDisplay: string = percentDone ? '(' + Math.round(percentDone * 100) / 100.0 + '%)' : '';
        layer3 = (
          <div className='text'>
            <div className='progress-text'><span className='body'>{time}</span></div>
            <div className='progress-text'><span className='body'>{rate}</span></div>
            <div className='progress-text'><span className='body'>{dataSize} {percentDisplay}</span></div>
          </div>
        );
        break;
      case ChannelStatus.OutOfDate:
        layer1 = <a className='waves-effect btn install-download-btn installing'>Awaiting Update</a>;
        break;
      case ChannelStatus.Ready:
        if (this.unready) {
          events.fire('play-sound', 'patch-complete');
          this.unready = false;
        }
        for (let vid: any = 0; vid < videoElements.length; vid++) {
          videoElements[vid].play();
        }

        if (selectedServer && selectedServer.type == ServerType.CUGAME) {
            if (!selectedServer.maxPlayers || selectedServer.maxPlayers === 0) {
              layer1 = <div className='waves-effect btn install-download-btn installing'>OFFLINE</div>;
            } else if (!selectedServer.characters || selectedServer.characters.length == 0) {
              layer1 = <div className='waves-effect btn install-download-btn installing'>Create Character</div>;
            } else if (!selectedServer.selectedCharacter) {
              layer1 = <div className='waves-effect btn install-download-btn installing'>Select Character</div>;
            } else {
              layer1 = <a className='waves-effect btn install-download-btn ready' onClick={this.onClicked.bind(event) }>Play Now</a>;
            }
        } else {
          layer1 = <a className='waves-effect btn install-download-btn ready' onClick={this.onClicked.bind(event) }>Play Now</a>;
        }

        uninstall = <UninstallButton uninstall={this.uninstall} name={selectedServer.name}/>;
        this.startDownload = undefined;
        break;
      case ChannelStatus.Launching:
        layer1 = <a className='waves-effect btn install-download-btn installing'>Launching</a>;
        break;
      case ChannelStatus.Running:
        layer1 = <a className='waves-effect btn install-download-btn installing'>Playing</a>;
        for (let vid: any = 0; vid < videoElements.length; vid++) {
          videoElements[vid].pause();
        }
        break;
      case ChannelStatus.Uninstalling:
        layer1 = <a className='waves-effect btn install-download-btn installing'>Uninstalling</a>;
        this.startDownload = undefined;
        break;
      case ChannelStatus.UpdateFailed:
        layer1 = <a className='waves-effect btn install-download-btn uninstalled' onClick={this.onClicked}>Update Failed.Try Again.</a>;
        this.startDownload = undefined;
        break;
    }

    // euala modal
    let eualaModal: any = this.state.showEuala ? this.generateEualaModal() : null;

    return (
      <div>
        <div id={this.name}>
          <div className='layer z1'>
            {layer1}
          </div>
          <div className='layer z2'>
            {layer2}
          </div>
          <div className='layer z3'>
            {layer3}
          </div>
        </div>
        {uninstall}
        <Animate animationEnter='slideInUp' animationLeave='slideOutDown'
          durationEnter={400} durationLeave={500}>
          {eualaModal}
        </Animate>
      </div>
    );
  }
}

export default connect(mapToProps)(PatchButton);
