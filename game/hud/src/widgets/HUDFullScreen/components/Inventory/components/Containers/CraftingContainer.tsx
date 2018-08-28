/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

import * as base from '../../../ItemShared/InventoryBase';
import ContainerView, { CloseButton } from './ContainerView';
import { DrawerCurrentStats } from '../Containers/Drawer';
import { slotDimensions } from '../InventorySlot';
import InventoryRowActionButton from '../InventoryRowActionButton';
import { calcRows, getContainerInfo, getItemDefinitionName, FullScreenContext } from '../../../../lib/utils';
import { rowActionIcons } from '../../../../lib/constants';
import { InventoryDataTransfer } from '../../../../lib/eventNames';
import { InventorySlotItemDef } from '../../../../lib/itemInterfaces';
import { InventoryItem, ContainerDefStat_Single } from 'gql/interfaces';

const HeaderContent = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const FooterContent = styled('div')`
  display: flex;
  align-items: center;
`;

export interface InjectedCraftingContainerProps {
  myTradeItems: InventoryItem.Fragment[];
  inventoryItems: InventoryItem.Fragment[];
  stackGroupIdToItemIDs: {[id: string]: string[]};
}

export interface CraftingContainerProps {
  item: InventorySlotItemDef;
  slotsPerRow: number;
  onCloseClick: () => void;
  onDropOnZone: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void;
  bodyWidth: number;
  containerID?: string[];
  drawerID?: string;
  containerPermissions?: base.ContainerPermissionDef;
  drawerCurrentStats?: DrawerCurrentStats;
  drawerMaxStats?: ContainerDefStat_Single;
}

export type CraftingContainerComponentProps = CraftingContainerProps &
  InjectedCraftingContainerProps & base.InventoryBaseProps;

export interface CraftingContainerState extends base.InventoryBaseState {
}

export class CraftingContainer extends React.Component<CraftingContainerComponentProps, CraftingContainerState> {
  private static minSlots = 10;
  private contentRef: HTMLElement = null;

  constructor(props: CraftingContainerComponentProps) {
    super(props);
    this.state = {
      ...base.defaultInventoryBaseState(),
    };
  }

  public render() {
    const firstItem = this.props.item && this.props.item.stackedItems[0];
    const { totalUnitCount, weight, averageQuality } = getContainerInfo(this.props.item.stackedItems);
    const header =
      `${getItemDefinitionName(firstItem)} | ${totalUnitCount} units | ${weight}kg | average quality ${averageQuality}%`;
    const { rows, rowData } = base.createRowElementsForCraftingItems({
      state: this.state,
      props: this.props,
      containerItem: this.props.item.item || firstItem,
      itemData: { items: this.props.item.stackedItems },
      bodyWidth: this.props.bodyWidth,
      onDropOnZone: this.props.onDropOnZone,
      containerID: this.props.containerID,
      drawerID: this.props.drawerID,
      drawerCurrentStats: this.props.drawerCurrentStats,
      drawerMaxStats: this.props.drawerMaxStats,
      syncWithServer: () => {},
      onMoveStack: () => {},
      myTradeItems: this.props.myTradeItems,
    });

    return (
      <ContainerView
        headerContent={() => (
          <HeaderContent>
            <div>{header}</div>
            <CloseButton className={`fa fa-times click-effect`} onClick={this.props.onCloseClick} />
          </HeaderContent>
        )}
        mainContent={() => rows}
        footerContent={() => (
          <FooterContent>
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
          </FooterContent>
        )}
        contentRef={r => this.contentRef = r}
      />
    );
  }

  public componentDidMount() {
    this.initialize();
  }

  public shouldComponentUpdate(nextProps: CraftingContainerComponentProps, nextState: CraftingContainerState) {
    return !_.isEqual(this.props.item, nextProps.item) ||
      !_.isEqual(this.props.drawerCurrentStats, nextProps.drawerCurrentStats) ||
      !_.isEqual(this.props.drawerMaxStats, nextProps.drawerMaxStats) ||
      this.props.slotsPerRow !== nextProps.slotsPerRow ||
      this.props.searchValue !== nextProps.searchValue ||
      !_.isEqual(this.props.activeFilters, nextProps.activeFilters) ||
      this.props.bodyWidth !== nextProps.bodyWidth ||

      this.state.rowCount !== nextState.rowCount ||
      this.state.slotCount !== nextState.slotCount ||
      this.state.slotsPerRow !== nextState.slotsPerRow;
  }

  // set up rows from scratch / works as a re-initialize as well
  private initialize = () => {
    this.setState(this.internalInit);
  }

  // should not be called outside of initializeInventory
  private internalInit = (state: CraftingContainerState, props: CraftingContainerComponentProps) => {
    if (!this.contentRef) return;
    const rowsAndSlots = calcRows(20, slotDimensions,
      Math.max(CraftingContainer.minSlots, props.item.stackedItems.length), props.slotsPerRow);
    const rowData = {
      slotsPerRow: props.slotsPerRow,
      ...rowsAndSlots,
    };
    return base.distributeItems({
      slotsData: rowData,
      itemData: { items: [] },
      state,
      props,
      inventoryItems: props.inventoryItems,
      stackGroupIdToItemIDs: props.stackGroupIdToItemIDs,
    });
  }

  private addRowOfSlots = () => {
    this.setState(base.addRowOfSlots);
  }

  private removeRowOfSlots = (rowData: InventorySlotItemDef[][]) => {
    const heightOfBody = 20;
    this.setState((state, props) => base.removeRowOfSlots(state, rowData, heightOfBody, true));
  }

  private pruneRowsOfSlots = (rowData: InventorySlotItemDef[][]) => {
    const heightOfBody = 20;
    this.setState((state, props) => base.pruneRowsOfSlots(state, rowData, heightOfBody, true));
  }
}

class CraftingContainerWithInjectedContext extends React.Component<CraftingContainerProps & base.InventoryBaseProps> {
  public render() {
    return (
      <FullScreenContext.Consumer>
        {({ myTradeItems, inventoryItems, stackGroupIdToItemIDs }) => {
          return (
            <CraftingContainer
              {...this.props}
              myTradeItems={myTradeItems}
              inventoryItems={inventoryItems}
              stackGroupIdToItemIDs={stackGroupIdToItemIDs}
            />
          );
        }}
      </FullScreenContext.Consumer>
    );
  }
}

export default CraftingContainerWithInjectedContext;
