/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';

import { ContainerDefStat_Single, GearSlotDefRef, InventoryItem } from 'gql/interfaces';
import ContextMenuContent from './ContextMenu/ContextMenuContent';
import { showContextMenuContent } from 'actions/contextMenu';
import ItemStack from '../../ItemShared/components/ItemStack';
import CraftingItem from './CraftingItem';
import { ContainerPermissionDef, ContainerIdToDrawerInfo } from '../../ItemShared/InventoryBase';
import { DrawerCurrentStats } from './Containers/Drawer';
import { DragAndDropInjectedProps, DragEvent } from 'components/DragAndDrop/DragAndDrop';
import { placeholderIcon } from '../../../lib/constants';
import eventNames, { InventoryDataTransfer, MoveStackPayload, CombineStackPayload } from '../../../lib/itemEvents';
import { InventorySlotItemDef, CraftingSlotItemDef, SlotType } from '../../../lib/itemInterfaces';
import { InventoryContext } from '../../ItemShared/InventoryContext';
import DraggableItem, { Props as DraggableItemProps } from '../../ItemShared/components/DraggableItem';
import {
  // isStackedItem,
  getInventoryDataTransfer,
  isContainerSlotVerified,
  getContainerColor,
  getContainerInfo,
  isCombiningStack,
  isMovingStack,
  isSwappingPartialStack,
  isContainerItem,
} from '../../../lib/utils';

export const StandardSlot = styled.img`
  vertical-align: baseline;
  background-size: cover;
  width: calc(100% - 5px);
  height: calc(100% - 5px);
  position: relative;
  overflow: hidden;
  cursor: pointer;
`;

export const SlotOverlay = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  right: 2px;
  z-index: 1;
  cursor: pointer;
  background-color: ${(props: any) => props.backgroundColor};
  border: ${(props: any) => props.containerIsOpen ? `1px solid ${props.borderColor}` : '0px'};
  &:hover {
    box-shadow: inset 0 0 10px rgba(255,255,255,0.2);
  };
  &:active {
    box-shadow: inset 0 0 10px rgba(0,0,0,0.4);
  };
`;

const ContainerOverlay = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  right: 2px;
  background: linear-gradient(to top, ${(props: any) => props.backgroundColor}, transparent 65%);
`;

const FirstContainerItem = styled.img`
  position: absolute;
  right: 3px;
  bottom: 4px;
  width: 25px;
  height: 25px;
  border: 1px solid #795B46;
  cursor: pointer;
  z-index: 9;
`;

function getDragItemID(item: InventorySlotItemDef & CraftingSlotItemDef) {
  return item.stackedItems && item.stackedItems[0] ? item.stackedItems[0].id : item.itemID;
}

export interface InjectedItemComponentProps {
  onMoveStack: (payload: MoveStackPayload) => void;
  onCombineStack: (payload: CombineStackPayload) => void;
  containerIdToDrawerInfo: ContainerIdToDrawerInfo;
}

export interface ItemComponentProps extends DragAndDropInjectedProps {
  item: InventorySlotItemDef & CraftingSlotItemDef;
  filtering: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void;
  containerPermissions: ContainerPermissionDef | ContainerPermissionDef[];
  syncWithServer: () => void;
  onContextMenuShow: () => void;
  onContextMenuHide: () => void;

  containerID?: string[];
  drawerID?: string;
  containerIsOpen?: boolean;
  drawerMaxStats?: ContainerDefStat_Single;
  drawerCurrentStats?: DrawerCurrentStats;
  onCombineStackDrawer?: (payload: CombineStackPayload) => void;
}

export type Props = InjectedItemComponentProps & ItemComponentProps;

export interface ItemComponentState {
  opacity: number;
  backgroundColor: string;
}

class ItemComponent extends React.PureComponent<Props, ItemComponentState> {
  private myDataTransfer: InventoryDataTransfer;

  constructor(props: Props) {
    super(props);
    this.state = {
      opacity: 1,
      backgroundColor: 'transparent',
    };
  }

