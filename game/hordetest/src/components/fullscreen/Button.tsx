/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: relative;
  cursor: pointer;
  padding: 10px;
  color: white;
  box-shadow: inset 0 5px 50px 5px rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  transition: filter 0.2s;
  text-align: center;
  user-select: none;

  div, span {
    cursor: pointer;
  }

  &:hover {
    filter: brightness(120%);
  }

  &:active {
    filter: brightness(90%);
  }

  &.primary {
    box-shadow: inset 0 5px 50px 5px rgba(255, 150, 0, 0.5);
    background: linear-gradient(to bottom, #ffd200, #a53d13);
    border: 2px solid #ff9e57;
  }

  &.secondary {
    box-shadow: none;
    background-color: #080d16;
    border: 2px solid #c75c1d;
  }

  &.blue {
    box-shadow: inset 0 5px 50px 5px rgba(19, 58, 83, 0.5);
    background: linear-gradient(to bottom, #52CFFD, #315fb7);
    border: 2px solid #77a5f2;
  }
`;

export interface Props {
  type: 'primary' | 'secondary' | 'blue';
  text: string | JSX.Element | JSX.Element[];
  onClick?: () => void;
  styles?: string;
}

export function Button(props: Props) {
  return (
    <Container onClick={props.onClick} className={`${props.type} ${props.styles || ''}`}>
      {props.text}
    </Container>
  );
}
