/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { AbilityType } from 'services/session/AbilityBuilderState';

// #region Container constants
const CONTAINER_HEIGHT = 130;
// #endregion
const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0px 20px;
  height: ${CONTAINER_HEIGHT}px;
  background-image: url(../images/abilitybuilder/uhd/title-bg.jpg);
  background-repeat: repeat;
  background-size: 100% 100%;
  z-index: 1;

  @media (max-width: 2560px) {
    height: ${CONTAINER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/abilitybuilder/hd/title-bg.jpg);
    height: ${CONTAINER_HEIGHT * HD_SCALE}px;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-image: url(../images/abilitybuilder/uhd/title-ability-builder-overlay.png);
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;

  &.Melee {
    filter: hue-rotate(110deg);
  }

  &.Archery {
    filter: hue-rotate(-75deg);
  }

  &.Shout {
    filter: hue-rotate(135deg);
  }

  &.Throwing {
    filter: hue-rotate(-135deg);
  }

  &.Support {
    filter: hue-rotate(118deg);
  }

  &.Devout {
    filter: hue-rotate(-100deg);
  }

  @media (max-width: 1920px) {
    background-image: url(../images/abilitybuilder/hd/title-ability-builder-overlay.png);
  }
`;

// #region Text constants
const TEXT_FONT_SIZE = 40;
const TEXT_LETTER_SPACING = 6;
// #endregion
const Text = styled.div`
  font-family: Caudex;
  color: #FAE9FF;
  font-size: ${TEXT_FONT_SIZE}px;
  letter-spacing: ${TEXT_LETTER_SPACING}px;
  text-transform: uppercase;

  &.Melee {
    filter: hue-rotate(110deg);
  }

  &.Archery {
    filter: hue-rotate(-75deg);
  }

  &.Shout {
    filter: hue-rotate(135deg);
  }

  &.Throwing {
    filter: hue-rotate(-135deg);
  }

  @media (max-width: 2560px) {
    font-size: ${TEXT_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${TEXT_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TEXT_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${TEXT_LETTER_SPACING * HD_SCALE}px;
  }
`;

export interface Props {
  title: string | JSX.Element;
  selectedType: AbilityType | null;
}

export class Header extends React.PureComponent<Props> {
  public render() {
    const className = this.props.selectedType ? this.props.selectedType.name : this.getClassType();
    return (
      <Container>
        <Overlay className={className} />
        <Text className={className}>{this.props.title}</Text>
      </Container>
    );
  }

  private getClassType = () => {
    switch (camelotunchained.game.selfPlayerState.classID) {
      case Archetype.BlackKnight:
      case Archetype.Mjolnir:
      case Archetype.Fianna: {
        return 'Melee';
      }

      case Archetype.Blackguard:
      case Archetype.WintersShadow:
      case Archetype.ForestStalker: {
        return 'Archery';
      }

      case Archetype.Druid:
      case Archetype.WaveWeaver:
      case Archetype.FlameWarden: {
        return 'Magic';
      }

      case Archetype.Empath:
      case Archetype.Physician:
      case Archetype.Stonehealer: {
        return 'Throwing';
      }

      case Archetype.DarkFool:
      case Archetype.Skald:
      case Archetype.Minstrel: {
        return 'Support';
      }

      case Archetype.Abbot:
      case Archetype.Helbound:
      case Archetype.BlessedCrow: {
        return 'Devout';
      }
      default: return '';
    }
  }
}