  public render()  {
    const { item } = this.props;
    let itemComponent: JSX.Element;
    switch (item.slotType) {
      case SlotType.Stack: {
        const count = item.stackedItems && item.stackedItems.length > 1 ?
          item.stackedItems.length : item.item.stats.item.unitCount;
        itemComponent = <ItemStack count={count} icon={item.icon} />;
        break;
      }
      case SlotType.CraftingContainer: {
        const count = item.stackedItems && item.stackedItems.length > 1 ?
          getContainerInfo(item.stackedItems).totalUnitCount : item.item.stats.item.unitCount;
        itemComponent = <ItemStack count={count} icon={item.icon} />;
        break;
      }
      case SlotType.CraftingItem: {
        // Items in a Crafting Container
        itemComponent =
          <CraftingItem
            count={item.itemCount}
            quality={Number(item.quality.toFixed(2))}
            icon={item.icon}
          />;
        break;
      }
      case SlotType.Stack: {
        const count = item.stackedItems && item.stackedItems.length > 1 ?
          item.stackedItems.length : item.item.stats.item.unitCount;
        itemComponent = <ItemStack count={count} icon={item.icon} />;
        break;
      }
      case SlotType.CraftingContainer: {
        itemComponent = <ItemStack count={getContainerInfo(item.stackedItems).totalUnitCount} icon={item.icon} />;
        break;
      }
      default: {
        itemComponent = <StandardSlot src={item.icon || placeholderIcon} />;
        break;
      }
    }

    const overlayBackgroundColor = this.props.item.disabled ? 'rgba(255, 255, 255, 0.5)' : this.state.backgroundColor;
    const containerFirstItem = this.getContainerFirstItem();

    return (
      <DraggableItem
        style={{ opacity: this.state.opacity }}
        initializeDragAndDrop={this.initializeDragOptions}
        item={item.item}
        dragItemID={getDragItemID(item)}
        data={() => this.myDataTransfer}
        onContextMenu={this.onContextMenu}
        onDragStart={this.onDragStart}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragEnd={this.onDragEnd}
        onDrop={this.onDrop}>
        {itemComponent}
        {item.slotType === SlotType.Container &&
          <FirstContainerItem src={containerFirstItem ? containerFirstItem.staticDefinition.iconUrl : placeholderIcon} />
        }
        {item && item.slotType === SlotType.Container &&
          <ContainerOverlay backgroundColor={getContainerColor(item.item, 0.5)} />
        }
        <SlotOverlay
          backgroundColor={overlayBackgroundColor}
          containerIsOpen={this.props.containerIsOpen}
          borderColor={getContainerColor(item.item)}
        />
      </DraggableItem>
    );
  }

  public componentDidMount() {
    this.setDragDataTransfer(this.props);
  }

  public componentDidUpdate() {
    this.setDragDataTransfer(this.props);
  }

  private initializeDragOptions = () => {
    const { item, containerPermissions, filtering } = this.props;
    const id = getDragItemID(item);
    const disableDrag = item.disabled || item.disableDrag ||
    (containerPermissions && (_.isArray(containerPermissions) ?
      // if container permissions is an array, search parent containers and this container
      // if they have RemoveContents permission
      _.findIndex(containerPermissions, (permission: ContainerPermissionDef) =>
        (permission.isParent || (!permission.isChild && !permission.isParent)) &&
        permission.userPermission & ItemPermissions.RemoveContents) === -1 :

      // if does not have parent containers, just return this container to see if it has RemoveContents permissions
      (containerPermissions && containerPermissions.userPermission & ItemPermissions.RemoveContents) === 0));
    return {
      id,
      dataKey: 'inventory-items',
      dropTarget: !item.disabled && !item.disableDrop &&
        item.slotType !== SlotType.CraftingItem && (!filtering || item.slotType === SlotType.CraftingContainer),
      disableDrag,
    };
  }

