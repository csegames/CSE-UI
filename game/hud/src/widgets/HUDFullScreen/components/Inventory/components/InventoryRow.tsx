/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

import { InventorySlot } from './InventorySlot';
import { DrawerCurrentStats } from './Containers/Drawer';
import CraftingContainer from './Containers/CraftingContainer';
import ItemContainer from './Containers/ItemContainer';
import { ContainerIdToDrawerInfo } from '../../ItemShared/InventoryBase';
import { hasViewContentPermissions } from '../../../lib/utils';
import { InventoryDataTransfer } from '../../../lib/eventNames';
import { InventorySlotItemDef, SlotType, SlotItemDefType } from '../../../lib/itemInterfaces';
import {
  InventoryItem,
  GearSlotDefRef,
  EquippedItem,
  ContainerDefStat_Single,
} from 'gql/interfaces';

declare const toastr: any;

const Container = styled('div')`
  margin: auto;
`;

const Row = styled('div')`
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
  flex-wrap: wrap;
`;

export interface ContainerInfo {
  // Containers can only go 1 container deep.
  itemIndex: number;
}

export interface InventoryRowProps {
  items: InventorySlotItemDef[];
  onChangeInventoryItems: (inventoryItems: InventoryItem.Fragment[]) => void;
  onDropOnZone: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void;
  onMoveStack: (item: InventoryItem.Fragment, amount: number) => void;
  onContainerIdToDrawerInfoChange: (newObj: ContainerIdToDrawerInfo) => void;
  onChangeStackGroupIdToItemIDs: (newObj: {[id: string]: string[]}) => void;
  onRightOrLeftItemAction: (item: InventoryItem.Fragment, action: (gearSlots: GearSlotDefRef.Fragment[]) => void) => void;
  showTooltip: (item: SlotItemDefType, event: MouseEvent) => void;
  hideTooltip: () => void;
  syncWithServer: () => void;
  bodyWidth: number;

  containerID?: string[];
  drawerID?: string;
  equippedItems?: EquippedItem.Fragment[];
  drawerMaxStats?: ContainerDefStat_Single;
  drawerCurrentStats?: DrawerCurrentStats;
  filtering?: boolean;
  onRightClickItem?: (item: InventoryItem.Fragment) => void;

  // Display gray slots png instead of gold
  showGraySlots?: boolean;
}

export interface InventoryRowState {
  // Multiple containers can be opened at a time
  containersOpen: ContainerInfo[];
}

export class InventoryRow extends React.Component<InventoryRowProps, InventoryRowState> {
  constructor(props: InventoryRowProps) {
    super(props);
    this.state = {
      containersOpen: [],
    };
  }

