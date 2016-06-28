/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import {PatcherAlert} from '../redux/modules/patcherAlerts';
import Animate from '../../../../shared/components/Animate';

export interface AlertsState {};

export interface AlertsProps {
  alerts: Array<PatcherAlert>,  
};

export class Alerts extends React.Component<AlertsProps, AlertsState> {
  public name = 'cse-patcher-alert';
  
  static propTypes = {
    alerts: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  }
  
  render() {
    let display: any = null;
    if (this.props.alerts.length > 0) {
      display = this.props.alerts.map((alert: PatcherAlert) => <li className='card-panel alert' key={alert.id}>{alert.message}</li> );
    }
    return (
      <div className={this.name}>
        <Animate animationEnter='bounceInLeft' animationLeave='fadeOut'
          durationEnter={700} durationLeave={500}>
          {display}
        </Animate>
      </div>
    );
  }
}

export default Alerts;
