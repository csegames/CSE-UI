/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { events } from '@csegames/camelot-unchained';
import { GraphQL } from '@csegames/camelot-unchained/lib/graphql/react';
import { SubscriptionResult } from '@csegames/camelot-unchained/lib/graphql/subscription';
import styled, { keyframes } from 'react-emotion';
import { PassiveAlert as IPassiveAlert } from 'gql/interfaces';

const fadeTime = 3000;
const maxNumAlerts = 5;

const fadeOut = keyframes`
  from { -webkit-opacity :1; }
  to { -webkit-opacity :0; }
`;

const PassiveAlertContainer = styled('div')`
  display: block;
  position: fixed;
  top: 12%;
  left: 20px;
  right: 0;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  text-align: center;
`;

const PassiveAlertItem = styled('li')`
  color: #FFFFFF;
  font-weight: medium;
  font-size: 13px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000 !important;
  -webkit-animation: ${fadeOut} 500ms ease-in-out;
  -webkit-animation-delay: ${fadeTime - 500}ms;
  animation: ${fadeOut} 500ms ease-in-out;
  animation-delay: ${fadeTime - 500}ms;
`;


export interface Alert {
  id: string;
  message: string;
}

export interface Props {
}

export interface State {
  alerts: Alert[];
}

const subscription = `
  subscription {
    passiveAlerts {
      targetID
      message
    }
  }
`;

type SubscriptionType = {
  passiveAlerts: Pick<IPassiveAlert, 'message'>;
};

class PassiveAlert extends React.Component<Props, State> {
  private passiveAlertListener: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      alerts: [],
    };
  }

  public render() {
    return (
      <PassiveAlertContainer>
        <ul>
          {this.state.alerts.map((passiveAlertMessage: Alert) =>
            <PassiveAlertItem key={passiveAlertMessage.id}>
              {passiveAlertMessage.message}
            </PassiveAlertItem>)
          }
        </ul>
        <GraphQL subscription={subscription} subscriptionHandler={this.handleSubscription} />
      </PassiveAlertContainer>
    );
  }

  public componentDidMount() {
    this.passiveAlertListener = events.on('passivealert--newmessage', this.addAlertMessage);
  }

  public componentWillUnmount() {
    events.off(this.passiveAlertListener);
  }

  private handleSubscription = (result: SubscriptionResult<SubscriptionType>) => {
    if (!result.data || !result.data.passiveAlerts) return;

    this.addAlertMessage(result.data.passiveAlerts.message);
  }

  private removeAlertById = (id: string) => {
    const tmpAlertArr = this.state.alerts.filter(alert => alert.id !== id);
    this.setState({
      alerts: tmpAlertArr,
    });
  }

  private removeLastAlert = () => {
    const tmpAlertArr = this.state.alerts;
    tmpAlertArr.splice(tmpAlertArr.length - 1, 1);
    this.setState({
      alerts: tmpAlertArr,
    });
  }

  private addAlertMessage = (message: string) => {
    const id = this.createAlertID();
    this.setState({ alerts: [{ id, message }, ...this.state.alerts] });

    // Set timer to remove the item by id
    setTimeout(() => {
      this.removeAlertById(id);
    }, fadeTime);

    // If the maximum of alerts is reached, remove the last item
    if (this.state.alerts.length >= maxNumAlerts) {
      this.removeLastAlert();
    }
  }

  private createAlertID = () => {
    const id = Math.random().toString().slice(2, 11);
    return id;
  }
}

export default PassiveAlert;
