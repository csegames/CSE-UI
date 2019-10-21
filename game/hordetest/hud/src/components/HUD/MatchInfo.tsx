/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const MatchInfoContainer = styled.div`
  display: flex;
  width: 300px;
  justify-content: space-between;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  color: white;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
`;

export interface Props {
}

export interface State {
  fps: number;
}

export class MatchInfo extends React.Component<Props, State> {
  private updateFPSInterval: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      fps: Math.round(game.fps),
    };
  }

  public render() {
    return (
      <MatchInfoContainer>
        <Item>30:13</Item>
        <Item>1523 Kills</Item>
        <Item>{this.state.fps} FPS</Item>
      </MatchInfoContainer>
    );
  }

  public componentDidMount() {
    this.updateFPSInterval = window.setInterval(this.updateFPS, 500);
  }

  public componentWillUnmount() {
    window.clearInterval(this.updateFPSInterval);
  }

  private updateFPS = () => {
    if (!game.fps.floatEquals(this.state.fps, 1)) {
      this.setState({ fps: Math.round(game.fps) });
    }
  }
}
