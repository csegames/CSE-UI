/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { InventoryItem } from 'gql/interfaces';
import SubHeader from '../VoxHeader/VoxInventoryHeader';
import Drawer from '../../../Inventory/components/Containers/Drawer';
import { slotDimensions } from '../../../Inventory/components/InventorySlot';
import { calcRowsForContainer } from '../../../../lib/utils';
import { DrawerSlotNumberToItem } from '../../../ItemShared/InventoryBase';
import { createRowElementsForVoxInventory } from '../../CraftingBase';
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const DrawerContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 115px);
`;

const ComingSoonOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 16px;
  text-transform: uppercase;

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    font-size: 32px;
  }
`;

export interface Props {
  item: InventoryItem.Fragment;
  slotNumberToItem: DrawerSlotNumberToItem;
}

export interface State {
  rowCount: number;
  slotsPerRow: number;
}

class VoxInventoryView extends React.Component<Props, State> {
  private ref: HTMLDivElement;
  private clientWidth: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      rowCount: 0,
      slotsPerRow: 0,
    };
  }

  public render() {
    const { item } = this.props;
    const { rows, rowData } = createRowElementsForVoxInventory(this.state, this.props.slotNumberToItem);
    const drawer = this.getDrawer();
    return (
      <Container>
        <SubHeader />
        <DrawerContainer ref={(r: HTMLDivElement) => this.ref = r}>
          <Drawer
            disableHeader
            index={0}
            rows={rows}
            rowData={rowData}
            containerItem={item}
            drawer={drawer}
          />
          <ComingSoonOverlay>Coming Soon</ComingSoonOverlay>
        </DrawerContainer>
      </Container>
    );
  }

  public componentDidMount() {
    setTimeout(() => {
      this.clientWidth = this.ref.clientWidth;
      this.initSlotsData();
    }, 1);
  }

  private getDrawer = () => {
    const { item } = this.props;
    let drawer = null;
    if (item && item.containerDrawers) {
      drawer = item.containerDrawers[0];
    }

    return drawer;
  }

  private initSlotsData = () => {
    const { item } = this.props;
    const gutterSize = 65;
    const minRows = 2;
    const { rowCount, slotsPerRow } = calcRowsForContainer(
      this.clientWidth,
      slotDimensions,
      item && item.containerDrawers ? item.containerDrawers[0].containedItems as InventoryItem.Fragment[] : [],
      gutterSize,
      minRows,
    );

    this.setState({ rowCount, slotsPerRow });
  }
}

export default VoxInventoryView;
