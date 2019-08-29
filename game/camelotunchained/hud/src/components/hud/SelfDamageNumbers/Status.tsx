/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { has } from 'lodash';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { StatusEvent, StatusEventBlock } from '.';
import { AnimatedContainer } from './AnimatedContainer';

const Container = css`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: center;
`;

// #region TextContainer constants
const TEXT_CONTAINER_FONT_SIZE = 32;
// #endregion
const TextContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  font-family: Kreon;
  font-weight: bold;
  color: white;
  font-size: ${TEXT_CONTAINER_FONT_SIZE}px;
  line-height: ${TEXT_CONTAINER_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${TEXT_CONTAINER_FONT_SIZE * MID_SCALE}px;
    line-height: ${TEXT_CONTAINER_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TEXT_CONTAINER_FONT_SIZE * HD_SCALE}px;
    line-height: ${TEXT_CONTAINER_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface Props {
  statusEvent: StatusEvent | StatusEventBlock;
}

// tslint:disable-next-line:function-name
export function Status(props: Props) {
  function getStatusTextPrefix(event: StatusEvent) {
    if (event.action === StatusAction.Added) {
      return '+';
    }

    if (event.action === StatusAction.Removed) {
      return '-';
    }

    return '';
  }

  const { statusEvent } = props;
  if (has(statusEvent, 'eventBlock')) {
    return (
      <AnimatedContainer className={Container}>
        {(statusEvent as StatusEventBlock).eventBlock.map((event) => {
          return (
            <TextContainer key={event.id}>{getStatusTextPrefix(event)} {event.name}</TextContainer>
          );
        })}
      </AnimatedContainer>
    );
  }

  return (
    <AnimatedContainer>
      <TextContainer>
        {getStatusTextPrefix(statusEvent as StatusEvent)} {(statusEvent as StatusEvent).name}
      </TextContainer>
    </AnimatedContainer>
  );
}
