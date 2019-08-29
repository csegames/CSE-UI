/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const ChannelBarContainer = styled.div`
  position: relative;
  width: 200px;
  height: 13px;
  border: 2px solid black;
  background-color: black;

  display: flex;
  align-items: center;
  justify-content: center;

  &:before {
    content: '';
    position: absolute;
    top: -12px;
    width: 115%;
    height: 250%;
    background-image: url(../images/hud/world-health-border.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
`;

const Fill = styled.div`
  position: absolute;
  top: 1px;
  right: 1px;
  left: 1px;
  bottom: 1px;
  background-color: #808080;
  z-index: 0;
`;

const Text = styled.div`
  font-size: 10px;
  color: white;
  font-family: Lato;
  font-weight: bold;
  z-index: 1;
`;

export interface Props {
  channelType: string;
  current: number;
  max: number;
}

export function ChannelBar(props: Props) {
  return (
    <ChannelBarContainer>
      <Fill style={{ width: `${(props.current / props.max) * 100}%` }} />
      <Text>{props.channelType}</Text>
    </ChannelBarContainer>
  );
}
