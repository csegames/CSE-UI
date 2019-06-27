/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { has } from 'lodash';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { ResourceEvent, HealEvent, PositiveEventBlock, getResourceType } from '.';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { AnimatedContainer } from './AnimatedContainer';

const Container = css`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

// #region NumberContainer constants
const TEXT_CONTAINER_FONT_SIZE = 40;
const TEXT_CONTAINER_TEXT_SHADOW_OFFSET = 4;
// #endregion
const TextContainer = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  color: #f7f7f7;
  font-family: Kreon;
  font-weight: bold;
  font-size: ${TEXT_CONTAINER_FONT_SIZE}px;
  line-height: ${TEXT_CONTAINER_FONT_SIZE}px;
  text-shadow: ${TEXT_CONTAINER_TEXT_SHADOW_OFFSET}px ${TEXT_CONTAINER_TEXT_SHADOW_OFFSET}px black;

  @media (max-width: 2560px) {
    font-size: ${TEXT_CONTAINER_FONT_SIZE * MID_SCALE}px;
    line-height: ${TEXT_CONTAINER_FONT_SIZE * MID_SCALE}px;
    text-shadow: ${TEXT_CONTAINER_TEXT_SHADOW_OFFSET * MID_SCALE}px
    ${TEXT_CONTAINER_TEXT_SHADOW_OFFSET * MID_SCALE}px black;
  }

  @media (max-width: 1920px) {
    font-size: ${TEXT_CONTAINER_FONT_SIZE * HD_SCALE}px;
    line-height: ${TEXT_CONTAINER_FONT_SIZE * HD_SCALE}px;
    text-shadow: ${TEXT_CONTAINER_TEXT_SHADOW_OFFSET * HD_SCALE}px
    ${TEXT_CONTAINER_TEXT_SHADOW_OFFSET * HD_SCALE}px black;
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

export interface Props {
  positiveEvent: ResourceEvent | HealEvent | PositiveEventBlock;
}

// tslint:disable-next-line:function-name
export function PositiveNumber(props: Props) {
  const { positiveEvent } = props;
  if (has(positiveEvent, 'eventBlock')) {
    return (
      <AnimatedContainer className={Container}>
        {(positiveEvent as PositiveEventBlock).eventBlock.map((event) => {
          const resourceType = getResourceType(event);
          return (
            <TextContainer className={resourceType}>+ {Math.round(event.received)}</TextContainer>
          );
        })}
      </AnimatedContainer>
    );
  }

  return (
    <AnimatedContainer>
      <TextContainer className={`${getResourceType(positiveEvent as ResourceEvent | HealEvent)}`}>
        + {Math.round((positiveEvent as ResourceEvent | HealEvent).received)}
      </TextContainer>
    </AnimatedContainer>
  );
}
