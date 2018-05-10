/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { SubscriptionResult } from '@csegames/camelot-unchained/lib/graphql/subscription';
import { IInteractiveAlert, TradeAlert, GroupAlert } from '@csegames/camelot-unchained/lib/graphql/schema';
import { remove } from '@csegames/camelot-unchained/lib/utils/arrayUtils';

import { query, QueryData } from './graphql/query';
import { subscription, SubscriptionData } from './graphql/subscription';
import { TradeAlertView, handleNewTradeAlert } from './TradeAlert';
import { GroupAlertView, handleNewGroupAlert } from './GroupAlert';

const Container = styled('div')`
  position: fixed;
  top: 0;
  width: 500px;
  height: 100px;
  margin-left: -250px;
  left: 50%;
`;

export interface Props {
}

export interface State {
  alerts: IInteractiveAlert[];
}

export class InteractiveAlertView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      alerts: [],
    };
  }

  public render() {
    return (
      <Container>
      {
        this.state.alerts.map((alert) => {
          switch (alert.category) {
            case 'Trade': return <TradeAlertView alert={alert as TradeAlert} remove={this.removeAlert} />;
            case 'Group': return <GroupAlertView alert={alert as GroupAlert} remove={this.removeAlert} />;
          }
          return null;
        })
      }
      <GraphQL
        query={query}
        onQueryResult={this.handleQueryResult}
        subscription={subscription}
        subscriptionHandler={this.handleSubscription}
      />
      </Container>
    );
  }

  private removeAlert = (alert: IInteractiveAlert) => {
    this.setState((state) => {
      return {
        ...state,
        alerts: remove(state.alerts, alert),
      };
    });
  }

  private handleQueryResult = (result: GraphQLResult<QueryData>) => {
    const resultData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
    if (resultData && resultData.myInteractiveAlerts) {
      this.setState({ alerts: resultData.myInteractiveAlerts });
    }
  }

  private handleSubscription = (result: SubscriptionResult<SubscriptionData>,
                                data: QueryData): QueryData => {
    if (!result.ok || !result.data || !result.data.interactiveAlerts) return data;

    // since the state of this component handles all the alerts, we won't add it to the QueryData.
    // just process and handle it here returning QueryData as it came in.
    const alert = result.data.interactiveAlerts;
    if (alert) {
      switch (alert.category) {
        case 'Trade':
          handleNewTradeAlert(this, alert as TradeAlert);
          break;
        case 'Group':
          handleNewGroupAlert(this, alert as GroupAlert);
          break;
      }
    }
    return data;
  }
}
