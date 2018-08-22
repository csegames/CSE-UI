/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { events } from '@csegames/camelot-unchained';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';

import queries from '../../../../gqlDocuments';
import { InventoryItem, CUQuery } from 'gql/interfaces';
import { SlotType } from '../../lib/itemInterfaces';
import eventNames, {
  InventoryDataTransfer,
  UpdateInventoryItemsPayload,
  MoveStackPayload,
  CombineStackPayload,
} from '../../lib/eventNames';
import {
  InventoryBaseState,
  InventoryBaseProps,
  ContainerIdToDrawerInfo,
  SlotNumberToItem,
  ItemIDToInfo,

  moveInventoryItemToEmptySlot,
  swapInventoryItems,
  onUpdateInventoryItemsHandler,
  onMoveStackClient,
  onMoveStackServer,
  distributeItemsNoFilter,
  onCombineStackClient,
  onCombineStackServer,
} from './InventoryBase';

export interface InventoryContextProps {
  visibleComponentLeft: string;
  visibleComponentRight: string;
}

export interface InventoryContextState {
  inventoryItems: InventoryItem.Fragment[];
  containerIdToDrawerInfo: ContainerIdToDrawerInfo;
  slotNumberToItem: SlotNumberToItem;
  itemIdToInfo: ItemIDToInfo;
  stackGroupIdToItemIDs: {[id: string]: string[]};
  itemIDToStackGroupID: {[id: string]: string};
  graphql: GraphQLResult<Pick<CUQuery, 'myInventory'>>;

  initializeInventory: () => void;
  onChangeInventoryItems: (inventoryItems: InventoryItem.Fragment[]) => void;
  onChangeContainerIdToDrawerInfo: (containerIdToDrawerInfo: ContainerIdToDrawerInfo) => void;
  onChangeStackGroupIdToItemIDs: (stackGroupIdToItemIDs: {[id: string]: string[]}) => void;
  onMoveInventoryItem: (payload: MoveInventoryItemPayload) => void;
  onMoveStack: (payload: MoveStackPayload) => void;
  onCombineStack: (payload: CombineStackPayload) => void;
}

export const defaultInventoryContextValue: InventoryContextState = {
  inventoryItems: [],
  containerIdToDrawerInfo: {},
  slotNumberToItem: {},
  itemIdToInfo: {},
  stackGroupIdToItemIDs: {},
  itemIDToStackGroupID: {},
  graphql: null,

  initializeInventory: () => {},
  onChangeInventoryItems: () => {},
  onChangeContainerIdToDrawerInfo: () => {},
  onChangeStackGroupIdToItemIDs: () => {},
  onMoveInventoryItem: () => {},
  onMoveStack: () => {},
  onCombineStack: () => {},
};

export const InventoryContext = React.createContext(defaultInventoryContextValue);

export interface MoveInventoryItemPayload {
  dragItemData: InventoryDataTransfer;
  dropZoneData: InventoryDataTransfer;
  state: InventoryBaseState;
  props: InventoryBaseProps;
  containerIdToDrawerInfo: ContainerIdToDrawerInfo;
  stackGroupIdToItemIDs: {[id: string]: string[]};
  inventoryItems: InventoryItem.Fragment[];
}

class InventoryContextProvider extends React.Component<InventoryContextProps, InventoryContextState> {
  private graphql: GraphQLResult<Pick<CUQuery, 'myInventory'>>;
  private updateInventoryItemsHandler: number;
  constructor(props: InventoryContextProps) {
    super(props);
    this.state = {
      ...defaultInventoryContextValue,
      onChangeInventoryItems: this.onChangeInventoryItems,
      onChangeContainerIdToDrawerInfo: this.onChangeContainerIdToDrawerInfo,
      onChangeStackGroupIdToItemIDs: this.onChangeStackGroupIdToItemIDs,
      onMoveInventoryItem: this.onMoveInventoryItem,
      onMoveStack: this.onMoveStack,
      onCombineStack: this.onCombineStack,
    };
  }

  public render() {
    return (
      <GraphQL query={{ query: queries.InventoryBase }} onQueryResult={this.handleQueryResult}>
        {(graphql: GraphQLResult<Pick<CUQuery, 'myInventory'>>) => {
          const contextValue: InventoryContextState = {
            ...this.state,
            graphql,
          };
          return (
            <InventoryContext.Provider value={contextValue}>
              {this.props.children}
            </InventoryContext.Provider>
          );
        }}
      </GraphQL>
    );
  }

  public componentDidMount() {
    this.updateInventoryItemsHandler = events.on(eventNames.updateInventoryItems, this.onUpdateInventoryOnEquip);
  }

