/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { InteractionBarState } from '.';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  border: 2px solid black;
  display: flex;
  width: fit-content;
`;

const KeybindBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 25px;
  background-color: black;
  color: white;
  font-size: 18px;
  font-family: Colus;
`;

const BarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 130px;
  height: 25px;
  background-color: #b5b5b5;
  z-index: -1;
`;

const Bar = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #626262;
  z-index: 0;
`;

const NameText = styled.div`
  font-size: 14px;
  color: white;
  font-family: Lato;
  margin-left: 10px;
  z-index: 10;
`;

export interface Props {
  state: InteractionBarState;
}

export function InteractionBar(props: Props) {
  const { state } = props;
  return (
    <Wrapper>
      <Container>
        {state.keybind.iconClass ?
          <KeybindBox className={state.keybind.iconClass}></KeybindBox> :
          <KeybindBox>{state.keybind.name}</KeybindBox>
        }
        <BarContainer>
          <Bar style={{ width: `${state.progress * 100}%` }} />
          <NameText>{state.name}</NameText>
        </BarContainer>
      </Container>
    </Wrapper>
  );
}
