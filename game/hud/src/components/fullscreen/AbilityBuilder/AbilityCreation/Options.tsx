/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { AbilityType } from 'services/session/AbilityBuilderState';

const Container = styled.div`
  position: relative;
  width: calc(100% - 30px);
  height: 113px;
  padding: 0 15px;
  background: url(../images/abilitybuilder/hd/component-border-options.png) no-repeat;
  background-size: 100% 100%;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: url(../images/abilitybuilder/hd/component-bg.png) no-repeat;
    background-size: cover;
  }
`;

// #region Title constants
const TITLE_WIDTH = 578;
const TITLE_HEIGHT = 60;
const TITLE_LETTER_SPACING = 4;
// #endregion
const Title = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  text-align: center;
  font-family: TradeWinds;
  color: #cebd9d;
  background-image: url(../images/abilitybuilder/uhd/component-title-options.png);
  background-repeat: no-repeat;
  background-size: contain;
  width: ${TITLE_WIDTH}px;
  height: ${TITLE_HEIGHT}px;
  letter-spacing: ${TITLE_LETTER_SPACING}px;

  @media (max-width: 2560px) {
    width: ${TITLE_WIDTH * MID_SCALE}px;
    height: ${TITLE_HEIGHT * MID_SCALE}px;
    letter-spacing: ${TITLE_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/abilitybuilder/hd/component-title-options.png);
    width: ${TITLE_WIDTH * HD_SCALE}px;
    height: ${TITLE_HEIGHT * HD_SCALE}px;
    letter-spacing: ${TITLE_LETTER_SPACING * HD_SCALE}px;
  }
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`;

// #region Name constants
const NAME_FONT_SIZE = 24;
const NAME_LETTER_SPACING = 4;
// #endregion
const Name = styled.div`
  text-transform: uppercase;
  text-align: center;
  font-family: TradeWinds;
  color: #cebd9d;
  font-size: ${NAME_FONT_SIZE}px;
  letter-spacing: ${NAME_LETTER_SPACING}px;

  @media (max-width: 2560px) {
    font-size: ${NAME_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${NAME_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${NAME_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${NAME_LETTER_SPACING * HD_SCALE}px;
  }
`;

// #region Button constants
const BUTTON_PADDING_HORIZONTAL = 40;
const BUTTON_HEIGHT = 112;
const BUTTON_FONT_SIZE = 24;
const BUTTON_LETTER_SPACING = 4;
// #endregion
const Button = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0 ${BUTTON_PADDING_HORIZONTAL}px;
  height: ${BUTTON_HEIGHT}px;
  font-size: ${BUTTON_FONT_SIZE}px;
  letter-spacing: ${BUTTON_LETTER_SPACING}px;
  text-transform: uppercase;
  text-align: center;
  font-family: TradeWinds;
  color: #cebd9d;
  cursor: pointer;
  z-index: 1;

  &:before {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-image: url(../images/abilitybuilder/uhd/option-btn-off.png);
    background-size: 100% 100%;
  }

  &.on {
    &:before {
      background-image: url(../images/abilitybuilder/uhd/option-btn-on.png);
    }

    &.Melee:before {
      filter: hue-rotate(110deg);
    }

    &.Archery:before {
      filter: hue-rotate(-75deg);
    }

    &.Shout:before {
      filter: hue-rotate(135deg);
    }

    &.Throwing:before {
      filter: hue-rotate(-135deg);
    }
  }

  &:hover {
    filter: brightness(120%);
  }

  @media (max-width: 2560px) {
    padding: 0 ${BUTTON_PADDING_HORIZONTAL * MID_SCALE}px;
    height: ${BUTTON_HEIGHT * MID_SCALE}px;
    font-size: ${BUTTON_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${BUTTON_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: 0 ${BUTTON_PADDING_HORIZONTAL * HD_SCALE}px;
    height: ${BUTTON_HEIGHT * HD_SCALE}px;
    font-size: ${BUTTON_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${BUTTON_LETTER_SPACING * HD_SCALE}px;

    &:before {
      background-image: url(../images/abilitybuilder/hd/option-btn-off.png);
    }

    &.on:before {
      background-image: url(../images/abilitybuilder/hd/option-btn-on.png);
    }
  }
`;

export interface Props {
  selectedType: AbilityType;
  selectedOption: string;
  buttons: string[];
  optionType: string;
  onClickOption: (option: string) => void;
}

export class Options extends React.PureComponent<Props> {
  public render() {
    return (
      <Container>
        <Title>Options</Title>
        <OptionContainer>
          <Name>{this.props.optionType}</Name>
          {this.props.buttons.map((button) => {
            return (
              <Button
                className={`${this.props.selectedOption === button ? 'on' : ''} ${this.props.selectedType.name}`}
                onClick={() => this.props.onClickOption(button)}>
                {button}
              </Button>
            );
          })}
        </OptionContainer>
      </Container>
    );
  }
}
