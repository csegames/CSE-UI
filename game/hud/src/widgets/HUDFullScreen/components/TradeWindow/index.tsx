/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { includes } from 'lodash';
import { client, events } from '@csegames/camelot-unchained';
import { CUQuery } from '@csegames/camelot-unchained/lib/graphql';
import {
  SecureTradeStatus,
  ISecureTradeUpdate,
  SecureTradeCompletedUpdate,
  SecureTradeItemUpdate,
  SecureTradeStateUpdate,
  SecureTradeState,
  SecureTradeDoneReason,
} from '@csegames/camelot-unchained/lib/graphql/schema';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { SubscriptionResult } from '@csegames/camelot-unchained/lib/graphql/subscription';

import TradeWindowView from './components/TradeWindowView';
import { FullScreenContext } from '../../lib/utils';
import { SlotItemDefType } from '../../lib/itemInterfaces';
import { InventoryItemFragment as ItemQueryFragment } from '../../graphql/fragments/strings/InventoryItemFragment';
import { InventoryItemFragment } from '../../../../gqlInterfaces';

type QueryType = {
  secureTrade: SecureTradeStatus;
};

const tradeQuery = `
  {
    secureTrade {
      myState
      myItems {
        ${ItemQueryFragment}
      }
      theirEntityID
      theirState
      theirItems {
        ${ItemQueryFragment}
      }
    }
  }
`;

const subscriptionQuery = `
  subscription {
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
          ${ItemQueryFragment}
        }
      }
    }
  }
`;
const subscriptionUrl =  `${client.apiHost}/graphql`.replace('http', 'ws');
const subscriptionInitPayload = {
  shardID: client.shardID,
  loginToken: client.loginToken,
  characterID: client.characterID,
};

type SubscriptionType = {
  secureTradeUpdates: ISecureTradeUpdate & SecureTradeCompletedUpdate & SecureTradeStateUpdate & SecureTradeItemUpdate;
};

export interface InjectedTradeWindowProps {
  isVisible: boolean;
  myTradeItems: InventoryItemFragment[];
  myTradeState: SecureTradeState;
}

export interface TradeWindowProps {
  showItemTooltip: (item: SlotItemDefType, event: MouseEvent) => void;
  hideItemTooltip: () => void;
  onMyTradeItemsChange: (myTradeItems: InventoryItemFragment[]) => void;
  onMyTradeStateChange: (tradeState: SecureTradeState) => void;
  onCloseFullScreen: () => void;
}

export type TradeWindowComponentProps = InjectedTradeWindowProps & TradeWindowProps;

export interface TradeWindowState {
  theirTradeState: SecureTradeState;
  theirTradeItems: InventoryItemFragment[];
}

class TradeWindow extends React.Component<TradeWindowComponentProps, TradeWindowState> {
  constructor(props: TradeWindowComponentProps) {
    super(props);
    this.state = {
      theirTradeState: 'None',
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
        {(graphql: GraphQLResult<QueryType>) => {
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
    if (this.props.myTradeState === 'Confirmed' && this.state.theirTradeState === 'ModifyingItems' &&
        prevState.theirTradeState === 'Locked') {
      this.props.onMyTradeStateChange('Locked');
    }
    if (this.props.myTradeState === 'Confirmed' && prevProps.myTradeState === 'Locked' &&
        this.state.theirTradeState === 'Confirmed' && prevState.theirTradeState === 'Confirmed') {
      // Trade is complete
      this.onTradeComplete('Completed');
    }
  }

  private handleQueryResult = (result: GraphQLResult<Pick<CUQuery, 'secureTrade'>>) => {
    const resultData: Pick<CUQuery, 'secureTrade'> = typeof result.data === 'string' ?
      JSON.parse(result.data) : result.data;

    if (resultData && resultData.secureTrade) {
      this.props.onMyTradeStateChange(resultData.secureTrade.myState);
      this.props.onMyTradeItemsChange((resultData.secureTrade.myItems || []) as any);
      this.onTheirTradeStateChange(resultData.secureTrade.theirState);
      this.onTheirTradeItemsChange((resultData.secureTrade.theirItems) as any);
    }
  }

  private handleSubscription = (result: SubscriptionResult<SubscriptionType>, data: QueryType) => {
    if (!result.ok || !result.data) return data;
    const resultData = result.data;

    switch (resultData.secureTradeUpdates.category) {
      case 'StateUpdate': {
        this.onTheirTradeStateChange(resultData.secureTradeUpdates.otherEntityState);
        break;
      }
      case 'ItemUpdate': {
        this.onTheirTradeItemsChange(resultData.secureTradeUpdates.otherEntityItems as any[]);
        break;
      }
      case 'Complete': {
        this.onTradeComplete(resultData.secureTradeUpdates.reason);
        break;
      }
    }
  }

  private onTradeComplete = (reason: SecureTradeDoneReason) => {
    this.props.onMyTradeStateChange('None');
    this.onTheirTradeStateChange('None');

    // Clear out trade items
    this.props.onMyTradeItemsChange([]);
    this.onTheirTradeItemsChange([]);

    events.fire('hudnav--navigate', 'trade', false);
    this.sendCompleteMessage(reason);
  }

  private sendCompleteMessage = (reason: SecureTradeDoneReason) => {
    switch (reason) {
      case 'Completed': {
        events.fire('passivealert--newmessage', 'Trade Complete');
        break;
      }
      case 'Canceled': {
        events.fire('passivealert--newmessage', 'Trade Canceled');
        break;
      }
    }
  }

  private onTheirTradeStateChange = (newTradeState: SecureTradeState) => {
    this.setState({ theirTradeState: newTradeState });
  }

  private onTheirTradeItemsChange = (newTradeItems: InventoryItemFragment[]) => {
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
