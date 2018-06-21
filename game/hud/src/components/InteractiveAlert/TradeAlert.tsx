/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { events, client, webAPI } from '@csegames/camelot-unchained';
import { IInteractiveAlert, TradeAlert } from '@csegames/camelot-unchained/lib/graphql/schema';

// Utility Functions
export function removeTradeInvite(alertsList: IInteractiveAlert[], toRemove: TradeAlert) {
  const alerts = _.filter([...alertsList], (a) => {
    return !(a.category === 'Trade' && (a as TradeAlert).otherName === toRemove.otherName);
  });
  return {
    alerts,
  };
}

function openTradeWindow() {
  events.fire('hudnav--navigate', 'trade', true);
}

export function handleNewTradeAlert(alertsList: IInteractiveAlert[], alert: TradeAlert) {
  const alerts: IInteractiveAlert[] = [...alertsList];
  switch (alert.kind) {
    case 'NewInvite': {
      alerts.push(alert);
      return {
        alerts,
      };
    }

    case 'InviteRevoked': {
      removeTradeInvite(alerts, alert);
      return;
    }

    case 'InviteAccepted': {
      removeTradeInvite(alerts, alert);
      openTradeWindow();
      return;
    }

    case 'InviteDeclined': {
      removeTradeInvite(alerts, alert);
      return;
    }

    default: {
      console.error('Received a Trade alert kind the UI does not handle yet');
      return;
    }
  }
}

const Container = styled('div')`
  position: fixed;
  top: 0;
  width: 500px;
  height: 100px;
  margin-left: -250px;
  left: 50%;
  background: #646464;
`;

const Button = styled('div')`
  cursor: pointer;
  display: inline-block;
  position: relative;
  width: 120px;
  height: 32px;
  line-height: 32px;
  border-radius: 2px;
  font-size: 0.9em;
  background-color: #fff;
  color: #646464;
  transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.2s;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
`;

export interface TradeAlertProps {
  alert: TradeAlert;
  remove: (alert: IInteractiveAlert) => void;
}

export class TradeAlertView extends React.Component<TradeAlertProps> {
  public render() {
    const { alert } = this.props;
    return (
      <Container>
        <h6>{alert.otherName || 'Unknown'} has invited you to a {alert.category}</h6>
        <Button onClick={this.onAccept}>Accept</Button>
        <Button onClick={this.onDecline}>Decline</Button>
      </Container>
    );
  }

  private onAccept = () => {
    this.props.remove(this.props.alert);
    this.makeAcceptRequest();
  }

  private onDecline = () => {
    this.props.remove(this.props.alert);
    this.makeDeclineRequest();
  }

  private makeAcceptRequest = async () => {
    const { alert } = this.props;
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
        openTradeWindow();
      } else {
        const data = JSON.parse(res.data);
        if (data.FieldCodes && data.FieldCodes.length > 0) {
          console.error(data.FieldCodes[0].Message);
        } else {
          // This means api server failed AcceptInvite request but did not provide a message about what happened
          console.error('An error occured');
        }
      }
    } catch (e) {
      console.error('There was an unhandled error');
    }
  }

  private makeDeclineRequest = async () => {
    const { alert } = this.props;
    try {
      const res = await webAPI.SecureTradeAPI.RejectInvite(
        webAPI.defaultConfig,
        client.loginToken,
        client.shardID,
        client.characterID,
        alert.otherEntityID,
      );
      // remove this alert from our ui
      this.props.remove(alert);
      if (!res.ok) {
        const data = JSON.parse(res.data);
        if (data.FieldCodes && data.FieldCodes.length > 0) {
          console.error(data.FieldCodes[0].Message);
        } else {
          // This means api server failed DeclineInvite request but did not provide a message about what happened
          console.error('An error occured');
        }
      }
    } catch (e) {
      console.error('There was an unhandled error');
    }
  }
}
