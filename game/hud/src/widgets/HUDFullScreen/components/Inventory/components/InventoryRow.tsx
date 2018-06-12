/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';
import { ql } from '@csegames/camelot-unchained';
import { SecureTradeState } from '@csegames/camelot-unchained/lib/graphql/schema';

import { InventorySlot } from './InventorySlot';
import { DrawerCurrentStats } from './Containers/Drawer';
import CraftingContainer from './Containers/CraftingContainer';
import ItemContainer from './Containers/ItemContainer';
import { ContainerIdToDrawerInfo } from '../../ItemShared/InventoryBase';
import { colors } from '../../../lib/constants';
import { hasViewContentPermissions } from '../../../lib/utils';
import { InventoryDataTransfer } from '../../../lib/eventNames';
import { InventorySlotItemDef, SlotType } from '../../../lib/itemInterfaces';
import { InventoryItemFragment, EquippedItemFragment } from '../../../../../gqlInterfaces';

declare const toastr: any;

export interface InventoryRowStyle extends StyleDeclaration {
  InventoryRow: React.CSSProperties;
  openContainerItemSlot: React.CSSProperties;
  row: React.CSSProperties;
}

export const defaultInventoryRowStyle: InventoryRowStyle = {
  InventoryRow: {
    margin: 'auto',
  },

  openContainerItemSlot: {
    border: `1px solid ${colors.inventoryContainerBackgroundColor}`,
  },

  row: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '5px',
    flexWrap: 'wrap',
  },
};

export interface ContainerInfo {
  // Containers can only go 1 container deep.
  itemIndex: number;
}

export interface InventoryRowProps {
  items: InventorySlotItemDef[];
  inventoryItems: InventoryItemFragment[];
  myTradeItems?: InventoryItemFragment[];
  onChangeInventoryItems: (inventoryItems: InventoryItemFragment[]) => void;
  onDropOnZone: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void;
  onMoveStack: (item: InventoryItemFragment, amount: number) => void;
  containerIdToDrawerInfo: ContainerIdToDrawerInfo;
  onContainerIdToDrawerInfoChange: (newObj: ContainerIdToDrawerInfo) => void;
  stackGroupIdToItemIDs: {[id: string]: string[]};
  onChangeStackGroupIdToItemIDs: (newObj: {[id: string]: string[]}) => void;
  syncWithServer: () => void;
  bodyWidth: number;
  myTradeState: SecureTradeState;

