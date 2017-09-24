/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-25 18:09:02
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-06 15:35:40
 */

import * as React from 'react';
import {LinkAddress} from '../../services/session/nav/navTypes';

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

  public render() {
    return (
      <div className='CampaignContent'>
        Campaign content under construction.
        <br />
        Viewing page {this.props.address.id}.
      </div>
    );
  }
}

export default CampaignContent;
