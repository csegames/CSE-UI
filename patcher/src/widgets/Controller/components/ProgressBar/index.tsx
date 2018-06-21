/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { utils } from '@csegames/camelot-unchained';

import { patcher, ChannelStatus } from '../../../../services/patcher';
import { PatcherServer } from '../../services/session/controller';
import ProgressBarView from './components/ProgressBarView';

export interface ProgressBarProps {
  servers: utils.Dictionary<PatcherServer>;
  selectedServer: PatcherServer;
}

export interface ProgressBarState {
}

class ProgressBar extends React.Component<ProgressBarProps, ProgressBarState> {

  private installingChannel: number;

  constructor(props: ProgressBarProps) {
    super(props);
    this.state = {};
  }

  public render() {
    let progress: number = null;
    let percentDone: number = null;
    if (this.installingChannel !== -1) {
      // are we downloading anything?
      const downloadRemaining: number = patcher.getDownloadRemaining();
      const estimate: number = patcher.getDownloadEstimate();
      percentDone = estimate ? 100.0 - ((downloadRemaining / estimate) * 100) : 0;
      progress = percentDone.toFixed(0) as any;
    } else if (this.props.selectedServer &&
      (this.props.selectedServer.channelStatus === ChannelStatus.Ready ||
        this.props.selectedServer.channelStatus === ChannelStatus.Running ||
        this.props.selectedServer.channelStatus === ChannelStatus.Launching)) {
      progress = 100;
    } else {
      progress = 0;
    }

    return (
      <ProgressBarView progress={progress} />
    );
  }

  public componentWillReceiveProps(nextProps: ProgressBarProps) {
    for (const key in nextProps.servers) {
      const s = nextProps.servers[key];
      if (s.channelStatus === ChannelStatus.Updating) {
        this.installingChannel = s.channelID;
        return;
      }
    }
    this.installingChannel = -1;
  }
}

export default ProgressBar;
