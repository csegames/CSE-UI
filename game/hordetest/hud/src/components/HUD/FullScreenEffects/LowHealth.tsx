/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

export const LOW_HEALTH_PERCENT = 20;

const Container = styled.div`
  position: fixed;
  pointer-events: none;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url(../images/hud/death-glow.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index: -1;
  animation: pulse 1s infinite;

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 1;
    }
  }
`;

export interface State {
  isVisible: boolean;
}

export class LowHealthFullScreenEffects extends React.Component<{}, State> {
  private evh: EventHandle;
  constructor(props: {}) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  public render() {
    return this.state.isVisible ? (
      <Container></Container>
    ) : null;
  }

  public componentDidMount() {
    this.evh = hordetest.game.selfPlayerState.onUpdated(this.handleSelfPlayerStateUpdate);
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private handleSelfPlayerStateUpdate = () => {
    const health = hordetest.game.selfPlayerState.health[0];
    const healthPercent = (health.current / health.max) * 100;
    if (healthPercent <= LOW_HEALTH_PERCENT) {
      if (!this.state.isVisible) {
        this.setState({ isVisible: true });
      }
    } else {
      if (this.state.isVisible) {
        this.setState({ isVisible: false });
      }
    }
  }
}