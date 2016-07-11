/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import inputOwnership from './InputOwnership';

export interface ButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  children?: any;
  disabled?: boolean;
};
export interface ButtonState {
};

class Button extends React.Component<ButtonProps, ButtonState> {
  public name: string = 'Button';

  constructor(props: ButtonProps) {
    super(props);
  }

  onClick = (e: React.MouseEvent) => {
    inputOwnership(e);
    if (this.props.onClick) this.props.onClick(e);
  }

  render() {
    return (
      <button
        onFocus={inputOwnership} onBlur={inputOwnership}
        onClick={this.onClick}
        disabled={this.props.disabled}
      >{this.props.children}</button>
    );
  }
}

export default Button;
