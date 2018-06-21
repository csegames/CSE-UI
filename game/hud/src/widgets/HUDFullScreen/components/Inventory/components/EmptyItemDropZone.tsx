/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { ql } from '@csegames/camelot-unchained';

import EmptyItem, { EmptyItemProps } from '../../ItemShared/EmptyItem';
import { ContainerPermissionDef } from '../../ItemShared/InventoryBase';
import { DrawerCurrentStats } from './Containers/Drawer';
import dragAndDrop, { DragAndDropInjectedProps, DragEvent } from '../../../../../components/DragAndDrop/DragAndDrop';
import { InventoryDataTransfer } from '../../../lib/eventNames';
import { InventoryItemFragment } from '../../../../../gqlInterfaces';
import {
  getInventoryDataTransfer,
  isContainerSlotVerified,
  isCraftingSlotVerified,
  isCraftingItem,
} from '../../../lib/utils';
import { SlotType, SlotIndexInterface } from '../../../lib/itemInterfaces';

const Container = styled('div')`
  position: relative;
`;

const SlotOverlay = styled('div')`
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  right: 2px;
  cursor: pointer;
  background-color: ${(props: any) => props.backgroundColor};
`;

export interface EmptyItemDropZoneProps extends DragAndDropInjectedProps {
  slotType: SlotType;
  slotIndex: SlotIndexInterface;
  disableDrop: boolean;
  onDrop: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void;
  containerPermissions: ContainerPermissionDef | ContainerPermissionDef[];
  drawerMaxStats?: ql.schema.ContainerDefStat_Single;
  drawerCurrentStats?: DrawerCurrentStats;

  // Only used by item stacks that are represented as containers. This item is the first item in the stack.
  item?: InventoryItemFragment;
}

export interface EmptyItemDropZoneState {
  backgroundColor: string;
}

class EmptyItemWrapper extends React.Component<EmptyItemDropZoneProps, EmptyItemDropZoneState> {
  private myDataTransfer: InventoryDataTransfer;
  constructor(props: EmptyItemDropZoneProps) {
    super(props);
    this.state = {
      backgroundColor: 'transparent',
    };
  }

  public data() {
    return this.myDataTransfer;
  }

  public onDrop(e: DragEvent<InventoryDataTransfer, EmptyItemProps & EmptyItemDropZoneProps>) {
    const { item, containerPermissions, drawerMaxStats, drawerCurrentStats, slotType } = this.props;
    // If containerPermissions is falsy or user has permission to add contents to container then proceed to drop
    if (this.props.slotIndex.containerID) {
      const canPutIn = isContainerSlotVerified(
        e.dataTransfer,
        this.myDataTransfer,
        this.props.slotIndex.containerID,
        containerPermissions,
        drawerMaxStats,
        drawerCurrentStats,
        true,
      ) && slotType === SlotType.Empty;
      // Dropping inside a container and not a crafting container
      if (canPutIn) {
        this.props.onDrop(e.dataTransfer, this.myDataTransfer);
      }
    } else if (item && isCraftingItem(item)) {
      const canPutIn = isCraftingSlotVerified(
        e.dataTransfer,
        this.myDataTransfer,
        true,
      );
      if (canPutIn) {
        this.props.onDrop(e.dataTransfer, this.myDataTransfer);
      }
    } else {
      // is in regular inventory
      this.props.onDrop(e.dataTransfer, this.myDataTransfer);
    }
  }

  public onDragOver(e: DragEvent<InventoryDataTransfer, EmptyItemProps & EmptyItemDropZoneProps>) {
    const { containerPermissions, drawerMaxStats, drawerCurrentStats, item, slotType } = this.props;
    const notAllowedColor = 'rgba(186, 50, 50, 0.4)';
    const allowedColor = 'rgba(46, 213, 80, 0.4)';
    this.setState((state, props) => {
      if (this.props.slotIndex.containerID) {
        // is an empty slot inside actual container
        const canPutIn = isContainerSlotVerified(
          e.dataTransfer,
          this.myDataTransfer,
          this.props.slotIndex.containerID,
          containerPermissions,
          drawerMaxStats,
          drawerCurrentStats,
          false,
        ) && slotType === SlotType.Empty;
        if (!canPutIn) {
          return {
            backgroundColor: notAllowedColor,
          };
        } else {
          return {
            backgroundColor: allowedColor,
          };
        }
      } else if (item && isCraftingItem(item)) {
        // is an empty slot inside crafting container
        const canPutIn = isCraftingSlotVerified(
          e.dataTransfer,
          this.myDataTransfer,
          false,
        );
        if (!canPutIn) {
          return {
            backgroundColor: notAllowedColor,
          };
        } else {
          return {
            backgroundColor: allowedColor,
          };
        }
      } else {
        // is an empty slot in regular inventory
        return {
          backgroundColor: allowedColor,
        };
      }
    });
  }

  public onDragLeave() {
    this.setState({ backgroundColor: 'transparent' });
  }

  public render() {
    return (
      <Container>
        <EmptyItem width={60} height={60} index={this.props.slotIndex.position} />
        <SlotOverlay backgroundColor={this.state.backgroundColor} />
      </Container>
    );
  }

  public componentDidMount() {
    this.setDropDataTransfer(this.props);
  }

  public componentWillReceiveProps(nextProps: EmptyItemDropZoneProps) {
    this.setDropDataTransfer(nextProps);
  }

  private setDropDataTransfer = (props: EmptyItemDropZoneProps) => {
    const dropZoneData = getInventoryDataTransfer({
      slotType: SlotType.Empty,
      item: props.item || null,
      position: props.slotIndex.position,
      location: props.slotIndex.location,
      containerID: props.slotIndex.containerID,
      drawerID: props.slotIndex.drawerID,
    });

    this.myDataTransfer = dropZoneData;
  }
}

const EmptyItemDropZone = dragAndDrop<EmptyItemProps & EmptyItemDropZoneProps>(
  (props: EmptyItemProps & EmptyItemDropZoneProps) => {
    return {
      id: 'emptyDropZone',
      dataKey: 'inventory-items',
      scrollBodyId: 'inventory-scroll-container',
      dropTarget: !props.disableDrop,
      disableDrag: true,
    };
  },
)(EmptyItemWrapper);

export default EmptyItemDropZone;
