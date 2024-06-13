/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import moment from 'moment';
import { styled } from '@csegames/linaria/react';

import { patcher, ChannelStatus } from '../../../../services/patcher';
import Animate from '../../../../lib/Animate';
import UpdateMessage from './components/UpdateMessage';
import PatchButtonView from './components/PatchButtonView';
import EualaModal from '../EualaModal';
import { ControllerContext, ServerType, PatcherServer } from '../../ControllerContext';
import { Dictionary } from '../../../../lib/Dictionary';
import { globalEvents } from '../../../../lib/EventEmitter';
import { Sound, playSound } from '../../../../lib/Sound';
import { SimpleCharacter } from '../../../../api/helpers';

declare const toastr: any;

const CHANNEL_CUBE = 27;

const Container = styled.div`
  display: flex;
  flex-direction: row-reverse;
  font-weight: 200;
`;

const UpdateInfoContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  label {
    color: #8f8f8f;
    font-size: 0.9em;
  }
`;

const LastUpdatedText = styled.label`
  display: flex;
  align-items: flex-end;
  margin-right: 5px;
  padding-bottom: 5px;
  font-size: 12px;
  font-weight: normal;
`;

const ButtonContainer = styled.div`
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
  eualaSource: string;
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
      eualaSource: null,
      installingChannel: -1,
      installingChannelName: ''
    };
  }

  public render() {
    const { selectedServer } = this.props;
    let lastUpdatedText;
    if (!selectedServer) {
      return null;
    }

    if (
      selectedServer.channelStatus !== ChannelStatus.NotInstalled &&
      selectedServer.lastUpdated &&
      selectedServer.lastUpdated > 0
    ) {
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
            onStartDownloadChange={(startDownload) => (this.startDownload = startDownload)}
          />
        </UpdateInfoContainer>
        <Animate animationEnter='slideInUp' animationLeave='slideOutDown' durationEnter={400} durationLeave={500}>
          {this.state.eualaSource ? (
            <div className='fullscreen-blackout flex-row' key='accept-euala'>
              <EualaModal source={this.state.eualaSource} accept={this.launchClient} decline={this.closeEualaModal} />
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

  private pauseMusic = (paused: boolean) => {
    globalEvents.trigger('pause-music', paused);
  };

  private playOffline = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (evt.altKey) return this.playNow(evt);
    alert('Server is offline! - Hold alt + click Play Offline to pass command line arguments.');
  };

  private noAccess = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (evt.altKey) return this.playNow(evt);
  };

  private playNow = (evt: React.MouseEvent<HTMLDivElement>) => {
    const { selectedServer, selectedCharacter } = this.props;

    if (evt.altKey) {
      const serverName: string = selectedServer ? selectedServer.name : 'cube';
      let channelCommand: string = localStorage.getItem('CSE_COMMANDS_' + serverName) || '';
      channelCommand = window.prompt('Please enter your command line parameters for ' + serverName, channelCommand);

      if (channelCommand != null) {
        // If non-null was returned, the player hit "OK" on the prompt.
        // We want to both save and use the commands that they entered
        localStorage.setItem('CSE_COMMANDS_' + serverName, channelCommand);
        this.commands = channelCommand;
      } else {
        // Null was returned, which means the player hit "cancel" on the prompt.
        // don't save the command line parameters, but also don't use them.
        this.commands = '';
      }
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
    if (selectedCharacter) lastPlay.characterID = selectedCharacter.id;
    localStorage.setItem('cse-patcher-lastplay', JSON.stringify(lastPlay));

    // EUALA source for selected game
    switch (this.props.selectedServer.type) {
      case ServerType.CUBE:
      case ServerType.CUGAME:
        this.setState({ eualaSource: 'https://camelotunchained.com/v3/euala.html' });
        break;

      case ServerType.COLOSSUS:
        this.setState({ eualaSource: 'https://finalstandgame.com/EUALA.html' });
        break;

      default:
        this.launchClient();
        break;
    }

    playSound(Sound.LaunchGame);
  };

  private closeEualaModal = () => {
    this.setState({ eualaSource: null });
  };

  private launchClient = () => {
    const { selectedServer, selectedCharacter } = this.props;
    if (!selectedServer) {
      toastr.error('There was a problem.', 'Oh no!', 5000);
      console.error('Could not get selectedServer for product: ' + patcher.product);
      return;
    }

    this.setState({ eualaSource: null });

    let launchString = this.commands ? this.commands : '';
    if (selectedServer.channelID !== CHANNEL_CUBE) {
      if (selectedServer.shardID) {
        launchString = this.addUniqueToLaunchString(
          launchString,
          ['servershardid', 'server'],
          `servershardid=${selectedServer.shardID}`
        );
      }

      const apiHost = selectedServer.apiHost || patcher.getApiHost();
      launchString = this.addUniqueToLaunchString(
        launchString,
        'masterserver',
        `masterserver=${apiHost.replace('https://', '')}`
      );

      if (selectedCharacter) {
        launchString = this.addUniqueToLaunchString(launchString, 'character', `character=${selectedCharacter.id}`);
      }

      launchString = this.addUniqueToLaunchString(launchString, 'webapihost', `webapihost=${apiHost}`);

      if (selectedServer.type == ServerType.CUGAME) {
        launchString = this.addUniqueToLaunchString(launchString, 'autoconnect', 'autoconnect=1');
      }
    }

    patcher.launchChannelfunction(selectedServer.channelID | 0, launchString);
    this.channelUpdateTimeout = window.setTimeout(() => this.props.updateChannels(), 200);
    playSound(Sound.Select);
  };

  private addUniqueToLaunchString = (launchString: string, keys: string | string[], value: string) => {
    // Only adds to launch string if the given keys have not already been defined
    let lowercaseLaunchString = launchString.toLowerCase();
    let launchStringClone = launchString;
    let doesInclude = false;

    if (!Array.isArray(keys)) {
      if (lowercaseLaunchString.includes(`${keys}=`) || lowercaseLaunchString.includes(`${keys} =`)) {
        doesInclude = true;
      }
    } else {
      keys.forEach((key) => {
        if (lowercaseLaunchString.includes(`${key}=`) || lowercaseLaunchString.includes(`${key} =`)) {
          doesInclude = true;
        }
      });
    }

    if (!doesInclude) {
      launchStringClone += ` ${value}`;
    }

    return launchStringClone;
  };

  private install = () => {
    const { selectedServer } = this.props;
    patcher.installChannel(selectedServer.channelID | 0);
    this.channelUpdateTimeout = window.setTimeout(this.props.updateChannels, 200);
    playSound(Sound.Select);
  };

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
  };
}

class PatchButtonWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <ControllerContext.Consumer>
        {({ updateChannels }) => {
          return <PatchButton {...this.props} updateChannels={updateChannels} />;
        }}
      </ControllerContext.Consumer>
    );
  }
}

export default PatchButtonWithInjectedContext;
