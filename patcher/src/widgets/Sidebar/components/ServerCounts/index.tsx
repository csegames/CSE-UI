/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-07 12:11:19
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-09-07 12:11:19
 */

import * as React from 'react';

export interface ServerCountsProps {
  artCount: number;
  tddCount: number;
  vikCount: number;
};

export interface ServerCountsState {};

class ServerCounts extends React.Component<ServerCountsProps, ServerCountsState> {
  public name: string = 'cse-patcher-server-counts';

  constructor(props: ServerCountsProps) {
    super(props);
  }

  render() {
    return (
      <div id={this.name}>
        <h5 className='label'>REALM POPULATION</h5>
        <div className='vik-counts'><span>{this.props.vikCount}</span></div>
        <div className='tdd-counts'><span>{this.props.tddCount}</span></div>
        <div className='art-counts'><span>{this.props.artCount}</span></div>
      </div>
    );
  }
}

export default ServerCounts;
