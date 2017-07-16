/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-07-11 12:12:31
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-14 14:57:26
 */

import * as React from 'react';
import { utils, events } from 'camelot-unchained';

import { InventorySlotItemDef, slotDimensions, SlotType } from './InventorySlot';
import InventoryRowActionButton from './InventoryRowActionButton';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

import { 
  calcRows,
  getItemDefinitionName,
} from '../../../lib/utils';
import {
  colors,
  rowActionIcons,
} from '../../../lib/constants';
import * as base from './InventoryBase';

export interface InventoryContainerStyle extends StyleDeclaration {
  InventoryContainer: React.CSSProperties;
  title: React.CSSProperties;
  content: React.CSSProperties;
  closeButton: React.CSSProperties;
}

export const defaultInventoryContainerStyle: InventoryContainerStyle = {
  InventoryContainer: {
    width: '100%',
  },
  
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '2px 5px',
    color: utils.lightenColor(colors.filterBackgroundColor, 150),
    backgroundColor: utils.lightenColor(colors.filterBackgroundColor, 5),
  },

  content: {
    width: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '5px 0px',
    boxShadow: 'inset 0 1px 3px 0 rgba(0, 0, 0, 0.7)',
    backgroundColor: utils.darkenColor(colors.filterBackgroundColor, 5),
    '::-webkit-scrollbar': {
      width: '15px',
    },
  },

  closeButton: {
    cursor: 'pointer',
    fontSize: '20px',
    color: utils.lightenColor(colors.filterBackgroundColor, 100),
    textShadow: '1px 1px rgba(0, 0, 0, 0.7)',
    marginLeft: '15px',
  },
};

export interface InventoryContainerProps extends base.InventoryBaseProps {
  styles?: Partial<InventoryContainerStyle>;
  item: InventorySlotItemDef;
  slotsPerRow: number;
  onCloseClick: () => void;
}

export interface InventoryContainerState extends base.InventoryBaseState {
}

export class InventoryContainer extends React.Component<InventoryContainerProps, InventoryContainerState> {

  private static minSlots = 20;
  private contentRef: HTMLElement = null;

  constructor(props: InventoryContainerProps) {
    super(props);
    this.state = {
     ...base.defaultInventoryBaseState(),
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultInventoryContainerStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    let header = '';
    let rows = null;
    let rowData: InventorySlotItemDef[][] = [];
    switch (this.props.item.slotType) {
      case SlotType.CraftingContainer:
        const firstItem = this.props.item.stackedItems[0];
        const { totalUnitCount, weight, averageQuality } = base.getContainerHeaderInfo(this.props.item.stackedItems);
        header =
          `${getItemDefinitionName(firstItem)} | ${totalUnitCount} units | ${weight}kg | average quality ${averageQuality}%`;
        rows = base.createRowElementsForCraftingItems(this.state, {items: this.props.item.stackedItems}).rows;
        rowData = base.createRowElementsForCraftingItems(this.state, {items: this.props.item.stackedItems}).rowData;
        break;
      default:
        header = `${getItemDefinitionName(firstItem)} | ${this.props.item.stackedItems.length}`;
        rows = base.createRowElements(this.state, {items: this.props.item.stackedItems}).rows;
        rowData = base.createRowElements(this.state, {items: this.props.item.stackedItems}).rowData;
    }

    return (
      <section className={css(ss.InventoryContainer, custom.InventoryContainer)}>
        <header className={css(ss.title, custom.title)}>
          <span>{header}</span>
          <div className={css(ss.addRemoveRowButtonContainer, custom.addRemoveRowButtonContainer)}>
            <InventoryRowActionButton
              tooltipContent={'Add Empty Row'}
              iconClass={rowActionIcons.addRow}
              onClick={this.addRowOfSlots}
            />
            <InventoryRowActionButton
              tooltipContent={'Remove Empty Row'}
              iconClass={rowActionIcons.removeRow}
              onClick={() => this.removeRowOfSlots(rowData)}
              disabled={base.inventoryContainerRemoveButtonDisabled(rowData)}
            />
            <InventoryRowActionButton
              tooltipContent={'Prune Empty Rows'}
              iconClass={rowActionIcons.pruneRows}
              onClick={() => this.pruneRowsOfSlots(rowData)}              
              disabled={base.inventoryContainerRemoveButtonDisabled(rowData)}
            />
            <span
              className={`fa fa-times click-effect ${css(ss.closeButton, custom.closeButton)}`}
              onClick={this.props.onCloseClick}
            />
          </div>
        </header>
        <main className={css(ss.content, custom.content)}
              ref={r => this.contentRef = r}>
          {rows}
        </main>
      </section>
    );
  }

  public componentDidMount() {
    this.initialize();
    events.on('cse-inventory--filter-enable', () => {});
  }

  // set up rows from scratch / works as a re-initialize as well
  private initialize = () => {
    this.setState(this.internalInit);
  }

  // should not be called outside of initializeInventory
  private internalInit = (state: InventoryContainerState, props: InventoryContainerProps) => {
    if (!this.contentRef) return;
    const rowsAndSlots = calcRows(this.contentRef, slotDimensions,
      Math.max(InventoryContainer.minSlots, props.item.stackedItems.length), props.slotsPerRow);
    const rowData = {
      slotsPerRow: props.slotsPerRow,
      ...rowsAndSlots,
    };
    return base.distributeItems(rowData, {items: []},  state, props);
  }

  private addRowOfSlots = () => {
    this.setState(base.addRowOfSlots);
  }

  private removeRowOfSlots = (rowData: InventorySlotItemDef[][]) => {
    const heightOfBody = this.contentRef.getBoundingClientRect().height;
    this.setState((state, props) => base.removeRowOfSlots(state, rowData, heightOfBody, true));
  }

  private pruneRowsOfSlots = (rowData: InventorySlotItemDef[][]) => {
    const heightOfBody = this.contentRef.getBoundingClientRect().height;
    this.setState((state, props) => base.pruneRowsOfSlots(state, rowData, heightOfBody, true));
  }
}

export default InventoryContainer;
