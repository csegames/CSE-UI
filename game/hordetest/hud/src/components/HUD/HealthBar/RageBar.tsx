/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const RageBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 7px;
  background-color: rgba(0, 0, 0, 0.8);
`;

const Fill = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: linear-gradient(to right, #f12600, #fe7100);
`;

export interface Props {
  current: number;
  max: number;
}

export function RageBar(props: Props) {
  return (
    <RageBarContainer>
      <Fill style={{ width: `${(props.current / props.max) * 100}%` }} />
    </RageBarContainer>
  );
}
