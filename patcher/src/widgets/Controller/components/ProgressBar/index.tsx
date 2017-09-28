/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {webAPI, events, utils} from 'camelot-unchained';
import {patcher, ChannelStatus} from '../../../../services/patcher';
import {ServerType, PatcherServer} from '../../services/session/controller';
import {Progress} from '../../lib/Progress';

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
    let bar: any = null;
    let percentDone: number = null;
    if (this.installingChannel !== -1) {
      // are we downloading anything?
      const downloadRate: number = patcher.getDownloadRate();
      const downloadRemaining: number = patcher.getDownloadRemaining();
      const estimate: number = patcher.getDownloadEstimate();
      percentDone = estimate ? 100.0 - ((downloadRemaining / estimate) * 100) : 0;
      bar = <div className='ProgressBar__bar__fill ProgressBar__bar__fill--working' style={{width: `${percentDone}%`}} />;
    } else if (this.props.selectedServer &&
      (this.props.selectedServer.channelStatus === ChannelStatus.Ready ||
       this.props.selectedServer.channelStatus === ChannelStatus.Running ||
       this.props.selectedServer.channelStatus === ChannelStatus.Launching)) {
      bar = <div className='ProgressBar__bar__fill ProgressBar__bar__fill--complete' style={{width: `100%`}} />;
    } else {
      bar = <div className='ProgressBar__bar__fill ProgressBar__bar__fill--error' style={{width: `0%`}} />;
    }

    return (
      <div className='ProgressBar'>
        <div className='ProgressBar__bar'>{bar}</div>
        {percentDone === null ? null : <label>{percentDone.toFixed(0)}%</label>}        
        <div className='ProgressBar__pause ProgressBar__settings--hidden'>
          <i className='fa fa-pause' aria-hidden='true'></i>
        </div>
        <div className='ProgressBar__settings ProgressBar__settings--hidden'>
          <i className='fa fa-cog' aria-hidden='true'></i>
        </div>
      </div>
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
