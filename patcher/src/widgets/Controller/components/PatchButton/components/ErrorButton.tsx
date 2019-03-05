/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { PatchButtonStyle, ButtonText, ButtonGlow } from '../styles';

const ErrorButtonView = styled.div`
  ${PatchButtonStyle};
  background: url(/ui/images/controller/play-button-press.png);
  filter: grayscale(0%) brightness(50%) hue-rotate(-45deg);

  &:hover {
    filter: grayscale(0%) brightness(60%) hue-rotate(-45deg);
  }
`;

export interface ErrorButtonProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

class ErrorButton extends React.Component<ErrorButtonProps> {
  public render() {
    return (
      <ErrorButtonView onClick={this.props.onClick}>
        <ButtonText>{this.props.text}</ButtonText>
        <ButtonGlow className='patch-button-glow' />
      </ErrorButtonView>
    );
  }
}

export default ErrorButton;
