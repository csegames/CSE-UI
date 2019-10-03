/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { PlayerDifferentiatorState } from '.';

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Diamond = styled.div`
  width: 10px;
  height: 10px;
  margin-top: 50px;
  opacity: 0.85;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props: { color: string } & React.HTMLProps<HTMLDivElement>) => props.color};
  color: white;
  transform: rotate(45deg);
`;

const colors = [
  '#bd55fd',
  '#63263b',
  '#50b2e0',
  '#d3af4d',
  '#ab0d49',
  '#d9d82d',
  '#c1b2bf',
  '#14820e',
];

export interface Props {
  state: PlayerDifferentiatorState;
}

export function PlayerDifferentiator(props: Props) {
  return (
    <Container>
      <Diamond color={colors[props.state.differentiator] || 'blue'} />
    </Container>
  );
}
