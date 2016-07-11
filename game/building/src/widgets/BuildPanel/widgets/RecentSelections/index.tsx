/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {BuildPaneProps} from '../../lib/BuildPane';

export interface RecentSelectionsState {
}

class RecentSelections extends React.Component<BuildPaneProps, RecentSelectionsState> {

  constructor(props: BuildPaneProps) {
    super(props);
  }

  render() {
    return (
      <div className={`recent-selections ${this.props.minimized ? 'minimied' : ''}`}>
        <img src='./images/cube.png' />
        <img src='./images/cube.png' />
        <img src='./images/cube.png' />
        <img src='./images/cube.png' />
        <img src='./images/cube.png' />
        <img src='./images/cube.png' />
      </div>
    )
  }
}

export default RecentSelections;
