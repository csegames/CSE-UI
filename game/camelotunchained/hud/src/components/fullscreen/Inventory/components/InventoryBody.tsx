/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';
import { GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';


import * as base from 'fullscreen/ItemShared/InventoryBase';
import InventoryFooter from './InventoryFooter';
import { InventorySlotItemDef } from 'fullscreen/lib/itemInterfaces';
import eventNames, { InventoryDataTransfer, DropItemPayload } from 'fullscreen/lib/itemEvents';
import { InventoryContext, MoveInventoryItemPayload } from 'fullscreen/ItemShared/InventoryContext';
import { SLOT_DIMENSIONS } from './InventorySlot';
import {
  FullScreenContext,
  calcRowAndSlots,
  hasActiveFilterButtons,
  hasFilterText,
} from 'fullscreen/lib/utils';
import { InventoryItem, CUQuery, SecureTradeState } from 'gql/interfaces';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { getScaledValue } from 'hudlib/scale';

export interface InventoryBodyStyles {
  inventoryBody: React.CSSProperties;
  inventoryBodyInnerContainer: React.CSSProperties;
  inventoryContent: React.CSSProperties;
  backgroundImg: React.CSSProperties;
  refreshContainer: React.CSSProperties;
  refreshTitle: React.CSSProperties;
  refreshButton: React.CSSProperties;
}

// #region Container constants
const CONTAINER_PADDING_RIGHT = 10;
const CONTAINER_PADDING_TOP = 30;
// #endregion
const Container = styled.div`
  position: relative;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding-right: ${CONTAINER_PADDING_RIGHT}px;
  padding-top: ${CONTAINER_PADDING_TOP}px;

  @media (max-width: 2560px) {
    padding-right: ${CONTAINER_PADDING_RIGHT * MID_SCALE}px;
    padding-top: ${CONTAINER_PADDING_TOP * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding-right: ${CONTAINER_PADDING_RIGHT * HD_SCALE}px;
    padding-top: ${CONTAINER_PADDING_TOP * HD_SCALE}px;
  }
`;

const InnerContainer = styled.div`
  flex: 1;
  overflow: auto;
  -webkit-backface-visibility: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  -webkit-backface-visibility: hidden;
  align-items: center;
  position: relative;
`;

const RefreshContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
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

// #region RefreshTitle constants
const REFRESH_TITLE_FONT_SIZE = 70;
// #endregion
const RefreshTitle = styled.div`
  font-size: ${REFRESH_TITLE_FONT_SIZE}px;
  color: white;

  @media (max-width: 2560px) {
    font-size: ${REFRESH_TITLE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${REFRESH_TITLE_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region RefreshButton constants
const REFRESH_BUTTON_DIMENSIONS = 100;
const REFRESH_BUTTON_FONT_SIZE = 70;
// #endregion
const RefreshButton = styled.div`
  width: ${REFRESH_BUTTON_DIMENSIONS}px;
  height: ${REFRESH_BUTTON_DIMENSIONS}px;
  font-size: ${REFRESH_BUTTON_FONT_SIZE}px;
  color: white;
  cursor: pointer;
  &:hover {
    color: rgba(255, 255, 255, 0.7);
  }

  @media (max-width: 2560px) {
    width: ${REFRESH_BUTTON_DIMENSIONS * MID_SCALE}px;
    height: ${REFRESH_BUTTON_DIMENSIONS * MID_SCALE}px;
    font-size: ${REFRESH_BUTTON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${REFRESH_BUTTON_DIMENSIONS * HD_SCALE}px;
    height: ${REFRESH_BUTTON_DIMENSIONS * HD_SCALE}px;
    font-size: ${REFRESH_BUTTON_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface InjectedInventoryBodyProps {
  graphql: GraphQLResult<Pick<CUQuery, 'myInventory'>>;
  myTradeItems: InventoryItem.Fragment[];
  myTradeState: SecureTradeState;
  stackGroupIdToItemIDs: {[id: string]: string[]};
  inventoryItems: InventoryItem.Fragment[];
  containerIdToDrawerInfo: base.ContainerIdToDrawerInfo;
  slotNumberToItem: base.SlotNumberToItem;
  itemIdToInfo: base.ItemIDToInfo;
  itemIDToStackGroupID: {[id: string]: string};
  visibleComponentRight: string;
  visibleComponentLeft: string;
  invBodyDimensions: {
    width: number;
    height: number;
  };
  initializeInventory: () => void;
  onMoveInventoryItem: (payload: MoveInventoryItemPayload) => void;
  isUHD: boolean;
  uiContext: UIContext;
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
  private initBodyDimensionsTimeout: number;
  private dropItemHandler: EventHandle;
  private bodyRef: HTMLDivElement;

  // a counter that is incremented each time a new
  // stack group id is generated that is used in
  // generateing the stack group id

  constructor(props: InventoryBodyComponentProps) {
    super(props);
    this.state = {
      ...base.defaultInventoryBaseState(),
    };
    this.initializeSlotsData = _.debounce(this.initializeSlotsData, 50);
  }

  public render() {
    let slotNumberToItem = this.props.slotNumberToItem;
    let itemIdToInfo = this.props.itemIdToInfo;

    if (hasActiveFilterButtons(this.props.activeFilters) || hasFilterText(this.props.searchValue)) {
      // Is being filtered
      const filteredData = base.distributeFilteredItems({
        itemData: { items: this.props.inventoryItems },
        stackGroupIdToItemIDs: this.props.stackGroupIdToItemIDs,
        itemIdToInfo: this.props.itemIdToInfo,
        slotNumberToItem: this.props.slotNumberToItem,
        itemIDToStackGroupID: this.props.itemIDToStackGroupID,
        activeFilters: this.props.activeFilters,
        searchValue: this.props.searchValue,
        slotCount: this.state.slotCount,
      });
      slotNumberToItem = filteredData.slotNumberToItem;
      itemIdToInfo = filteredData.itemIdToInfo;
    }

    const { graphql } = this.props;
    const showLoading = graphql.loading;
    const showError = graphql.lastError && graphql.lastError !== 'OK';

    const { rows, rowData } = base.createRowElements({
      state: this.state,
      props: this.props,
      itemData: { items: this.props.inventoryItems },
      onDropOnZone: this.onDropOnZone,
      syncWithServer: this.props.graphql.refetch,
      bodyWidth: this.props.invBodyDimensions.width,
      myTradeItems: this.props.myTradeItems,
      myTradeState: this.props.myTradeState,
      stackGroupIdToItemIDs: this.props.stackGroupIdToItemIDs,
      slotNumberToItem,
      itemIdToInfo,
    });

    const buttonDisabled = base.allInventoryFooterButtonsDisabled(this.props);
    const removeAndPruneDisabled = buttonDisabled || (base.allInventoryFooterButtonsDisabled(this.props) ||
      base.inventoryFooterRemoveAndPruneButtonDisabled(rowData, this.props.invBodyDimensions.height));
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
        <InnerContainer ref={(r: HTMLDivElement) => this.bodyRef = r} className='cse-ui-scroller-thumbonly-brown'>
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
  }

  public componentDidMount() {
    this.initializeSlotsData();
    this.initBodyDimensionsTimeout = window.setTimeout(() => this.initializeBodyDimensions(true), 1);
    window.addEventListener('optimizedResize', () => {
      this.initializeBodyDimensions(true);
    });
    this.dropItemHandler = game.on(eventNames.onDropItem, (payload: DropItemPayload) =>
      base.makeDropItemRequest(payload.inventoryItem.item));
    game.itemPlacementMode.requestCancel();
  }

  public componentDidUpdate(prevProps: InventoryBodyComponentProps) {
    if (this.props.isUHD !== prevProps.isUHD ||
        (!_.isEqual(this.props.invBodyDimensions, prevProps.invBodyDimensions) && !this.props.graphql.loading)) {
      this.initializeSlotsData();
    }

    if (this.props.searchValue !== prevProps.searchValue) {
      this.bodyRef.scrollTop = 0;
    }
  }

  public componentWillUnmount() {
    this.dropItemHandler.clear();
    window.clearTimeout(this.initBodyDimensionsTimeout);
    window.removeEventListener('optimizedResize', () => this.initializeBodyDimensions(true));
  }

  private refetch = () => {
    this.props.graphql.refetch();
  }

  private initializeBodyDimensions = (override?: boolean) => {
    if (!this.bodyRef) return;
    if (!this.props.invBodyDimensions.width || !this.props.invBodyDimensions.height || override) {
      const { clientHeight, clientWidth } = this.bodyRef;
      this.props.onChangeInvBodyDimensions({ height: clientHeight, width: clientWidth });
    }
  }

  // set up rows from scratch / works as a re-initialize as well
  private initializeSlotsData = () => {
    this.setState(this.internalInit);
  }

  // should not be called outside of initializeSlotsData
  private internalInit = (state: InventoryBodyState) => {
    if (!this.bodyRef || !this.props.invBodyDimensions.height || !this.props.invBodyDimensions.width) {
      return;
    }
    const slotDimension = getScaledValue(this.props.uiContext, SLOT_DIMENSIONS);
    const itemCount = this.props.inventoryItems && this.props.inventoryItems.length;
    const rowsAndSlots = calcRowAndSlots(
      { height: this.props.invBodyDimensions.height, width: this.props.invBodyDimensions.width },
      slotDimension,
      Math.max(InventoryBody.minSlots, itemCount),
    );

    return {
      ...state,
      ...rowsAndSlots,
    };
  }

  private onDropOnZone = (dragItemData: InventoryDataTransfer,
                          dropZoneData: InventoryDataTransfer) => {
    // this function only gets called for inventory items, containers take care of their own state.
    this.setState((state, props) => {
      return props.onMoveInventoryItem({
        dragItemData,
        dropZoneData,
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
}

class InventoryBodyWithInjectedContext extends React.Component<InventoryBodyProps & base.InventoryBaseProps> {
  public render() {
    return (
      <UIContext.Consumer>
        {(uiContext: UIContext) => (
          <FullScreenContext.Consumer>
            {({
                myTradeItems,
                myTradeState,
                visibleComponentLeft,
                visibleComponentRight,
                invBodyDimensions,
              }) => {
              return (
                <InventoryContext.Consumer>
                  {({
                    graphql,
                    inventoryItems,
                    containerIdToDrawerInfo,
                    stackGroupIdToItemIDs,
                    slotNumberToItem,
                    itemIdToInfo,
                    itemIDToStackGroupID,
                    initializeInventory,
                    onMoveInventoryItem,
                  }) => {
                    return (
                      <InventoryBody
                        {...this.props}
                        isUHD={uiContext.isUHD()}
                        uiContext={uiContext}
                        graphql={graphql}
                        inventoryItems={inventoryItems}
                        myTradeItems={myTradeItems}
                        myTradeState={myTradeState}
                        stackGroupIdToItemIDs={stackGroupIdToItemIDs}
                        containerIdToDrawerInfo={containerIdToDrawerInfo}
                        slotNumberToItem={slotNumberToItem}
                        itemIdToInfo={itemIdToInfo}
                        itemIDToStackGroupID={itemIDToStackGroupID}
                        visibleComponentLeft={visibleComponentLeft}
                        visibleComponentRight={visibleComponentRight}
                        invBodyDimensions={invBodyDimensions}
                        initializeInventory={initializeInventory}
                        onMoveInventoryItem={onMoveInventoryItem}
                      />
                    );
                  }}
                </InventoryContext.Consumer>
              );
            }}
          </FullScreenContext.Consumer>
        )}
      </UIContext.Consumer>
    );
  }
}

export default InventoryBodyWithInjectedContext;
