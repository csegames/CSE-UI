/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { webAPI } from '@csegames/camelot-unchained';

const Container = styled('div')`
  overflow: hidden;
  background: repeating-linear-gradient(45deg, #600000, #600000 2px, #6F0000 2px, #6F0000 5px);
  border-top: 3px solid #600000;
  border-bottom: 3px solid #600000;
  color: #ececec;
  padding: 3px 15px;
`;

export interface AlertsProps {
  alerts: webAPI.PatcherAlert[];  
}

export class Alerts extends React.Component<AlertsProps, {}> {
  public render() {
    if (this.props.alerts.length === 0) return null;
    return <Container>{this.props.alerts[0].message}</Container>;
  }
}

export default Alerts;
