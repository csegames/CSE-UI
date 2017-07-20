/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-27 10:19:44
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-09 14:42:22
 */

import * as React from 'react';
import * as _ from 'lodash';

import { ApolloClient } from 'apollo-client';
import  { graphql, withApollo } from 'react-apollo';
import { ListenerInfo, events, client } from 'camelot-unchained';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

import * as base from './InventoryBase';
import InventoryFooter from './InventoryFooter';
import { InventorySlotItemDef, slotDimensions } from './InventorySlot';
import eventNames, { UpdateInventoryItems } from '../../../lib/eventNames';
import queries from '../../../../../gqlDocuments';
import { calcRowAndSlots, getDimensionsOfElement } from '../../../lib/utils';

export interface InventoryBodyStyles extends StyleDeclaration {
  inventoryBody: React.CSSProperties;
  inventoryBodyInnerContainer: React.CSSProperties;
  inventoryContent: React.CSSProperties;
  backgroundImg: React.CSSProperties;
}

export const defaultInventoryBodyStyles: InventoryBodyStyles = {
  inventoryBody: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },

  inventoryBodyInnerContainer: {
    flex: '1 1 auto',
    webkitBackfaceVisibility: 'hidden',
    overflow: 'auto',
    '::-webkit-scrollbar': {
      width: '15px',
    },
    position: 'relative',
  },
  
  inventoryContent: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    webkitBackfaceVisibility: 'hidden',
    alignItems: 'center',
    position: 'relative',
  },

  backgroundImg: {
    position: 'absolute',
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
};

export interface InventoryBodyProps extends base.InventoryBaseProps {
  styles?: Partial<InventoryBodyStyles>;
  visibleComponent: string;
  client?: ApolloClient;
}

export interface InventoryBodyState extends base.InventoryBaseState {
}

@withApollo
class InventoryBody extends React.Component<InventoryBodyProps, InventoryBodyState> {
  private isFetching: boolean = false; // This is used when refetching for data onInventoryAdded and onInventoryRemoved.
  private inventoryItemsAdded: any[] = [];
  private updateInventoryItemsHandler: ListenerInfo;
  private dropItemHandler: ListenerInfo;
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
        <img src={'images/inventorybg.png'} className={css(ss.backgroundImg, custom.backgroundImg)} />
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
    this.updateInventoryItemsHandler = events.on(eventNames.updateInventoryItems, this.onUpdateInventoryOnEquip);
    this.dropItemHandler = events.on(eventNames.onDropItem, payload => base.dropItemRequest(payload.inventoryItem));
    window.addEventListener('resize', this.initializeInventory);
    client.SubscribeInventory(true);
    client.OnInventoryAdded((item) => {
      if (this.props.visibleComponent === '' && !this.isFetching) {
        this.inventoryItemsAdded.push(item);
        if (this.inventoryItemsAdded.length > 2) {
          this.props.data.refetch().then((res) => {
            this.props.onChangeInventoryItems(res.data.myInventory.items);
            this.inventoryItemsAdded = [];
          });
        } else {
          this.props.client.query({
            query: queries.ItemAdded as any,
            variables: {
              id: item.id,
              shard: client.shardID,
            },
          }).then((res: any) => {
            this.props.onChangeInventoryItems([...this.props.inventoryItems, res.data.item]);
            this.inventoryItemsAdded = [];
          });
        }
      }
    });
    client.OnInventoryRemoved((item) => {
      if (this.props.visibleComponent === '' && !this.isFetching) {
        this.props.onChangeInventoryItems(_.filter(
          this.props.inventoryItems, inventoryItem => inventoryItem.id !== item,
        ));
      }
    });
  }

  public componentWillReceiveProps(nextProps: InventoryBodyProps) {
    const graphqlDataChange = !_.isEqual(nextProps.data.myInventory, this.props.data.myInventory);
    const onInventoryItemsChange = !_.isEqual(nextProps.inventoryItems, this.props.inventoryItems);
    const onSearchValueChange = nextProps.searchValue !== this.props.searchValue;
    const onActiveFiltersChange = !_.isEqual(nextProps.activeFilters, this.props.activeFilters);
    
    if (graphqlDataChange || onInventoryItemsChange || onActiveFiltersChange || onSearchValueChange) {
      this.initializeInventory();
    }
  }

  public componentWillUnmount() {
    events.off(this.updateInventoryItemsHandler);
    events.off(this.dropItemHandler);
    window.removeEventListener('resize', this.initializeInventory);
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

  private onUpdateInventoryOnEquip = (payload: UpdateInventoryItems) => {
    this.setState((state, props) => base.onUpdateInventoryItemsHandler(state, props, payload));
  }
}

const InventoryBodyWithQL = graphql(queries.InventoryBase as any)(InventoryBody);

export default InventoryBodyWithQL;
