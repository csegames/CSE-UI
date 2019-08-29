/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { ContainerSlotItemDef } from 'fullscreen/lib/itemInterfaces';
import VoxInventorySlot from './VoxInventorySlot';

const Container = styled.div`
  display: flex;
`;

const ItemContainer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  pointer-events: all;
  cursor: pointer;
  background: url(../images/inventory/item-slot.png);
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  margin: 0 2.5px;
`;

export interface Props {
  items: ContainerSlotItemDef[];
}

class VoxInventoryRow extends React.Component<Props> {
  public render() {
    const { items } = this.props;
    return (
      <Container>
        {items.map((item, i) => (
          <ItemContainer key={i}>
            <VoxInventorySlot item={item} />
          </ItemContainer>
        ))}
      </Container>
    );
  }
}

export default VoxInventoryRow;
