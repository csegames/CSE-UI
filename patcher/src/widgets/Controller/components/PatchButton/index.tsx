/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import moment from 'moment';
import styled from 'react-emotion';

import { patcher, ChannelStatus } from '../../../../services/patcher';
import Animate from '../../../../lib/Animate';
import UpdateMessage from './components/UpdateMessage';
import PatchButtonView from './components/PatchButtonView';
import EualaModal from '../EualaModal';
import { ControllerContext, ServerType, PatcherServer } from '../../ControllerContext';
import { SimpleCharacter } from 'gql/interfaces';

const Container = styled('div')`
  display: flex;
  flex-direction: row-reverse;
  font-weight: 200;
`;

const UpdateInfoContainer = styled('div')`
  display: flex;
  flex-direction: row-reverse;
  label {
    color: #8f8f8f;
    font-size: 0.9em;
  }
`;

const LastUpdatedText = styled('label')`
  display: flex;
  align-items: flex-end;
  margin-right: 5px;
  padding-bottom: 5px;
  font-size: 12px;
  font-weight: normal;
`;

const ButtonContainer = styled('div')`
  display: flex;
  z-index: 10;
`;

export interface ComponentProps {
  servers: Dictionary<PatcherServer>;
  selectedServer: PatcherServer;
  selectedCharacter: SimpleCharacter;
}

export interface InjectedProps {
  updateChannels: () => void;
}

export type Props = ComponentProps & InjectedProps;

export interface PatchButtonState {
  showEuala: boolean;
  installingChannel: number;
  installingChannelName: string;
}

class PatchButton extends React.Component<Props, PatchButtonState> {
  private commands: string = '';
  private startDownload: number;
  private channelUpdateTimeout: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      showEuala: false,
      installingChannel: -1,
      installingChannelName: '',
    };
  }

  public render() {
    const { selectedServer } = this.props;
    let lastUpdatedText;
    if (!selectedServer) {
      return null;
    }

    if (selectedServer.channelStatus !== ChannelStatus.NotInstalled &&
        (selectedServer.lastUpdated && selectedServer.lastUpdated > 0)) {
      lastUpdatedText = `Updated ${moment(selectedServer.lastUpdated).fromNow()}`;
    }

    return (
      <Container>
        <UpdateInfoContainer>
          <ButtonContainer>
            <PatchButtonView
              selectedServer={selectedServer}
              selectedCharacter={this.props.selectedCharacter}
              onInstallClick={this.install}
              onPlayClick={this.playNow}
              onPlayOfflineClick={this.playOffline}
              onNoAccessClick={this.noAccess}
              onPauseMusic={this.pauseMusic}
              shouldPauseMusic={this.shouldPauseMusic}
            />
          </ButtonContainer>
          <LastUpdatedText>{lastUpdatedText}</LastUpdatedText>
          <UpdateMessage
            installingChannelName={this.state.installingChannelName}
            installingChannel={this.state.installingChannel}
            startDownload={this.startDownload}
            onStartDownloadChange={startDownload => this.startDownload = startDownload}
          />
        </UpdateInfoContainer>
        <Animate animationEnter='slideInUp' animationLeave='slideOutDown' durationEnter={400} durationLeave={500}>
          {this.state.showEuala ? (
            <div className='fullscreen-blackout flex-row' key='accept-euala'>
              <EualaModal accept={this.launchClient} decline={this.closeEualaModal} />
            </div>
          ) : null}
        </Animate>
      </Container>
    );
  }

  public componentWillReceiveProps(nextProps: Props) {
    for (const key in nextProps.servers) {
      const s = nextProps.servers[key];
      if (s.channelStatus === ChannelStatus.Updating) {
        if (this.state.installingChannel !== s.channelID) this.startDownload = undefined;
        this.setState({ installingChannel: s.channelID, installingChannelName: s.name });
        return;
      }
    }
    this.setState({ installingChannel: -1 });
  }

  public componentWillUnmount() {
    window.clearTimeout(this.channelUpdateTimeout);
  }

  private playSound = (sound: string) => {
    game.trigger('play-sound', sound);
  }

  private pauseMusic = (paused: boolean) => {
    game.trigger('pause-music', paused);
  }

  private playOffline = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (evt.altKey) return this.playNow(evt);
    alert('Server is offline! - Hold alt + click Play Offline to pass command line arguments.');
  }

  private noAccess = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (evt.altKey) return this.playNow(evt);
  }

  private playNow = (evt: React.MouseEvent<HTMLDivElement>) => {
    const { selectedServer } = this.props;

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
      characterID: null as string,
    };
    if (selectedServer) lastPlay.serverName = selectedServer.name;
    if (selectedServer.selectedCharacter) lastPlay.characterID = selectedServer.selectedCharacter.id;
    localStorage.setItem('cse-patcher-lastplay', JSON.stringify(lastPlay));

    // Display EULA if CU game
    if (selectedServer.type !== ServerType.CHANNEL) {
      this.setState({ showEuala: true });
      this.playSound('launch-game');
    } else {
      this.launchClient();
      this.playSound('launch-game');
    }
  }

  private closeEualaModal = () => {
    this.setState({ showEuala: false });
  }

  private launchClient = () => {
    const { selectedServer, selectedCharacter } = this.props;
    if (!selectedServer) return;

    this.setState({ showEuala: false });
    let launchString = this.commands ? this.commands.toLowerCase() : '';
    if (selectedCharacter && selectedCharacter.id !== '' && selectedServer.channelID !== 27) {

      if (!launchString.includes('servershardid') &&
          !launchString.includes('server =') &&
          !launchString.includes('server=')) {
        launchString += ` servershardid=${selectedServer.shardID}`;
      }

      if (!launchString.includes('masterserver=') && !launchString.includes('masterserver =')) {
        launchString += ` masterserver=${selectedServer.apiHost.replace('https://', '')}`;
      }

      if (!launchString.includes('character=') &&
          !launchString.includes('character =')) {
        launchString += ` character=${selectedCharacter.id}`;
      }

      const apiHost = selectedServer.apiHost || 'https://api.camelotunchained.com';

      if (!launchString.includes('webapihost=') &&
          !launchString.includes('webapihost =')) {
        launchString += ` webapihost=${apiHost}`;
      }

      launchString += ' autoconnect=1';
    }

    patcher.launchChannelfunction(selectedServer.channelID | 0, launchString);
    this.channelUpdateTimeout = window.setTimeout(() => this.props.updateChannels(), 200);
    this.playSound('select');
  }

  private install = () => {
    const { selectedServer } = this.props;
    patcher.installChannel(selectedServer.channelID | 0);
    this.channelUpdateTimeout = window.setTimeout(this.props.updateChannels, 200);
    this.playSound('select');
  }

  private shouldPauseMusic = () => {
    const { servers } = this.props;
    let running = false;
    if (servers) {
      for (const key in servers) {
        const server = servers[key];
        if (server.channelStatus === ChannelStatus.Running) {
          running = true;
        }
      }
    }
    // music should be paused if there are any clients running
    return running;
  }
}

class PatchButtonWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <ControllerContext.Consumer>
        {({ updateChannels }) => {
          return (
            <PatchButton {...this.props} updateChannels={updateChannels} />
          );
        }}
      </ControllerContext.Consumer>
    );
  }
}

export default PatchButtonWithInjectedContext;
