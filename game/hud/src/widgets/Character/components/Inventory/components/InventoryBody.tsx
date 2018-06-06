/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import { StyleDeclaration, StyleSheet, css } from 'aphrodite';
import { client, webAPI, Vec3F, Euler3f } from '@csegames/camelot-unchained';
import { withGraphQL } from '@csegames/camelot-unchained/lib/graphql/react';
import * as events from '@csegames/camelot-unchained/lib/events';

import * as base from './InventoryBase';
import InventoryFooter from './InventoryFooter';
import { InventorySlotItemDef, slotDimensions } from './InventorySlot';
import eventNames, { UpdateInventoryItemsPayload, InventoryDataTransfer } from '../../../lib/eventNames';
import { calcRowAndSlots, getDimensionsOfElement } from '../../../lib/utils';
import queries from '../../../../../gqlDocuments';
import { InventoryItemFragment } from '../../../../../gqlInterfaces';

declare const toastr: any;

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
  private isFetching: boolean = false; // This is used when refetching for data onInventoryAdded and onInventoryRemoved.
  private updateInventoryItemsHandler: number;
  private dropItemHandler: number;
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
    const { rows, rowData } = base.createRowElements({
      state: this.state,
      props: this.props,
      itemData: { items: this.props.inventoryItems },
      onDropOnZone: this.onDropOnZone,
      onMoveStack: this.onMoveStack,
      syncWithServer: this.refetch,
      bodyWidth: this.bodyRef && getDimensionsOfElement(this.bodyRef).width,
    });
    const buttonDisabled = base.allInventoryFooterButtonsDisabled(this.props);
    const removeAndPruneDisabled = buttonDisabled || (base.allInventoryFooterButtonsDisabled(this.props) ||
      base.inventoryFooterRemoveAndPruneButtonDisabled(rowData, this.heightOfBody));
    const { graphql } = this.props;
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
        <div ref={r => this.bodyRef = r} id='inventory-scroll-container'
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
          itemCount={graphql.data && graphql.data.myInventory ? graphql.data.myInventory.itemCount : 0}
          totalMass={graphql.data && graphql.data.myInventory ? graphql.data.myInventory.totalMass : 0}
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
          (!this.timePrevItemAdded ||
          timeNextItemAdded - this.timePrevItemAdded > 100)
        ) {
        // When inventory is closed and item is added to inventory, resync inventory with server
        this.isFetching = true;
        setTimeout(() => this.refetch(), 200);
      }
      this.timePrevItemAdded = new Date().getTime();
    });
    client.OnInventoryRemoved((item) => {
      if (!this.isFetching && this.props.visibleComponent === '') {
        // When inventory is closed and item is removed from inventory, resync inventory with server
        this.isFetching = true;
        setTimeout(() => this.refetch(), 200);
      }
    });
    client.SendCommitItemRequest(this.handleCommitItemRequest);
  }

  public componentWillUpdate(nextProps: InventoryBodyProps, nextState: InventoryBodyState) {
    const thisInventory = this.props.graphql.data && this.props.graphql.data.myInventory;
    const nextInventory = nextProps.graphql.data && nextProps.graphql.data.myInventory;

    const graphqlDataChange = !_.isEqual(nextInventory, thisInventory);
    const onInventoryItemsChange = !_.isEqual(nextProps.inventoryItems, this.props.inventoryItems);
    const onSearchValueChange = nextProps.searchValue !== this.props.searchValue;
    const onActiveFiltersChange = !_.isEqual(nextProps.activeFilters, this.props.activeFilters);
    if (!this.props.graphql.data && nextProps.graphql.data) {
      // this.timePrevItemAdded = new Date().getTime();
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
    events.fire('refetch-character-info');
    const res: any = await this.props.graphql.client.query({
      operationName: 'InventoryBase',
      namedQuery: '',
      query: queries.InventoryBase,
      variables: null,
    });
    this.props.onChangeInventoryItems(res.data.myInventory.items);
    this.isFetching = false;
  }

  private handleCommitItemRequest = (itemId: string, position: Vec3F, rotation: Euler3f, actionId?: string) => {
    // Calls a moveItem request to a world position.
    // This then will call client.OnInventoryRemoved which will then sync the inventory with the server.
    if (actionId) {
      // Handle as an item action
      this.makeItemActionRequest(itemId, actionId, position, rotation);
    } else {
      const item = _.find(this.props.inventoryItems, _item => _item.id === itemId);
      base.onCommitPlacedItem(item, position, rotation);
    }
  }

  private makeItemActionRequest = async (itemId: string, actionId: string, position: Vec3F, rotation: Euler3f) => {
    try {
      const res = await webAPI.ItemAPI.PerformItemAction(
        webAPI.defaultConfig,
        client.loginToken,
        client.shardID,
        client.characterID,
        itemId,
        client.playerState.id,
        actionId,
        { WorldPosition: position, Rotation: rotation },
      );
      if (!res.ok) {
        const data = JSON.parse(res.data);
        if (data.FieldCodes && data.FieldCodes.length > 0) {
          toastr.error(data.FieldCodes[0].Message, 'Oh No!', { timeout: 3000 });
        } else {
          // This means api server failed perform item action request but did not provide a message about what happened
          toastr.error('An error occured', 'Oh No!', { timeout: 3000 });
        }
      }
    } catch (e) {
      toastr.error('There was an unhandled error!', 'Oh No!!', { timeout: 5000 });
    }
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
    const rowsAndSlots = calcRowAndSlots(
      this.bodyRef.getBoundingClientRect(),
      slotDimensions,
      Math.max(InventoryBody.minSlots, itemCount),
    );
    const inventory = props.graphql.data && {
      ...props.graphql.data.myInventory,
      items: props.graphql.data.myInventory.items,
    };
    return base.distributeItems(
      rowsAndSlots,
      inventory,
      state,
      props,
    );
  }

  private onDropOnZone = (dragItemData: InventoryDataTransfer,
                          dropZoneData: InventoryDataTransfer) => {
    // this function only gets called for inventory items, containers take care of their own state.
    this.setState((state, props) => {
      return base.onMoveInventoryItem(dragItemData, dropZoneData, state, props);
    });
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

  private onUpdateInventoryOnEquip = (payload: UpdateInventoryItemsPayload) => {
    this.setState((state, props) => base.onUpdateInventoryItemsHandler(state, props, payload));
  }

  private onMoveStack = (item: InventoryItemFragment, amount: number) => {
    this.setState((state, props) => base.onMoveStack(state, props, item, amount));
  }
}

const InventoryBodyWithQL = withGraphQL<InventoryBodyProps>(
  { query: queries.InventoryBase },
)(InventoryBody);

export default InventoryBodyWithQL;
