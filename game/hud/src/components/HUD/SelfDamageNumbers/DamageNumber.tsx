/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useMemo } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { AnimatedContainer } from './AnimatedContainer';

const damageTypeIcons = {
  [DamageType.Slashing]: 'icon-damage-slashing',
  [DamageType.Piercing]: 'icon-damage-piercing',
  [DamageType.Crushing]: 'icon-damage-crushing',
  [DamageType.Acid]: 'icon-damage-acid',
  [DamageType.Poison]: 'icon-damage-poison',
  [DamageType.Disease]: 'icon-damage-disease',
  [DamageType.Earth]: 'icon-damage-earth',
  [DamageType.Water]: 'icon-damage-water',
  [DamageType.Fire]: 'icon-damage-fire',
  [DamageType.Air]: 'icon-damage-air',
  [DamageType.Lightning]: 'icon-damage-lightning',
  [DamageType.Frost]: 'icon-damage-frost',
  [DamageType.Life]: 'icon-damage-life',
  [DamageType.Mind]: 'icon-damage-mind',
  [DamageType.Spirit]: 'icon-damage-spirit',
  [DamageType.Radiant]: 'icon-damage-radiant',
  [DamageType.Death]: 'icon-damage-death',
  [DamageType.Shadow]: 'icon-damage-shadow',
  [DamageType.Chaos]: 'icon-damage-chaos',
  [DamageType.Void]: 'icon-damage-void',
  [DamageType.Arcane]: 'icon-damage-arcane',
};

// #region NumberContainer constants
const NUMBER_CONTAINER_FONT_SIZE = 40;
const NUMBER_CONTAINER_TEXT_SHADOW_OFFSET = 4;
// #endregion
const NumberContainer = css`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-shrink: 0;
  color: #f7f7f7;
  font-family: Kreon;
  font-weight: bold;
  font-size: ${NUMBER_CONTAINER_FONT_SIZE}px;
  line-height: ${NUMBER_CONTAINER_FONT_SIZE}px;
  text-shadow: ${NUMBER_CONTAINER_TEXT_SHADOW_OFFSET}px ${NUMBER_CONTAINER_TEXT_SHADOW_OFFSET}px black;
  right: 0;

  @media (max-width: 2560px) {
    font-size: ${NUMBER_CONTAINER_FONT_SIZE * MID_SCALE}px;
    line-height: ${NUMBER_CONTAINER_FONT_SIZE * MID_SCALE}px;
    text-shadow: ${NUMBER_CONTAINER_TEXT_SHADOW_OFFSET * MID_SCALE}px
    ${NUMBER_CONTAINER_TEXT_SHADOW_OFFSET * MID_SCALE}px black;
  }

  @media (max-width: 1920px) {
    font-size: ${NUMBER_CONTAINER_FONT_SIZE * HD_SCALE}px;
    line-height: ${NUMBER_CONTAINER_FONT_SIZE * HD_SCALE}px;
    text-shadow: ${NUMBER_CONTAINER_TEXT_SHADOW_OFFSET * HD_SCALE}px
    ${NUMBER_CONTAINER_TEXT_SHADOW_OFFSET * HD_SCALE}px black;
  }

  &.absolute {
    position: absolute;
  }

  &.heal {
    color: #4eb5ff;
  }

  &.stamina {
    color: #8cff2d;
  }

  &.blood {
    color: #ff4718;
  }
`;

// #region DamageTypeIcon constants
const DAMAGE_TYPE_ICON_FONT_SIZE = 32;
// #endregion
const DamageTypeIcon = styled.span`
  font-size: ${DAMAGE_TYPE_ICON_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${DAMAGE_TYPE_ICON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${DAMAGE_TYPE_ICON_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface Props {
  id: string;
  eventType: 'damage' | 'resource';
  damageNumber: number;
  positionAbsoluteClass: string;
  damageType?: DamageType;
  resourceType?: string;
  shouldAnimate?: boolean;
}

// tslint:disable-next-line
export function DamageNumber(props: Props) {
  const { id, positionAbsoluteClass, damageNumber, damageType, eventType, resourceType } = props;
  const roundedDamageNumber = useMemo(() => Math.round(damageNumber), [damageNumber]);

  if (eventType === 'damage') {
    return (
      <AnimatedContainer
        key={id}
        className={`${NumberContainer} ${positionAbsoluteClass}`}
        shouldAnimate={props.shouldAnimate}>
          <div>{roundedDamageNumber}</div>
          <DamageTypeIcon className={damageTypeIcons[damageType]}></DamageTypeIcon>
      </AnimatedContainer>
    );
  }

  return (
    <AnimatedContainer
      key={id}
      className={`${NumberContainer} ${resourceType} ${positionAbsoluteClass}`}
      shouldAnimate={props.shouldAnimate}>
        <>- {roundedDamageNumber}</>
    </AnimatedContainer>
  );
}
