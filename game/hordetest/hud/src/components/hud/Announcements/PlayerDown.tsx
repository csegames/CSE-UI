/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const PlayerDownContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 20px;
  background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.7));
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 25px;
  color: white;
  font-family: RobotoCondensed;
  font-weight: bold;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.7);
  margin-bottom: 5px;
  text-transform: uppercase;
`;

const BarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 12px;
  border: 1px solid gray;
`;

const BarFill = styled.div`
  position: absolute;
  color: white;
  top: 1px;
  right: 1px;
  bottom: 1px;
  left: 1px;
  background-color: white;
`;

export interface Props {
  message: string;
  seconds: number;
}

export function PlayerDown(props: Props) {
  return (
    <PlayerDownContainer>
      <InfoContainer>
        <Title>{props.message}</Title>
        <BarContainer>
          <BarFill style={{ width: '80%' }} />
        </BarContainer>
      </InfoContainer>
    </PlayerDownContainer>
  );
}
