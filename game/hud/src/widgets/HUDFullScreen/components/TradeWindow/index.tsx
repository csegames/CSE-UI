/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { includes } from 'lodash';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { SubscriptionResult } from '@csegames/camelot-unchained/lib/graphql/subscription';

import TradeWindowView from './components/TradeWindowView';
import { FullScreenContext } from '../../lib/utils';
import { SlotItemDefType } from '../../lib/itemInterfaces';
import { InventoryItemFragment } from 'gql/fragments/InventoryItemFragment';
import {
  InventoryItem,
  TradeWindowQuery,
  TradeWindowSubscription,
  SecureTradeState,
  SecureTradeDoneReason,
  SecureTradeUpdateCategory,
} from 'gql/interfaces';

const tradeQuery = gql`
  query TradeWindowQuery {
    secureTrade {
      myState
      myItems {
        ...InventoryItem
      }
      theirEntityID
      theirState
      theirItems {
        ...InventoryItem
      }
    }
  }
  ${InventoryItemFragment}
`;

const subscriptionQuery = gql`
  subscription TradeWindowSubscription {
    secureTradeUpdates {
      category
      targetID
      tradeID

      ... on SecureTradeCompletedUpdate {
        reason
      }

      ... on SecureTradeStateUpdate {
        otherEntityState
      }

      ... on SecureTradeItemUpdate {
        otherEntityItems {
          ...InventoryItem
        }
      }
    }
  }
  ${InventoryItemFragment}
`;
const subscriptionUrl =  game.webAPIHost + '/graphql'.replace('http', 'ws');
const subscriptionInitPayload = {
  shardID: game.shardID,
  Authorization: `Bearer ${game.accessToken}`,
  characterID: game.selfPlayerState.characterID,
};

export interface InjectedTradeWindowProps {
  isVisible: boolean;
  myTradeItems: InventoryItem.Fragment[];
  myTradeState: SecureTradeState;
}

export interface TradeWindowProps {
  showItemTooltip: (item: SlotItemDefType, event: MouseEvent) => void;
  hideItemTooltip: () => void;
  onMyTradeItemsChange: (myTradeItems: InventoryItem.Fragment[]) => void;
  onMyTradeStateChange: (tradeState: SecureTradeState) => void;
  onCloseFullScreen: () => void;
}

export type TradeWindowComponentProps = InjectedTradeWindowProps & TradeWindowProps;

export interface TradeWindowState {
  theirTradeState: SecureTradeState;
  theirTradeItems: InventoryItem.Fragment[];
}

class TradeWindow extends React.Component<TradeWindowComponentProps, TradeWindowState> {
  constructor(props: TradeWindowComponentProps) {
    super(props);
    this.state = {
      theirTradeState: SecureTradeState.None,
      theirTradeItems: [],
    };
  }

  public render() {
    return this.props.isVisible ? (
      <GraphQL
        query={tradeQuery}
        onQueryResult={this.handleQueryResult}
        subscription={{
          query: subscriptionQuery,
          url: subscriptionUrl,
          initPayload: subscriptionInitPayload,
        }}
        subscriptionHandler={this.handleSubscription}>
        {(graphql: GraphQLResult<TradeWindowQuery.Query>) => {
          return (
            <TradeWindowView
              myTradeState={this.props.myTradeState}
              myTradeItems={this.props.myTradeItems}
              onMyTradeItemsChange={this.props.onMyTradeItemsChange}
              onMyTradeStateChange={this.props.onMyTradeStateChange}
              theirTradeItems={this.state.theirTradeItems}
              theirTradeState={this.state.theirTradeState}
              onTheirTradeStateChange={this.onTheirTradeStateChange}
              showTooltip={this.props.showItemTooltip}
              hideTooltip={this.props.hideItemTooltip}
            />
          );
        }}
      </GraphQL>
    ) : null;
  }

