/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { getJobContext } from '../../lib/utils';

export interface Props {
  jobNumber: number;
}

class CollectJob extends React.PureComponent<Props> {
  public render() {
    const JobContext = getJobContext(this.props.jobNumber);
    return (
      <JobContext.Consumer>
        {({ onCollectJob }) => {
          return (
            <button onClick={onCollectJob}>Collect Job</button>
          );
        }}
      </JobContext.Consumer>
    );
  }
}

export default CollectJob;
