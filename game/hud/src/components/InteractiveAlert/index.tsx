/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { SubscriptionResult } from '@csegames/camelot-unchained/lib/graphql/subscription';
import { remove } from '@csegames/camelot-unchained/lib/utils/arrayUtils';
import {
  IInteractiveAlert,
  TradeAlert,
  GroupAlert,
  ProgressionAlert,
} from '@csegames/camelot-unchained/lib/graphql/schema';

import { query, QueryData } from './graphql/query';
import { subscription, SubscriptionData } from './graphql/subscription';
import { TradeAlertView, handleNewTradeAlert, removeTradeInvite } from './TradeAlert';
import { GroupAlertView, handleNewGroupAlert } from './GroupAlert';
import { ProgressionAlertView } from './ProgressionAlert';

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
      <GraphQL
        query={query}
        onQueryResult={this.handleQueryResult}
        subscription={subscription}
        subscriptionHandler={this.handleSubscription}
      >
        {() =>
        <Container>
          {!_.isEmpty(this.state.alerts) ? (
            this.state.alerts.map((a, i) => {
              switch (a.category) {
                case 'Trade': {
                  return <TradeAlertView key={i} alert={a as TradeAlert} remove={this.removeAlert} />;
                }
                case 'Group': {
                  return <GroupAlertView key={i} alert={a as GroupAlert} remove={this.removeAlert} />;
                }
                case 'Progression': {
                  return <ProgressionAlertView key={i} alert={a as ProgressionAlert} remove={this.removeAlert} />;
                }
              }
              return null;
            })
          ) : null}
          </Container>
        }
      </GraphQL>
    );
  }

  private removeAlert = (alert: IInteractiveAlert) => {
    let alerts = [...this.state.alerts];
    switch (alert.category) {
      case 'Trade': {
        alerts = removeTradeInvite(this.state.alerts, alert as TradeAlert).alerts;
        break;
      }

      default: {
        alerts = remove(alerts, alert);
        break;
      }
    }
    this.setState({ alerts });
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
          this.setState(handleNewTradeAlert(this.state.alerts, alert as TradeAlert));
          break;
        case 'Group':
          handleNewGroupAlert(this, alert as GroupAlert);
          break;
      }
    }
  }
}
