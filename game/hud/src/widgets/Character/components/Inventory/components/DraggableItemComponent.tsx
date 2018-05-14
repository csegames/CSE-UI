/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { ql, events, ItemPermissions } from '@csegames/camelot-unchained';
import styled from 'react-emotion';

import ItemStack from '../../ItemStack';
import CraftingItem from './CraftingItem';
import { InventorySlotItemDef, CraftingSlotItemDef, SlotType } from './InventorySlot';
import { InventoryDataTransfer, ContainerPermissionDef } from './InventoryBase';
import { DrawerCurrentStats } from './Containers/Drawer';
import dragAndDrop, { DragAndDropInjectedProps, DragEvent } from '../../../../../components/DragAndDrop/DragAndDrop';
import { placeholderIcon } from '../../../lib/constants';
import eventNames from '../../../lib/eventNames';
import {
  getInventoryDataTransfer,
  isContainerSlotVerified,
  getContainerColor,
  getContainerInfo,
} from '../../../lib/utils';

const Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StandardSlot = styled('img')`
  vertical-align: baseline;
  background-size: cover;
  width: 54px;
  height: 54px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
`;

export const SlotOverlay = styled('div')`
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  right: 2px;
  z-index: 10;
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

const ContainerOverlay = styled('div')`
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  right: 2px;
  background: linear-gradient(to top, ${(props: any) => props.backgroundColor}, transparent 65%)
`;

const FirstContainerItem = styled('div')`
  position: absolute;
  right: 3px;
  bottom: 4px;
  width: 25px;
  height: 25px;
  background: ${(props: any) => props.background};
  background-size: cover;
  border: 1px solid #795B46;
  cursor: pointer;
  z-index: 9;
