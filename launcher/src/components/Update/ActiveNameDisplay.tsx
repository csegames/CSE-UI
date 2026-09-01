/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { connect, DispatchProp } from 'react-redux';
import { RootState } from '../../redux/store';
import { LaunchableState } from '../../redux/launchablesSlice';
import { ChannelState } from '../../redux/channelsSlice';

interface ReactProps {}

interface InjectedProps {
  channelID: number | null;
  channels: ChannelState;
  launchables: LaunchableState;
}

type Props = ReactProps & InjectedProps;

export class AnActiveNameDisplay extends React.Component<Props & DispatchProp> {
  public render() {
    const { channelID, channels, launchables } = this.props;
    if (!channelID) return null;
    for (const launchable of Object.values(launchables)) {
      if (launchable.channelID === channelID) return launchable.name;
    }
    return channels[channelID]?.name;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { channelID } = state.download;
  const { channels, launchables } = state;
  return {
    ...ownProps,
    channelID,
    channels,
    launchables
  };
};

export const ActiveNameDisplay = connect(mapStateToProps)(AnActiveNameDisplay);
