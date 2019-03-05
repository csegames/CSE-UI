/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

export const RespawnDimensions = {
  width: 532,
  height: 166,
  widthUHD: 1064,
  heightUHD: 332,
};

const Container = styled.div`
  position: relative;
  pointer-events: all;
  background-size: contain;
  width: ${RespawnDimensions.widthUHD}px;
  height: ${RespawnDimensions.heightUHD}px;
  background: url(../images/respawn/uhd/banner.png);
  z-index: -1;

  @media (max-width: 1920px) {
    width: ${RespawnDimensions.width}px;
    height: ${RespawnDimensions.height}px;
    background: url(../images/respawn/hd/banner.png);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const RespawnText = styled.div`
  font-family: Caudex;
  text-transform: uppercase;
  color: #F5D699;
  cursor: default;
  font-size: 48px;
  letter-spacing: 2px;
  margin-bottom: 10px;

  @media (max-width: 1920px) {
    font-size: 26px;
    letter-spacing: 1px;
    margin-bottom: 5px;
  }
`;

const RespawnButton = styled.div`
  position: relative;
  font-family: Caudex;
  background-color: rgba(17, 17, 17, 0.8);
  color: #ffdfa0;
  cursor: pointer;
  text-transform: uppercase;
  transition: all ease .2s;
  z-index: 10;
  font-size: 28px;
  letter-spacing: 0.4em;
  padding: 8px 20px;
  border: 2px solid #404040;
  border-width: 2px 1px 2px 1px;
  border-image: url(../images/respawn/uhd/button-border-gold.png);
  border-image-slice: 2 1 2 1;
  margin: 6px;

  &:hover {
    background-image: url(../images/respawn/uhd/button-glow.png);
  }

  @media (max-width: 1920px) {
    font-size: 14px;
    letter-spacing: .2em;
    padding: 4px 10px;
    border: 1px solid #404040;
    border-width: 2px 1px 2px 1px;
    border-image: url(../images/respawn/hd/button-border-gold.png);
    border-image-slice: 2 1 2 1;
    margin: 3px;

    &:hover {
      background-image: url(../images/gamemenu/button-glow.png);
    }
  }
`;

export interface Props {

}

export interface State {
  visible: boolean;
}

export class Respawn extends React.Component<Props, State> {
  private evh: EventHandle;

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  public render() {
    return this.state.visible ? (
      <Container data-input-group='block'>
        <Content>
          <RespawnText>You died!</RespawnText>
          <RespawnButton onClick={this.onRespawnClick}>Respawn</RespawnButton>
        </Content>
      </Container>
    ) : null;
  }

  public componentDidMount() {
    this.handleVisibility();
    this.evh = game.selfPlayerState.onUpdated(this.handleVisibility);
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.state.visible !== nextState.visible;
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private handleVisibility = () => {
    if (!game.selfPlayerState.isAlive && !this.state.visible) {
      this.setState({ visible: true });
      return;
    }

    if (game.selfPlayerState.isAlive && this.state.visible) {
      this.setState({ visible: false });
    }
  }

  private onRespawnClick = () => {
    game.selfPlayerState.respawn('-1');
  }
}
