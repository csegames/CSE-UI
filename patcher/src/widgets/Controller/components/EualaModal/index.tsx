/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-07 12:07:27
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-09-07 12:07:27
 */

import * as React from 'react';

export interface EualaModalProps {
  accept: () => void;
  decline: () => void;
}

export interface EualaModalState {
}

class EualaModal extends React.Component<EualaModalProps, EualaModalState> {

  constructor(props: EualaModalProps) {
    super(props);
  }

  render() {
    return (
      <div className='euala-modal'>
        <iframe src="http://camelotunchained.com/v2/euala.html" width="100%" height="100%" frameBorder="0"></iframe>
			  <button className="accept" onClick={this.props.accept}>Accept</button>
			  <button className="decline" onClick={this.props.decline}>Decline</button>
      </div>
    )
  }
}

export default EualaModal;
