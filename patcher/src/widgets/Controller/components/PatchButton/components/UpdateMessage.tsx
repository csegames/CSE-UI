/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

import { Progress } from '../../../lib/Progress';
import { patcher } from '../../../../../services/patcher';

const Container = styled('div')`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(images/controller/update-details.png);
  color: #BFBFBF;
  font-size: 12px;
  width: 295px;
  height: 90px;
  right: ${(props: any) => props.right}px;
  transition: right 0.5s ease;
  font-weight: normal;
`;

const TextContainer = styled('div')`
  text-align: right;
`;

export interface UpdateMessageProps {
  installingChannelName: string;
  installingChannel: number;
  startDownload: number;
  onStartDownloadChange: (startDownload: number) => void;
}

export interface UpdateMessageState {

}

class UpdateMessage extends React.Component<UpdateMessageProps, UpdateMessageState> {
  public render() {
    const { startDownload, installingChannelName, installingChannel } = this.props;

    let time: string;
    let rate: string;
    let dataSize: string;
    if (installingChannel !== -1) {
      if (startDownload === undefined) this.props.onStartDownloadChange(Date.now());

      const downloadRate: number = patcher.getDownloadRate();
      const downloadRemaining: number = patcher.getDownloadRemaining();
      const estimate: number = patcher.getDownloadEstimate();

      const percentDone = estimate ? 100.0 - ((downloadRemaining / estimate) * 100) : 0;
      const downloadDuration: number = (Date.now() - startDownload) / 1000;
      const remainingTime: number = percentDone ? ((100 / percentDone) * downloadDuration) - downloadDuration : undefined;
      time = percentDone ? Progress.secondsToString(remainingTime) : 'starting';
      rate = Progress.bypsToString(downloadRate);
      dataSize = Progress.bytesToString(estimate - downloadRemaining) + ' of ' +
        Progress.bytesToString(estimate);
    }

    return (
      <Container right={installingChannel !== -1 ? 230 : 0}>
        {installingChannel !== -1 &&
          <TextContainer>
            <div>Updating {installingChannelName}...</div>
            <div>{time} estimated remaining</div>
            <div>{dataSize} ({rate})</div>
          </TextContainer>
        }
      </Container>
    );
  }
}

export default UpdateMessage;
