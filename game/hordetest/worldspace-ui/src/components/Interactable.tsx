/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { InteractableState } from '.';

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
  transform: skewX(-10deg);
`;

const IconBox = styled.div`
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

const Icon = styled.span`
  transform: skewX(10deg);
`;

const BarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 130px;
  height: 25px;
  background-color: rgba(28, 31, 31, 0.75);
  z-index: -1;
`;

const NameText = styled.div`
  font-size: 14px;
  color: white;
  font-family: Lato;
  margin-left: 10px;
  transform: skewX(10deg);
  z-index: 10;
`;

export interface Props {
  state: InteractableState;
}

export function Interactable(props: Props) {
  const { state } = props;
  return (
    <Wrapper>
      <Container>
        <IconBox>
          <Icon className='icon-category-light-hand' />
        </IconBox>
        <BarContainer>
          <NameText>{state.name}</NameText>
        </BarContainer>
      </Container>
    </Wrapper>
  );
}
