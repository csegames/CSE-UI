/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as events  from '@csegames/camelot-unchained/lib/events';
import styled from 'react-emotion';
import { PatchButtonStyle, ButtonText, ButtonGlow, shine } from '../styles';

const PlayNowButtonView = styled('div')`
  ${PatchButtonStyle};
  transition: all 0.3s ease;
  &:hover {
    -webkit-filter: brightness(120%);
    filter: brightness(120%);
  }

  &:hover .patch-button-glow {
    opacity: 1;
  }

  &:hover:before {
    content: '';
    pointer-events: none;
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5px;
    opacity: 0;
    height: 85%;
    width: 90px;
    background: linear-gradient(transparent, rgba(255,255,255,0.2));
    clip-path: polygon(70% 0%, 100% 0%, 30% 100%, 0% 100%);
    -webkit-clip-path: polygon(70% 0%, 100% 0%, 30% 100%, 0% 100%);
    -webkit-animation: ${shine} 0.5s ease forwards;
    animation: ${shine} 0.5s ease forwards;
    animation-delay: 0.3s;
    -webkit-animation-delay: 0.3s;
  }

  &:hover:after {
    content: '';
    pointer-events: none;
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5px;
    opacity: 0;
    height: 85%;
    width: 90px;
    background: linear-gradient(transparent, rgba(255,255,255,0.2));
    clip-path: polygon(70% 0%, 100% 0%, 30% 100%, 0% 100%);
    -webkit-clip-path: polygon(70% 0%, 100% 0%, 30% 100%, 0% 100%);
    -webkit-animation: ${shine} 0.5s ease forwards;
    animation: ${shine} 0.5s ease forwards;
  }

  &:active {
    background: url(images/controller/play-button-press.png)  no-repeat;
  }
`;

export interface PlayNowButtonProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

class PlayNowButton extends React.Component<PlayNowButtonProps> {
  public render() {
    return (
      <PlayNowButtonView onClick={this.props.onClick} onMouseEnter={this.playSound}>
        <ButtonText>{this.props.text}</ButtonText>
        <ButtonGlow className='patch-button-glow' />
      </PlayNowButtonView>
    );
  }

  private playSound = () => {
    events.fire('play-sound', 'select-change');
  }
}

export default PlayNowButton;
