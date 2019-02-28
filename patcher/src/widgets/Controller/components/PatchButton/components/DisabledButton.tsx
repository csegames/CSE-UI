/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from 'linaria/react';
import { PatchButtonStyle, ButtonGlow, ButtonText } from '../styles';

const DisabledButtonView = styled.div`
  ${PatchButtonStyle};
  background: url(/ui/images/controller/play-button-press.png);
  filter: grayscale(90%) brightness(50%);

  &:hover {
    filter: grayscale(90%) brightness(60%);
  }
`;

export interface DisabledButtonProps {
  text: string;
  fontSize?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

class DisabledButton extends React.PureComponent<DisabledButtonProps> {
  public render() {
    return (
      <DisabledButtonView onClick={this.props.onClick}>
        <ButtonText style={{ fontSize: this.props.fontSize }}>{this.props.text}</ButtonText>
        <ButtonGlow className='patch-button-glow' />
        {this.props.children}
      </DisabledButtonView>
    );
  }
}

export default DisabledButton;
