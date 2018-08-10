/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

import { client, webAPI, Vec3F, Euler3f } from '@csegames/camelot-unchained';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import * as events from '@csegames/camelot-unchained/lib/events';

import * as base from '../../ItemShared/InventoryBase';
import InventoryFooter from './InventoryFooter';
import { slotDimensions } from './InventorySlot';
import { InventorySlotItemDef } from '../../../lib/itemInterfaces';
import eventNames, { UpdateInventoryItemsPayload, InventoryDataTransfer, DropItemPayload } from '../../../lib/eventNames';
import { calcRowAndSlots, FullScreenContext } from '../../../lib/utils';
import queries from '../../../../../gqlDocuments';
import { InventoryItemFragment, SecureTradeState } from '../../../../../gqlInterfaces';
import { CUQuery } from '@csegames/camelot-unchained/lib/graphql';

declare const toastr: any;

export interface InventoryBodyStyles {
  inventoryBody: React.CSSProperties;
  inventoryBodyInnerContainer: React.CSSProperties;
  inventoryContent: React.CSSProperties;
  backgroundImg: React.CSSProperties;
  refreshContainer: React.CSSProperties;
  refreshTitle: React.CSSProperties;
  refreshButton: React.CSSProperties;
}

const Container = styled('div')`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding-top: 15px;
`;

const InnerContainer = styled('div')`
  flex: 1;
  overflow: auto;
  position: relative;
  -webkit-backface-visibility: hidden;
  &::-webkit-scrollbar {
    width: 15px;
  }
`;

const Content = styled('div')`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  -webkit-backface-visibility: hidden;
  align-items: center;
  position: relative;
`;

const RefreshContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  pointer-events: all;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const RefreshTitle = styled('div')`
  font-size: 35px;
  color: white;
`;

const RefreshButton = styled('div')`
  width: 50px;
  height: 50px;
  font-size: 35px;
  color: white;
  cursor: pointer;
  &:hover {
    color: rgba(255, 255, 255, 0.7);
  }
`;

export interface InjectedInventoryBodyProps {
  myTradeItems: InventoryItemFragment[];
  myTradeState: SecureTradeState;
  stackGroupIdToItemIDs: {[id: string]: string[]};
  inventoryItems: InventoryItemFragment[];
  containerIdToDrawerInfo: base.ContainerIdToDrawerInfo;
  visibleComponentRight: string;
  visibleComponentLeft: string;
  invBodyDimensions: {
    width: number;
    height: number;
  };
}

export interface InventoryBodyProps {
  styles?: Partial<InventoryBodyStyles>;
  onChangeInvBodyDimensions: (invBodyDimensions: { width: number; height: number; }) => void;
}

export type InventoryBodyComponentProps = InjectedInventoryBodyProps & InventoryBodyProps & base.InventoryBaseWithQLProps;

export interface InventoryBodyState extends base.InventoryBaseState {
}

class InventoryBody extends React.Component<InventoryBodyComponentProps, InventoryBodyState> {
  private static minSlots = 200;
  private updateInventoryItemsHandler: number;
  private dropItemHandler: number;
  private bodyRef: HTMLDivElement;
  private graphql: GraphQLResult<Pick<CUQuery, 'myInventory'>>;

  // a counter that is incremented each time a new
  // stack group id is generated that is used in
  // generateing the stack group id

