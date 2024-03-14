/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';

const Button = 'Shared-CloseButton';

export interface CloseButtonProps {
  onClick: (e?: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  width?: number;
  height?: number;
}

export class CloseButton extends React.Component<CloseButtonProps> {
  public render() {
    return (
      //TODO: This should really be a <button> tag, not a div
      <div
        className={`${Button} icon-close ${this.props.className ? this.props.className : ''}`}
        style={{ width: this.props.width, height: this.props.height, fontSize: this.props.width }}
        onClick={this.props.onClick}
      />
    );
  }
}
