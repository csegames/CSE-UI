/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface ActionButtonProps {
  isActive: boolean;
  icon: string;
}

export interface ActionButtonState {
}

class ActionButton extends React.Component<ActionButtonProps, ActionButtonState> {

  constructor(props: ActionButtonProps) {
    super(props);
  }

  render() {
    return (
      <img src={this.props.icon}
        className={`action-bar__action-button icon ${this.props.isActive ? 'active' : ''}`}
        style={{width: '18px', height:'18px'}}/>
    )
  }
}

export default ActionButton;
