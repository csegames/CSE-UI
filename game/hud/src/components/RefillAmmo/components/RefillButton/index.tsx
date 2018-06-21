/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';

interface RefillButtonStyle {
  container: React.CSSProperties;
}

interface RefillButtonProps {
  styles?: Partial<RefillButtonStyle>;
  className?: string;
  refill: () => void;
}

const Container = styled('div')`
  width: 120px;
  height: 35px;
  line-height: 35px;
  color: white;
  text-align: center;
  background-color: #444;
  cursor: pointer;
  opacity: 0.7;
  user-select: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  &:hover {
    background-color: #888;
    transform: ease 0.2s;
  }
  &:active {
    background-color: #0C0;
    transform: ease;
  }
`;

const RefillButton = (props: RefillButtonProps) => {
  return (
    <Container className={props.className} onClick={() => props.refill()}>
      <i className='fa fa-bullseye fa-inverse'/> Refill Ammo
    </Container>
  );
};

export default RefillButton;
