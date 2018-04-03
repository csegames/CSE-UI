/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

import * as base from '../InventoryBase';
import ContainerView, { CloseButton } from './ContainerView';
import { InventorySlotItemDef, slotDimensions, SlotType } from '../InventorySlot';
import InventoryRowActionButton from '../InventoryRowActionButton';
import { calcRows, getItemDefinitionName } from '../../../../lib/utils';
import { rowActionIcons } from '../../../../lib/constants';

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

export interface CraftingContainerProps extends base.InventoryBaseProps {
  item: InventorySlotItemDef;
  slotsPerRow: number;
  onCloseClick: () => void;
  onDropOnZone: (dragItemData: base.InventoryDataTransfer, dropZoneData: base.InventoryDataTransfer) => void;
  bodyWidth: number;
}

export interface CraftingContainerState extends base.InventoryBaseState {
}

export class CraftingContainer extends React.Component<CraftingContainerProps, CraftingContainerState> {

  private static minSlots = 20;
  private contentRef: HTMLElement = null;

  constructor(props: CraftingContainerProps) {
    super(props);
    this.state = {
      ...base.defaultInventoryBaseState(),
    };
  }

  public render() {
    let header = '';
    let rows: any = null;
    let rowData: InventorySlotItemDef[][] = [];
    switch (this.props.item.slotType) {
      case SlotType.CraftingContainer:
        const firstItem = this.props.item && this.props.item.stackedItems[0];
        const { totalUnitCount, weight, averageQuality } = base.getContainerHeaderInfo(this.props.item.stackedItems);
        header =
          `${getItemDefinitionName(firstItem)} | ${totalUnitCount} units | ${weight}kg | average quality ${averageQuality}%`;
        rows =
          base.createRowElementsForCraftingItems(
            this.state,
            this.props,
            { items: this.props.item.stackedItems },
            () => {},
            this.props.bodyWidth,
          ).rows;
        rowData =
          base.createRowElementsForCraftingItems(
            this.state,
            this.props,
            { items: this.props.item.stackedItems },
            () => {},
            this.props.bodyWidth,
          ).rowData;
        break;
      default:
        header = `${firstItem && getItemDefinitionName(firstItem)} | ${this.props.item.stackedItems &&
          this.props.item.stackedItems.length}`;
        rows = base.createRowElements(
          this.state,
          this.props,
          { items: this.props.item.stackedItems },
          this.props.onDropOnZone,
          () => {},
          this.props.bodyWidth,
        ).rows;
        rowData = base.createRowElements(
          this.state,
          this.props,
          { items: this.props.item.stackedItems },
          this.props.onDropOnZone,
          () => {},
          this.props.bodyWidth,
        ).rowData;
    }

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

  public shouldComponentUpdate(nextProps: CraftingContainerProps, nextState: CraftingContainerState) {
    return !_.isEqual(this.props.item, nextProps.item) ||
      !_.isEqual(this.props.inventoryItems, nextProps.inventoryItems) ||
      !_.isEqual(this.props.containerIdToDrawerInfo, nextProps.containerIdToDrawerInfo) ||
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
  private internalInit = (state: CraftingContainerState, props: CraftingContainerProps) => {
    if (!this.contentRef) return;
    const rowsAndSlots = calcRows(this.contentRef.getBoundingClientRect(), slotDimensions,
      Math.max(CraftingContainer.minSlots, props.item.stackedItems.length), props.slotsPerRow);
    const rowData = {
      slotsPerRow: props.slotsPerRow,
      ...rowsAndSlots,
    };
    return base.distributeItems(rowData, { items: [] },  state, props);
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

export default CraftingContainer;
