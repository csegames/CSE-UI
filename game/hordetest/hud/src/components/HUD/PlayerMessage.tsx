/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

export function sendPlayerMessage(message: string, duration: number = 1700, className: string = '') {
  game.trigger('player-message', message, duration, className);
}

const ANIMATION_DURATION = 0.2;

const Container = styled.div`
  font-size: 25px;
  font-family: Colus;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  text-shadow: 1px 1px rgba(0, 0, 0, 0.8);
  opacity: 0;
  animation: fadeIn ${ANIMATION_DURATION}s forwards;

  &.fadeOut {
    animation: fadeOut ${ANIMATION_DURATION}s forwards;
  }

  &.Health {
    filter: drop-shadow(0px 0px 10px rgba(68, 174, 104, 1));
    text-shadow:
      rgba(68, 174, 104, 1) 0px 0px 20px,
      rgba(68, 174, 104, 1) 0px 0px 30px,
      rgba(68, 174, 104, 1) 0px 0px 40px,
      rgba(68, 174, 104, 1) 0px 0px 50px,
      rgba(68, 174, 104, 1) 0px 0px 75px;
  }

  &.Protection {
    text-shadow:
      rgba(102, 199, 255, 1) 0px 0px 20px,
      rgba(102, 199, 255, 1) 0px 0px 30px,
      rgba(102, 199, 255, 1) 0px 0px 40px,
      rgba(102, 199, 255, 1) 0px 0px 50px,
      rgba(102, 199, 255, 1) 0px 0px 75px;
  }

  &.Weapon {
    text-shadow:
      rgba(255, 116, 5, 1) 0px 0px 20px,
      rgba(255, 116, 5, 1) 0px 0px 30px,
      rgba(255, 116, 5, 1) 0px 0px 40px,
      rgba(255, 116, 5, 1) 0px 0px 50px,
      rgba(255, 116, 5, 1) 0px 0px 75px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

export interface Props {
}

export interface State {
  className: string;
  playerMessage: string;
  shouldPlayFadeOutAnimation: boolean;
}

export class PlayerMessage extends React.Component<Props, State> {
  private evh: EventHandle;
  private durationTimeout: number;
  private fadeOutTimeout: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      className: '',
      playerMessage: '',
      shouldPlayFadeOutAnimation: false,
    };
  }

  public render() {
    const fadeOutClass = this.state.shouldPlayFadeOutAnimation ? 'fadeOut' : '';
    return this.state.playerMessage && (
      <Container className={`${fadeOutClass} ${this.state.className}`}>
        {this.state.playerMessage}
      </Container>
    );
  }

  public componentDidMount() {
    this.evh = game.on('player-message', this.handlePlayerMessage);
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private handlePlayerMessage = (message: string, duration: number = 1700, className: string = '') => {
    // First clear out any existing timeouts, we're overriding them
    if (this.durationTimeout) {
      window.clearTimeout(this.durationTimeout);
      this.durationTimeout = null;
    }

    if (this.fadeOutTimeout) {
      window.clearTimeout(this.fadeOutTimeout);
      this.fadeOutTimeout = null;
    }

    // Update player message
    this.setState({ playerMessage: message, shouldPlayFadeOutAnimation: false, className });

    // Fade out player message on a timeout
    this.playFadeOutAnimation(duration);

    // Remove player message on a given duration timeout
    this.durationTimeout = window.setTimeout(() => {
      this.setState({ playerMessage: '', className: '' });

      this.durationTimeout = null;
    }, duration);
  }

  private playFadeOutAnimation = (messageDuration: number) => {
    this.fadeOutTimeout = window.setTimeout(() => {
      this.setState({ shouldPlayFadeOutAnimation: true });

      this.fadeOutTimeout = null;
    }, messageDuration - (ANIMATION_DURATION * 1000));
  }
}
