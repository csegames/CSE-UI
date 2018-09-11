/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface ConfirmDialogState {
}

export interface ConfirmDialogProps {
  onYes: () => void;
  onNo: () => void;
  yes?: string;
  no?: string;
  children?: any;
}

class ConfirmDialog extends React.Component<ConfirmDialogProps, ConfirmDialogState> {
  constructor(props: ConfirmDialogProps) {
    super(props);
  }

  public render() {
    return (
      <div className='confirm-modal'>
        <div className='confirm-message'>
          {this.props.children}
        </div>
        <button className='wave-effects btn-flat' onClick={this.props.onYes}>{this.props.yes || 'HELL YES!'}</button>
        <button className='wave-effects btn-flat' onClick={this.props.onNo} >{this.props.no || 'NO NO NO!'}</button>
      </div>
    );
  }
}

export default ConfirmDialog;
