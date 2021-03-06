/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { HealthBarState } from '..';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const NameOfItem = styled.div`
  font-family: Exo;
  font-weight: normal;
  color: white;
  font-size: 12px;
  margin-left: 7px;
  margin-bottom: 2px;
  width: 200px;
  text-shadow: 2px 2px 4px black;
`;

const BarContainer = styled.div`
  position: relative;
  width: 200px;
  height: 8px;
  margin-left: 5px;
  border: 1px solid rgb(0, 0, 0);
  background-color: #000000;
  transform: skewX(-10deg);
  z-index: -1;
`;

const Bar = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #29AAE1;
  z-index: 0;
`;

export interface Props {
  state: HealthBarState;
}

export function ItemHealthBar(props: Props) {
  const { state } = props;
  return state.current > 0 ? (
    <Container>
      <NameOfItem>{state.name}</NameOfItem>
      <BarContainer>
        <Bar style={{ width: `${(state.current / state.max) * 100}%` }} />
      </BarContainer>
    </Container>
  ) : null;
}
