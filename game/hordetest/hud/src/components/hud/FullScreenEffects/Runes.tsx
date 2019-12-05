/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

export function showRuneFullScreenEffect(type: RuneType) {
  game.trigger('show-rune-full-screen-effects', type);
}

const HIDE_DURATION = 1.3;

const Container = styled.div`
  position: fixed;
  pointer-events: none;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url(../images/hud/frame-glow.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index: -1;
  animation: pulse ${HIDE_DURATION}s infinite;

  &.Protection {
    filter: hue-rotate(160deg);
  }

  &.Health {
    filter: hue-rotate(60deg);
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
`;

export interface State {
  isVisible: boolean;
  runeType: RuneType;
}

export class RuneFullScreenEffects extends React.Component<{}, State> {
  private evh: EventHandle;
  private hideTimeout: number;
  constructor(props: {}) {
    super(props);
    this.state = {
      isVisible: false,
      runeType: null,
    };
  }

  public render() {
    return this.state.isVisible ? (
      <Container className={RuneType[this.state.runeType]}></Container>
    ) : null;
  }

  public componentDidMount() {
    this.evh = game.on('show-rune-full-screen-effects', this.handleShow);
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private handleShow = (runeType: RuneType) => {
    if (this.hideTimeout) {
      this.setState({ runeType });
      return;
    }

    this.setState({ isVisible: true, runeType });

    this.hideTimeout = window.setTimeout(() => {
      this.setState({ isVisible: false, runeType: null });
      this.hideTimeout = null;
    }, HIDE_DURATION * 1000);
  }
}