  private getContainerFirstItem = () => {
    const { item, containerIdToDrawerInfo } = this.props;
    let containerFirstItem: InventoryItem.Fragment = null;
    if (isContainerItem(item.item)) {
      const containerID = item.itemID;
      const itemContainer = containerIdToDrawerInfo[containerID];
      // Find first drawer that has an item in it
      const containerFirstDrawer = _.find(_.values(itemContainer.drawers), (_drawer) => {
        return Object.keys(_drawer).length > 0;
      });
      if (containerFirstDrawer) {
        // Then get first item in that drawer
        Object.keys(containerFirstDrawer).forEach((slot) => {
          const slotNumber = Number(slot);
          if (containerFirstDrawer[slotNumber].item) {
            containerFirstItem = containerFirstDrawer[slotNumber].item;
          }
        });
      }
    }
    return containerFirstItem;
  }

  private setDragDataTransfer = (props: Props) => {
    const item = props.item.item || props.item.stackedItems[0];
    const pos = item.location.inContainer ? item.location.inContainer.position :
      item.location.inventory ? item.location.inventory.position : -1;
    this.myDataTransfer = getInventoryDataTransfer({
      slotType: props.item.slotType,
      item,
      location: item.location.inContainer ? 'inContainer' : 'inventory',
      position: pos,
      containerID: props.containerID,
      drawerID: props.drawerID,
      fullStack: props.item.slotType === SlotType.CraftingContainer,
    });
  }

  private onContextMenu = (e: MouseEvent) => {
    const { item } = this.props;
    if (!item.disableContextMenu && !item.disabled) {
      showContextMenuContent(
        <ContextMenuContent
          item={item.item || (item.stackedItems && item.stackedItems[0])}
          syncWithServer={this.props.syncWithServer}
          containerID={typeof item.slotIndex !== 'number' && item.slotIndex.containerID}
          drawerID={typeof item.slotIndex !== 'number' && item.slotIndex.drawerID}
          onContextMenuShow={this.props.onContextMenuShow}
          onContextMenuHide={this.props.onContextMenuHide}
        />
      , e as any);
    }
  }

  private onDragStart = (e: DragEvent<InventoryDataTransfer, DraggableItemProps>) => {
    const item = e.dataTransfer.item;
    const gearSlotSets = item && item.staticDefinition && item.staticDefinition.gearSlotSets;
    if (item && item.staticDefinition && item.staticDefinition.gearSlotSets) {
      let allGearSlots: GearSlotDefRef[] = [];
      gearSlotSets.forEach((gearSlotSet) => {
        allGearSlots = [...allGearSlots, ...gearSlotSet.gearSlots as any];
      });
      game.trigger(eventNames.onHighlightSlots, allGearSlots);
    }
    this.setState({ opacity: 0.3 });
    this.props.onDragStart();
  }

  private onDragEnter = (e: DragEvent<InventoryDataTransfer, DraggableItemProps>) => {
    const { item, containerID, containerPermissions, drawerMaxStats, drawerCurrentStats } = this.props;
    this.setState(() => {
      const notAllowedColor = 'rgba(186, 50, 50, 0.4)';
      const allowedColor = 'rgba(46, 213, 80, 0.4)';
      const combiningColor = 'rgba(234, 211, 171, 0.4)';
      const isCombining = isCombiningStack(e.dataTransfer, this.myDataTransfer);

      if (e.dataTransfer.item.id === (this.props.item && this.props.item.item.id)) {
        // Trying to put on top of self
        return;
      }

      if (containerID) {
        const canDrop = isContainerSlotVerified(
          e.dataTransfer,
          this.myDataTransfer,
          containerID,
          containerPermissions,
          drawerMaxStats,
          drawerCurrentStats,
          false,
        );
        if (canDrop) {
          if (isCombining) {
            return {
              backgroundColor: combiningColor,
            };
          } else {
            return {
              backgroundColor: allowedColor,
            };
          }
        } else {
          return {
            backgroundColor: notAllowedColor,
          };
        }
      } else if (item.slotType === SlotType.CraftingItem ||
          (e.dataTransfer.slotType === SlotType.CraftingItem && item.slotType === SlotType.CraftingContainer)) {
        return {
          backgroundColor: notAllowedColor,
        };
      } else {
        const swappingPartialStack = isSwappingPartialStack(e.dataTransfer, this.myDataTransfer);
        if ((e.dataTransfer && e.dataTransfer['gearSlots']) || swappingPartialStack) {
          return {
            backgroundColor: notAllowedColor,
          };
        } else {
          if (isCombining) {
            return {
              backgroundColor: combiningColor,
            };
          } else {
            return {
              backgroundColor: allowedColor,
            };
          }
        }
      }
    });
  }

