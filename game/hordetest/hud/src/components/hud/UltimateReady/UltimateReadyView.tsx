/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Colus;
`;

const TextContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  color: #f6f2ff;
  font-size: 16px;
  background: linear-gradient(95deg, transparent 1%, rgba(255, 106, 5, 0.8), transparent 99%);
  animation: pulse 2s alternate infinite;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background: linear-gradient(to right, transparent 1%, white, transparent 99%);
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background: linear-gradient(to right, transparent 1%, white, transparent 99%);
  }

  @keyframes pulse {
    from {
      filter: brightness(140%);
    }
    to {
      filter: brightness(80%);
    }
  }
`;

const KeybindBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.7);
`;

const KeybindText = styled.span`
  color: white;
  font-weight: bold;
  font-size: 15px;
`;

export interface Props {
  ultAbilityID: number;
}

export interface State {
  isVisible: boolean;
  keybind: Binding;
}

export class UltimateReadyView extends React.Component<Props, State> {
  private visibleListener: EventHandle;
  private keybindListener: EventHandle;

  constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: true,
      keybind: hordetest.game.abilityBarState.ultimate.binding,
    };
  }

  public render() {
    return this.state.isVisible ? (
      <Container>
        <TextContainer>
          Ultimate Ready
        </TextContainer>
        <KeybindBox>
          {this.state.keybind && this.state.keybind.iconClass ?
            <KeybindText className={this.state.keybind.iconClass}></KeybindText> :
            <KeybindText>{this.state.keybind.name}</KeybindText>
          }
        </KeybindBox>
      </Container>
    ) : null;
  }

  public componentDidMount() {
    this.visibleListener = hordetest.game.abilityStates[this.props.ultAbilityID].onUpdated(this.handleVisibility);
    this.keybindListener = hordetest.game.abilityBarState.onUpdated(this.handleAbilityBarUpdate);
  }

  public componentWillUnmount() {
    this.visibleListener.clear();
    this.keybindListener.clear();
  }

  private handleVisibility = () =>{
    if (this.isUltimateReady()) {
      this.setState({ isVisible: true });
    } else {
      this.setState({ isVisible: false });
    }
  }

  private handleAbilityBarUpdate = () => {
    this.setState({ keybind: hordetest.game.abilityBarState.ultimate.binding });
  }

  private isUltimateReady = () => {
    return (hordetest.game.abilityStates[this.props.ultAbilityID].status &
      AbilityButtonState.Cooldown) === 0;
  }
}
