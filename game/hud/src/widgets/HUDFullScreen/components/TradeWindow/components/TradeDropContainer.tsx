/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';
import { webAPI } from '@csegames/camelot-unchained';

import LockedOverlay from './LockedOverlay';
import withDragAndDrop, { DragAndDropInjectedProps, DragEvent } from '../../../../../components/DragAndDrop/DragAndDrop';
import InventoryRow from '../../Inventory/components/InventoryRow';
import { SlotType, InventorySlotItemDef, SlotItemDefType } from '../../../lib/itemInterfaces';
import { InventoryDataTransfer } from '../../../lib/itemEvents';
import { InventoryItem, SecureTradeState } from 'gql/interfaces';
import {
  calcTradingSlots,
  getItemMapID,
  isContainerItem,
  isCraftingItem,
  isStackedItem,
  getContainerInfo,
  getItemWithNewUnitCount,
} from '../../../lib/utils';
import { InventoryContext } from '../../ItemShared/InventoryContext';

declare const toastr: any;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex: 1;
`;

const LeftBG = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 47px;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 0;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-size: cover;
  z-index: 0;
`;

const ContainerOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const LockedContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 36px;
  z-index: 1;
`;

const FooterItem = styled.div`
  display: flex;
  color: ${(props: any) =>  props.useGrayBG ? '#999999' : '#998675'};
  font-family: Caudex;
  margin-right: 10px;
`;

const FooterIcon = styled.span`
  margin-right: 5px;
