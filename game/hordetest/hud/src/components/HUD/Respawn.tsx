/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { InputContext } from 'components/context/InputContext';

export const RespawnDimensions = {
  width: 532,
  height: 166,
  widthUHD: 1064,
  heightUHD: 332,
};

const Container = styled.div`
  position: relative;
  pointer-events: all;
  width: ${RespawnDimensions.widthUHD}px;
  height: ${RespawnDimensions.heightUHD}px;
  background-image: url(../images/hud/respawn/uhd/banner.png);
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: center center;
  z-index: -1;

  @media (max-width: 1920px) {
    width: ${RespawnDimensions.width}px;
    height: ${RespawnDimensions.height}px;
    background-image: url(../images/hud/respawn/hd/banner.png);
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
  border-image: url(../images/hud/respawn/uhd/button-border-gold.png);
  border-image-slice: 2 1 2 1;
  margin: 6px;

  &:hover {
    background-image: url(../images/hud/respawn/uhd/button-glow.png);
  }

  &.highlight {
    background-image: url(../images/hud/respawn/uhd/button-glow.png);
  }

  @media (max-width: 1920px) {
    font-size: 14px;
    letter-spacing: .2em;
    padding: 4px 10px;
    border: 1px solid #404040;
    border-width: 2px 1px 2px 1px;
    border-image: url(../images/hud/respawn/hd/button-border-gold.png);
    border-image-slice: 2 1 2 1;
    margin: 3px;

    &:hover {
      background-image: url(../images/hud/gamemenu/button-glow.png);
    }

    &.highlight {
      background-image: url(../images/hud/gamemenu/button-glow.png);
    }
  }
`;

export interface Props {
  isConsole: boolean;
}

export interface State {
  visible: boolean;
}

class RespawnWithInjectedContext extends React.Component<Props, State> {
  private visibilityEVH: EventHandle;
  private controllerSelectEVH: EventHandle;

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
            <RespawnButton className={this.props.isConsole ? 'highlight' : ''} onClick={this.onRespawn}>
              {this.props.isConsole && <span className={game.gamepadSelectBinding.iconClass}></span>}
              Respawn
            </RespawnButton>
          </Content>
        </Container>
    ) : null;
  }

  public componentDidMount() {
    this.handleVisibility();
    this.visibilityEVH = hordetest.game.selfPlayerState.onUpdated(this.handleVisibility);
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.state.visible) {
      if (!prevProps.isConsole && this.props.isConsole) {
        this.setWaitingForSelect(true);
        this.controllerSelectEVH = game.onControllerSelect(this.onRespawn);
      }

      if (prevProps.isConsole && !this.props.isConsole) {
        this.setWaitingForSelect(false);
        this.controllerSelectEVH.clear();
      }
    }
  }

  public componentWillUnmount() {
    this.visibilityEVH.clear();

    if (this.controllerSelectEVH) {
      this.controllerSelectEVH.clear();
    }
  }

  private handleVisibility = () => {
    if (!hordetest.game.selfPlayerState.isAlive && !this.state.visible) {
      this.show();
      return;
    }

    if (hordetest.game.selfPlayerState.isAlive && this.state.visible) {
      this.hide();
    }
  }

  private show = () => {
    if (this.props.isConsole) {
      this.setWaitingForSelect(true);
      this.controllerSelectEVH = game.onControllerSelect(this.onRespawn);
    }

    this.setState({ visible: true });
  }

  private hide = () => {
    if (this.props.isConsole) {
      this.setWaitingForSelect(false);
    }

    this.setState({ visible: false });
  }

  private onRespawn = () => {
    hordetest.game.selfPlayerState.respawn('-1');
  }

  private setWaitingForSelect = (isWaitingForSelect: boolean) => {
    game.setWaitingForSelect(isWaitingForSelect);
  }
}

export function Respawn() {
  return (
    <InputContext.Consumer>
      {({ isConsole }) => (
        <RespawnWithInjectedContext isConsole={isConsole} />
      )}
    </InputContext.Consumer>
  );
}
