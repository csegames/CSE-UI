/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { Bundle } from './testData';

const Container = styled.div`
  position: relative;
  width: 407px;
  height: 300px;
  margin: 5px;
  background-color: #2f0d03;
  cursor: pointer;

  &:before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    background: linear-gradient(to top, rgba(102, 185, 252, 0.7), transparent);
    opacity: 0;
    transition: box-shadow 0.2s, opacity 0.2s;
  }

  &:active:before {
    background: linear-gradient(to top, rgba(56, 105, 144, 0.7), transparent);
  }

  &:hover {
    box-shadow: inset 0 0 0 2px #66b9fc;
    &:before {
      opacity: 1;
    }
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CostContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;
  height: 20%;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background-color: rgba(0, 0, 0, 0.6);
  pointer-events: none;
`;

const Name = styled.div`
  font-size: 18px;
  font-family: Colus;
  color: white;
`;

const Cost = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-family: Colus;
  color: #f1d381;
`;

const CostIcon = styled.img`
  width: 12px;
  height: auto;
  object-fit: contain;
  margin-right: 5px;
`;

export interface Props {
  bundle: Bundle;
}

export function BundleItem(props: Props) {
  return (
    <Container>
      <Image src={props.bundle.image} />
      <CostContainer>
        <Name>{props.bundle.name}</Name>
        <Cost>
          <CostIcon src='images/fullscreen/startscreen/currency.png' />
          {props.bundle.cost}
        </Cost>
      </CostContainer>
    </Container>
  );
}
