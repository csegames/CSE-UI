/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-27 10:19:44
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2017-09-25 17:29:47
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
  refreshContainer: React.CSSProperties;
  refreshTitle: React.CSSProperties;
  refreshButton: React.CSSProperties;
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

  refreshContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    pointerEvents: 'all',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },

  refreshTitle: {
    fontSize: '35px',
  },

  refreshButton: {
    width: '50px',
    height: '50px',
    fontSize: '35px',
    color: 'white',
    cursor: 'pointer',
    ':hover': {
      color: 'rgba(255,255,255,0.7)',
    },
  },
};

export interface InventoryBodyProps extends base.InventoryBaseWithQLProps {
  styles?: Partial<InventoryBodyStyles>;
  visibleComponent: string;
}

export interface InventoryBodyState extends base.InventoryBaseState {
}

class InventoryBody extends React.Component<InventoryBodyProps, InventoryBodyState> {
  private static minSlots = 200;

  private timePrevItemAdded: number;
  private initial: boolean = true;
  private isFetching: boolean = false; // This is used when refetching for data onInventoryAdded and onInventoryRemoved.
  private updateInventoryItemsHandler: EventListener;
  private dropItemHandler: EventListener;
  private bodyRef: HTMLDivElement;
  private heightOfBody: number;

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
    const { rows, rowData } = base.createRowElements(this.state, { items: this.props.inventoryItems });
    const buttonDisabled = base.allInventoryFooterButtonsDisabled(this.props);
    const removeAndPruneDisabled = buttonDisabled || (base.allInventoryFooterButtonsDisabled(this.props) ||
      base.inventoryFooterRemoveAndPruneButtonDisabled(rowData, this.heightOfBody));
    return (
      <div className={css(ss.inventoryBody, custom.inventoryBody)}>
        {!this.props.graphql.data &&
          <div className={css(ss.refreshContainer, custom.refreshContainer)}>
            {!this.props.graphql.loading && <div className={css(ss.refreshTitle, custom.refreshTitle)}>
              Could not retrieve items. Click to try again.
            </div>}
            <div
              className={css(ss.refreshButton, custom.refreshButton)}
              onClick={this.refetch}>
                {this.props.graphql.loading ?
                  <i className='fa fa-circle-o-notch loading-spin' /> : <i className='fa fa-refresh' />}
            </div>
          </div>
        }
        <div ref={r => this.bodyRef = r}
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
          currency={this.props.graphql.data ? this.props.graphql.data.myInventory.currency : 0}
          itemCount={this.props.graphql.data ? this.props.graphql.data.myInventory.itemCount : 0}
          totalMass={this.props.graphql.data ? this.props.graphql.data.myInventory.totalMass : 0}
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
      const timeNextItemAdded = new Date().getTime();
      if (this.props.visibleComponent === '' &&
          !this.isFetching &&
          this.timePrevItemAdded &&
          timeNextItemAdded - this.timePrevItemAdded > 100
        ) {
        this.isFetching = true;
        setTimeout(() => this.refetch(), 200);
      }
      this.timePrevItemAdded = new Date().getTime();
    });
    client.OnInventoryRemoved((item) => {
      if (!this.isFetching && this.props.visibleComponent === '') {
        this.isFetching = true;
        setTimeout(() => this.refetch(), 200);
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

    if (!this.props.graphql.data && nextProps.graphql.data) {
      this.initial = false;
      this.timePrevItemAdded = new Date().getTime();
    }

    if (graphqlDataChange || onInventoryItemsChange || onActiveFiltersChange || onSearchValueChange) {
      this.setState(() => this.internalInit(nextState, nextProps));
    }

    if (this.props.visibleComponent !== '' && nextProps.visibleComponent === '') {
      this.refetch();
    }
  }

  public componentWillUnmount() {
    events.off(this.updateInventoryItemsHandler);
    events.off(this.dropItemHandler);
    window.removeEventListener('resize', this.initializeInventory);
  }

  private refetch = async () => {
    await this.props.graphql.refetch();
    const res: any = await this.props.graphql.client.query({
      operationName: 'InventoryBase',
      namedQuery: 'myInventory',
      query: queries.InventoryBase,
      variables: null,
    });
    this.props.onChangeInventoryItems(res.data.myInventory.items);
    this.isFetching = false;
  }

  // set up rows from scratch / works as a re-initialize as well
  private initializeInventory = () => {
    this.setState(this.internalInit);
  }

  // should not be called outside of initializeInventory
  private internalInit = (state: InventoryBodyState, props: InventoryBodyProps) => {
    if (!this.bodyRef) return;
    const itemCount =
      (props.graphql.data && props.graphql.data.myInventory && props.graphql.data.myInventory.itemCount) || 0;
    this.heightOfBody = getDimensionsOfElement(this.bodyRef).height;
    const rowsAndSlots = calcRowAndSlots(this.bodyRef, slotDimensions,
      Math.max(InventoryBody.minSlots, itemCount));
    return base.distributeItems(
      rowsAndSlots,
      (props.graphql.data && props.graphql.data.myInventory) || { items: [] },
      state,
      props,
    );
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
