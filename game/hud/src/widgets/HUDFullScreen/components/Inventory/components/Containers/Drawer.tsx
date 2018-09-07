/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';
import { webAPI, Tooltip } from '@csegames/camelot-unchained';

import * as base from '../../../ItemShared/InventoryBase';
import * as containerBase from '../../../ItemShared/ContainerBase';
import DrawerView from './DrawerView';
import InventoryRowActionButton from '../InventoryRowActionButton';
import { rowActionIcons } from '../../../../lib/constants';
import { InventoryDataTransfer, CombineStackPayload } from '../../../../lib/itemEvents';
import { getContainerColor, getContainerInfo, FullScreenContext } from '../../../../lib/utils';
import { InventoryContext } from '../../../ItemShared/InventoryContext';
import { InventorySlotItemDef } from '../../../../lib/itemInterfaces';
import {
  SecureTradeState,
  InventoryItem,
  PermissibleHolder,
  ContainerDrawers,
} from 'gql/interfaces';

declare const toastr: any;

const Container = styled.div`
  position: relative;
  display: flex;
`;

const HeaderContent = styled.div`
  position: relative;
  height: 30px;
  width: 160px;
  padding-left: 15px;
  background: ${(props: any) => props.showImg ? 'url(../images/inventory/sub-title.png)' : 'transparent' };
  background-size: 100% 100%;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: ${(props: any) => props.showImg ? 'url(../images/inventory/sub-title.png)' : 'transparent' };
    background-size: 100% 100%;
  }
`;

const MainContent = styled.div`
  padding: 0 10px;
`;

const FooterContainer = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  padding-right: 3px;
`;

const RequirementsContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const RequirementIcon = styled.span`
  display: flex;
  font-size: 15px;
  margin-right: 5px;
  color: ${(props: any) => props.color};
`;

const PermissionContainer = styled.div`
  background: rgba(0,0,0,0.5);
  padding: 0 5px;
`;

const PermissionIcon = styled.span`
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
  slotNumberToItem: base.SlotNumberToItem;
  stackGroupIdToItemIDs: {[id: string]: string[]};
  containerIdToDrawerInfo: base.ContainerIdToDrawerInfo;
  myTradeItems: InventoryItem.Fragment[];
  myTradeState: SecureTradeState;
  onChangeInventoryItems: (inventoryItems: InventoryItem.Fragment[]) => void;
  onChangeSlotNumberToItem: (slotNumberToItem: base.SlotNumberToItem) => void;
  onChangeContainerIdToDrawerInfo: (newObj: base.ContainerIdToDrawerInfo) => void;
  onChangeStackGroupIdToItemIDs: (stackGroupIdToItemIDs: {[id: string]: string[]}) => void;
}

export interface DrawerProps {
  index: number;
  slotsPerRow: number;
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

  private addRowOfSlots = () => {
    this.setState(base.addRowOfSlots);
  }

  private removeRowOfSlots = (rowData: InventorySlotItemDef[][]) => {
    const heightOfBody = this.contentRef.getBoundingClientRect().height;
    this.setState(state => base.removeRowOfSlots(state, rowData, heightOfBody, true));
  }

  private pruneRowsOfSlots = (rowData: InventorySlotItemDef[][]) => {
    const heightOfBody = this.contentRef.getBoundingClientRect().height;
    this.setState(state => base.pruneRowsOfSlots(state, rowData, heightOfBody, true));
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
                onChangeInventoryItems,
                onChangeSlotNumberToItem,
                onChangeStackGroupIdToItemIDs,
                onChangeContainerIdToDrawerInfo,
              }) => {
                return (
                  <Drawer
                    {...this.props}
                    inventoryItems={inventoryItems}
                    slotNumberToItem={slotNumberToItem}
                    stackGroupIdToItemIDs={stackGroupIdToItemIDs}
                    containerIdToDrawerInfo={containerIdToDrawerInfo}
                    myTradeItems={myTradeItems}
                    myTradeState={myTradeState}
                    onChangeInventoryItems={onChangeInventoryItems}
                    onChangeSlotNumberToItem={onChangeSlotNumberToItem}
                    onChangeStackGroupIdToItemIDs={onChangeStackGroupIdToItemIDs}
                    onChangeContainerIdToDrawerInfo={onChangeContainerIdToDrawerInfo}
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
