/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import EmptyItem, { EmptyItemProps } from '../../ItemShared/components/EmptyItem';
import { ContainerPermissionDef } from '../../ItemShared/InventoryBase';
import { DrawerCurrentStats } from './Containers/Drawer';
import dragAndDrop, { DragAndDropInjectedProps, DragEvent } from '../../../../../components/DragAndDrop/DragAndDrop';
import { InventoryDataTransfer, MoveStackPayload } from '../../../lib/itemEvents';
import { InventoryItem, ContainerDefStat_Single } from 'gql/interfaces';
import {
  getInventoryDataTransfer,
  isContainerSlotVerified,
  isCraftingSlotVerified,
  isCraftingItem,
  isStackedItem,
} from '../../../lib/utils';
import { SlotType, SlotIndexInterface } from '../../../lib/itemInterfaces';
import { InventoryContext } from '../../ItemShared/InventoryContext';

const Container = styled.div`
  position: relative;
`;

const SlotOverlay = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  right: 2px;
  cursor: pointer;
  background-color: ${(props: any) => props.backgroundColor};
`;

export interface InjectedEmptyItemDropZoneProps {
  onMoveStack: (payload: MoveStackPayload) => void;
}

export interface EmptyItemDropZoneProps extends DragAndDropInjectedProps {
  filtering: boolean;
  slotType: SlotType;
  slotIndex: SlotIndexInterface;
  disableDrop: boolean;
  onDrop: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void;
  containerPermissions: ContainerPermissionDef | ContainerPermissionDef[];
  drawerMaxStats?: ContainerDefStat_Single;
  drawerCurrentStats?: DrawerCurrentStats;

  // Only used by item stacks that are represented as containers. This item is the first item in the stack.
  item?: InventoryItem.Fragment;
}

export type Props = InjectedEmptyItemDropZoneProps & EmptyItemDropZoneProps;

export interface EmptyItemDropZoneState {
  backgroundColor: string;
}

class EmptyItemWrapper extends React.Component<Props, EmptyItemDropZoneState> {
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

  public onDrop(e: DragEvent<InventoryDataTransfer, EmptyItemProps & Props>) {
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
      if (isStackedItem(e.dataTransfer.item) && e.dataTransfer.unitCount) {
        const moveStackPayload: MoveStackPayload = {
          itemDataTransfer: e.dataTransfer,
          amount: e.dataTransfer.unitCount,
          newLocation: 'inventory',
          newPosition: this.props.slotIndex.position,
        };
        this.props.onMoveStack(moveStackPayload);
      } else {
        // is in regular inventory
        this.props.onDrop(e.dataTransfer, this.myDataTransfer);
      }
    }
  }

  public onDragOver(e: DragEvent<InventoryDataTransfer, EmptyItemProps & Props>) {
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

  public componentWillReceiveProps(nextProps: Props) {
    this.setDropDataTransfer(nextProps);
  }

  private setDropDataTransfer = (props: Props) => {
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

const EmptyItemDropZone = dragAndDrop<EmptyItemProps & Props>(
  (props: EmptyItemProps & Props) => {
    return {
      id: 'emptyDropZone',
      dataKey: 'inventory-items',
      dropTarget: !props.disableDrop && !props.filtering,
      disableDrag: true,
    };
  },
)(EmptyItemWrapper);

class EmptyItemDropZoneWithInjectedContext extends React.Component<EmptyItemProps & EmptyItemDropZoneProps> {
  public render() {
    return (
      <InventoryContext.Consumer>
        {({ onMoveStack }) => {
          return <EmptyItemDropZone {...this.props} onMoveStack={onMoveStack} />;
        }}
      </InventoryContext.Consumer>
    );
  }
}

export default EmptyItemDropZoneWithInjectedContext;
