/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

const Button = styled('div')`
  z-index: 99;
  width: ${(props: { width: number }) => props.width ? `${props.width}px` : '12px'};
  height: ${(props: { height: number }) => props.height ? `${props.height}px` : '12px'};
  background: url(images/inventory/close-button-grey.png) no-repeat;
  cursor: pointer;
  &:hover {
    -webkit-filter: drop-shadow(2px 2px 2px rgba(255, 255, 255, 0.9));
  }
  &:active {
    -webkit-filter: drop-shadow(2px 2px 2px rgba(255, 255, 255, 1));
  }
`;

export interface CloseButtonProps {
  onClick: (e?: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  width?: number;
  height?: number;
}

export class CloseButton extends React.Component<CloseButtonProps> {
  public render() {
    return (
      <Button
        className={this.props.className}
        width={this.props.width}
        height={this.props.height}
        onClick={this.props.onClick}
      />
    );
  }
}
