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
  text-transform: uppercase;
  transition: filter 0.2s;
  text-align: center;
  user-select: none;
  border: 2px solid #ff9e57;

  div, span {
    cursor: pointer;
  }

  &.disabled {
    filter: grayscale(100%);
    pointer-events: none;
  }

  &:hover {
    filter: brightness(120%);
  }

  &:active {
    filter: brightness(90%);
  }
`;

const ButtonBackground = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: -1;
`;

const ButtonLoad = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  box-shadow: inset 0 5px 50px 5px rgba(255, 150, 0, 0.5);
  background: linear-gradient(to bottom, #ffd200, #a53d13);
  z-index: -1;
`;

const TextContainer = styled.div`
  z-index: 1;
`;

export interface Props {
  current: number;
  max: number;
  text: string | JSX.Element | JSX.Element[];
  onClick?: () => void;
  styles?: string;
  disabled?: boolean;
}

export function LoadingButton(props: Props) {
  const disabledClassName = props.disabled ? 'disabled' : '';
  return (
    <Container onClick={props.onClick} className={`${props.styles || ''} ${disabledClassName}`}>
      <ButtonBackground />
      <ButtonLoad style={{ width: `${(props.current / props.max) * 100}%` }} />
      <TextContainer>{props.text}</TextContainer>
    </Container>
  );
}
