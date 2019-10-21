/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: relative;
  transform: skewX(-10deg);

  &.active {
    z-index: 10;
  }
`;

const Button = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;
  margin: 0 3px;
  background-color: rgba(0, 0, 0, 0.5);
  transform: scale(1);
  overflow: hidden;
  border: 2px solid transparent;
  transition: transform 0.2s, border-color 0.2s;

  &.active {
    transform: scale(1.3) translate(0px, -5px);
    border-color: white;
  }
`;

const KeybindBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  height: 14px;
  font-size: 10px;
  color: white;
  background-color: rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  transform: skewX(10deg);
`;

const UseKeybind = css`
  position: absolute;
  left: 50%;
  bottom: -4px;
  transform: translateX(-50%);
`;

const Image = styled.img`
  width: 115%;
  height: 115%;
  transform: skewX(10deg);
  object-fit: cover;
`;

export interface Props {
  item: ConsumableItem;
  isActive: boolean;
  useKeybind: Binding;
}

export function ConsumableButton(props: Props) {
  const activeClass = props.item && props.isActive ? 'active' : '';
  return (
    <Container className={activeClass}>
      <Button className={activeClass}>
        {props.item && <Image src={props.item.iconUrl} />}
      </Button>
      {props.item && props.isActive && (
        props.useKeybind.iconClass ?
        <KeybindBox className={`${props.useKeybind.iconClass} ${UseKeybind}`}></KeybindBox> :
        <KeybindBox className={UseKeybind}>{props.useKeybind.name}</KeybindBox>
      )}
    </Container>
  );
}
