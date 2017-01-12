/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {webAPI} from 'camelot-unchained';
import Animate from '../../../../lib/Animate';

export interface AlertsProps {
  alerts: webAPI.PatcherAlert[],  
};

export class Alerts extends React.Component<AlertsProps, {}> {
  static propTypes = {
    alerts: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  }
  
  render() {
    if (this.props.alerts.length === 0) return null;
    return <div className='Alerts'>{this.props.alerts[0].message}</div>;
  }
}

export default Alerts;
