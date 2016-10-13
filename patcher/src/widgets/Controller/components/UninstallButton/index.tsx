/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-07 12:09:20
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-09-07 12:10:22
 */

import * as React from 'react';
import ConfirmDialog from './components/ConfirmDialog';
import Animate from '../../../../lib/Animate';

export interface UninstallButtonState {
  showConfirmDialog: boolean;
}

export interface UninstallButtonProps {
  name: string;
  uninstall: () => void;
}

class UninstallButton extends React.Component<UninstallButtonProps, UninstallButtonState> {
  constructor(props : UninstallButtonProps) {
    super(props);
    this.state = { showConfirmDialog: false };
  }

  generateConfirmDialog = (): JSX.Element => {
    return  this.state.showConfirmDialog ? (
      <div className='fullscreen-modal' key='confirm-dialog'>
        <ConfirmDialog onYes={this.props.uninstall} onNo={this.hideModal}>
          Do you really want to uninstall {this.props.name}?
        </ConfirmDialog>
      </div>
    ) : null;
  }

  showModal = () => {
    this.setState({ showConfirmDialog: true } as any);
  }

  hideModal = () => {
    this.setState({ showConfirmDialog: false } as any);
  }

  render() {
    return (
      <div>
        <a className='uninstall-link' onClick={this.showModal}>Uninstall {this.props.name}</a>
        <Animate animationEnter='slideInUp' animationLeave='slideOutDown'
          durationEnter={400} durationLeave={500}>
          {this.generateConfirmDialog()}
        </Animate>
      </div>
      );
  }

}

export default UninstallButton;
