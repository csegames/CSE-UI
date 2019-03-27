/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { AbilityBookQuery } from 'gql/interfaces';
import { Ring } from 'shared/Ring';
import { Tooltip } from 'shared/Tooltip';
import { ComponentTooltip } from './ComponentTooltip';
import { AbilityBookContext } from '../index';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { getScaledValue } from 'lib/scale';

// #region Component constants
const COMPONENT_DIMENSIONS = 72;
const COMPONENT_MARGIN_RIGHT = 5;
// #endregion
const Component = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${COMPONENT_DIMENSIONS}px;
  height: ${COMPONENT_DIMENSIONS}px;
  margin-right: ${COMPONENT_MARGIN_RIGHT}px;
  border-radius: 50%;

  @media (max-width: 2560px) {
    width: ${COMPONENT_DIMENSIONS * MID_SCALE}px;
    height: ${COMPONENT_DIMENSIONS * MID_SCALE}px;
    margin-right: ${COMPONENT_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${COMPONENT_DIMENSIONS * HD_SCALE}px;
    height: ${COMPONENT_DIMENSIONS * HD_SCALE}px;
    margin-right: ${COMPONENT_MARGIN_RIGHT * HD_SCALE}px;
  }
`;

// #region ComponentImage constants
const COMPONENT_IMAGE_DIMENSIONS = 48;
// #endregion
const ComponentImage = styled.img`
  width: ${COMPONENT_IMAGE_DIMENSIONS}px;
  height: ${COMPONENT_IMAGE_DIMENSIONS}px;
  border-radius: 50%;

  @media (max-width: 2560px) {
    width: ${COMPONENT_IMAGE_DIMENSIONS * MID_SCALE}px;
    height: ${COMPONENT_IMAGE_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${COMPONENT_IMAGE_DIMENSIONS * HD_SCALE}px;
    height: ${COMPONENT_IMAGE_DIMENSIONS * HD_SCALE}px;
  }
`;

export interface Props {
  abilityComponent: AbilityBookQuery.AbilityComponents;
}

const RING_RADIUS = 36;
const STROKE_WIDTH = 4;

// tslint:disable-next-line:function-name
export function AbilityComponent(props: Props) {
  const uiContext = useContext(UIContext);
  const { abilityComponentIDToProgression } = useContext(AbilityBookContext);
  const progressionData = abilityComponentIDToProgression[props.abilityComponent.id];
  let progress = 0;

  if (progressionData) {
    const progressInfo = props.abilityComponent.progression.levels.levels.find(level =>
      level.levelNumber === progressionData.level);
    progress = progressionData.progressionPoints / progressInfo.progressionForLevel;
  }

  const ringRadius = getScaledValue(uiContext, RING_RADIUS);
  const strokeWidth = getScaledValue(uiContext, STROKE_WIDTH);

  return (
    <Tooltip content={<ComponentTooltip abilityComponent={props.abilityComponent} />}>
      <Component>
        <Ring
          radius={ringRadius - strokeWidth}
          centerOffset={ringRadius}
          strokeWidth={strokeWidth}
          foreground={{ percent: progress, color: '#423b36', animation: null }}
          background={{ percent: 0.99, color: '#af9c8f', animation: null }}
        />
        <ComponentImage src={props.abilityComponent.display.iconURL} />
      </Component>
    </Tooltip>
  );
}
