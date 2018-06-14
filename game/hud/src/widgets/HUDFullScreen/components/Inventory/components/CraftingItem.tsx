/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import ItemIcon from '../../ItemShared/ItemIcon';

const Container = styled('div')`
  width: 60px;
  height: 60px;
  position: relative;
  cursor: pointer;
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
