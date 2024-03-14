/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface EualaModalProps {
  source: string;
  accept: () => void;
  decline: () => void;
}

export interface EualaModalState {}

class EualaModal extends React.Component<EualaModalProps, EualaModalState> {
  constructor(props: EualaModalProps) {
    super(props);
  }

  public render() {
    return (
      <div className='euala-modal'>
        <iframe src={this.props.source} width='100%' height='100%' frameBorder='0'></iframe>
        <button className='accept' onClick={this.props.accept}>
          Accept
        </button>
        <button className='decline' onClick={this.props.decline}>
          Decline
        </button>
      </div>
    );
  }
}

export default EualaModal;
