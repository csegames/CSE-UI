/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { InteractableState } from '.';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const Text = styled.div`
  width: fit-content;
  height: 20px;
  padding: 5px;
  background-color: black;
  color: white;
  font-size: 14px;
  font-family: Lato;
`;

export interface Props {
  state: InteractableState;
}

export function Interactable(props: Props) {
  return (
    <Container>
      <Text>{props.state.name}</Text>
    </Container>
  );
}
