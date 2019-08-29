/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  text-align: center;
  font-size: 20px;
  padding: 34px 30px;
  width: fit-content;
  color: white;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.2s color;

  &:hover {
    color: #85d2ff;
  }

  &.selected {
    color: #85d2ff;
    background: linear-gradient(to bottom, rgba(36, 55, 97, 1), rgba(36, 55, 97, 0.7), transparent);
  }
`;

export interface Props {
  isSelected?: boolean;
  children?: any;
  onClick?: () => void;
}

export function Header(props: Props) {
  const selectedClass = props.isSelected ? 'selected' : '';
  return (
    <Container className={selectedClass} onClick={props.onClick}>
      {props.children}
    </Container>
  );
}
