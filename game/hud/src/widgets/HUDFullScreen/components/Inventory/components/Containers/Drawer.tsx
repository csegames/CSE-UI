/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { webAPI, Tooltip } from '@csegames/camelot-unchained';

import * as base from '../../../ItemShared/InventoryBase';
import { slotDimensions } from '../InventorySlot';
import DrawerView from './DrawerView';
import InventoryRowActionButton from '../InventoryRowActionButton';
import { rowActionIcons } from '../../../../lib/constants';
import { InventoryDataTransfer } from '../../../../lib/eventNames';
import {
  calcRowsForContainer,
  getContainerColor,
  getContainerInfo,
  createMoveItemRequestToContainerPosition,
  isContainerItem,
  FullScreenContext,
} from '../../../../lib/utils';
import { InventorySlotItemDef } from '../../../../lib/itemInterfaces';
import {
  SecureTradeState,
  InventoryItem,
  PermissibleHolder,
  ContainerDrawers,
} from 'gql/interfaces';

declare const toastr: any;

const Container = styled('div')`
  position: relative;
  display: flex;
`;

const HeaderContent = styled('div')`
  position: relative;
  height: 30px;
  width: 160px;
  padding-left: 15px;
  background: ${(props: any) => props.showImg ? 'url(images/inventory/sub-title.png)' : 'transparent' };
  background-size: 100% 100%;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: ${(props: any) => props.showImg ? 'url(images/inventory/sub-title.png)' : 'transparent' };
    background-size: 100% 100%;
  }
`;

const MainContent = styled('div')`
  padding: 0 10px;
`;

const FooterContainer = styled('div')`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  padding-right: 3px;
`;

const RequirementsContainer = styled('div')`
  display: flex;
  align-items: center;
  height: 100%;
`;

const RequirementIcon = styled('span')`
  display: flex;
  font-size: 15px;
  margin-right: 5px;
  color: ${(props: any) => props.color};
`;

const PermissionContainer = styled('div')`
  background: rgba(0,0,0,0.5);
  padding: 0 5px;
`;

const PermissionIcon = styled('span')`
  opacity: ${(props: any) => props.opacity};
  padding: 0 5px 0 0;
  vertical-align: middle;
`;

export interface DrawerCurrentStats {
  totalUnitCount: number;
  weight: number;
}

export interface InjectedDrawerProps {
  inventoryItems: InventoryItem.Fragment[];
  stackGroupIdToItemIDs: {[id: string]: string[]};
  containerIdToDrawerInfo: base.ContainerIdToDrawerInfo;
  myTradeItems: InventoryItem.Fragment[];
  myTradeState: SecureTradeState;
}

export interface DrawerProps {
  index: number;
  slotsPerRow: number;
  containerID: string[];
  drawer: ContainerDrawers.Fragment;
  containerItem: InventoryItem.Fragment;
  permissions: PermissibleHolder.Fragment;
  syncWithServer: () => void;

  // Will be sent to InventoryBody component who will act as the state machine for all container -> drawer -> slot
  onChangeContainerIdToDrawerInfo: (newObj: base.ContainerIdToDrawerInfo) => void;
  bodyWidth: number;
  marginTop?: number | string;
  footerWidth?: number | string;
}

export type DrawerComponentProps = DrawerProps & InjectedDrawerProps & base.InventoryBaseProps;

export interface DrawerState extends base.InventoryBaseState {
}

