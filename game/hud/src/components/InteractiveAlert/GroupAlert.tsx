/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import {  client, webAPI } from '@csegames/camelot-unchained';
import { IInteractiveAlert, GroupAlert } from '@csegames/camelot-unchained/lib/graphql/schema';
import { InteractiveAlertView } from './index';
import * as CONFIG from '../Settings/config';

// Utility Functions
export function groupInviteID(alert: GroupAlert) {
  return `${alert.kind}:${alert.forGroup}`;
}

export function handleNewGroupAlert(ia: InteractiveAlertView, alert: GroupAlert) {
  ia.setState((state) => {
    const alerts = state.alerts.slice();
    alerts.push(alert);
    return {
      ...state,
      alerts,
    };
  });
}

const Container = styled('div')`
    margin-top: 20px;
    height: 100px;
    text-align: center;
    color: #FFFFFF;
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
    width: ${CONFIG.ACTION_BUTTON_WIDTH}px;
    height: ${CONFIG.ACTION_BUTTON_HEIGHT}px;
    line-height: ${CONFIG.ACTION_BUTTON_HEIGHT}px;
    text-align: center;
    text-transform: uppercase;
    color: ${CONFIG.NORMAL_TEXT_COLOR};
    margin: 0 3px;
    font-size: 9px;
    background-image: url(images/settings/button-off.png);
    ${CONFIG.INTERACTIVE_FONT}
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

export interface GroupAlertProps {
  alert: GroupAlert;
  remove: (alert: IInteractiveAlert) => void;
}

export class GroupAlertView extends React.Component<GroupAlertProps> {
  public render() {
    const { alert } = this.props;
    console.log(`GroupAlertView | render()`);
    return (
      <Container>
        <h6>
          {alert.fromName || 'Unknown'} has invited you to the {alert.kind.replace('Invite', '')} {alert.forGroupName}.
        </h6>
        <InputContainer>
          <Button onClick={this.joinGroup}>Join {alert.kind.replace('Invite', '')}</Button>
          <Button onClick={this.onDecline}>Decline</Button>
        </InputContainer>
      </Container>
    );
  }

  private joinGroup = async () => {
    const { alert } = this.props;
    try {
      const res = await webAPI.GroupsAPI.JoinV1(
        webAPI.defaultConfig,
        client.loginToken,
        client.shardID,
        client.characterID,
        alert.forGroup,
        alert.code);
      if (res.ok) {
        this.props.remove(alert);
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

  private onDecline = async () => {
    // remove this alert from our ui
    const { alert } = this.props;
    this.props.remove(alert);
  }
}