  public componentDidUpdate(prevProps: InventoryContextProps, prevState: InventoryContextState) {
    const inventoryWasOpened = (this.props.visibleComponentLeft === 'inventory-left' &&
      prevProps.visibleComponentLeft !== 'inventory-left') || (this.props.visibleComponentRight === 'inventory-right' &&
        prevProps.visibleComponentRight !== 'inventory-right');
    if (inventoryWasOpened) {
      this.refetch();
      return;
    }
  }

  public componentWillUnmount() {
    events.off(this.updateInventoryItemsHandler);
  }

  private handleQueryResult = (graphql: GraphQLResult<Pick<CUQuery, 'myInventory'>>) => {
    this.graphql = graphql;
    if (!graphql || graphql.loading || graphql.lastError !== 'OK') return graphql;
    this.initializeInventory(graphql.data.myInventory.items);
    return graphql;
  }

  private refetch = async () => {
    if (!this.graphql) return;
    this.graphql.refetch();
    events.fire('refetch-character-info');
  }

  private initializeInventory(inventoryItems: InventoryItem.Fragment[]) {
    this.setState((state) => {
      return {
        ...state,
        ...this.internalInit(inventoryItems),
      };
    });
  }

  // should not be called outside of initializeInventory
  private internalInit = (inventoryItems: InventoryItem.Fragment[]) => {
    if (!this.graphql) {
      return;
    }
    const itemData = {
      items: inventoryItems,
    };

    return distributeItemsNoFilter({
      itemData,
      onChangeContainerIdToDrawerInfo: this.onChangeContainerIdToDrawerInfo,
      onChangeStackGroupIdToItemIDs: this.onChangeStackGroupIdToItemIDs,
      onChangeInventoryItems: this.onChangeInventoryItems,
    });
  }

  private onUpdateInventoryOnEquip = (payload: UpdateInventoryItemsPayload) => {
    this.setState(state => (
      onUpdateInventoryItemsHandler({
        itemIdToInfo: state.itemIdToInfo,
        slotNumberToItem: state.slotNumberToItem,
        itemIDToStackGroupID: state.itemIDToStackGroupID,
        payload,
        stackGroupIdToItemIDs: state.stackGroupIdToItemIDs,
        inventoryItems: state.inventoryItems,
        containerIdToDrawerInfo: state.containerIdToDrawerInfo,
      })
    ));
  }

  private onMoveInventoryItem = (payload: MoveInventoryItemPayload) => {
    this.setState(() => {
      const { dragItemData, dropZoneData, inventoryItems } = payload;
      const { containerIdToDrawerInfo, stackGroupIdToItemIDs, slotNumberToItem, itemIdToInfo } = this.state;
      if (dropZoneData.slotType === SlotType.Empty) {
        return moveInventoryItemToEmptySlot({
          dragItemData,
          dropZoneData,
          containerIdToDrawerInfo,
          stackGroupIdToItemIDs,
          inventoryItems,
          slotNumberToItem,
          itemIdToInfo,
        });
      } else {
        return swapInventoryItems({
          dragItem: dragItemData,
          dropZone: dropZoneData,
          stackGroupIdToItemIDs,
          inventoryItems,
          slotNumberToItem,
          itemIdToInfo,
        });
      }
    });
  }

  private onMoveStack = (payload: MoveStackPayload) => {
    const { item, amount, newPosition } = payload;
    const { stackGroupIdToItemIDs, inventoryItems, slotNumberToItem, itemIdToInfo } = this.state;
    const args = {
      item,
      amount,
      newPosition,
      stackGroupIdToItemIDs,
      inventoryItems,
      slotNumberToItem,
      itemIdToInfo,
    };
    const newState = onMoveStackClient(args);
    this.setState({ ...newState });

    onMoveStackServer(args).then((newState: Partial<InventoryContextState>) => {
      this.setState({ ...this.state, ...newState });
    });
  }

  private onCombineStack = (payload: CombineStackPayload) => {
    const { item, amount, stackItem } = payload;
    const { inventoryItems, slotNumberToItem } = this.state;
    const args = {
      item,
      amount,
      stackItem,
      inventoryItems,
      slotNumberToItem,
    };
    const newState = onCombineStackClient(args);
    this.setState({ ...newState });

    onCombineStackServer(args).then((newState: Partial<InventoryContextState>) => {
      this.setState({ ...this.state, ...newState });
    });
  }

  private onChangeInventoryItems = (inventoryItems: InventoryItem.Fragment[]) => {
    this.setState({ inventoryItems });
  }

  private onChangeContainerIdToDrawerInfo = (containerIdToDrawerInfo: ContainerIdToDrawerInfo) => {
    this.setState({ containerIdToDrawerInfo });
  }

  private onChangeStackGroupIdToItemIDs = (stackGroupIdToItemIDs: {[id: string]: string[]}) => {
    this.setState({ stackGroupIdToItemIDs });
  }
}

export default InventoryContextProvider;
