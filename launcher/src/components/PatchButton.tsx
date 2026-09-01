/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../redux/store';
import { connect, DispatchProp } from 'react-redux';
import { Product, updateLastPlayed } from '../redux/navigationSlice';
import { Launchable } from '../redux/launchablesSlice';
import { GenericButton } from './GenericButton';
import { ChannelStatus } from '../api/patcher/channelStatus';
import { ChannelInfo, isChannelInfo } from '../api/patcher/channelInfo';
import { playSound, Sound } from '../lib/Sound';
import { hideModal, showModal } from '../redux/modalsSlice';
import { EUALA } from './EUALA';

interface ReactProps {
  selected?: Launchable | ChannelInfo;
}

interface InjectedProps {
  estimate: number;
  remaining: number;
}

interface State {
  commandLine: string;
}

type Props = ReactProps & InjectedProps;

class APatchButton extends React.Component<Props & DispatchProp, State> {
  constructor(props: Props & DispatchProp) {
    super(props);
    this.state = {
      commandLine: ''
    };
  }

  public render() {
    const { selected, remaining } = this.props;
    if (!selected) {
      return <GenericButton big disabled text={'Initializing'} />;
    }

    const status = isChannelInfo(selected) ? selected.status : selected.channelStatus;
    switch (status) {
      case ChannelStatus.None:
        return <GenericButton big text='Install' onClick={this.install.bind(this)} />;

      case ChannelStatus.Validating:
        return <GenericButton big disabled text='Validating' />;

      case ChannelStatus.Updating:
        if (remaining == 0) {
          return <GenericButton big disabled text='Finalizing' />;
        } else {
          return <GenericButton big disabled text={`Updating... (${this.percentRemaining()}%)`} />;
        }

      case ChannelStatus.OutOfDate:
        return <GenericButton big disabled text='Awaiting Update' />;

      case ChannelStatus.UpToDate:
        if (!isChannelInfo(selected)) {
          switch (selected.product) {
            case Product.CamelotUnchained:
              if (!selected.canAccess) {
                return <GenericButton big disabled text='No Access' />;
              }
              if (!selected.isAvailable) {
                return <GenericButton big disabled text='Offline' onClick={this.playOffline.bind(this)} />;
              }
              break;
          }
        }
        return <GenericButton big text='Play Now' onClick={this.playNow.bind(this)} />;

      case ChannelStatus.Launching:
        return <GenericButton big disabled text='Launching' />;

      case ChannelStatus.Running:
        return <GenericButton big disabled text='Playing' />;

      case ChannelStatus.Uninstalling:
        return <GenericButton big disabled text={`Uninstalling... (${this.percentRemaining()}%)`} />;

      case ChannelStatus.UpdateFailed:
        return <GenericButton big error text='Update Failed' onClick={this.install.bind(this)} />;

      case ChannelStatus.NotEnoughSpace:
        return <GenericButton big error text='Not Enough Space' onClick={this.install.bind(this)} />;
    }
  }

  private percentRemaining(): string {
    const { selected, estimate, remaining } = this.props;
    const pct = estimate ? 100 * (1 - remaining / estimate) : 100;
    const status = isChannelInfo(selected) ? selected.status : selected?.channelStatus;
    switch (status) {
      case ChannelStatus.Uninstalling:
        return '' + (100 - Math.ceil(pct));
      default:
        return '' + Math.floor(pct);
    }
  }

  private playOffline(evt: React.MouseEvent<HTMLDivElement>): void {
    if (evt.altKey) {
      return this.playNow(evt);
    }
    alert('Server is offline! - Hold alt + click Play Offline to pass command line arguments.');
  }

  private playNow(evt: React.MouseEvent<HTMLDivElement>) {
    const { selected } = this.props;
    if (!selected) return;

    let commandLine = '';
    let shouldShowEUALA = true;
    if (evt.altKey) {
      const storageKey = `CSE_COMMANDS_${selected.name})`;
      const prev = localStorage.getItem(storageKey) ?? '';
      const channelCommand = window.prompt(`Please enter your command line parameters for ${selected.name}`, prev);

      if (channelCommand != null) {
        // If non-null was returned, the player hit "OK" on the prompt.
        // We want to both save and use the commands that they entered.
        localStorage.setItem(storageKey, channelCommand);
        commandLine = channelCommand;
      } else {
        shouldShowEUALA = false;
      }
    }

    // Save selected channel, server, and character
    if (isChannelInfo(selected)) {
      this.props.dispatch(updateLastPlayed({ product: Product.Tools, key: selected.name }));
    } else {
      this.props.dispatch(updateLastPlayed({ product: selected.product, key: selected.selectionKey }));
    }

    if (shouldShowEUALA) {
      this.setState({ commandLine });
      this.props.dispatch(
        showModal({
          id: 'EUALA',
          content: {
            body: <EUALA />,
            buttons: [
              {
                text: 'Accept',
                onClick: () => {
                  this.launchClient(this.state.commandLine);
                  this.props.dispatch(hideModal());
                }
              },
              {
                text: 'Decline',
                onClick: () => {
                  this.setState({ commandLine: '' });
                  this.props.dispatch(hideModal());
                }
              }
            ]
          }
        })
      );
    }

    playSound(Sound.LaunchGame);
  }

  private launchClient(commandLine: string) {
    const { selected } = this.props;
    if (!selected) return;

    this.setState({ commandLine: '' });
    let channelID = 0;
    if (isChannelInfo(selected)) {
      channelID = selected.id;
    } else {
      channelID = selected.channelID;
      commandLine = this.buildFinalCommandLine(commandLine, selected);
    }
    window.patcher.launchChannel(channelID, commandLine);
    playSound(Sound.Select);
  }

  private buildFinalCommandLine(commandLine: string, selected: Launchable): string {
    commandLine = this.tryAppendArgument(commandLine, 'servershardid', selected.shardID?.toString());
    commandLine = this.tryAppendArgument(commandLine, 'shardapiurl', selected.apiHost);
    return commandLine;
  }

  private tryAppendArgument(commandLine: string, key: string, value: string | undefined): string {
    if (!value) {
      return commandLine;
    }

    const test = commandLine.toLowerCase();

    if (test.includes(`${key}=`) || test.includes(`${key} =`)) {
      return commandLine;
    }
    return `${commandLine} ${key}="${value}"`;
  }

  private install() {
    const { selected } = this.props;
    if (!selected) return;

    window.patcher.installChannel(isChannelInfo(selected) ? selected.id : selected.channelID);
    playSound(Sound.Select);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { estimate, remaining } = state.download;
  return {
    ...ownProps,
    estimate,
    remaining
  };
};

export const PatchButton = connect(mapStateToProps)(APatchButton);
