/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';

import { query } from '../Inventory/graphql/query';
import { InventoryItem, CUQuery } from 'gql/interfaces';
import { SlotType } from 'fullscreen/lib/itemInterfaces';
import eventNames, {
  InventoryDataTransfer,
  UpdateInventoryItemsPayload,
  MoveStackPayload,
  CombineStackPayload,
} from 'fullscreen/lib/itemEvents';
import {
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
  moveInventoryItemOutOfInventory,
  DrawerSlotNumberToItem,
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
  onUpdateState: (newState: Partial<InventoryContextState>) => void;
  onMoveInventoryItem: (payload: MoveInventoryItemPayload) => void;
  onMoveStack: (payload: MoveStackPayload) => void;
  onCombineStack: (payload: CombineStackPayload) => void;
  onMoveInventoryItemOutOfInventory: (dragItemData: InventoryDataTransfer) => void;
  onAddContainer: (containerID: string, drawerID: string, drawerSlotNumberToItem: DrawerSlotNumberToItem) => void;
  onRemoveContainer: (containerID: string) => void;
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
  onUpdateState: () => {},
  onMoveInventoryItem: () => {},
  onMoveStack: () => {},
  onCombineStack: () => {},
  onMoveInventoryItemOutOfInventory: () => {},
  onAddContainer: () => {},
  onRemoveContainer: () => {},
};

export const InventoryContext = React.createContext(defaultInventoryContextValue);

export interface MoveInventoryItemPayload {
  dragItemData: InventoryDataTransfer;
  dropZoneData: InventoryDataTransfer;
}

class InventoryContextProvider extends React.Component<InventoryContextProps, InventoryContextState> {
  private graphql: GraphQLResult<Pick<CUQuery, 'myInventory'>>;
  private updateInventoryItemsHandler: EventHandle;
  constructor(props: InventoryContextProps) {
    super(props);
    this.state = {
      ...defaultInventoryContextValue,
      onUpdateState: this.onUpdateState,
      onMoveInventoryItem: this.onMoveInventoryItem,
      onMoveStack: this.onMoveStack,
      onCombineStack: this.onCombineStack,
      onMoveInventoryItemOutOfInventory: this.onMoveInventoryItemOutOfInventory,
      onAddContainer: this.onAddContainer,
      onRemoveContainer: this.onRemoveContainer,
    };
  }

  public render() {
    return (
      <GraphQL query={query} onQueryResult={this.handleQueryResult}>
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
    this.updateInventoryItemsHandler = game.on(eventNames.updateInventoryItems, this.onUpdateInventoryOnEquip);
  }

  public componentDidUpdate(prevProps: InventoryContextProps) {
    const leftInventoryOpened = this.props.visibleComponentLeft === 'inventory-left' &&
      prevProps.visibleComponentLeft === '';
    const rightInventoryOpened = this.props.visibleComponentRight === 'inventory-right' &&
      prevProps.visibleComponentRight === '';
    const inventoryWasOpened = leftInventoryOpened || rightInventoryOpened;
    if (inventoryWasOpened) {
      this.refetch();
      return;
    }
  }

  public componentWillUnmount() {
    this.updateInventoryItemsHandler.clear();
  }

  private handleQueryResult = (graphql: GraphQLResult<Pick<CUQuery, 'myInventory'>>) => {
    this.graphql = graphql;
    if (!graphql || graphql.loading || graphql.lastError !== 'OK') {
      console.error(`Failed to load inventory: ${graphql ? graphql : "--"}`);
      console.error(`Failed to load inventory: ${graphql ? graphql.lastError : "??"}`);
      return graphql;
    }
    this.initializeInventory(graphql.data.myInventory.items);
    return graphql;
  }

  private refetch = async (disableLoading?: boolean) => {
    if (!this.graphql) return;
    this.graphql.refetch(disableLoading);
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

    return distributeItemsNoFilter({ itemData, containerIdToDrawerInfo: this.state.containerIdToDrawerInfo });
  }

  private onUpdateState = (newState: Partial<InventoryContextState>) => {
    this.setState(state => ({ ...state, ...newState }));
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

  private onMoveInventoryItemOutOfInventory = (dragItemData: InventoryDataTransfer) => {
    const { containerIdToDrawerInfo, stackGroupIdToItemIDs, itemIdToInfo, slotNumberToItem, inventoryItems } = this.state;
    this.setState(() => {
      return moveInventoryItemOutOfInventory({
        dragItemData,
        containerIdToDrawerInfo,
        stackGroupIdToItemIDs,
        itemIdToInfo,
        slotNumberToItem,
        inventoryItems,
      });
    });
  }

  private onMoveInventoryItem = (payload: MoveInventoryItemPayload) => {
    this.setState(() => {
      const { dragItemData, dropZoneData } = payload;
      const { containerIdToDrawerInfo, stackGroupIdToItemIDs, inventoryItems, slotNumberToItem, itemIdToInfo } = this.state;
      if (!dropZoneData || dropZoneData.slotType === SlotType.Empty) {
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
    const { itemDataTransfer, amount, newPosition } = payload;
    const { containerIdToDrawerInfo, stackGroupIdToItemIDs, inventoryItems, slotNumberToItem, itemIdToInfo } = this.state;
    const args = {
      itemDataTransfer,
      amount,
      newPosition,
      stackGroupIdToItemIDs,
      inventoryItems,
      slotNumberToItem,
      itemIdToInfo,
      containerIdToDrawerInfo,
    };
    const newState = onMoveStackClient(args);
    this.setState({ ...newState });

    onMoveStackServer(args).then((newState: Partial<InventoryContextState>) => {
      this.setState({ ...this.state, ...newState });
    });
  }

  private onCombineStack = (payload: CombineStackPayload) => {
    const { dragItem, dropZone, amount } = payload;
    const { inventoryItems, slotNumberToItem, stackGroupIdToItemIDs, containerIdToDrawerInfo } = this.state;
    const args = {
      itemDataTransfer: dragItem,
      amount,
      stackItem: dropZone.item,
      inventoryItems,
      slotNumberToItem,
      stackGroupIdToItemIDs,
      containerIdToDrawerInfo,
    };
    const newState = onCombineStackClient(args);
    this.setState({ ...newState });

    onCombineStackServer(args).then((newState: Partial<InventoryContextState>) => {
      this.setState({ ...this.state, ...newState });
    });
  }

  private onAddContainer = (containerID: string, drawerID: string, drawerSlotNumberToItem: DrawerSlotNumberToItem) => {
    const containerIdToDrawerInfo = { ...this.state.containerIdToDrawerInfo };
    if (containerIdToDrawerInfo[containerID]) return;
    containerIdToDrawerInfo[containerID] = {
      drawers: {
        [drawerID]: drawerSlotNumberToItem,
      },
    };

    this.setState({ containerIdToDrawerInfo });
  }

  private onRemoveContainer = (containerID: string) => {
    const containerIdToDrawerInfo = { ...this.state.containerIdToDrawerInfo };
    if (!containerIdToDrawerInfo[containerID]) return;

    delete containerIdToDrawerInfo[containerID];
    this.setState({ containerIdToDrawerInfo });
  }
}

export default InventoryContextProvider;
