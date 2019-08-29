/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import ItemIcon from 'fullscreen/ItemShared/components/ItemIcon';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_DIMENSIONS = 120;
// #endregion
const Container = styled.div`
  width: ${CONTAINER_DIMENSIONS}px;
  height: ${CONTAINER_DIMENSIONS}px;
  position: relative;
  cursor: pointer;

  @media (max-width: 2560px) {
    width: ${CONTAINER_DIMENSIONS * MID_SCALE}px;
    height: ${CONTAINER_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${CONTAINER_DIMENSIONS * HD_SCALE}px;
    height: ${CONTAINER_DIMENSIONS * HD_SCALE}px;
  }
`;

export interface CraftingItemProps {
  icon: string;
  count: number;
  quality: number;
}

export const CraftingItem = (props: CraftingItemProps) => {
  return (
    <Container>
      <ItemIcon
        url={props.icon}
        textBottom={props.count.toString()}
        textTop={typeof props.quality === 'number' ? `${props.quality.toString()}%` : ''}
      />
    </Container>
  );
};

export default CraftingItem;