  styles?: Partial<InventoryRowStyle>;
  containerID?: string[];
  drawerID?: string;
  equippedItems?: EquippedItemFragment[];
  drawerMaxStats?: ql.schema.ContainerDefStat_Single;
  drawerCurrentStats?: DrawerCurrentStats;
  filtering?: boolean;
  onRightClickItem?: (item: InventoryItemFragment) => void;

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
    const ss = StyleSheet.create(defaultInventoryRowStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const { containersOpen } = this.state;
    return (
      <div className={css(ss.InventoryRow, custom.InventoryRow)}>
        <div className={css(ss.row, custom.row)}>
          {this.props.items.map((slotDef, index) => {
            const containerIsOpen = _.findIndex(containersOpen, _container => _container.itemIndex === index) !== -1;
            return (
              <InventorySlot
                key={index}
                item={slotDef}
                itemIndex={index}
                filtering={this.props.filtering}
                onToggleContainer={() => this.toggleContainer(index)}
                equippedItems={this.props.equippedItems}
                onDropOnZone={this.props.onDropOnZone}
                onMoveStack={this.props.onMoveStack}
                showGraySlots={this.props.showGraySlots}
                containerIsOpen={containerIsOpen}
                drawerMaxStats={this.props.drawerMaxStats}
                drawerCurrentStats={this.props.drawerCurrentStats}
                syncWithServer={this.props.syncWithServer}
                onRightClick={this.props.onRightClickItem}
              />
            );
          })}
        </div>
        {containersOpen.length > 0 ? [...containersOpen].reverse().map((container) => {
          const itemDef = this.props.items[container.itemIndex];
          // Is a crafting container
          if (itemDef && itemDef.slotType === SlotType.CraftingContainer) {
            return (
              <div key={container.itemIndex} className={css(ss.row, custom.row)}>
                <CraftingContainer
                  item={itemDef}
                  searchValue={''}
                  activeFilters={null}
                  slotsPerRow={this.props.items.length}
                  inventoryItems={this.props.inventoryItems}
                  onChangeInventoryItems={this.props.onChangeInventoryItems}
                  onDropOnZone={this.props.onDropOnZone}
                  containerIdToDrawerInfo={this.props.containerIdToDrawerInfo}
                  onChangeContainerIdToDrawerInfo={this.props.onContainerIdToDrawerInfoChange}
                  stackGroupIdToItemIDs={this.props.stackGroupIdToItemIDs}
                  onChangeStackGroupIdToItemIDs={this.props.onChangeStackGroupIdToItemIDs}
                  drawerCurrentStats={this.props.drawerCurrentStats}
                  drawerMaxStats={this.props.drawerMaxStats}
                  bodyWidth={this.props.bodyWidth}
                  containerID={this.props.containerID}
                  drawerID={this.props.drawerID}
                  onCloseClick={() => this.hideContainer(container.itemIndex)}
                  myTradeState={this.props.myTradeState}
                />
              </div>
            );
          }

          // Is an item container
          if (itemDef && itemDef.slotType === SlotType.Container) {
            return (
              <div key={container.itemIndex} className={css(ss.row, custom.row)}>
                <ItemContainer
                  item={itemDef}
                  searchValue={''}
                  activeFilters={null}
                  slotsPerRow={this.props.items.length}
                  onCloseClick={() => this.hideContainer(container.itemIndex)}
                  onDropOnZone={this.props.onDropOnZone}
                  inventoryItems={this.props.inventoryItems}
                  myTradeItems={this.props.myTradeItems}
                  onChangeInventoryItems={this.props.onChangeInventoryItems}
                  containerID={(this.props.containerID && [...this.props.containerID, itemDef.itemID]) || [itemDef.itemID]}
                  containerIdToDrawerInfo={this.props.containerIdToDrawerInfo}
                  onChangeContainerIdToDrawerInfo={this.props.onContainerIdToDrawerInfoChange}
                  stackGroupIdToItemIDs={this.props.stackGroupIdToItemIDs}
                  onChangeStackGroupIdToItemIDs={this.props.onChangeStackGroupIdToItemIDs}
                  syncWithServer={this.props.syncWithServer}
                  bodyWidth={this.props.bodyWidth}
                  myTradeState={this.props.myTradeState}
                />
              </div>
            );
          }
        }) : null}
      </div>
    );
  }

  public shouldComponentUpdate(nextProps: InventoryRowProps, nextState: InventoryRowState) {
    return !_.isEqual(this.props.items, nextProps.items) ||
      !_.isEqual(this.props.inventoryItems, nextProps.inventoryItems) ||
      !_.isEqual(this.props.equippedItems, nextProps.equippedItems) ||
      !_.isEqual(this.props.myTradeItems, nextProps.myTradeItems) ||
      !_.isEqual(this.props.myTradeState, nextProps.myTradeState) ||
      !_.isEqual(this.state.containersOpen, nextState.containersOpen) ||
      !_.isEqual(this.props.drawerCurrentStats, nextProps.drawerCurrentStats) ||
      !_.isEqual(this.props.drawerMaxStats, nextProps.drawerMaxStats) ||
      !_.isEqual(this.props.containerIdToDrawerInfo, nextProps.containerIdToDrawerInfo) ||
      this.props.bodyWidth !== nextProps.bodyWidth ||
      this.props.filtering !== nextProps.filtering;
  }

  public componentWillReceiveProps(nextProps: InventoryRowProps) {
    // If item is moved away and container is open, then close the container.
    if (!_.isEqual(nextProps.items, this.props.items)) {
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