class Drawer extends React.Component<DrawerComponentProps, DrawerState> {
  private contentRef: any;
  constructor(props: DrawerComponentProps) {
    super(props);
    this.state = {
      ...base.defaultInventoryBaseState(),
    };
  }
  public render() {
    const { drawer, containerItem, containerID, syncWithServer } = this.props;
    const { stats, requirements } = drawer;

    // Grab items from containerIdToDrawerInfo (Managed by CharacterMain)

    const container = this.props.containerIdToDrawerInfo[containerID[containerID.length - 1]];
    const drawerInfo = container ? container.drawers[drawer.id] : {};
    const drawerItems: InventoryItem.Fragment[] = [];
    Object.keys(drawerInfo).forEach((_key) => {
      drawerItems.push(drawerInfo[_key].item);
    });

    // Get header info
    const { totalUnitCount, weight } = getContainerInfo(drawerItems);

    const containerPermissions = this.getContainerPermissions();

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
      onMoveStack: () => {},
      bodyWidth: this.props.bodyWidth,
      containerIdToDrawerInfo: this.props.containerIdToDrawerInfo,
      stackGroupIdToItemIDs: this.props.stackGroupIdToItemIDs,
      myTradeState: this.props.myTradeState,
      myTradeItems: this.props.myTradeItems,
    });

    const requirementIconColor = getContainerColor(containerItem, 0.3);
    return (
      <DrawerView
        marginTop={this.props.marginTop}
        footerWidth={this.props.footerWidth}
        containerItem={this.props.containerItem}
        headerContent={() => (
          <HeaderContent showImg={this.props.index !== 0}>
            <RequirementsContainer>
              {requirements &&
                <Tooltip content={() => (
                  <div>{requirements.description}</div>
                )}>
                  <RequirementIcon
                    className={requirements.icon}
                    color={requirementIconColor}
                  />
                </Tooltip>
              }
            </RequirementsContainer>
          </HeaderContent>
        )}
        mainContent={() => (
          <Container>
            <MainContent>
              {rows}
            </MainContent>
          </Container>
        )}
        footerContent={() => (
          <FooterContainer>
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
            {stats.maxItemMass !== -1 &&
              <PermissionContainer>
                <PermissionIcon className='icon-ui-weight' />
                {weight} / {stats.maxItemMass}
              </PermissionContainer>
            }
            {stats.maxItemCount !== -1 &&
              <PermissionContainer>
                <PermissionIcon className='icon-ui-bag' />
                {totalUnitCount} / {stats.maxItemCount}
              </PermissionContainer>
            }
          </FooterContainer>
        )}
        contentRef={r => this.contentRef = r}>
      </DrawerView>
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
      this.props.slotsPerRow !== nextProps.slotsPerRow ||
      this.props.myTradeState !== nextProps.myTradeState ||

      this.state.slotsPerRow !== nextState.slotsPerRow ||
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
    const rowData = this.getRowsAndSlots(props);
    return base.initializeSlotsData(rowData);
  }

  private getRowsAndSlots = (props: DrawerComponentProps) => {
    const { drawer, containerID, containerIdToDrawerInfo } = props;
    const container = containerIdToDrawerInfo[containerID[containerID.length - 1]];
    const drawerInfo = container ? container.drawers[drawer.id] : {};
    const drawerItems: InventoryItem.Fragment[] = [];
    Object.keys(drawerInfo).forEach((_key) => {
      drawerItems.push(drawerInfo[_key].item);
    });
    const rowData = calcRowsForContainer(props.bodyWidth, slotDimensions, drawerItems);

    return rowData;
  }

  private getContainerPermissions = (): base.ContainerPermissionDef | base.ContainerPermissionDef[] => {
    const { containerID, inventoryItems, containerItem } = this.props;
    const itemPermissions: base.ContainerPermissionDef = {
      userPermission: containerItem.permissibleHolder ?
        containerItem.permissibleHolder.userPermissions : ItemPermissions.All,
      isChild: false,
      isParent: false,
    };

    const containerPermissionsArray: base.ContainerPermissionDef[] = [itemPermissions];

    if (containerID.length > 1) {
      const parentContainer = _.find(inventoryItems, item => item.id === containerID[0]);
      const parentPermissions: base.ContainerPermissionDef = {
        userPermission: parentContainer.permissibleHolder ?
          parentContainer.permissibleHolder.userPermissions : ItemPermissions.All,
        isChild: false,
        isParent: true,
      };
      containerPermissionsArray.push(parentPermissions);
    }

    function getChildContainerPermissions(containerItem: InventoryItem.Fragment) {
      if (isContainerItem(containerItem)) {
        return;
      }
      containerItem.containerDrawers.forEach((drawer) => {
        drawer.containedItems.forEach((_containedItem) => {
          if (_containedItem.permissibleHolder &&
              _containedItem.permissibleHolder.userPermissions ! & ItemPermissions.Ground) {
            const childPermissions: base.ContainerPermissionDef = {
              userPermission: _containedItem.permissibleHolder ?
                _containedItem.permissibleHolder.userPermissions : ItemPermissions.All,
              isChild: true,
              isParent: false,
            };
            containerPermissionsArray.push(childPermissions);
          }

          getChildContainerPermissions(containerItem);
        });
      });
    }

    getChildContainerPermissions(containerItem);

    return containerPermissionsArray.length > 1 ? containerPermissionsArray : itemPermissions;
  }

  private onDropOnZone = (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => {
    // These will be modified throughout the function
    const containerIdToDrawerInfo = { ...this.props.containerIdToDrawerInfo };
    const inventoryItems = [...this.props.inventoryItems];

    const dragContainerID = dragItemData.containerID && dragItemData.containerID[dragItemData.containerID.length - 1];
    const dropContainerID = dropZoneData.containerID && dropZoneData.containerID[dropZoneData.containerID.length - 1];

    const newDragItem: InventoryItem.Fragment = {
      ...dragItemData.item,
      location: {
        inContainer: {
          position: dropZoneData.position,
        },
        inventory: null,
        equipped: null,
      },
    };

    const newDropItem: InventoryItem.Fragment = dropZoneData.item && {
      ...dropZoneData.item,
      location: {
        inContainer: {
          position: dragItemData.position,
        },
        inventory: null,
        equipped: null,
      },
    };

    if (newDropItem) {
      if (dragContainerID) {
        containerIdToDrawerInfo[dragContainerID].drawers[dragItemData.drawerID][dragItemData.position] = {
          slot: dragItemData.position,
          drawerId: dragItemData.drawerID,
          containerId: dragContainerID,
          item: newDropItem,
        };
      }
    }

    // Move item to container
    containerIdToDrawerInfo[dropContainerID].drawers[dropZoneData.drawerID][dropZoneData.position] = {
      slot: dropZoneData.position,
      drawerId: dropZoneData.drawerID,
      containerId: dropContainerID,
      item: newDragItem,
    };

    const indexOfDropZoneContainer = _.findIndex(inventoryItems, _item => _item.id === this.props.containerID[0]);
    const newDropContainerDrawers =
      this.getUpdatedDropContainer(
        dropZoneData,
        newDragItem,
        newDropItem,
        inventoryItems,
        indexOfDropZoneContainer,
      );

    inventoryItems[indexOfDropZoneContainer] = {
      ...inventoryItems[indexOfDropZoneContainer],
      containerDrawers: newDropContainerDrawers,
    };

    // Drag item was in container
    if (dragContainerID) {
      // Delete drag slot if moving to empty slot
      if (!newDropItem) {
        delete containerIdToDrawerInfo[dragContainerID].drawers[dragItemData.drawerID][dragItemData.position];
      }

      const indexOfTopDragItemContainer = _.findIndex(inventoryItems, _item => _item.id === dragItemData.containerID[0]);
      const newDragContainerDrawers =
        this.getUpdatedDragContainer(
          dragItemData,
          newDragItem,
          newDropItem,
          dropZoneData,
          inventoryItems,
          indexOfTopDragItemContainer,
        );

      inventoryItems[indexOfTopDragItemContainer] = {
        ...inventoryItems[indexOfTopDragItemContainer],
        containerDrawers: newDragContainerDrawers as any,
      };

    } else {
      // Drag item is in regular inventory
      const indexOfDragItem = _.findIndex(inventoryItems, _item => _item.id === dragItemData.item.id);
      if (newDropItem) {
        inventoryItems[indexOfDragItem] = newDropItem;
      } else {
        inventoryItems[indexOfDragItem] = null;
      }
    }

    this.props.onChangeInventoryItems(_.compact(inventoryItems));
    this.props.onChangeContainerIdToDrawerInfo(containerIdToDrawerInfo);

    // Make a move request to api server
    const moveRequests = [createMoveItemRequestToContainerPosition(dragItemData, dropZoneData)];

    if (newDropItem) {
      moveRequests.push(createMoveItemRequestToContainerPosition(dropZoneData, dragItemData));
    }

    webAPI.ItemAPI.BatchMoveItems(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      moveRequests,
    ).then((res) => {
      // If request fails for any reason
      if (!res.ok) {
        const data = JSON.parse(res.data);
        if (data.FieldCodes && data.FieldCodes.length > 0) {
          toastr.error(data.FieldCodes[0].Message, 'Oh No!', { timeout: 3000 });
        } else {
          // This means api server failed move item request but did not have a message about what happened
          toastr.error('An error occured', 'Oh No!', { timeout: 3000 });
        }

        // Sync with server, which should just revert the state
        this.props.syncWithServer();
      }
    });
  }

  private getUpdatedDropContainer = (dropZoneData: InventoryDataTransfer,
                                      newDragItem: InventoryItem.Fragment,
                                      newDropItem: InventoryItem.Fragment,
                                      inventoryItems: InventoryItem.Fragment[],
                                      indexOfDropZoneContainer: number) => {
    let newDropContainerDrawers;
    if (dropZoneData.containerID.length > 1) {
      // Dropped in a nested container
      newDropContainerDrawers = _.map(inventoryItems[indexOfDropZoneContainer].containerDrawers, (_drawer) => {
        const dropZoneContainer = _.find(_drawer.containedItems, _containedItem =>
          _containedItem.id === dropZoneData.containerID[dropZoneData.containerID.length - 1]);
        if (dropZoneContainer) {
          // Look for item in container drawer
          const newDropZoneDrawer = dropZoneContainer.containerDrawers.map((_dropZoneDrawer) => {
            const filteredDrawer = _.filter(_dropZoneDrawer.containedItems, _containedItem =>
              _containedItem.id !== newDragItem.id && (newDropItem ? _containedItem.id !== newDropItem.id : true));
            return {
              ..._dropZoneDrawer,
              containedItems: _.compact([
                ...filteredDrawer,
                newDragItem,
                newDropItem,
              ]),
            };
          });

          const newContainedItem = {
            ...dropZoneContainer,
            containerDrawers: newDropZoneDrawer,
          };

          return {
            ..._drawer,
            containedItems: [
              ..._.filter(_drawer.containedItems, _containedItem => _containedItem.id !== dropZoneContainer.id),
              newContainedItem,
            ],
          };
        }
        return _drawer;
      });

    } else {
      // Dropped in a top level container inside the inventory
      newDropContainerDrawers = _.map(inventoryItems[indexOfDropZoneContainer].containerDrawers, (_drawer) => {
        // Add item to drop zone drawer
        if (_drawer.id === dropZoneData.drawerID) {
          const filteredDrawer = _.filter(_drawer.containedItems, _containedItem =>
            _containedItem.id !== newDragItem.id && (newDropItem ? _containedItem.id !== newDropItem.id : true));
          return {
            ..._drawer,
            containedItems: _.compact([
              ...filteredDrawer,
              newDragItem,
              newDropItem,
            ]),
          };
        }

        return _drawer;
      });
    }

    return newDropContainerDrawers;
  }
  private getUpdatedDragContainer = (dragItemData: InventoryDataTransfer,
                                      newDragItem: InventoryItem.Fragment,
                                      newDropItem: InventoryItem.Fragment,
                                      dropZoneData: InventoryDataTransfer,
                                      inventoryItems: InventoryItem.Fragment[],
                                      indexOfTopDragItemContainer: number) => {
    let newDragContainerDrawers;
    const dragContainerID = dragItemData.containerID[dragItemData.containerID.length - 1];
    if (dragItemData.containerID.length > 1) {
      // Drag item came from a NESTED container
      newDragContainerDrawers = _.map(inventoryItems[indexOfTopDragItemContainer].containerDrawers, (_drawer) => {
        const dragItemContainer = _.find(_drawer.containedItems, _containedItem => _containedItem.id === dragContainerID);
        if (dragItemContainer) {
          // Look for item in container drawer
          const newDragItemDrawer = dragItemContainer.containerDrawers.map((_dragItemDrawer) => {

            let newContainedItems;
            if (!newDropItem) {
              // drop zone was an EMPTY slot
              if (!_.isEqual(dragItemData.containerID, dropZoneData.containerID) ||
                dragItemData.drawerID !== dropZoneData.drawerID) {
                // Coming from a different container or drawer
                newContainedItems =
                  _.filter(_dragItemDrawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id);
              } else {
                // Moving in same container and drawer
                newContainedItems = [
                  ..._.filter(_dragItemDrawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id),
                  newDragItem,
                ];
              }
            } else {
              // SWAPPING with item in drop zone
              if (!_.isEqual(dragItemData.containerID, dropZoneData.containerID) ||
                dragItemData.drawerID !== dropZoneData.drawerID) {
                // Coming from a different container and drawer
                newContainedItems = [
                  ..._.filter(_dragItemDrawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id),
                  newDropItem,
                ];
              } else {
                // Moving in same container and drawer
                newContainedItems = [
                  ..._.filter(_dragItemDrawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id &&
                    _containedItem.id !== dropZoneData.item.id),
                  newDragItem,
                  newDropItem,
                ];
              }
            }

            return {
              ..._dragItemDrawer,
              containedItems: newContainedItems,
            };
          });

          const newContainedItem = {
            ...dragItemContainer,
            containerDrawers: newDragItemDrawer,
          };
          return {
            ..._drawer,
            containedItems: [
              ..._.filter(_drawer.containedItems, _containedItem => _containedItem.id !== dragItemContainer.id),
              newContainedItem,
            ],
          };
        }
        return _drawer;
      });
    } else {
      newDragContainerDrawers = _.map(inventoryItems[indexOfTopDragItemContainer].containerDrawers, (_drawer) => {
        if (_drawer.id === dragItemData.drawerID) {
          // IF drag item going to a different drawer then just delete drag item from previous drawer
          // ELSE drag item is moved to a position in the same drawer, just update the drag item
          let newDrawer;
          if (!newDropItem) {
            // EMPTY
            if (!_.isEqual(dragItemData.containerID, dropZoneData.containerID) ||
              dragItemData.drawerID !== dropZoneData.drawerID) {
              // Coming from a different container or drawer
              newDrawer = _.filter(_drawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id);
            } else {
              // Moving in same container and drawer
              newDrawer = [
                ..._.filter(_drawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id),
                newDragItem,
              ];
            }
          } else {
            // SWAPPING
            if (!_.isEqual(dragItemData.containerID, dropZoneData.containerID) ||
              dragItemData.drawerID !== dropZoneData.drawerID) {
              // Coming from a different container or drawer
              newDrawer = [
                ..._.filter(_drawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id),
                newDropItem,
              ];
            } else {
              // Moving in same container and drawer
              newDrawer = [
                ..._.filter(_drawer.containedItems, _containedItem => _containedItem.id !== dragItemData.item.id &&
                  _containedItem.id !== dropZoneData.item.id),
                newDragItem,
                newDropItem,
              ];
            }
          }
          return {
            ..._drawer,
            containedItems: newDrawer,
          };
        }

        return _drawer;
      });
    }

    return newDragContainerDrawers;
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

class DrawerWithInjectedContext extends React.Component<DrawerProps & base.InventoryBaseProps> {
  public render() {
    return (
      <FullScreenContext.Consumer>
        {({ inventoryItems, stackGroupIdToItemIDs, containerIdToDrawerInfo, myTradeItems, myTradeState }) => {
          return (
            <Drawer
              {...this.props}
              inventoryItems={inventoryItems}
              stackGroupIdToItemIDs={stackGroupIdToItemIDs}
              containerIdToDrawerInfo={containerIdToDrawerInfo}
              myTradeItems={myTradeItems}
              myTradeState={myTradeState}
            />
          );
        }}
      </FullScreenContext.Consumer>
    );
  }
}

export default DrawerWithInjectedContext;
