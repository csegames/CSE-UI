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
  border-image-slice: 1;
  background: url(images/ui/interactive-alert/alert-bg.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: fixed;
  top: -2px;
  width: 700px;
  height: 140px;
  left: 50%;
  margin-left: -350px;
  -webkit-transition: height 1s;
  transition: height 1s;
  &:before {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    content: '';
    position: absolute;
    left: 50px;
    right: 50px;
    top: 0;
    height: 10px;
    background-image: url(images/ui/interactive-alert/divider-top.png);
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
}
  &:after {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    content: '';
    position: absolute;
    left: 50px;
    right: 50px;
    bottom: -2px;
    height: 10px;
    background-image: url(images/ui/interactive-alert/divider-bottom.png);
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
}
`;



export interface Props {
  height: number;
}

export interface State {
  alerts: IInteractiveAlert[];
  shown: boolean;
}

export class InteractiveAlertView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      alerts: [],
      shown: true,
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
        <Container height={this.state.shown ? '140' : '0'}>
          {!_.isEmpty(this.state.alerts) ? (
            this.state.alerts.map((a, i) => {
              switch (a.category) {
                case 'Trade': {
                  return <TradeAlertView key={i}
                                         alert={a as TradeAlert}
                                         remove={this.removeAlert} />;
                }
                case 'Group': {
                  return <GroupAlertView key={i}
                                         alert={a as GroupAlert}
                                         remove={this.removeAlert} />;
                }
                case 'Progression': {
                  return <ProgressionAlertView key={i}
                                               alert={a as ProgressionAlert}
                                               remove={this.removeAlert} />;
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

  // Comments are for animations in progress
  // public shouldComponentUpdate(nextProps: Props) {
  //   return !_.isEqual(nextProps.height, this.props.height);
  // }
  //
  // public toggleShown = () => {
  //   this.setState(prevState => ({ shown: !prevState.shown }));
  // }

  private removeAlert = (alert: IInteractiveAlert) => {
    let alerts = [...this.state.alerts];
    switch (alert.category) {
      case 'Trade': {
        alerts = removeTradeInvite(this.state.alerts, alert as TradeAlert).alerts;
        // this.toggleShown();
        break;
      }

      default: {
        alerts = remove(alerts, alert);
        // this.toggleShown();
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
