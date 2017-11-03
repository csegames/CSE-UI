/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import { StyleDeclaration, StyleSheet, css } from 'aphrodite';
import { ql } from 'camelot-unchained';

import { InventorySlot, InventorySlotItemDef } from './InventorySlot';
import { InventoryContainer } from './InventoryContainer';
import { colors } from '../../../lib/constants';

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
    position: 'relative',
    top: '3px',
    boxShadow: `0px 0px 3px 2px ${colors.inventoryContainerBackgroundColor}`,
    border: `1px solid ${colors.inventoryContainerBackgroundColor}`,
  },

  row: {

  },
};

export interface InventoryRowProps {
  styles?: Partial<InventoryRowStyle>;
  items: InventorySlotItemDef[];
  equippedItems?: ql.schema.EquippedItem[];
  onDropOnZone: (dragItemData: ql.schema.Item, dropZoneData: ql.schema.Item | number) => void;
}

export interface InventoryRowState {
  // if true show the inventory container (default false)
  showContainer: boolean;
  // the index into the props items array of which item the container
  // is open for
  containerItemIndex: number;
}

export class InventoryRow extends React.Component<InventoryRowProps, InventoryRowState> {
  constructor(props: InventoryRowProps) {
    super(props);
    this.state = {
      showContainer: false,
      containerItemIndex: -1,
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultInventoryRowStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(ss.InventoryRow, custom.InventoryRow)}>
        <div className={css(ss.row, custom.row)}>
          {this.props.items.map((slotDef, index) => (
            <InventorySlot
              key={index}
              styles={{
                InventorySlot: index === this.state.containerItemIndex ?
                  defaultInventoryRowStyle.openContainerItemSlot : {},
              }}
              item={slotDef}
              itemIndex={index}
              onToggleContainer={this.toggleContainer}
              equippedItems={this.props.equippedItems}
              onDropOnZone={this.props.onDropOnZone}
            />
          ))}
        </div>
        {this.state.showContainer ? (
          <div className={css(ss.row, custom.row)}>
            <InventoryContainer
              item={this.props.items[this.state.containerItemIndex]}
              searchValue={''}
              activeFilters={null}
              slotsPerRow={this.props.items.length}
              onCloseClick={this.hideContainer}
              onDropOnZone={this.props.onDropOnZone}
            />
          </div>
        ) : null}
      </div>
    );
  }

  public shouldComponentUpdate(nextProps: InventoryRowProps, nextState: InventoryRowState) {
    return !_.isEqual(nextProps.items, this.props.items) ||
      !_.isEqual(nextProps.equippedItems, this.props.equippedItems) ||
      !_.isEqual(nextState, this.state);
  }

  public componentWillReceiveProps(nextProps: InventoryRowProps, nextState: InventoryRowState) {
    if (this.state.showContainer && nextProps.items[this.state.containerItemIndex]
      && nextProps.items[this.state.containerItemIndex].stackedItems) return;

    if (this.state.showContainer) this.toggleContainer(this.state.containerItemIndex);
  }

  private toggleContainer = (index: number) => {
    // Hide
    if (this.state.showContainer && this.state.containerItemIndex === index) {
      this.hideContainer();
      return;
    }

    // Show
    this.showContainer(index);
  }

  private hideContainer = () => {
    this.setState({
      showContainer: false,
      containerItemIndex: -1,
    });
  }

  private showContainer = (index: number) => {
    this.setState({
      showContainer: true,
      containerItemIndex: index,
    });
  }
}

export default InventoryRow;
