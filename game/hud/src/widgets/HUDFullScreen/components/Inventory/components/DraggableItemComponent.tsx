/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';

import ContextMenuContent from './ContextMenu/ContextMenuContent';
import { showContextMenuContent } from 'actions/contextMenu';
import ItemStack from '../../ItemShared/components/ItemStack';
import CraftingItem from './CraftingItem';
import { ContainerPermissionDef } from '../../ItemShared/InventoryBase';
import { DrawerCurrentStats } from './Containers/Drawer';
import enableDragAndDrop, { DragAndDropInjectedProps, DragEvent } from 'components/DragAndDrop/DragAndDrop';
import { placeholderIcon } from '../../../lib/constants';
import eventNames, { InventoryDataTransfer, MoveStackPayload, CombineStackPayload } from '../../../lib/eventNames';
import { InventorySlotItemDef, CraftingSlotItemDef, SlotType } from '../../../lib/itemInterfaces';
import { ContainerDefStat_Single, GearSlotDefRef } from 'gql/interfaces';
import { InventoryContext } from '../../ItemShared/InventoryContext';
import SplitStackMenu from './ContextMenu/SplitStackMenu';
import {
  // isStackedItem,
  getInventoryDataTransfer,
  isContainerSlotVerified,
  getContainerColor,
  getContainerInfo,
  isCombiningStack,
  isMovingStack,
} from '../../../lib/utils';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StandardSlot = styled.img`
  vertical-align: baseline;
  background-size: cover;
  width: 54px;
  height: 54px;
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

const FirstContainerItem = styled.div`
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
}

export type Props = InjectedItemComponentProps & ItemComponentProps;

export interface ItemComponentState {
  opacity: number;
  backgroundColor: string;
}

class ItemComponent extends React.Component<Props, ItemComponentState> {
  private myDataTransfer: InventoryDataTransfer;
  private isDragging: boolean = false;
  private dragBoundaries: { top: number, left: number, right: number, bottom: number };
  constructor(props: Props) {
    super(props);
    this.state = {
      opacity: 1,
      backgroundColor: 'transparent',
    };
  }

  public data() {
    return this.myDataTransfer;
  }

  public onDragStart(e: DragEvent<InventoryDataTransfer, Props>) {
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
    this.isDragging = true;
  }

