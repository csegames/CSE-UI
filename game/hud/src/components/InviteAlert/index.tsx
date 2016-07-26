/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
const Animate = require('react-animate.css');
import cu, {GroupInvite, groupType} from 'camelot-unchained';
const Slider = require('react-slick');

export interface InviteAlertProps {
  invites: GroupInvite[],
  declineInvite: (invite: GroupInvite) => void;
  acceptInvite: (invite: GroupInvite, force?: boolean) => void;
}

export interface InviteAlertState {
}

class InviteAlert extends React.Component<InviteAlertProps, InviteAlertState> {
  public name: string = 'inviteAlert';

  constructor(props: InviteAlertProps) {
    super(props);
  }

  render() {

    var settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    let display: any = null;
    if (this.props.invites.length > 0) {
      display = (
        <div>
        <Slider {...settings}>
          {this.props.invites.map((invite: GroupInvite, index: number) => {
            return (
              <div className='inviteAlert__message' key={index}>
                <h6>{invite.invitedByName} has invited you to a {groupType[invite.groupType]}.</h6>
                <em>Invite code: {invite.inviteCode}</em>
                <div className='button raised blue' onClick={() => this.props.acceptInvite(invite)}>Accept</div>
                <div className='button raised' onClick={() => this.props.declineInvite(invite)}>Decline</div>
              </div>
            );
          })}
        </Slider>
        </div>
      );
    }

    return (
      <div className={this.name}>
          {display}
      </div>
    )
  }
}

export default InviteAlert;
