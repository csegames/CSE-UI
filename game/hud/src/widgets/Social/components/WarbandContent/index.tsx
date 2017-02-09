/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-25 18:09:02
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-13 15:15:58
 */

import * as React from 'react';
import { LinkAddress } from '../../services/session/nav/navTypes';

export interface WarbandContentProps {
  dispatch: (action: any) => any;
  address: LinkAddress;
}

export interface WarbandContentState {

}

export class WarbandContent extends React.Component<WarbandContentProps, WarbandContentState> {

  constructor(props: WarbandContentProps) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.address.kind === 'Primary') {
      return <div>INVALID ADDRESS PROVIDED TO WARBAND CONTENT COMPONENT!</div>;
    }
    return (
      <div className='WarbandContent'>
        Warband content under construction.
        <br />
        Viewing page {this.props.address.id} for warband {this.props.address.subKey}.
      </div>
    )
  }
}

export default WarbandContent;
