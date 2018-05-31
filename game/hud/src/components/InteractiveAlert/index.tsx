/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { client, events, webAPI } from '@csegames/camelot-unchained';
import { CUQuery, CUSubscription } from '@csegames/camelot-unchained/lib/graphql';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { SubscriptionResult } from '@csegames/camelot-unchained/lib/graphql/subscription';
import { IInteractiveAlert, TradeAlert } from '@csegames/camelot-unchained/lib/graphql/schema';
import InteractiveAlertView from './components/InteractiveAlertView';

declare const toastr: any;

const query = `
  {
    myInteractiveAlerts {
      category
      targetID
      ... on TradeAlert {
        otherEntityID
        otherName
        kind
      }
    }
  }
`;

const subscriptionQuery = `
  subscription {
    interactiveAlerts {
      category
      targetID
      ... on TradeAlert {
        targetID
        secureTradeID
        otherEntityID
        otherName
        kind
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

export type AlertType = IInteractiveAlert & TradeAlert;

export interface Alert {
  render: () => any;
}

export interface Props {
}

export interface State {
  alerts: AlertType[];
}

class InteractiveAlert extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      alerts: [],
    };
  }

  public render() {
    console.log('render: InteractiveAlert');
    return (
      <GraphQL
        query={query}
        onQueryResult={this.handleQueryResult}
        subscription={{
          query: subscriptionQuery,
          url: subscriptionUrl,
          initPayload: subscriptionInitPayload,
        }}
        subscriptionHandler={this.handleSubscription}
      >
        {(result: GraphQLResult<Pick<CUQuery, 'myInteractiveAlerts'>>) => {
          return !_.isEmpty(this.state.alerts) ? (
            <InteractiveAlertView
              alert={this.state.alerts[0]}
              onTradeAccept={this.onTradeAccept}
              onTradeDecline={this.onTradeDecline}
            />
          ) : null;
        }}
      </GraphQL>
    );
  }

  private handleQueryResult = (result: GraphQLResult<Pick<CUQuery, 'myInteractiveAlerts'>>) => {
    const resultData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
    if (resultData && resultData.myInteractiveAlerts) {
      this.setState({ alerts: resultData.myInteractiveAlerts });
    }
  }

  private handleSubscription = (result: SubscriptionResult<Pick<CUSubscription, 'interactiveAlerts'>>,
                                data: Pick<CUQuery, 'myInteractiveAlerts'>) => {
    const newAlert: AlertType = typeof result.data === 'string' ? JSON.parse(result.data)['data'].interactiveAlerts :
      result.data['data'].interactiveAlerts;

    if (newAlert) {
      // Add new alert to alerts array
      const alerts: AlertType[] = [...(data.myInteractiveAlerts as AlertType[] || [])];
      if (newAlert.secureTradeID) {
        // Alert is a trade alert
        this.handleNewTradeAlert(newAlert);
      }
      return alerts;
    }
    return data;
  }

  private handleNewTradeAlert = (alert: TradeAlert) => {
    let alerts = [...this.state.alerts];
    const alertID = this.getTradeAlertID(alert);
    switch (alert.kind) {
      case 'NewInvite': {
        alerts.push(alert);
        break;
      }

      case 'InviteRevoked': {
        alerts = _.filter(alerts, _alert => this.getTradeAlertID(_alert) !== alertID);
        break;
      }

      case 'InviteAccepted': {
        alerts = _.filter(alerts, _alert => this.getTradeAlertID(_alert) !== alertID);
        this.openTradeWindow();
        break;
      }

      case 'InviteDeclined': {
        alerts = _.filter(alerts, _alert => this.getTradeAlertID(_alert) !== alertID);
        break;
      }

      default: {
        toastr.error('Received a Trade alert kind the UI does not handle yet', 'Oh No!!', { timeout: 3000 });
        break;
      }
    }

    this.setState({ alerts });
  }

  private getTradeAlertID = (alert: TradeAlert) => {
    return `${alert.category}-${alert.targetID}`;
  }

  private onTradeAccept = async (alert: TradeAlert) => {
    try {
      const res = await webAPI.SecureTradeAPI.AcceptInvite(
        webAPI.defaultConfig,
        client.loginToken,
        client.shardID,
        client.characterID,
        alert.otherEntityID,
      );
      if (res.ok) {
        // Open trade window
        this.openTradeWindow();
      } else {
        const data = JSON.parse(res.data);
        if (data.FieldCodes && data.FieldCodes.length > 0) {
          toastr.error(data.FieldCodes[0].Message, 'Oh No!', { timeout: 3000 });
        } else {
          // This means api server failed AcceptInvite request but did not provide a message about what happened
          toastr.error('An error occured', 'Oh No!', { timeout: 3000 });
        }
      }
    } catch (e) {
      toastr.error('There was an unhandled error', 'Oh No!!', { timeout: 5000 });
    }
  }

  private onTradeDecline = async (alert: TradeAlert) => {
    try {
      const res = await webAPI.SecureTradeAPI.RejectInvite(
        webAPI.defaultConfig,
        client.loginToken,
        client.shardID,
        client.characterID,
        alert.otherEntityID,
      );
      if (!res.ok) {
        const data = JSON.parse(res.data);
        if (data.FieldCodes && data.FieldCodes.length > 0) {
          toastr.error(data.FieldCodes[0].Message, 'Oh No!', { timeout: 3000 });
        } else {
          // This means api server failed DeclineInvite request but did not provide a message about what happened
          toastr.error('An error occured', 'Oh No!', { timeout: 3000 });
        }
      }
    } catch (e) {
      toastr.error('There was an unhandled error', 'Oh No!!', { timeout: 5000 });
    }
  }

  private openTradeWindow = () => {
    events.fire('hudnav--navigate', 'trade-left', true);
  }
}

export default InteractiveAlert;