  public componentDidUpdate(prevProps: TradeWindowComponentProps, prevState: TradeWindowState) {
    if (
      this.props.myTradeState === SecureTradeState.Confirmed &&
      this.state.theirTradeState === SecureTradeState.ModifyingItems &&
      prevState.theirTradeState === SecureTradeState.Locked
    ) {
      this.props.onMyTradeStateChange(SecureTradeState.Locked);
    }
    if (
      this.props.myTradeState === SecureTradeState.Confirmed &&
      prevProps.myTradeState === SecureTradeState.Locked &&
      this.state.theirTradeState === SecureTradeState.Confirmed &&
      prevState.theirTradeState === SecureTradeState.Confirmed
    ) {
      // Trade is complete
      this.onTradeComplete((SecureTradeDoneReason.Completed));
    }
  }

  private handleQueryResult = (result: GraphQLResult<TradeWindowQuery.Query>) => {
    const resultData: TradeWindowQuery.Query = typeof result.data === 'string' ?
      JSON.parse(result.data) : result.data;

    if (resultData && resultData.secureTrade) {
      this.props.onMyTradeStateChange(resultData.secureTrade.myState);
      this.props.onMyTradeItemsChange((resultData.secureTrade.myItems || []) as any);
      this.onTheirTradeStateChange(resultData.secureTrade.theirState);
      this.onTheirTradeItemsChange((resultData.secureTrade.theirItems) as any);
    }
  }

  private handleSubscription = (
    result: SubscriptionResult<TradeWindowSubscription.Subscription>,
    data: TradeWindowQuery.Query,
  ) => {
    if (!result.ok || !result.data) return data;
    const resultData = result.data;

    switch (resultData.secureTradeUpdates.category) {
      case SecureTradeUpdateCategory.StateUpdate: {
        this.onTheirTradeStateChange(
          (resultData.secureTradeUpdates as TradeWindowSubscription.SecureTradeStateUpdateInlineFragment).otherEntityState,
        );
        break;
      }
      case SecureTradeUpdateCategory.ItemUpdate: {
        this.onTheirTradeItemsChange(
          (
            resultData.secureTradeUpdates as TradeWindowSubscription.SecureTradeItemUpdateInlineFragment
          ).otherEntityItems as any[],
        );
        break;
      }
      case SecureTradeUpdateCategory.Complete: {
        this.onTradeComplete(
          (resultData.secureTradeUpdates as TradeWindowSubscription.SecureTradeCompletedUpdateInlineFragment).reason,
        );
        break;
      }
    }
  }

  private onTradeComplete = (reason: SecureTradeDoneReason) => {
    this.props.onMyTradeStateChange(SecureTradeState.None);
    this.onTheirTradeStateChange(SecureTradeState.None);

    // Clear out trade items
    this.props.onMyTradeItemsChange([]);
    this.onTheirTradeItemsChange([]);

    game.trigger('hudnav--navigate', 'trade', false);
    this.sendCompleteMessage(reason);
  }

  private sendCompleteMessage = (reason: SecureTradeDoneReason) => {
    switch (reason) {
      case SecureTradeDoneReason.Completed: {
        game.trigger('passivealert--newmessage', 'Trade Complete');
        break;
      }
      case SecureTradeDoneReason.Canceled: {
        game.trigger('passivealert--newmessage', 'Trade Canceled');
        break;
      }
    }
  }

  private onTheirTradeStateChange = (newTradeState: SecureTradeState) => {
    this.setState({ theirTradeState: newTradeState });
  }

  private onTheirTradeItemsChange = (newTradeItems: InventoryItem.Fragment[]) => {
    this.setState({ theirTradeItems: newTradeItems || [] });
  }
}

class TradeWindowWithInjectedContext extends React.Component<TradeWindowProps> {
  public render() {
    return (
      <FullScreenContext.Consumer>
        {({ myTradeItems, myTradeState, visibleComponentLeft, visibleComponentRight }) => {
          return (
            <TradeWindow
              {...this.props}
              isVisible={includes(visibleComponentLeft, 'trade') || includes(visibleComponentRight, 'trade')}
              myTradeItems={myTradeItems}
              myTradeState={myTradeState}
            />
          );
        }}
      </FullScreenContext.Consumer>
    );
  }
}

export default TradeWindowWithInjectedContext;
