/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-25 18:09:02
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-01-25 18:34:04
 */

import * as React from 'react';
import { LinkAddress } from '../../services/session/nav/navTypes';

export interface CampaignContentProps {
  dispatch: (action: any) => any;
  address: LinkAddress;
}

export interface CampaignContentState {

}

export class CampaignContent extends React.Component<CampaignContentProps, CampaignContentState> {

  constructor(props: CampaignContentProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='CampaignContent'>
        Campaign content under construction.
        <br />
        Viewing page {this.props.address.id}.
      </div>
    )
  }
}

export default CampaignContent;
