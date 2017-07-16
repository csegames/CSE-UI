/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-27 10:19:44
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-18 11:10:13
 */
import * as React from 'react';
import * as _ from 'lodash';

import  { graphql } from 'react-apollo';
import { slotDimensions } from './InventorySlot';
import { ListenerInfo, events } from 'camelot-unchained';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

import * as base from './InventoryBase';
import InventoryFooter from './InventoryFooter';
import { InventorySlotItemDef } from './InventorySlot';
import eventNames, { UpdateInventoryItemsOnEquipCallback } from '../../../lib/eventNames';
import queries from '../../../../../gqlDocuments';
import { calcRowAndSlots, getDimensionsOfElement } from '../../../lib/utils';

export interface InventoryBodyStyles extends StyleDeclaration {
  inventoryBody: React.CSSProperties;
  inventoryBodyInnerContainer: React.CSSProperties;
  inventoryContent: React.CSSProperties;
}

export const defaultInventoryBodyStyles: InventoryBodyStyles = {
  inventoryBody: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },

  inventoryBodyInnerContainer: {
    flex: '1 1 auto',
    background: 'url(images/inventorybg.png)',
    position: 'relative',
    overflow: 'auto',
    '::-webkit-scrollbar': {
      width: '15px',
    },
  },
  
  inventoryContent: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    background: 'url(images/inventorybg.png)',
    alignItems: 'center',
  },
};

export interface InventoryBodyProps extends base.InventoryBaseProps {
  styles?: Partial<InventoryBodyStyles>;
}

export interface InventoryBodyState extends base.InventoryBaseState {
}

class InventoryBody extends React.Component<InventoryBodyProps, InventoryBodyState> {
  // private fetchInterval: any;
  // private visible: boolean;
  private navEventHandler: ListenerInfo;
  private updateInventoryItemsHandler: ListenerInfo;
  private bodyRef: HTMLDivElement;
  private heightOfBody: number;

  private static minSlots = 200;

  // a counter that is incremented each time a new
  // stack group id is generated that is used in
  // generateing the stack group id

  constructor(props: InventoryBodyProps) {
    super(props);
    this.state = {
      ...base.defaultInventoryBaseState(), 
    };
  }
  public render() {
    const ss = StyleSheet.create(defaultInventoryBodyStyles);
    const custom = StyleSheet.create(this.props.styles || {});

    const { rows, rowData } = base.createRowElements(this.state, this.props.data.myInventory);
    const buttonDisabled = base.allInventoryFooterButtonsDisabled(this.props);
    const removeAndPruneDisabled = buttonDisabled || (base.allInventoryFooterButtonsDisabled(this.props) ||
      base.inventoryFooterRemoveAndPruneButtonDisabled(rowData, this.heightOfBody));

    return (
      <div className={css(ss.inventoryBody, custom.inventoryBody)}>
        <div ref={(r) => this.bodyRef = r}
            className={css(ss.inventoryBodyInnerContainer, custom.inventoryBodyInnerContainer)}>
          <div className={css(ss.inventoryContent, custom.inventoryContent)}>
            {rows}
          </div>
        </div>
        <InventoryFooter
          onAddRowClick={this.addRowOfSlots}
          onRemoveRowClick={() => this.removeRowOfSlots(rowData)}
          onPruneRowsClick={() => this.pruneRowsOfSlots(rowData)}
          addRowButtonDisabled={buttonDisabled}
          removeRowButtonDisabled={removeAndPruneDisabled}
          pruneRowsButtonDisabled={removeAndPruneDisabled}
          currency={this.props.data.myInventory ? this.props.data.myInventory.currency : 0}
          itemCount={this.props.data.myInventory ? this.props.data.myInventory.itemCount : 0}
          totalMass={this.props.data.myInventory ? this.props.data.myInventory.totalMass : 0}
        />
      </div>
    );
  }

  public componentDidMount() {
    this.initializeInventory();
    this.navEventHandler = events.on('hudnav--navigate', this.refetchInventoryData);
    this.updateInventoryItemsHandler = events.on(eventNames.updateInventoryItems, this.onUpdateInventoryOnEquip);
    window.addEventListener('resize', this.initializeInventory);
  }

  public componentWillReceiveProps(nextProps: InventoryBodyProps) {
    const onMyInventoryChange = !_.isEqual(nextProps.data.myInventory, this.props.data.myInventory);
    const onSearchValueChange = nextProps.searchValue !== this.props.searchValue;
    const onActiveFiltersChange = !_.isEqual(nextProps.activeFilters, this.props.activeFilters);

    if (onMyInventoryChange || onSearchValueChange || onActiveFiltersChange) {
      this.initializeInventory();
    }
  }

  public componentWillUnmount() {
    events.off(this.navEventHandler);
    events.off(this.updateInventoryItemsHandler);
    window.removeEventListener('resize', this.initializeInventory);
  }

  private refetchInventoryData = (name: string) => {
    if (name === 'inventory' || name === 'equippedgear' || name === 'character') {
      this.props.data.refetch();
      // if (this.visible) {
      //   this.visible = false;
      //   clearInterval(this.fetchInterval);
      // } else {
      //   this.visible = true;
      //   this.fetchInterval = setInterval(() => this.props.data.refetch(), 5000);
      // }
    }
  }

  // set up rows from scratch / works as a re-initialize as well
  private initializeInventory = () => {
    this.setState(this.internalInit);
  }

  // should not be called outside of initializeInventory
  private internalInit = (state: InventoryBodyState, props: InventoryBodyProps) => {
    if (!this.bodyRef) return;
    this.heightOfBody = getDimensionsOfElement(this.bodyRef).height;
    const rowsAndSlots = calcRowAndSlots(this.bodyRef, slotDimensions, 
      Math.max(InventoryBody.minSlots, props.data.myInventory ? props.data.myInventory.itemCount : InventoryBody.minSlots));
    return base.distributeItems(rowsAndSlots, props.data ? props.data.myInventory : {items:[]}, state, props);
  }

  private addRowOfSlots = () => {
    this.setState(base.addRowOfSlots);
  }

  private removeRowOfSlots = (rowData: InventorySlotItemDef[][]) => {
    this.setState((state, props) => base.removeRowOfSlots(state, rowData, this.heightOfBody));
  }

  private pruneRowsOfSlots = (rowData: InventorySlotItemDef[][]) => {
    this.setState((state, props) => base.pruneRowsOfSlots(state, rowData, this.heightOfBody));
  }

  private onUpdateInventoryOnEquip = (payload: UpdateInventoryItemsOnEquipCallback) => {
    this.setState((state, props) => base.onUpdateInventoryItemsHandler(state, payload));
  }
}

const InventoryBodyWithQL = graphql(queries.InventoryBase as any)(InventoryBody);

export default InventoryBodyWithQL;
