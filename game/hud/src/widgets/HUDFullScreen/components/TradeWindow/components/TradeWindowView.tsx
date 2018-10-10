/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { webAPI } from '@csegames/camelot-unchained';

import TabHeader from '../../TabHeader';
import TabSubHeader from '../../TabSubHeader';
import TradeWindowMidSection from './TradeWindowMidSection';
import TradeDropContainer from './TradeDropContainer';
import { SlotItemDefType } from '../../../lib/itemInterfaces';
import { isStackedItem, isCraftingItem, isContainerItem, getItemMapID } from '../../../lib/utils';
import { ContainerIdToDrawerInfo, getContainerIdToDrawerInfo } from '../../ItemShared/InventoryBase';
import { InventoryItem, SecureTradeState } from 'gql/interfaces';

declare const toastr: any;

const Container = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const BackgroundImage = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const CancelButton = styled('div')`
  position: absolute;
  top: 9px;
  right: 20px;
  z-index: 99;s
  pointer-events: all;
  cursor: pointer;
  font-family: Caudex;
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 7px 25px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #CEAF82;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-right-width: 0px;
  border-style: solid;
  border-image: linear-gradient(to bottom left, #634833, transparent) 10% 1%;
  border-image-slice: 0.5;
  border-width: 1px;
  border-style: solid;
  -webkit-filter: brightness(100%);
  -webkit-transition: -webkit-filter 0.2s;
  &:hover {
    -webkit-filter: brightness(130%);
  }
`;

const TradeSection = styled('div')`
  display: flex;
  flex: 1;
  width: 100%;
  height: calc(50% - 110px);
`;

export interface TradeWindowViewProps {
  myTradeState: SecureTradeState;
  theirTradeState: SecureTradeState;
  onMyTradeStateChange: (newTradeState: SecureTradeState) => void;
  onTheirTradeStateChange: (newTradeState: SecureTradeState) => void;
  myTradeItems: InventoryItem.Fragment[];
  theirTradeItems: InventoryItem.Fragment[];
  onMyTradeItemsChange: (items: InventoryItem.Fragment[]) => void;
  showTooltip: (item: SlotItemDefType, event: MouseEvent) => void;
  hideTooltip: () => void;
}

export interface TradeWindowViewState {
  dropContainerWidth: number;
  dropContainerHeight: number;
  theirContainerIdToDrawerInfo: ContainerIdToDrawerInfo;
  theirStackGroupIdToItemIDs: {[id: string]: string[]};
}

class TradeWindowView extends React.Component<TradeWindowViewProps, TradeWindowViewState> {
  private closeTradeListener: any;
  private tradeDropContainerRef: HTMLDivElement;
  constructor(props: TradeWindowViewProps) {
    super(props);
    this.state = {
      dropContainerWidth: 0,
      dropContainerHeight: 0,
      theirContainerIdToDrawerInfo: {},
      theirStackGroupIdToItemIDs: {},
    };
  }
  public render() {
    const subHeaderClassName = this.props.myTradeState === 'Confirmed' ? 'confirmed' : '';
    return (
      <Container>
        <BackgroundImage src={'images/inventory/bag-bg.png'} />
        <CancelButton onClick={this.onCancelClick}>Cancel</CancelButton>
        <TabHeader title='TRADE' />
        <TabSubHeader text='Your Offer' className={subHeaderClassName} />
        <TradeSection>
          <TradeDropContainer
            id={'myItems'}
            items={this.props.myTradeItems}
            onTradeItemsChange={this.props.onMyTradeItemsChange}
            tradeState={this.props.myTradeState}
            getRef={this.setTradeDropRef}
            bodyWidth={this.state.dropContainerWidth}
            bodyHeight={this.state.dropContainerHeight}
            showTooltip={this.props.showTooltip}
            hideTooltip={this.props.hideTooltip}
          />
        </TradeSection>
        <TradeWindowMidSection
          myTradeState={this.props.myTradeState}
          theirTradeState={this.props.theirTradeState}
          onMyTradeStateChanged={this.props.onMyTradeStateChange}
          onTheirTradeStateChanged={this.props.onTheirTradeStateChange}
        />
        <TabSubHeader text='You will receive' useGrayBG={true} className={subHeaderClassName} />
        <TradeSection>
          <TradeDropContainer
            id={'theirItems'}
            useGrayBG={true}
            items={this.props.theirTradeItems}
            tradeState={this.props.theirTradeState}
            bodyHeight={this.state.dropContainerHeight}
            bodyWidth={this.state.dropContainerWidth}
            showTooltip={this.props.showTooltip}
            hideTooltip={this.props.hideTooltip}
          />
        </TradeSection>
      </Container>
    );
  }