`;

interface TradeStackItem extends InventoryItem.Fragment {
  tradeStackId: string;
}

export interface InjectedTradeDropContainerProps {
  stackGroupIdToItemIDs: {[id: string]: string[]};
  inventoryItems: InventoryItem.Fragment[];
}

export interface TradeDropContainerProps extends DragAndDropInjectedProps {
  id: 'myItems' | 'theirItems';
  tradeState: SecureTradeState;
  items: InventoryItem.Fragment[];
  bodyHeight: number;
  bodyWidth: number;
  onTradeItemsChange?: (items: InventoryItem.Fragment[]) => void;
  showTooltip: (item: SlotItemDefType, event: MouseEvent) => void;
  hideTooltip: () => void;
  useGrayBG?: boolean;
  getRef?: (ref: HTMLDivElement) => void;
}

export type TradeDropContainerComponentProps = InjectedTradeDropContainerProps & TradeDropContainerProps;

export interface TradeDropContainerState {
  backgroundColor: string;
  slotsPerRow: number;
}

class TradeContainer extends React.Component<TradeDropContainerComponentProps, TradeDropContainerState> {
  constructor(props: TradeDropContainerComponentProps) {
    super(props);
    this.state = {
      backgroundColor: 'transparent',
      slotsPerRow: 0,
    };
  }

  public onDragEnter() {
    this.setState({ backgroundColor: 'rgba(46, 213, 80, 0.4)' });
  }

  public onDragLeave() {
    this.setState({ backgroundColor: 'transparent' });
  }

  public onDrop(e: DragEvent<InventoryDataTransfer, TradeDropContainerComponentProps>) {
    this.onDropOnZone(e);
  }

  public render() {
    const { items, getRef, bodyWidth, useGrayBG, tradeState } = this.props;
    const rowItems = this.getTradeRowElements();
    const footerInfo = getContainerInfo(items);

    return (
      <Container>
        <BackgroundImage src={useGrayBG ? 'images/inventory/bag-bg-grey.png' : 'images/inventory/bag-bg.png'} />
        <Content ref={getRef}>
          {(tradeState === 'Locked' || tradeState === 'Confirmed' || tradeState === 'None') &&
            <LockedContainer>
              <LockedOverlay state={tradeState} />
            </LockedContainer>
          }
          <ContainerOverlay style={{ backgroundColor: this.state.backgroundColor }} />
          <InventoryRow
            items={rowItems || []}
            bodyWidth={bodyWidth}
            showTooltip={this.props.showTooltip}
            hideTooltip={this.props.hideTooltip}
            onRightClickItem={this.onRightClick}
            onDropOnZone={() => {}}
            syncWithServer={() => {}}
            onRightOrLeftItemAction={() => {}}
          />
        </Content>
        <Footer style={{ backgroundImage: `url(${useGrayBG ?
          'url(../images/inventory/bag-bottom-bg-grey.png) no-repeat' :
          'url(../images/inventory/bag-bottom-bg.png) no-repeat'})` }}>
          <FooterItem useGrayBG={useGrayBG}>
            <FooterIcon className={'icon-ui-bag'}></FooterIcon> {footerInfo.totalUnitCount}
          </FooterItem>
          <FooterItem useGrayBG={useGrayBG}>
            <FooterIcon className={'icon-ui-weight'}></FooterIcon> {footerInfo.weight}
          </FooterItem>
        </Footer>
        <LeftBG style={{ backgroundImage: `url(${useGrayBG ? '../images/inventory/bag-left-bg-grey.png' :
          '../images/inventory/bag-left-bg.png'})` }} />
      </Container>
    );
  }

  public componentDidUpdate(prevProps: TradeDropContainerComponentProps) {
    if (this.props.bodyHeight !== prevProps.bodyHeight || this.props.bodyWidth !== prevProps.bodyWidth) {
      this.initSlots();
    }
  }

  private initSlots = () => {
    const bodyDimensions = { height: this.props.bodyHeight, width: this.props.bodyWidth };
    const { slotsPerRow } = calcTradingSlots(bodyDimensions, 62);
    this.setState({ slotsPerRow });
  }

  private onRightClick = async (item: InventoryItem.Fragment | TradeStackItem) => {
    if (this.props.id === 'myItems' && this.props.tradeState === 'ModifyingItems') {
      try {
        const tradeItem = { ItemID: (item as TradeStackItem).tradeStackId || item.id, UnitCount: item.stats.item.unitCount };
        const res = await webAPI.SecureTradeAPI.RemoveItem(
          webAPI.defaultConfig,
          game.shardID,
          game.selfPlayerState.characterID,
          tradeItem.ItemID,
          tradeItem.UnitCount,
        );
        if (res.ok) {
          let tradeItems = [...this.props.items];
          tradeItems = _.filter(tradeItems, _tradeItem => _tradeItem.id !== item.id);
          this.props.onTradeItemsChange(tradeItems);
        } else {
          const parsedRes = webAPI.parseResponseData(res);
          toastr.error(parsedRes.FieldCodes[0].Message, parsedRes.Message, { timeout: 2500 });
        }
      } catch (err) {
        toastr.error('There was an error!', 'Oh No!!', { timeout: 2500 });
      }
    }
  }

  private onDropOnZone = (e: DragEvent<InventoryDataTransfer, TradeDropContainerComponentProps>) => {
    if (this.props.id === 'myItems') {
      if (isCraftingItem(e.dataTransfer.item)) {
        this.moveStackItems(e);
      } else {
        this.moveSingleItem(e);
      }
    }
  }

  private moveStackItems = async (e: DragEvent<InventoryDataTransfer, TradeDropContainerComponentProps>) => {
    try {
      const tradeItems: InventoryItem.Fragment[] = [];
      const stackId = getItemMapID(e.dataTransfer.item);

      if (e.dataTransfer.fullStack && !_.find(this.props.items, _item => _item.id === e.dataTransfer.item.id)) {
        this.props.stackGroupIdToItemIDs[stackId].forEach((_stackId) => {
          const stackItem = _.find(this.props.inventoryItems, _item => _item.id === _stackId);
          tradeItems.push(stackItem);
        });
      } else {
        tradeItems.push({
          ...e.dataTransfer.item,
          stats: {
            ...e.dataTransfer.item.stats,
            item: {
              ...e.dataTransfer.item.stats.item,
              unitCount: e.dataTransfer.unitCount || e.dataTransfer.item.stats.item.unitCount,
            },
          },
        });
      }

      await tradeItems.forEach((_tradeItem) => {
        const tradeItem = { ItemID: _tradeItem.id, UnitCount: _tradeItem.stats.item.unitCount };
        const res = webAPI.SecureTradeAPI.AddItem(
          webAPI.defaultConfig,
          game.shardID,
          game.selfPlayerState.characterID,
          tradeItem.ItemID,
          tradeItem.UnitCount,
        );
        res.then((res) => {
          if (res.ok) {
            // Get new item id of partial stack
            const newItemId = utils.tryParseJSON<{ FieldCodes: { Result: webAPI.ModifySecureTradeResultCode } }>(res.data)
              .FieldCodes[0].Result.MovedItemIDs[0];

            const tradeItems = [...this.props.items] || [];
            const potentialItemIndex = _.findIndex(tradeItems, item => getItemMapID(item, { noPos: true }) ===
              getItemMapID(_tradeItem, { noPos: true }));
            if (potentialItemIndex !== -1) {
              // There is already an item up for trade that can be stacked with
              const item: TradeStackItem = {
                ...tradeItems[potentialItemIndex],
                tradeStackId: newItemId,
              };
              tradeItems[potentialItemIndex] =
                getItemWithNewUnitCount(item, item.stats.item.unitCount + _tradeItem.stats.item.unitCount);
            } else {
              // Item is it's own unique thing, just add item to tradeItems
              const item: TradeStackItem = {
                ..._tradeItem,
                tradeStackId: newItemId,
              };
              tradeItems.push(item);
            }
            this.props.onTradeItemsChange(tradeItems);
          } else {
            const parsedResData = webAPI.parseResponseData(res).data;
            toastr.error(parsedResData.FieldCodes[0].Message, parsedResData.Message, { timeout: 2500 });
          }
        });
      });
    } catch (err) {
      toastr.error('There was an error!', 'Oh No!!', { timeout: 2500 });
    }
  }

  private moveSingleItem = async (e: DragEvent<InventoryDataTransfer, TradeDropContainerComponentProps>) => {
    try {
      const tradeItem = { ItemID: e.dataTransfer.item.id, UnitCount: e.dataTransfer.item.stats.item.unitCount };
      const res = await webAPI.SecureTradeAPI.AddItem(
        webAPI.defaultConfig,
        game.shardID,
        game.selfPlayerState.characterID,
        tradeItem.ItemID,
        tradeItem.UnitCount,
      );
      if (res.ok) {
        const items = this.props.items || [];
        const newItems = [...items, e.dataTransfer.item];
        this.props.onTradeItemsChange(newItems);
      } else {
        const parsedResData = webAPI.parseResponseData(res).data;
        toastr.error(parsedResData.FieldCodes[0].Message, parsedResData.Message, { timeout: 2500 });
      }
    } catch (err) {
      toastr.error('There was an error!', 'Oh No!!', { timeout: 2500 });
    }
  }

  private getTradeRowElements = () => {
    const rowItems: InventorySlotItemDef[] = [];
    const items = this.props.items || [];

    for (let i = 0; i < this.state.slotsPerRow; i++) {
      const itemDef = items[i];
      if (!itemDef) {
        rowItems.push({
          slotType: SlotType.Empty,
          icon: ' ',
          slotIndex: { position: i, location: 'trade' },
          disableDrag: true,
          disableDrop: true,
          disableContextMenu: true,
          disableEquip: true,
        });
        continue;
      }

      if (isContainerItem(itemDef)) {
        rowItems.push({
          slotType: SlotType.Container,
          icon: itemDef.staticDefinition.iconUrl,
          itemID: itemDef.id,
          item: itemDef,
          slotIndex: { position: i, location: 'trade' },
          disableDrag: true,
          disableDrop: true,
          disableContextMenu: true,
          disableEquip: true,
        });
        continue;
      }

      if (isCraftingItem(itemDef)) {
        rowItems.push({
          slotType: SlotType.CraftingContainer,
          icon: itemDef.staticDefinition.iconUrl,
          groupStackHashID: itemDef.id,
          item: itemDef,
          slotIndex: { position: i, location: 'trade' },
          disableCraftingContainer: true,
          disableDrag: true,
          disableDrop: true,
          disableContextMenu: true,
          disableEquip: true,
        });
        continue;
      }

      if (isStackedItem(itemDef)) {
        rowItems.push({
          slotType: SlotType.Stack,
          icon: itemDef.staticDefinition.iconUrl,
          itemID: itemDef.id,
          item: itemDef,
          slotIndex: { position: i, location: 'inventory' },
          disableDrag: true,
          disableDrop: true,
          disableContextMenu: true,
          disableEquip: true,
        });
        continue;
      }

      rowItems.push({
        slotType: SlotType.Standard,
        icon: itemDef.staticDefinition.iconUrl,
        itemID: itemDef.id,
        item: itemDef,
        slotIndex: { position: i, location: 'inventory' },
        disableDrag: true,
        disableDrop: true,
        disableContextMenu: true,
        disableEquip: true,
      });
    }

    return rowItems;
  }
}

const TradeDropContainer = withDragAndDrop<TradeDropContainerComponentProps>(
  (props: TradeDropContainerProps) => {
    return {
      id: props.id,
      fullDimensions: true,
      dataKey: 'inventory-items',
      dropTarget: props.tradeState !== 'Locked' && props.tradeState !== 'None' && props.id === 'myItems',
      disableDrag: true,
    };
  },
)(TradeContainer);

class TradeDropContainerWithInjectedContext extends React.Component<TradeDropContainerProps> {
  public render() {
    return (
      <InventoryContext.Consumer>
        {({ inventoryItems, stackGroupIdToItemIDs }) => {
          return (
            <TradeDropContainer
              {...this.props}
              stackGroupIdToItemIDs={stackGroupIdToItemIDs}
              inventoryItems={inventoryItems}
            />
          );
        }}
      </InventoryContext.Consumer>
    );
  }
}

export default TradeDropContainerWithInjectedContext;
