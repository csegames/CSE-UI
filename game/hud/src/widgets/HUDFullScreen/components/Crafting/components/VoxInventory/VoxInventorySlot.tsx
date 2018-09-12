/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { InventoryContext } from '../../../ItemShared/InventoryContext';
import { VoxInventoryContext } from './VoxInventoryContext';
import { CraftingContext } from '../../CraftingContext';
import dragAndDrop, { DragEvent, DragAndDropInjectedProps } from 'components/DragAndDrop/DragAndDrop';
import { moveItemToVoxInventory } from '../../CraftingBase';
import { ContainerSlotItemDef, SlotType } from '../../../../lib/itemInterfaces';
import { InventoryDataTransfer } from '../../../../lib/itemEvents';
import { isStackedItem, getItemUnitCount, getInventoryDataTransfer } from '../../../../lib/utils';
import { getNearestVoxEntityID } from '../../lib/utils';
import ItemStack from '../../../ItemShared/components/ItemStack';

const Container = styled.div`
  width: 60px;
  height: 60px;
  pointer-events: all;
`;

const SlotOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${(props: { backgroundColor: string }) => props.backgroundColor};
  pointer-events: none;
`;

export interface ComponentProps {
  item: ContainerSlotItemDef;
}

export interface InjectedProps {
  voxEntityID: string;
  voxContainerID: string;
  refetchInventory: () => void;
  refetchVoxInventory: () => void;
}

export type Props = ComponentProps & InjectedProps & DragAndDropInjectedProps;

export interface State {
  backgroundColor: string;
}

const ALLOWED_COLOR = 'rgba(46, 213, 80, 0.4)';
// const NOT_ALLOWED_COLOR = 'rgba(186, 50, 50, 0.4)';

class VoxInventorySlot extends React.PureComponent<Props, State> {
  private myDataTransfer: InventoryDataTransfer;
  constructor(props: Props) {
    super(props);
    this.state = {
      backgroundColor: 'transparent',
    };
  }

  public data() {
    return this.myDataTransfer;
  }

  public onDragOver(e: DragEvent<InventoryDataTransfer, Props>) {
    this.setState({ backgroundColor: ALLOWED_COLOR });
  }

  public onDragLeave(e: DragEvent<InventoryDataTransfer, Props>) {
    this.setState({ backgroundColor: 'transparent' });
  }

  public onDrop(e: DragEvent<InventoryDataTransfer, Props>) {
    moveItemToVoxInventory(
      e.dataTransfer,
      this.props.voxEntityID,
      this.props.voxContainerID,
      this.props.item.slotIndex.position,
    );
  }

  public render() {
    const { item } = this.props;
    return (
      <Container>
        {item.item && isStackedItem(item.item) &&
          <ItemStack count={getItemUnitCount(item.item)} icon={item.item.staticDefinition.iconUrl} />
        }
        <SlotOverlay backgroundColor={this.state.backgroundColor} />
      </Container>
    );
  }

  public componentDidMount() {
    this.setDragDataTransfer(this.props);
  }

  public componentDidUpdate() {
    this.setDragDataTransfer(this.props);
  }

  private setDragDataTransfer = (props: Props) => {
    if (props.item.item) {
      const item = props.item.item || props.item.stackedItems[0];
      const pos = item.location.inContainer ? item.location.inContainer.position :
        item.location.inventory ? item.location.inventory.position : -1;
      this.myDataTransfer = getInventoryDataTransfer({
        slotType: props.item.slotType,
        item,
        location: item.location.inContainer ? 'inContainer' : 'inventory',
        position: pos,
        containerID: [props.voxContainerID],
        drawerID: 'default',
        fullStack: props.item.slotType === SlotType.CraftingContainer,
        voxEntityID: props.voxEntityID,
      });
    }
  }
}

const VoxInventorySlotWithDragAndDrop = dragAndDrop<Props>(
  (props: Props) => {
    return {
      id: props.item.itemID,
      dataKey: 'inventory-items',
      disableDrag: false,
      dropTarget: true,
    };
  },
)(VoxInventorySlot);

class VoxInventorySlotWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <InventoryContext.Consumer>
        {({ graphql }) => (
          <CraftingContext.Consumer>
            {({ crafting, voxContainerID }) => (
              <VoxInventoryContext.Consumer>
              {({ refetchVoxInventory }) => (
                <VoxInventorySlotWithDragAndDrop
                  {...this.props}
                  voxEntityID={getNearestVoxEntityID(crafting)}
                  voxContainerID={voxContainerID}
                  refetchInventory={graphql.refetch}
                  refetchVoxInventory={refetchVoxInventory}
                />
              )}
            </VoxInventoryContext.Consumer>
            )}
          </CraftingContext.Consumer>
        )}
      </InventoryContext.Consumer>
    );
  }
}

export default VoxInventorySlotWithInjectedContext;
