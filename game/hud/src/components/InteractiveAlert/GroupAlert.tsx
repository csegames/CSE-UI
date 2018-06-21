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
        <Button onClick={this.joinGroup}>Join {alert.kind.replace('Invite', '')}</Button>
        <Button onClick={this.onDecline}>Decline</Button>
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