  public render() {
    const { containersOpen } = this.state;
    return (
      <Container>
        <Row>
          {this.props.items.map((slotDef, index) => {
            const containerIsOpen = _.findIndex(containersOpen, _container => _container.itemIndex === index) !== -1;
            return (
              <InventorySlot
                key={index}
                item={slotDef}
                itemIndex={index}
                filtering={this.props.filtering}
                onToggleContainer={() => this.toggleContainer(index)}
                onDropOnZone={this.props.onDropOnZone}
                onMoveStack={this.props.onMoveStack}
                onRightOrLeftItemAction={this.props.onRightOrLeftItemAction}
                showTooltip={this.props.showTooltip}
                hideTooltip={this.props.hideTooltip}
                showGraySlots={this.props.showGraySlots}
                containerIsOpen={containerIsOpen}
                drawerMaxStats={this.props.drawerMaxStats}
                drawerCurrentStats={this.props.drawerCurrentStats}
                syncWithServer={this.props.syncWithServer}
                onRightClick={this.props.onRightClickItem}
              />
            );
          })}
        </Row>
        {containersOpen.length > 0 ? [...containersOpen].reverse().map((container) => {
          const itemDef = this.props.items[container.itemIndex];
          // Is a crafting container
          if (itemDef && itemDef.slotType === SlotType.CraftingContainer) {
            return (
              <Row key={container.itemIndex}>
                <CraftingContainer
                  item={itemDef}
                  searchValue={''}
                  activeFilters={null}
                  slotsPerRow={this.props.items.length}
                  onChangeInventoryItems={this.props.onChangeInventoryItems}
                  onDropOnZone={this.props.onDropOnZone}
                  onChangeContainerIdToDrawerInfo={this.props.onContainerIdToDrawerInfoChange}
                  onChangeStackGroupIdToItemIDs={this.props.onChangeStackGroupIdToItemIDs}
                  drawerCurrentStats={this.props.drawerCurrentStats}
                  drawerMaxStats={this.props.drawerMaxStats}
                  bodyWidth={this.props.bodyWidth}
                  containerID={this.props.containerID}
                  drawerID={this.props.drawerID}
                  onCloseClick={() => this.hideContainer(container.itemIndex)}
                  onRightOrLeftItemAction={this.props.onRightOrLeftItemAction}
                  showTooltip={this.props.showTooltip}
                  hideTooltip={this.props.hideTooltip}
                />
              </Row>
            );
          }

          // Is an item container
          if (itemDef && itemDef.slotType === SlotType.Container) {
            return (
              <Row key={container.itemIndex}>
                <ItemContainer
                  item={itemDef}
                  searchValue={''}
                  activeFilters={null}
                  slotsPerRow={this.props.items.length}
                  onCloseClick={() => this.hideContainer(container.itemIndex)}
                  onDropOnZone={this.props.onDropOnZone}
                  onChangeInventoryItems={this.props.onChangeInventoryItems}
                  containerID={(this.props.containerID && [...this.props.containerID, itemDef.itemID]) || [itemDef.itemID]}
                  onChangeContainerIdToDrawerInfo={this.props.onContainerIdToDrawerInfoChange}
                  onChangeStackGroupIdToItemIDs={this.props.onChangeStackGroupIdToItemIDs}
                  syncWithServer={this.props.syncWithServer}
                  bodyWidth={this.props.bodyWidth}
                  onRightOrLeftItemAction={this.props.onRightOrLeftItemAction}
                  showTooltip={this.props.showTooltip}
                  hideTooltip={this.props.hideTooltip}
                />
              </Row>
            );
          }
        }) : null}
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: InventoryRowProps, nextState: InventoryRowState) {
    return !_.isEqual(this.props.items, nextProps.items) ||
      !_.isEqual(this.props.equippedItems, nextProps.equippedItems) ||
      !_.isEqual(this.state.containersOpen, nextState.containersOpen) ||
      !_.isEqual(this.props.drawerCurrentStats, nextProps.drawerCurrentStats) ||
      !_.isEqual(this.props.drawerMaxStats, nextProps.drawerMaxStats) ||
      this.props.bodyWidth !== nextProps.bodyWidth ||
      this.props.filtering !== nextProps.filtering;
  }

  public componentWillReceiveProps(nextProps: InventoryRowProps) {
    // If item is moved away and container is open, then close the container.
    if (!_.isEqual(nextProps.items, this.props.items) && !_.isEmpty(this.state.containersOpen)) {
      const containersOpen = [...this.state.containersOpen];
      this.state.containersOpen.forEach((container, i) => {
        const nextItemSlot = nextProps.items[container.itemIndex];
        const prevItemSlot = this.props.items[container.itemIndex];
        if (nextItemSlot && nextItemSlot.groupStackHashID !==
          (prevItemSlot && prevItemSlot.groupStackHashID)) {
          containersOpen[i] = null;
        }
      });

      // Get rid of null values in containersOpen array
      this.setState({ containersOpen: _.compact(containersOpen) });
    }
  }

  private toggleContainer = (index: number) => {
    if (this.props.items[index].disableCraftingContainer) {
      return;
    }
    if (!hasViewContentPermissions(this.props.items[index].item)) {
      toastr.error('You do not have viewing permissions for this container', 'Oh No!!', { timeout: 3000 });
      return;
    }
    const isOpen = _.find(this.state.containersOpen, container => container.itemIndex === index);
    if (isOpen) {
      this.hideContainer(index);
    } else {
      this.showContainer(index);
    }
  }

  private hideContainer = (index: number) => {
    const containersOpen = _.filter(this.state.containersOpen, container => container.itemIndex !== index);
    this.setState({ containersOpen });
  }

  private showContainer = (index: number) => {
    const containersOpen = [...this.state.containersOpen, { itemIndex: index }];
    this.setState({ containersOpen });
  }
}

export default InventoryRow;
