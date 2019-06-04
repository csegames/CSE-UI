/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Button constants
const BUTTON_FONT_SIZE = 28;
// #endregion
const Button = styled.div`
  z-index: 99;
  pointer-events: all;
  font-size: ${BUTTON_FONT_SIZE}px;
  color: #C3C3C3;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: white;
  }
  &:active {
    -webkit-filter: drop-shadow(2px 2px 2px rgba(255, 255, 255, 1));
  }

  @media (max-width: 2560px) {
    font-size: ${BUTTON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${BUTTON_FONT_SIZE * HD_SCALE}px;
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
        className={`icon-close ${this.props.className}`}
        style={{ width: this.props.width, height: this.props.height, fontSize: this.props.width }}
        onClick={this.props.onClick}
      />
    );
  }
}
