/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import Slider from '../Slider';
import cu, {client, GroupInvite, groupType} from 'camelot-unchained';
import {initializeInvites, acceptInvite, declineInvite} from '../../services/session/invites';

export interface Alert {
  render: () => any;
}

export interface InteractiveAlertProps {
  dispatch: (action: any) => any;
  invites: GroupInvite[];
}

export interface InteractiveAlertState {
}

class InteractiveAlert extends React.Component<InteractiveAlertProps, InteractiveAlertState> {

  constructor(props: InteractiveAlertProps) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => this.props.dispatch(initializeInvites()), 1000);
  }

  private accumulateAlerts = () => {
    let alerts: Alert[] = [];

    if (this.props.invites && this.props.invites.length > 0) {
      this.props.invites.forEach(i => {
        alerts.push({
          render: () => {
            return (
              <div className='invite'>
                <h6>{i.invitedByName} has invited you to a {groupType[i.groupType]}.</h6>
                <em>Invite code: {i.inviteCode}</em>
                <div className='button raised blue' onClick={() => this.props.dispatch(acceptInvite(i))}>Accept</div>
                <div className='button raised' onClick={() => this.props.dispatch(declineInvite(i))}>Decline</div>
              </div>
            );
          }
        });
      });
    }

    return alerts;
  }

  private sliderRef: Slider = null;
  render() {

    const alerts = this.accumulateAlerts();
    if (alerts.length == 0) return null;

    return (
      <div className='InteractiveAlert'>
        <Slider ref={(r: Slider) => this.sliderRef = r}>
          {alerts.map((a: Alert, index: number) => {
            return (
              <div className='InteractiveAlert__message' key={`alert_${index}`}>
                {a.render()}
              </div>
            );
          })}
        </Slider>
      </div>
    )
  }
}

export default InteractiveAlert;
