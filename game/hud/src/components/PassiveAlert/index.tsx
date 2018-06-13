/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { events } from '@csegames/camelot-unchained';
import styled, { keyframes } from 'react-emotion';

const fadeTime = 3000;
const maxNumAlerts = 5;

const randomMessages = [
  'You can\'t do that yet.',
  'Out of range.',
  'Target too close.',
  'Can\'t attack that target.'
];

const fadeOut = keyframes`
  from { opacity :1; }
  to { opacity :0; }
`;

const PassiveAlertContainer = styled('div')`
  display: block;
  position: fixed;
  top: 15%;
  left: 0;
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

class PassiveAlert extends React.Component<Props, State> {
  public static defaultProps = {
    fadeTimeSeconds: 3
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      alerts: []
    };
  }

  public render() {
    return (
      <div>
        <button onClick={() => this.testEventFire()}>Send event</button>
        <PassiveAlertContainer>
          <ul>
            {this.state.alerts.map((passiveAlertMessage: Alert) =>
              <PassiveAlertItem key={passiveAlertMessage.id}>
                {passiveAlertMessage.message}
              </PassiveAlertItem>)
            }
          </ul>
        </PassiveAlertContainer>
      </div>
    );
  }

  public componentDidMount() {
    events.on('passivealert--newmessage', this.addAlertMessage);
  }

  private testEventFire = () => {
    events.fire('passivealert--newmessage', randomMessages[Math.floor(Math.random() * (3+1))], true);
  }

  private removeAlertById = (id: string) => {
    const tmpAlertArr = this.state.alerts.filter(alert => alert.id !== id)
    this.setState({
      alerts: tmpAlertArr
    });
  }

  private removeLastAlert = () => {
    const tmpAlertArr = this.state.alerts;
    tmpAlertArr.splice(tmpAlertArr.length - 1, 1);
    this.setState({
      alerts: tmpAlertArr
    });
  }

  private addAlertMessage = (message: string) => {
    const id = Math.random().toString().slice(2, 11);
    this.setState({ alerts: [{ id, message }, ...this.state.alerts]});
    if (this.state.alerts.length >= maxNumAlerts) {
      this.removeLastAlert();
    } else {
      setTimeout(() => {
        this.removeAlertById(id);
      }, fadeTime);
    }
  }
}

export default PassiveAlert;
