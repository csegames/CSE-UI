/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { HealthBarState } from '.';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const NameOfPlayer = styled.div`
  font-family: Lato;
  font-weight: bold;
  color: white;
  font-size: 12px;
  margin-left: 7px;
  margin-bottom: 2px;
  width: 120px;
`;

const BarContainer = styled.div`
  position: relative;
  width: 120px;
  height: 12px;
  margin-left: 5px;
  border: 2px solid black;
  background-color: #00254f;
  transform: skewX(-10deg);
  z-index: -1;

  &.enemy {
    background-color: #3d0000;
  }
`;

const Bar = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #29aae1;
  z-index: 0;

  &.enemy {
    background-color: #c2272d;
  }
`;

const BarText = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-family: Lato;
  font-weight: bold;
  color: white;
  font-size: 12px;
  line-height: 10px;
  transform: skewX(10deg);
`;

export interface Props {
  state: HealthBarState;
}

export function HealthBar(props: Props) {
  const { state } = props;
  const enemyClass = state.isEnemy ? 'enemy' : '';
  return (
    <Container>
      <NameOfPlayer>{state.name}</NameOfPlayer>
      <BarContainer className={enemyClass}>
        <Bar
          className={enemyClass}
          style={{ width: `${(state.current / state.max) * 100}%` }}
        />
        <BarText>{state.current} / {state.max}</BarText>
      </BarContainer>
    </Container>
  );
}