`;

export interface ItemComponentProps extends DragAndDropInjectedProps {
  item: InventorySlotItemDef & CraftingSlotItemDef;
  filtering: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void;
  containerPermissions: ContainerPermissionDef | ContainerPermissionDef[];
  containerID?: string[];
  drawerID?: string;
  containerIsOpen?: boolean;
  drawerMaxStats?: ql.schema.ContainerDefStat_Single;
  drawerCurrentStats?: DrawerCurrentStats;
}

export interface ItemComponentState {
  opacity: number;
  backgroundColor: string;
}

class ItemComponent extends React.Component<ItemComponentProps, ItemComponentState> {
  private myDataTransfer: InventoryDataTransfer;
  constructor(props: ItemComponentProps) {
    super(props);
    this.state = {
      opacity: 1,
      backgroundColor: 'transparent',
    };
  }

  public data() {
    return this.myDataTransfer;
  }

  public onDragStart(e: DragEvent<InventoryDataTransfer, ItemComponentProps>) {
    const item = e.dataTransfer.item;
    const gearSlotSets = item && item.staticDefinition && item.staticDefinition.gearSlotSets;
    if (item && item.staticDefinition && item.staticDefinition.gearSlotSets) {
      let allGearSlots: ql.schema.GearSlotDefRef[] = [];
      gearSlotSets.forEach((gearSlotSet) => {
        allGearSlots = [...allGearSlots, ...gearSlotSet.gearSlots as any];
      });
      events.fire(eventNames.onHighlightSlots, allGearSlots);
    }
    this.setState({ opacity: 0.3 });
    this.props.onDragStart();
  }

  public onDragEnter(e: DragEvent<InventoryDataTransfer, ItemComponentProps>) {
    this.setState(() => {
      const canDrop = isContainerSlotVerified(
        e.dataTransfer,
        this.myDataTransfer,
        this.props.containerID,
        this.props.containerPermissions,
        this.props.drawerMaxStats,
        this.props.drawerCurrentStats,
        false,
      );
      const notAllowedColor = 'rgba(186, 50, 50, 0.4)';
      const allowedColor = 'rgba(46, 213, 80, 0.4)';
      if (this.props.containerID) {
        if (canDrop) {
          return {
            backgroundColor: allowedColor,
          };
        } else {
          return {
            backgroundColor: notAllowedColor,
          };
        }
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
    events.fire(eventNames.onDehighlightSlots);
    this.props.onDragEnd();
  }

  public onDrop(e: DragEvent<InventoryDataTransfer, ItemComponentProps>) {
    // FOR NOW, don't allow drop if drag item is an equipped item.
    const containerSlotVerified = (this.props.containerID &&
      isContainerSlotVerified(
        e.dataTransfer,
        this.myDataTransfer,
        this.props.containerID,
        this.props.containerPermissions,
        this.props.drawerMaxStats,
        this.props.drawerCurrentStats,
        true,
      )) || true;
    if (containerSlotVerified && !e.dataTransfer || !e.dataTransfer['gearSlots']) {
      const { item, containerID, drawerID } = this.props;
      const location = item.item.location;
      const dropZoneData = getInventoryDataTransfer({
        item: item.item,
        location: location.inContainer ? 'inContainer' : 'inventory',
        position: location.inContainer ? location.inContainer.position : location.inventory.position,
        drawerID,
        containerID,
      });
      this.props.onDrop(e.dataTransfer, dropZoneData);
    }
  }

  public render()  {
    const { item } = this.props;
    let itemComponent: JSX.Element;
    switch (item.slotType) {
      case SlotType.CraftingItem: {
        // Items in a Crafting Container
        itemComponent =
          <CraftingItem
            count={item.itemCount}
            quality={item.quality}
            icon={item.icon}
          />;
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
      <Container style={{ opacity: this.state.opacity }}>
        {itemComponent}
        {item.slotType === SlotType.Container &&
          <FirstContainerItem
            background={containerFirstItem ? `url(${containerFirstItem.staticDefinition.iconUrl})` :
              `url(${placeholderIcon})`}
          />
        }
        {item && item.slotType === SlotType.Container &&
          <ContainerOverlay backgroundColor={getContainerColor(item.item, 0.5)} />
        }
        <SlotOverlay
          backgroundColor={this.state.backgroundColor}
          containerIsOpen={this.props.containerIsOpen}
          borderColor={getContainerColor(item.item)}
        />
      </Container>
    );
  }

  public componentDidMount() {
    this.setDragDataTransfer(this.props);
  }

  public componentWillReceiveProps(nextProps: ItemComponentProps) {
    this.setDragDataTransfer(nextProps);
  }

  private setDragDataTransfer = (props: ItemComponentProps) => {
    const item = props.item.item || props.item.stackedItems[0];
    const pos = item.location.inContainer ? item.location.inContainer.position :
      item.location.inventory ? item.location.inventory.position : -1;
    this.myDataTransfer = getInventoryDataTransfer({
      item,
      location: item.location.inContainer ? 'inContainer' : 'inventory',
      position: pos,
      containerID: props.containerID,
      drawerID: props.drawerID,
    });
  }
}

const DraggableItemComponent = dragAndDrop<ItemComponentProps>(
  (props: ItemComponentProps) => {
    const item = props.item;
    const id = item.stackedItems && item.stackedItems[0] ? item.stackedItems[0].id : item.itemID;
    return {
      id,
      dataKey: 'inventory-items',
      scrollBodyId: 'inventory-scroll-container',
      dropTarget: item.slotType !== SlotType.CraftingItem && (props.filtering ? false : true),
      disableDrag: props.filtering || item.slotType === SlotType.CraftingItem ||
        (props.containerPermissions && (_.isArray(props.containerPermissions) ?
        
          // if container permissions is an array, search parent containers and this container
          // if they have RemoveContents permission
          _.findIndex(props.containerPermissions, (permission: ContainerPermissionDef) =>
            (permission.isParent || (!permission.isChild && !permission.isParent)) &&
            permission.userPermission & ItemPermissions.RemoveContents) === -1 :

          // if does not have parent containers, just return this container to see if it has RemoveContents permissions
          (props.containerPermissions && props.containerPermissions.userPermission & ItemPermissions.RemoveContents) === 0)),
    };
  },
)(ItemComponent);

export default DraggableItemComponent;
