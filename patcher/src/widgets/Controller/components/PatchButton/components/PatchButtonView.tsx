/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { webAPI } from '@csegames/camelot-unchained';
import {
  // patcher,
  ChannelStatus,
//  PatchPermissions
} from '../../../../../services/patcher';
import { ServerType, PatcherServer } from '../../../services/session/controller';
import PlayNowButton from './PlayNowButton';
import DisabledButton from './DisabledButton';
import DownloadingButton from './DownloadingButton';
import ErrorButton from './ErrorButton';

export interface ButtonProps {
  selectedServer: PatcherServer;
  selectedCharacter: webAPI.SimpleCharacter;
  onInstallClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onPlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onPlayOfflineClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onNoAccessClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onPauseMusic: (shouldPause?: boolean) => void;
  shouldPauseMusic: () => boolean;
}

export interface ButtonState {

}

class Button extends React.Component<ButtonProps, ButtonState> {
  public render() {
    const { selectedServer } = this.props;
    const videoElements: any = document.getElementsByTagName('video');

    switch (selectedServer.channelStatus) {

      case ChannelStatus.NotInstalled:
        return (
          <PlayNowButton text='Install' onClick={this.props.onInstallClick} />
        );

      case ChannelStatus.Validating:
        return (
          <DownloadingButton text='Validating' />
        );

      case ChannelStatus.Updating:
        return (
          <DownloadingButton text='Installing' />
        );

      case ChannelStatus.OutOfDate:
        return (
          <DisabledButton text='Awaiting Update' />
        );

      case ChannelStatus.Ready:

        this.props.onPauseMusic(this.props.shouldPauseMusic());
        for (let vid: any = 0; vid < videoElements.length; vid++) {
          videoElements[vid].play();
        }

        // const permissions = patcher.getPermissions();
        if (selectedServer.type === ServerType.CUGAME) {
          // if (!selectedServer.available && (permissions & (PatchPermissions.Devs | PatchPermissions.IT)) === 0) {
          //   return (
          //     <DisabledButton text='Server Offline' />
          //   );
          // } else
          if (!selectedServer.available) {
            return (
              <DisabledButton text='Play Offline' onClick={this.props.onPlayOfflineClick} />
            );
          } else if (!selectedServer.characterCount || !this.props.selectedCharacter) {
            return (
              <DisabledButton text='No Character Selected' fontSize={'1.1em'} />
            );
          } else {
            return (
              <PlayNowButton text='Play Now' onClick={this.props.onPlayClick} />
            );
          }
        }

        return (
          <PlayNowButton text='Play Now' onClick={this.props.onPlayClick} />
        );

      case ChannelStatus.Launching:
        return (
          <DisabledButton text='Launching' />
        );

      case ChannelStatus.Running:
        this.props.onPauseMusic(true);
        for (let vid: any = 0; vid < videoElements.length; vid++) {
          videoElements[vid].pause();
        }
        return (
          <DisabledButton text='Playing' />
        );

      case ChannelStatus.Uninstalling:
        return (
          <DisabledButton text='Uninstalling' />
        );

      case ChannelStatus.UpdateFailed:
        return (
          <ErrorButton text='Update Failed' onClick={this.props.onInstallClick} />
        );
    }
  }
}

export default Button;

          // else if ((permissions & webAPI.accessLevelToPatchPermission(selectedServer.accessLevel)) === 0) {
          //   // Server is online but player does not have permissions
          //   return (
          //     <DisabledButton text='No Access' onClick={this.props.onNoAccessClick} />
          //   );
          // }
