/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const ShieldBarContainer = styled.div`
  position: relative;
  width: 400px;
  height: 15px;
  border: 2px solid #e3e1e2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Fill = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  bottom: 2px;
  left: 2px;
  background-color: #e3e1e2;
  clip-path: polygon(0 50%, 100% 0,100% 50%,0 100%);
  -webkit-clip-path: polygon(0 50%, 100% 0,100% 50%,0 100%);
`;

const Text = styled.div`
  color: white;
  font-size: 10px;
  z-index: 1;
`;

export interface Props {
  current: number;
  max: number;
}

export function ShieldBar(props: Props) {
  return (
    <ShieldBarContainer>
      <Fill style={{ width: `${(props.current / props.max) * 100}%` }} />
      <Text>{props.current} / {props.max}</Text>
    </ShieldBarContainer>
  );
}
