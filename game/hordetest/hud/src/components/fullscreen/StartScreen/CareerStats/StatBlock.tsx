/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: relative;
  flex: 1;
  min-width: calc(33% - 20px);
  margin: 20px 20px 0 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 0;
  outline: 2px solid rgba(255, 255, 255, 0.15);
  outline-offset: -15px;
`;

const BestText = styled.div`
  font-family: Colus;
  font-size: 33px;
  color: white;
`;

const NameText = styled.div`
  font-family: Colus;
  font-size: 16px;
  color: #696969;
`;

const SecondaryStatContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SecondaryStatText = styled.div`
  font-family: Lato;
  font-weight: bold;
  font-size: 18px;
  color: #5f5f5f;
`;

const IconContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: -1;
`;

const IconClass = styled.div`
  font-size: 200px;
  color: rgba(75, 94, 105, 0.20);
`;

export interface Props {
  iconClass: string;
  name: string;
  best: number;
  average: number;
  total: number;

  containerStyles?: string;
}

export function StatBlock(props: Props) {
  return (
    <Container className={props.containerStyles ? props.containerStyles : ''}>
      <IconContainer>
        <IconClass className={props.iconClass} />
      </IconContainer>

      <BestText>{props.best}</BestText>
      <NameText>{props.name}</NameText>

      <SecondaryStatContainer>
        <SecondaryStatText>Average: {props.average}</SecondaryStatText>
        <SecondaryStatText>Total: {props.total}</SecondaryStatText>
      </SecondaryStatContainer>
    </Container>
  );
}