  public componentDidMount() {
    this.closeTradeListener = game.on('cancel-trade', this.onCancelClick);
    window.addEventListener('resize', this.setDropContainerDimensions);
    setTimeout(() => {
      this.setDropContainerDimensions();
    }, 1);
  }

  public componentDidUpdate(prevProps: TradeWindowViewProps, prevState: TradeWindowViewState) {
    if (!_.isEqual(this.props.theirTradeItems, prevProps.theirTradeItems)) {
      this.updateTheirContainerAndStackData();
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.setDropContainerDimensions);

    if (this.closeTradeListener) {
      game.off(this.closeTradeListener);
      this.closeTradeListener = null;
    }
  }

  private setDropContainerDimensions = () => {
    const { clientWidth, clientHeight } = this.tradeDropContainerRef;
    if (clientWidth !== this.state.dropContainerWidth || clientHeight !== this.state.dropContainerHeight) {
      this.setState({ dropContainerWidth: clientWidth, dropContainerHeight: clientHeight });
    }
  }

  private setTradeDropRef = (r: HTMLDivElement) => {
    if (!this.tradeDropContainerRef) {
      this.tradeDropContainerRef = r;
    }
  }

  private onCancelClick = async () => {
    try {
      const res = await webAPI.SecureTradeAPI.AbortSecureTrade(
        webAPI.defaultConfig,
        game.shardID,
        game.selfPlayerState.characterID,
      );
      if (res.ok) {
        // Handle aborting trade
        game.trigger('passivealert--newmessage', 'Trade Canceled');
        this.closeTradeWindow();
        this.props.onMyTradeStateChange(SecureTradeState.None);
        this.props.onMyTradeItemsChange([]);
        this.props.onTheirTradeStateChange(SecureTradeState.None);
      } else {
        const parsedResData = webAPI.parseResponseData(res).data;
        toastr.error(parsedResData.FieldCodes[0].Message, parsedResData.Message, { timeout: 2500 });
      }
    } catch (err) {
      toastr.error('There was an error!', 'Oh no!!', { timeout: 2500 });
    }
  }

  private updateTheirContainerAndStackData = () => {
    const items = this.props.theirTradeItems;
    const containerItems: InventoryItem.Fragment[] = [];
    const theirStackGroupIdToItemIDs: {[id: string]: string[]} = {};

    items.forEach((item) => {
      if (isContainerItem(item)) {
        containerItems.push(item);

        // Find nested containers
        item.containerDrawers.forEach((drawers) => {
          drawers.containedItems.forEach((_item) => {
            if (isContainerItem(_item as InventoryItem.Fragment)) {
              containerItems.push(_item as InventoryItem.Fragment);
            }
          });
        });
      }

      if (isStackedItem(item) || isCraftingItem(item)) {
        const stackId = getItemMapID(item, 0, true);
        if (theirStackGroupIdToItemIDs[stackId]) {
          theirStackGroupIdToItemIDs[stackId].push(item.id);
        } else {
          theirStackGroupIdToItemIDs[stackId] = [item.id];
        }
      }
    });

    const theirContainerIdToDrawerInfo = getContainerIdToDrawerInfo(containerItems, {}).newContainerIdToDrawerInfo;

    if (!_.isEqual(theirStackGroupIdToItemIDs, this.state.theirStackGroupIdToItemIDs) ||
        !_.isEqual(theirContainerIdToDrawerInfo, this.state.theirContainerIdToDrawerInfo)) {
      this.setState((state) => {
        return {
          ...state,
          theirStackGroupIdToItemIDs,
          theirContainerIdToDrawerInfo,
        };
      });
    }
  }

  private closeTradeWindow = () => {
    game.trigger('hudnav--navigate', 'trade', false);
  }
}

export default TradeWindowView;
