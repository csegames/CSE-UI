/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { HealthBarState } from '..';

const Container = styled.div`
  font-family: Exo;
  font-weight: bold;
  color: white;
  font-size: 14px;
  margin-left: 7px;
  margin-bottom: 2px;
  width: 100%;
  text-shadow: 2px 2px 4px black;
  text-align: center;
`;

export interface Props {
  state: HealthBarState;
}

export function FriendlyHealthBar(props: Props) {
  return (
    <Container>{props.state.name}</Container>
  );
}
