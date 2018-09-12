/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';

import * as base from '../../../ItemShared/InventoryBase';
import * as containerBase from '../../../ItemShared/ContainerBase';
import { InventoryDataTransfer, CombineStackPayload } from '../../../../lib/itemEvents';
import { getContainerInfo, FullScreenContext } from '../../../../lib/utils';
import { InventoryContext, InventoryContextState } from '../../../ItemShared/InventoryContext';
import Drawer from './Drawer';
import {
  SecureTradeState,
  InventoryItem,
  PermissibleHolder,
  ContainerDrawers,
} from 'gql/interfaces';

export interface DrawerCurrentStats {
  totalUnitCount: number;
  weight: number;
}

export interface InjectedDrawerProps {
  inventoryItems: InventoryItem.Fragment[];
  slotNumberToItem: base.SlotNumberToItem;
  stackGroupIdToItemIDs: {[id: string]: string[]};
  containerIdToDrawerInfo: base.ContainerIdToDrawerInfo;
  myTradeItems: InventoryItem.Fragment[];
  myTradeState: SecureTradeState;
  onUpdateState: (newState: Partial<InventoryContextState>) => void;
}

export interface DrawerProps {
  index: number;
  containerID: string[];
  drawer: ContainerDrawers.Fragment;
  containerItem: InventoryItem.Fragment;
  permissions: PermissibleHolder.Fragment;
  syncWithServer: () => void;
  bodyWidth: number;
  marginTop?: number | string;
  footerWidth?: number | string;
}

export type DrawerComponentProps = DrawerProps & InjectedDrawerProps & base.InventoryBaseProps;

export interface DrawerState extends base.InventoryBaseState {
}

class InventoryDrawer extends React.Component<DrawerComponentProps, DrawerState> {
  constructor(props: DrawerComponentProps) {
    super(props);
    this.state = {
      ...base.defaultInventoryBaseState(),
    };
  }
  public render() {
    const { drawer, containerID, syncWithServer } = this.props;
    const { stats } = drawer;

    // Grab items from containerIdToDrawerInfo (Managed by CharacterMain)
    const container = this.props.containerIdToDrawerInfo[containerID[containerID.length - 1]];
    const drawerInfo = container ? container.drawers[drawer.id] : {};
    const drawerItems: InventoryItem.Fragment[] = [];
    Object.keys(drawerInfo).forEach((_key) => {
      drawerItems.push(drawerInfo[_key].item);
    });

    // Get header info
    const { totalUnitCount, weight } = getContainerInfo(drawerItems);

    const containerPermissions = containerBase.getContainerPermissions(this.props);

    // Create rows
    const { rows, rowData } = base.createRowElementsForContainerItems({
      state: this.state,
      props: this.props,
      itemData: { items: drawerItems },
      containerID,
      drawerID: drawer.id,
      onDropOnZone: this.onDropOnZone,
      containerPermissions,
      drawerMaxStats: stats,
      drawerCurrentStats: { totalUnitCount, weight },
      syncWithServer,
      bodyWidth: this.props.bodyWidth,
      containerIdToDrawerInfo: this.props.containerIdToDrawerInfo,
      stackGroupIdToItemIDs: this.props.stackGroupIdToItemIDs,
      myTradeState: this.props.myTradeState,
      myTradeItems: this.props.myTradeItems,
      onCombineStackDrawer: this.onCombineStack,
    });

    return (
      <Drawer
        rows={rows}
        rowData={rowData}
        containerItem={this.props.containerItem}
        index={this.props.index}
        drawer={this.props.drawer}
      />
    );
  }

  public componentDidMount() {
    this.initialize(this.props);
    window.addEventListener('resize', () => this.initialize(this.props));
  }

  public shouldComponentUpdate(nextProps: DrawerComponentProps, nextState: DrawerState) {
    return !_.isEqual(this.props.containerItem, nextProps.containerItem) ||
      !_.isEqual(this.props.drawer.containedItems, nextProps.drawer.containedItems) ||
      !_.isEqual(this.props.inventoryItems, nextProps.inventoryItems) ||
      !_.isEqual(this.props.containerIdToDrawerInfo, nextProps.containerIdToDrawerInfo) ||
      !_.isEqual(this.props.myTradeItems, nextProps.myTradeItems) ||
      !_.isEqual(this.props.stackGroupIdToItemIDs, nextProps.stackGroupIdToItemIDs) ||
      !_.isEqual(this.props.containerID, nextProps.containerID) ||
      this.props.index !== nextProps.index ||
      this.props.bodyWidth !== nextProps.bodyWidth ||
      this.props.searchValue !== nextProps.searchValue ||
      !_.isEqual(this.props.activeFilters, nextProps.activeFilters) ||
      this.props.myTradeState !== nextProps.myTradeState ||

      this.state.slotCount !== nextState.slotCount ||
      this.state.rowCount !== nextState.rowCount;
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', () => this.initialize(this.props));
  }

  // set up rows from scratch / works as a re-initialize as well
  private initialize = (props: DrawerComponentProps) => {
    this.setState(() => this.internalInit(this.state, props));
  }

  private internalInit = (state: DrawerState, props: DrawerComponentProps) => {
    // Initialize slot data, that's the only state drawers need to maintain.
    if (!props.bodyWidth) return;
    const rowData = containerBase.getRowsAndSlots(props);
    return base.initializeSlotsData(rowData);
  }

  private onCombineStack = (payload: CombineStackPayload) => {
    containerBase.onCombineStackClient(this.props, payload);
    containerBase.onCombineStackServer(this.props, payload);
  }

  private onDropOnZone = (dragItem: InventoryDataTransfer, dropZone: InventoryDataTransfer) => {
    containerBase.onDropOnZoneClient(this.props, dragItem, dropZone);
    containerBase.onDropOnZoneServer(this.props, dragItem, dropZone);
  }
}

class DrawerWithInjectedContext extends React.Component<DrawerProps & base.InventoryBaseProps> {
  public render() {
    return (
      <FullScreenContext.Consumer>
        {({ myTradeItems, myTradeState }) => {
          return (
            <InventoryContext.Consumer>
              {({
                inventoryItems,
                slotNumberToItem,
                stackGroupIdToItemIDs,
                containerIdToDrawerInfo,
                onUpdateState,
              }) => {
                return (
                  <InventoryDrawer
                    {...this.props}
                    inventoryItems={inventoryItems}
                    slotNumberToItem={slotNumberToItem}
                    stackGroupIdToItemIDs={stackGroupIdToItemIDs}
                    containerIdToDrawerInfo={containerIdToDrawerInfo}
                    myTradeItems={myTradeItems}
                    myTradeState={myTradeState}
                    onUpdateState={onUpdateState}
                  />
                );
              }}
            </InventoryContext.Consumer>
          );
        }}
      </FullScreenContext.Consumer>
    );
  }
}

export default DrawerWithInjectedContext;
