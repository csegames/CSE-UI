/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { TradeAlert } from '@csegames/camelot-unchained/lib/graphql/schema';
import { AlertType } from '../index';

declare const toastr: any;

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

export interface InteractiveAlertViewProps {
  alert: AlertType;
  onTradeAccept: (alert: TradeAlert) => void;
  onTradeDecline: (alert: TradeAlert) => void;
}

class InteractiveAlertView extends React.Component<InteractiveAlertViewProps> {
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
    const { alert } = this.props;
    switch (alert.category) {
      case 'Trade': {
        this.props.onTradeAccept(alert);
        break;
      }
      default: {
        this.handleUnrecognizedAlert();
        break;
      }
    }
  }

  private onDecline = () => {
    const { alert } = this.props;
    switch (alert.category) {
      case 'Trade': {
        this.props.onTradeDecline(alert);
        break;
      }
      default: {
        this.handleUnrecognizedAlert();
        break;
      }
    }
  }

  private handleUnrecognizedAlert = () => {
    const { alert } = this.props;
    toastr.error(`We received a ${alert.category} alert that we don't handle currently!`, 'Oh No!!', { timeout: 3000 });
  }
}

export default InteractiveAlertView;