  private onDragLeave = () => {
    this.setState({ backgroundColor: 'transparent' });
  }

  private onDragEnd = () => {
    this.setState({ opacity: 1 });
    game.trigger(eventNames.onDehighlightSlots);
    this.props.onDragEnd();
  }

  private onDrop = (e: DragEvent<InventoryDataTransfer, DraggableItemProps>) => {
    // FOR NOW, don't allow drop if drag item is an equipped item.
    this.setState({ backgroundColor: 'transparent' });
    const { item, containerID, drawerID } = this.props;
    const containerSlotVerified = (containerID &&
      isContainerSlotVerified(
        e.dataTransfer,
        this.myDataTransfer,
        this.props.containerID,
        this.props.containerPermissions,
        this.props.drawerMaxStats,
        this.props.drawerCurrentStats,
        true,
      )) || true;
    if (e.dataTransfer.item.id === (this.props.item && this.props.item.item.id)) {
      // Trying to put on top of self
      return;
    }

    if (item.slotType !== SlotType.CraftingItem &&
        !(e.dataTransfer.slotType === SlotType.CraftingItem && item.slotType === SlotType.CraftingContainer) &&
        (containerSlotVerified && !e.dataTransfer || !e.dataTransfer['gearSlots']) &&
        !isSwappingPartialStack(e.dataTransfer, this.myDataTransfer)) {
      const location = item.item.location;
      const dropZoneData = getInventoryDataTransfer({
        slotType: item.slotType,
        item: item.item,
        location: location.inContainer ? 'inContainer' : 'inventory',
        position: location.inContainer ? location.inContainer.position : location.inventory.position,
        drawerID,
        containerID,
      });

      if (isCombiningStack(e.dataTransfer, this.myDataTransfer)) {
        const combineStackPayload: CombineStackPayload = {
          dragItem: e.dataTransfer,
          dropZone: this.myDataTransfer,
          amount: e.dataTransfer.unitCount || e.dataTransfer.item.stats.item.unitCount,
          newPosition: this.props.item.slotIndex.position,
        };
        // Call onCombineStackDrawer if we have it (only items within container drawers should have this function)
        this.props.onCombineStackDrawer ? this.props.onCombineStackDrawer(combineStackPayload) :
          this.props.onCombineStack(combineStackPayload);
      } else if (isMovingStack(e.dataTransfer)) {
        const moveStackPayload: MoveStackPayload = {
          itemDataTransfer: e.dataTransfer,
          amount: e.dataTransfer.unitCount,
          newLocation: 'inventory',
          newPosition: this.props.item.slotIndex.position,
        };
        this.props.onMoveStack(moveStackPayload);
      } else {
        this.props.onDrop(e.dataTransfer, dropZoneData);
      }
    }
  }
}

class DraggableItemComponentWithInjectedContext extends React.Component<ItemComponentProps> {
  public render() {
    return (
      <InventoryContext.Consumer>
        {({ containerIdToDrawerInfo, onMoveStack, onCombineStack }) => {
          return (
            <ItemComponent
              {...this.props}
              containerIdToDrawerInfo={containerIdToDrawerInfo}
              onCombineStack={onCombineStack}
              onMoveStack={onMoveStack}
            />
          );
        }}
      </InventoryContext.Consumer>
    );
  }
}

export default DraggableItemComponentWithInjectedContext;