  public onDragEnter(e: DragEvent<InventoryDataTransfer, Props>) {
    const { item, containerID, containerPermissions, drawerMaxStats, drawerCurrentStats } = this.props;
    this.setState(() => {
      const notAllowedColor = 'rgba(186, 50, 50, 0.4)';
      const allowedColor = 'rgba(46, 213, 80, 0.4)';
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
          return {
            backgroundColor: allowedColor,
          };
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
        if (e.dataTransfer && e.dataTransfer['gearSlots']) {
          return {
            backgroundColor: notAllowedColor,
          };
        } else {
          return {
            backgroundColor: allowedColor,
          };
        }
      }
    });
  }

  public onDragLeave() {
    this.setState({ backgroundColor: 'transparent' });
  }

  public onDragEnd() {
    this.setState({ opacity: 1 });
    game.trigger(eventNames.onDehighlightSlots);
    this.props.onDragEnd();
    this.resetDraggingInfo();
  }

  public onDrop(e: DragEvent<InventoryDataTransfer, Props>) {
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
    if (item.slotType !== SlotType.CraftingItem &&
        !(e.dataTransfer.slotType === SlotType.CraftingItem && item.slotType === SlotType.CraftingContainer) &&
        (containerSlotVerified && !e.dataTransfer || !e.dataTransfer['gearSlots'])) {
      const location = item.item.location;
      const dropZoneData = getInventoryDataTransfer({
        slotType: item.slotType,
        item: item.item,
        location: location.inContainer ? 'inContainer' : 'inventory',
        position: location.inContainer ? location.inContainer.position : location.inventory.position,
        drawerID,
        containerID,
      });

      if (isMovingStack(e.dataTransfer)) {
        const moveStackPayload: MoveStackPayload = {
          item: e.dataTransfer.item,
          amount: e.dataTransfer.unitCount,
          newLocation: 'inventory',
          newPosition: this.props.item.slotIndex.position,
        };
        this.props.onMoveStack(moveStackPayload);
      } else if (isCombiningStack(e.dataTransfer, this.myDataTransfer)) {
        const combineStackPayload: CombineStackPayload = {
          item: e.dataTransfer.item,
          amount: e.dataTransfer.item.stats.item.unitCount,
          stackItem: this.props.item.item,
          newPosition: this.props.item.slotIndex.position,
        };
        this.props.onCombineStack(combineStackPayload);
      } else {
        this.props.onDrop(e.dataTransfer, dropZoneData);
      }
    }
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

    // Find first drawer that has an item in it
    const containerFirstDrawer = item && item.item && _.isArray(item.item.containerDrawers) &&
      _.find(item.item.containerDrawers, (_drawer) => {
        return _drawer.containedItems.length > 0;
      });
    // Then get first item in that drawer
    const containerFirstItem = containerFirstDrawer &&
      _.sortBy(
        containerFirstDrawer.containedItems, (_item) => {
          return _item.location.inContainer.position;
        },
      )[0];
    return (
      <Container
        style={{ opacity: this.state.opacity }}
        onMouseDown={this.onMouseDown}
        onClick={this.onClick}
        onContextMenu={this.onContextMenu}>
        {itemComponent}
        {item.slotType === SlotType.Container &&
          <FirstContainerItem
            style={{ background: containerFirstItem ? `url(${containerFirstItem.staticDefinition.iconUrl})` :
              `url(${placeholderIcon})`, backgroundSize: 'cover' }}
          />
        }
        {item && item.slotType === SlotType.Container &&
          <ContainerOverlay backgroundColor={getContainerColor(item.item, 0.5)} />
        }
        <SlotOverlay
          backgroundColor={overlayBackgroundColor}
          containerIsOpen={this.props.containerIsOpen}
          borderColor={getContainerColor(item.item)}
        />
      </Container>
    );
  }

  public componentDidMount() {
    this.setDragDataTransfer(this.props);
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (!_.isEqual(this.props, nextProps)) {
      this.setDragDataTransfer(nextProps);
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('mousedown', this.startDraggingHalfStack);
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
    showContextMenuContent(
      <ContextMenuContent
        item={item.item || (item.stackedItems && item.stackedItems[0])}
        syncWithServer={this.props.syncWithServer}
        containerID={typeof item.slotIndex !== 'number' && item.slotIndex.containerID}
        drawerID={typeof item.slotIndex !== 'number' && item.slotIndex.drawerID}
        onContextMenuShow={this.props.onContextMenuShow}
        onContextMenuHide={this.props.onContextMenuHide}
      />
    , e);
  }

  private onMouseDown = (e: MouseEvent) => {
    if (e.shiftKey && e.button === 0) {
      e.stopPropagation();

      // If they shift + start to drag their mouse, then move half the stack
      window.addEventListener('mousemove', this.startDraggingHalfStack);

      // Player has 500 milliseconds to start dragging
      setTimeout(() => {
        window.removeEventListener('mousemove', this.startDraggingHalfStack);
        this.resetDraggingInfo();
      }, 500);
    }

    if (e.ctrlKey && e.button === 0) {
      e.stopPropagation();

      this.startDraggingStack(e, 1);
    }
  }

  private onClick = (e: MouseEvent) => {
    if (e.shiftKey && e.type === 'click' && !this.isDragging) {
      e.stopPropagation();
      window.removeEventListener('mousemove', this.startDraggingHalfStack);
      this.resetDraggingInfo();

      // If they just shift + click, show the stack menu so they can choose the amount to move
      this.showStackMenu(e);
    }
  }

  private showStackMenu = (e: MouseEvent) => {
    showContextMenuContent(
      <SplitStackMenu
        min={1}
        max={this.props.item.item.stats.item.unitCount}
        onSplit={this.startDraggingStack}
      />
    , e);
  }

  private startDraggingHalfStack = (e: MouseEvent) => {
    if (!this.dragBoundaries) {
      this.dragBoundaries = {
        top: e.clientY + 5,
        bottom: e.clientY - 5,
        right: e.clientX + 5,
        left: e.clientX - 5,
      };
    }
    const { item } = this.props;
    const count = Math.floor(item.item.stats.item.unitCount / 2);
    this.startDraggingStack(e, count);
  }

  private startDraggingStack = (e: MouseEvent, amount: number) => {
    const { item } = this.props;
    window.removeEventListener('mousemove', this.startDraggingHalfStack);
    const dragRender = <ItemStack count={amount} icon={item.icon} />;

    if (amount === this.myDataTransfer.item.stats.item.unitCount) {
      // User is trying to move whole stack, just move the whole item
      this.startDrag(e, this.myDataTransfer, dragRender);
      return;
    }

    const dataTransfer = getInventoryDataTransfer({
      ...this.myDataTransfer,
      fullStack: false,
      unitCount: amount,
    });
    this.startDrag(e, dataTransfer, dragRender);
  }

  private startDrag = (e: MouseEvent, dataTransfer?: InventoryDataTransfer, dragRender?: JSX.Element) => {
    if (!this.isDragging) {
      const startDragOptions: StartDragOptions = {
        e: e as any,
        draggableData: dataTransfer,
        dragRender,
      };
      events.fire('start-drag', getDragItemID(this.props.item), startDragOptions);
      this.isDragging = true;
    }
  }

  private resetDraggingInfo = () => {
    this.isDragging = false;
    this.dragBoundaries = null;
  }
}

const DraggableItemComponent = enableDragAndDrop<ItemComponentProps>(
  (props: ItemComponentProps) => {
    const item = props.item;
    const id = getDragItemID(item);
    const disableDrag = props.item.disabled || props.item.disableDrag || props.filtering ||
    (props.containerPermissions && (_.isArray(props.containerPermissions) ?
      // if container permissions is an array, search parent containers and this container
      // if they have RemoveContents permission
      _.findIndex(props.containerPermissions, (permission: ContainerPermissionDef) =>
        (permission.isParent || (!permission.isChild && !permission.isParent)) &&
        permission.userPermission & ItemPermissions.RemoveContents) === -1 :

      // if does not have parent containers, just return this container to see if it has RemoveContents permissions
      (props.containerPermissions && props.containerPermissions.userPermission & ItemPermissions.RemoveContents) === 0));
    return {
      id,
      dataKey: 'inventory-items',
      scrollBodyId: 'inventory-scroll-container',
      dropTarget: !props.item.disabled && !props.item.disableDrop &&
        item.slotType !== SlotType.CraftingItem && !props.filtering,
      disableDrag,
    };
  },
)(ItemComponent);

class DraggableItemComponentWithInjectedContext extends React.Component<ItemComponentProps> {
  public render() {
    return (
      <InventoryContext.Consumer>
        {({ onMoveStack, onCombineStack }) => {
          return (
            <DraggableItemComponent {...this.props} onMoveStack={onMoveStack} onCombineStack={onCombineStack} />
          );
        }}
      </InventoryContext.Consumer>
    );
  }
}

export default DraggableItemComponentWithInjectedContext;
