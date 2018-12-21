/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { GraphQL } from '@csegames/camelot-unchained/lib/graphql/react';
import { SubscriptionResult } from '@csegames/camelot-unchained/lib/graphql/subscription';
import styled, { keyframes } from 'react-emotion';
import { PassiveAlert as IPassiveAlert } from 'gql/interfaces';

const fadeTime = 3000;
const maxNumAlerts = 5;
const shiftBy = 3;

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
`;

const FadeAlertItem = styled(PassiveAlertItem)`
  -webkit-animation: ${fadeOut} 500ms ease-in-out;
  -webkit-animation-delay: ${fadeTime - 500}ms;
  animation: ${fadeOut} 500ms ease-in-out;
  animation-delay: ${fadeTime - 500}ms;
`;

let alertId = 0;
let updateId = 0;

export interface Alert {
  id: number;
  message: string;
}

export interface Props {
}

export interface State {
  updated: number;
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
  private alerts: Alert[] = [];
  private removeTimer: NodeJS.Timer;
  constructor(props: Props) {
    super(props);
    this.state = {
      updated: null,
    };
  }

  // [1,2,3,4,5,6,7,8,9,10].forEach((n) => game.trigger('passivealert--newmessage', 'hello ' + n));

  public render() {
    const alerts = this.alerts.slice(0, maxNumAlerts);
    return (
      <PassiveAlertContainer>
        { alerts.length === 0 ? null : (
          <ul>
            { alerts.map((alert: Alert, index) => (
                index < shiftBy
                  ? <FadeAlertItem key={alert.id}>{alert.message}</FadeAlertItem>
                  : <PassiveAlertItem key={alert.id}>{alert.message}</PassiveAlertItem>
            ))}
          </ul>
        )}
        <GraphQL subscription={subscription} subscriptionHandler={this.handleSubscription} />
      </PassiveAlertContainer>
    );
  }

  public componentDidMount() {
    this.passiveAlertListener = game.on('passivealert--newmessage', this.addAlertMessage);
  }

  public componentWillUnmount() {
    game.off(this.passiveAlertListener);
  }

  private handleSubscription = (result: SubscriptionResult<SubscriptionType>) => {
    if (!result.data || !result.data.passiveAlerts) return;
    this.addAlertMessage(result.data.passiveAlerts.message);
  }

  private addAlertMessage = (message: string) => {
    this.alerts.push({ id: alertId++, message });
    this.setState({ updated: updateId++ });
    if (!this.removeTimer) {
      this.removeTimer = setInterval(this.removeAlert, fadeTime);
    }
  }

  private removeAlert = () => {
    // Set timer to remove the item by id
    this.alerts = this.alerts.slice(shiftBy);
    this.setState({ updated: updateId++ });
    if (this.alerts.length === 0) {
      clearInterval(this.removeTimer);
      this.removeTimer = null;
    }
  }
}

export default PassiveAlert;