  constructor(props: InventoryBodyComponentProps) {
    super(props);
    this.state = {
      ...base.defaultInventoryBaseState(),
    };
  }
  public render() {
    const { rows, rowData } = base.createRowElements({
      state: this.state,
      props: this.props,
      itemData: { items: this.props.inventoryItems },
      onDropOnZone: this.onDropOnZone,
      onMoveStack: this.onMoveStack,
      syncWithServer: this.refetch,
      bodyWidth: this.props.invBodyDimensions.width,
      myTradeItems: this.props.myTradeItems,
      myTradeState: this.props.myTradeState,
      stackGroupIdToItemIDs: this.props.stackGroupIdToItemIDs,
    });
    const buttonDisabled = base.allInventoryFooterButtonsDisabled(this.props);
    const removeAndPruneDisabled = buttonDisabled || (base.allInventoryFooterButtonsDisabled(this.props) ||
      base.inventoryFooterRemoveAndPruneButtonDisabled(rowData, this.props.invBodyDimensions.height));
    return (
      <GraphQL query={{ query: queries.InventoryBase }} onQueryResult={this.handleQueryResult}>
        {(graphql: GraphQLResult<Pick<CUQuery, 'myInventory'>>) => {
          this.graphql = graphql;
          const showLoading = graphql.loading;
          const showError = graphql.lastError && graphql.lastError !== 'OK';
          return (
            <Container>
              {showLoading &&
                <RefreshContainer>
                  <RefreshTitle>Loading...</RefreshTitle>
                </RefreshContainer>
              }
              {showError &&
                <RefreshContainer>
                  <RefreshTitle>Could not retrieve items. Click to try again.</RefreshTitle>
                  <RefreshButton onClick={this.refetch}><i className='fa fa-refresh' /></RefreshButton>
                </RefreshContainer>
              }
              <InnerContainer innerRef={(r: HTMLDivElement) => this.bodyRef = r} id='inventory-scroll-container'>
                <Content>{rows}</Content>
              </InnerContainer>
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
            </Container>
          );
        }}
      </GraphQL>
    );
  }

  public componentDidMount() {
    setTimeout(() => this.initializeBodyDimensions(), 1);
    window.addEventListener('resize', () => this.initializeBodyDimensions(true));
    this.updateInventoryItemsHandler = events.on(eventNames.updateInventoryItems, this.onUpdateInventoryOnEquip);
    this.dropItemHandler = events.on(eventNames.onDropItem, (payload: DropItemPayload) =>
      base.dropItemRequest(payload.inventoryItem.item));
    window.addEventListener('resize', this.initializeInventory);
    client.SendCommitItemRequest(this.handleCommitItemRequest);
  }

  public componentDidUpdate(prevProps: InventoryBodyComponentProps, prevState: InventoryBodyState) {
    const onInventoryItemsChange = !_.isEqual(prevProps.inventoryItems, this.props.inventoryItems);
    const onSearchValueChange = prevProps.searchValue !== this.props.searchValue;
    const onActiveFiltersChange = !_.isEqual(prevProps.activeFilters, this.props.activeFilters);

    if (onInventoryItemsChange || onActiveFiltersChange || onSearchValueChange) {
      this.setState(() => this.internalInit(this.state, this.props));
      return;
    }

    const inventoryWasOpened = (this.props.visibleComponentLeft === 'inventory-left' &&
      prevProps.visibleComponentLeft === '') || (this.props.visibleComponentRight === 'inventory-right' &&
        prevProps.visibleComponentRight === '');
    if (inventoryWasOpened) {
      this.refetch();
      return;
    }

    if (!_.isEqual(this.props.invBodyDimensions, prevProps.invBodyDimensions)) {
      this.initializeInventory();
      return;
    }
  }

  public componentWillUnmount() {
    events.off(this.updateInventoryItemsHandler);
    events.off(this.dropItemHandler);
    window.removeEventListener('resize', () => this.initializeBodyDimensions(true));
  }

  private handleQueryResult = (result: GraphQLResult<Pick<CUQuery, 'myInventory'>>) => {
    if (!result || result.loading || result.lastError !== 'OK') return result;
    if (!_.isEqual(result.data.myInventory.items, this.props.inventoryItems)) {
      this.props.onChangeInventoryItems(result.data.myInventory.items);
    } else {
      this.setState(() => this.internalInit(this.state, this.props));
    }
    return result;
  }

  private refetch = async () => {
    if (!this.graphql) return;
    this.graphql.refetch();
    events.fire('refetch-character-info');
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
    this.setState((state, props) => this.internalInit(state, props));
  }

  private initializeBodyDimensions = (override?: boolean) => {
    if (!this.bodyRef) return;
    if (!this.props.invBodyDimensions.width || !this.props.invBodyDimensions.height || override) {
      const { clientHeight, clientWidth } = this.bodyRef;
      this.props.onChangeInvBodyDimensions({ height: clientHeight, width: clientWidth });
    }
  }

