/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { UninstallConfirmationDialog } from './UninstallConfirmationDialog';
import { Animate } from '../lib/Animate';

export interface UninstallButtonState {
  showConfirmDialog: boolean;
}

export interface UninstallButtonProps {
  name: string;
  uninstall: () => void;
}

class UninstallButton extends React.Component<UninstallButtonProps, UninstallButtonState> {
  constructor(props: UninstallButtonProps) {
    super(props);
    this.state = { showConfirmDialog: false };
  }

  public render() {
    return (
      <div>
        <a className='uninstall-link' onClick={this.showModal}>
          Uninstall {this.props.name}
        </a>
        <Animate animationEnter='slideInUp' animationLeave='slideOutDown' durationEnter={400} durationLeave={500}>
          {this.generateConfirmDialog()}
        </Animate>
      </div>
    );
  }

  private generateConfirmDialog = (): React.ReactNode => {
    return !this.state.showConfirmDialog ? null : (
      <div className='fullscreen-modal' key='confirm-dialog'>
        <UninstallConfirmationDialog onYes={this.props.uninstall} onNo={this.hideModal}>
          Do you really want to uninstall {this.props.name}?
        </UninstallConfirmationDialog>
      </div>
    );
  };

  private showModal = () => {
    this.setState({ showConfirmDialog: true } as any);
  };

  private hideModal = () => {
    this.setState({ showConfirmDialog: false } as any);
  };
}

export default UninstallButton;
