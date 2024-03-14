/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const ChannelBarContainer = 'ChannelBar-ChannelBarContainer';
const Fill = 'ChannelBar-Fill';

const Text = 'ChannelBar-Text';

export interface Props {
  channelType: string;
  current: number;
  max: number;
}

export function ChannelBar(props: Props) {
  return (
    <div className={ChannelBarContainer}>
      <div className={Fill} style={{ width: `${(props.current / props.max) * 100}%` }} />
      <div className={Text}>{props.channelType}</div>
    </div>
  );
}