  // should not be called outside of initializeInventory
  private internalInit = (state: InventoryBodyState, props: InventoryBodyComponentProps) => {
    if (!this.bodyRef || !this.graphql || !this.props.invBodyDimensions.height || !this.props.invBodyDimensions.width) {
      return;
    }
    const itemCount = this.props.inventoryItems && this.props.inventoryItems.length;
    const rowsAndSlots = calcRowAndSlots(
      { height: this.props.invBodyDimensions.height, width: this.props.invBodyDimensions.width },
      slotDimensions,
      Math.max(InventoryBody.minSlots, itemCount),
    );
    const inventory = this.graphql.data && this.graphql.data.myInventory && {
      ...this.graphql.data.myInventory,
      items: this.graphql.data.myInventory.items as any,
    };

    return base.distributeItems({
      slotsData: rowsAndSlots,
      itemData: inventory,
      state,
      props,
      inventoryItems: props.inventoryItems,
      stackGroupIdToItemIDs: props.stackGroupIdToItemIDs,
    });
  }

  private onDropOnZone = (dragItemData: InventoryDataTransfer,
                          dropZoneData: InventoryDataTransfer) => {
    // this function only gets called for inventory items, containers take care of their own state.
    this.setState((state, props) => {
      return base.onMoveInventoryItem({
        dragItemData,
        dropZoneData,
        state,
        props,
        containerIdToDrawerInfo: props.containerIdToDrawerInfo,
        stackGroupIdToItemIDs: props.stackGroupIdToItemIDs,
        inventoryItems: props.inventoryItems,
      });
    });
  }

  private addRowOfSlots = () => {
    this.setState(base.addRowOfSlots);
  }

  private removeRowOfSlots = (rowData: InventorySlotItemDef[][]) => {
    this.setState(state => base.removeRowOfSlots(state, rowData, this.props.invBodyDimensions.height));
  }

  private pruneRowsOfSlots = (rowData: InventorySlotItemDef[][]) => {
    this.setState(state => base.pruneRowsOfSlots(state, rowData, this.props.invBodyDimensions.height));
  }

  private onUpdateInventoryOnEquip = (payload: UpdateInventoryItemsPayload) => {
    this.setState((state, props) => (
      base.onUpdateInventoryItemsHandler({
        state,
        props,
        payload,
        stackGroupIdToItemIDs: props.stackGroupIdToItemIDs,
        inventoryItems: props.inventoryItems,
        containerIdToDrawerInfo: props.containerIdToDrawerInfo,
      })
    ));
  }

  private onMoveStack = (item: InventoryItemFragment, amount: number) => {
    this.setState((state, props) => (
      base.onMoveStack({
        state,
        props,
        item,
        amount,
        stackGroupIdToItemIDs: props.stackGroupIdToItemIDs,
        inventoryItems: props.inventoryItems,
      })
    ));
  }
}

class InventoryBodyWithInjectedContext extends React.Component<InventoryBodyProps & base.InventoryBaseProps> {
  public render() {
    return (
      <FullScreenContext.Consumer>
        {({
            myTradeItems,
            myTradeState,
            stackGroupIdToItemIDs,
            inventoryItems,
            containerIdToDrawerInfo,
            visibleComponentLeft,
            visibleComponentRight,
            invBodyDimensions,
          }) => {
          return (
            <InventoryBody
              {...this.props}
              inventoryItems={inventoryItems}
              myTradeItems={myTradeItems}
              myTradeState={myTradeState}
              stackGroupIdToItemIDs={stackGroupIdToItemIDs}
              containerIdToDrawerInfo={containerIdToDrawerInfo}
              visibleComponentLeft={visibleComponentLeft}
              visibleComponentRight={visibleComponentRight}
              invBodyDimensions={invBodyDimensions}
            />
          );
        }}
      </FullScreenContext.Consumer>
    );
  }
}

export default InventoryBodyWithInjectedContext;
