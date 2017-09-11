/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-27 10:19:44
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-14 15:41:49
 */

import * as React from 'react';
import * as _ from 'lodash';

import { StyleDeclaration, StyleSheet, css } from 'aphrodite';
import { events, client } from 'camelot-unchained';
import { withGraphQL } from 'camelot-unchained/lib/graphql/react';

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

export interface InventoryBodyProps extends base.InventoryBaseWithQLProps {
  styles?: Partial<InventoryBodyStyles>;
  visibleComponent: string;
}

export interface InventoryBodyState extends base.InventoryBaseState {
}

class InventoryBody extends React.Component<InventoryBodyProps, InventoryBodyState> {
  private isFetching: boolean = false; // This is used when refetching for data onInventoryAdded and onInventoryRemoved.
  private updateInventoryItemsHandler: EventListener;
  private dropItemHandler: EventListener;
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

    if (!this.props.graphql.loading) {
      const { rows, rowData } = base.createRowElements(this.state, this.props.graphql.data.myInventory);
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
            currency={this.props.graphql.data.myInventory.currency}
            itemCount={this.props.graphql.data.myInventory.itemCount}
            totalMass={this.props.graphql.data.myInventory.totalMass}
          />
        </div>
      );
    }
    return null;
  }

  public componentDidMount() {
    this.initializeInventory();
    this.updateInventoryItemsHandler = events.on(eventNames.updateInventoryItems, this.onUpdateInventoryOnEquip);
    this.dropItemHandler = events.on(eventNames.onDropItem, payload => base.dropItemRequest(payload.inventoryItem));
    window.addEventListener('resize', this.initializeInventory);
    client.SubscribeInventory(true);
    client.OnInventoryAdded((item) => {
      if (this.props.visibleComponent === '' && !this.isFetching) {
        this.isFetching = true;
        setTimeout(() => {
          this.props.graphql.refetch();
          this.isFetching = false
        }, 2000);
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

  public componentWillUpdate(nextProps: InventoryBodyProps, nextState: InventoryBodyState) {
    const thisInventory = this.props.graphql.data && this.props.graphql.data.myInventory;
    const nextInventory = nextProps.graphql.data && nextProps.graphql.data.myInventory;

    const graphqlDataChange = !_.isEqual(nextInventory, thisInventory);
    const onInventoryItemsChange = !_.isEqual(nextProps.inventoryItems, this.props.inventoryItems);
    const onSearchValueChange = nextProps.searchValue !== this.props.searchValue;
    const onActiveFiltersChange = !_.isEqual(nextProps.activeFilters, this.props.activeFilters);
    
    if (graphqlDataChange || onInventoryItemsChange || onActiveFiltersChange || onSearchValueChange) {
      this.setState(() => this.internalInit(nextState, nextProps));
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
    this.props.onChangeInventoryItems(props.graphql.data.myInventory.items);
    this.heightOfBody = getDimensionsOfElement(this.bodyRef).height;
    const rowsAndSlots = calcRowAndSlots(this.bodyRef, slotDimensions, 
      Math.max(InventoryBody.minSlots, props.graphql.data.myInventory.itemCount));
    return base.distributeItems(rowsAndSlots, props.graphql.data.myInventory, state, props);
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

const InventoryBodyWithQL = withGraphQL<InventoryBodyProps>({ query: queries.InventoryBase })(InventoryBody);

export default InventoryBodyWithQL;
