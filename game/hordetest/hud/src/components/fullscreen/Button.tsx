/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';

const Container = css`
  position: relative;
  cursor: pointer;
  font-family: Colus;
  padding: 10px;
  color: white;
  box-shadow: inset 0 5px 50px 5px rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  transition: filter 0.1s;
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

  &.gray {
    box-shadow: inset 0 5px 50px 5px rgba(255, 255, 255, 0.1);
    background: linear-gradient(to bottom, #4c4c4c, #2b2b2b);
    border: 2px solid #6d6d6d;
  }

  &.disabled {
    opacity: 0.3;
    pointer-events: none;
  }
`;

export interface Props {
  type: 'primary' | 'secondary' | 'blue' | 'gray';
  text: string | JSX.Element | JSX.Element[];
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  styles?: string;
  disabled?: boolean;
}

export function Button(props: Props) {
  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.persist();
    props.onClick(e);
  }
  return (
    <button
      onClick={onClick}
      className={`${props.type} ${props.styles || ''} ${props.disabled ? 'disabled' : ''} ${Container}`}>
      {props.text}
    </button>
  );
}
