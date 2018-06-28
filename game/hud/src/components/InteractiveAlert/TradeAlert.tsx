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
import * as CONFIG from '../../widgets/Settings/config';

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
    margin-top: 20px;
    height: 100px;
    text-align: center;
    color: #baa892;
    ${CONFIG.INTERACTIVE_FONT}
    font-size: 20px;
    margin: 30px 150px 0px 150px;
`;

const InputContainer = styled('div')`
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    position: absolute;
    bottom: 20px;
    left: 250px;
`;

const Button = styled('div')`
    cursor: pointer;
    width: ${CONFIG.ACTION_BUTTON_WIDTH}px;
    height: ${CONFIG.ACTION_BUTTON_HEIGHT}px;
    line-height: ${CONFIG.ACTION_BUTTON_HEIGHT}px;
    text-align: center;
    text-transform: uppercase;
    margin: 0 3px;
    font-size: 9px;
    background-image: url(images/settings/button-off.png);
    letter-spacing: 2px;
    position: relative;
    &:hover {
    color: ${CONFIG.HIGHLIGHTED_TEXT_COLOR};
    background-image: url(images/settings/button-on.png);
    ::before {
      content: '';
      position: absolute;
      background-image: url(images/settings/button-glow.png);
      width: 93px;
      height: 30px;
      left: 1px;
      background-size: cover;
    }
    }
`;

const ButtonOverlay = styled('div')`
    color: ${CONFIG.NORMAL_TEXT_COLOR};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(images/ui/interactive-alert/button-texture.png);
    padding-left: 2px;
    padding-right: 2px;
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
        <InputContainer>
            <Button onClick={this.onAccept}><ButtonOverlay>Accept</ButtonOverlay></Button>
            <Button onClick={this.onDecline}><ButtonOverlay>Decline</ButtonOverlay></Button>
        </InputContainer>
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
