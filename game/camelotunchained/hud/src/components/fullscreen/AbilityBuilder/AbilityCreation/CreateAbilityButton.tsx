/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';
import { AbilityType } from 'services/session/AbilityBuilderState';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

// #region Button constants
const BUTTON_WIDTH = 1142;
const BUTTON_HEIGHT = 205;
const BUTTON_LETTER_SPACING = 6;
const BUTTON_FONT_SIZE = 32;
// #endregion
export const Button = styled.div`
  position: relative;
  width: ${BUTTON_WIDTH}px;
  height: ${BUTTON_HEIGHT}px;
  letter-spacing: ${BUTTON_LETTER_SPACING}px;
  font-size: ${BUTTON_FONT_SIZE}px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-family: TradeWinds;
  color: white;
  cursor: pointer;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url(../images/abilitybuilder/hd/create-btn.png);
    background-repeat: no-repeat;
    background-size: contain;
    z-index: -1;
  }

  &:hover {
    filter: brightness(120%);
  }

  &.Melee {
    filter: hue-rotate(110deg);
    &:hover {
      filter: hue-rotate(110deg) brightness(120%);
    }
  }

  &.Archery {
    filter: hue-rotate(-75deg);
    &:hover {
      filter: hue-rotate(-75deg) brightness(120%);
    }
  }

  &.Shout {
    filter: hue-rotate(135deg);
    &:hover {
      filter: hue-rotate(135deg) brightness(120%);
    }
  }

  &.Throwing {
    filter: hue-rotate(-135deg);
    &:hover {
      filter: hue-rotate(-135deg) brightness(120%);
    }
  }

  @media (max-width: 2560px) {
    width: ${BUTTON_WIDTH * MID_SCALE}px;
    height: ${BUTTON_HEIGHT * MID_SCALE}px;
    letter-spacing: ${BUTTON_LETTER_SPACING * MID_SCALE}px;
    font-size: ${BUTTON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${BUTTON_WIDTH * HD_SCALE}px;
    height: ${BUTTON_HEIGHT * HD_SCALE}px;
    letter-spacing: ${BUTTON_LETTER_SPACING * HD_SCALE}px;
    font-size: ${BUTTON_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface Props {
  text: string;
  selectedType: AbilityType;
  onClick: () => void;
}

// tslint:disable-next-line:function-name
export function CreateAbilityButton(props: Props) {
  return (
    <Container>
      <Button className={props.selectedType.name} onClick={props.onClick}>{props.text}</Button>
    </Container>
  );
}
