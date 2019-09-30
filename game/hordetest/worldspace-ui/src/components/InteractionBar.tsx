/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { InteractionBarState } from '.';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  border: 2px solid black;
  display: flex;
  width: fit-content;
  transform: skewX(-10deg);
`;

const KeybindBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 25px;
  background-color: black;
  color: white;
  font-size: 18px;
  font-family: Colus;
`;

const KeybindText = styled.div`
  transform: skewX(10deg);
  transition: color 0.1s;

  &.pressed {
    color: #4D4D4D;
  }
`;

const BarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 130px;
  height: 25px;
  background-color: #1C1F1F;
  z-index: -1;
`;

const Bar = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #4D4D4D;
  z-index: 0;
`;

const NameText = styled.div`
  font-size: 14px;
  color: white;
  font-family: Lato;
  margin-left: 10px;
  transform: skewX(10deg);
  z-index: 10;
`;

export interface Props {
  state: InteractionBarState;
}

export interface State {
  isPressed: boolean;
}

export class InteractionBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isPressed: false,
    };
  }

  public render() {
    const { state } = this.props;
    const pressedClassName = this.state.isPressed ? 'pressed' : '';
    return (
      <Wrapper>
        <Container>
          {state.keybind.iconClass ?
            <KeybindBox>
              <KeybindText className={`${pressedClassName} ${state.keybind.iconClass}`}></KeybindText>
            </KeybindBox> :
            <KeybindBox>
              <KeybindText className={pressedClassName}>{state.keybind.name}</KeybindText>
            </KeybindBox>
          }
          <BarContainer>
            <Bar style={{ width: `${state.progress * 100}%` }} />
            <NameText>{state.name}</NameText>
          </BarContainer>
        </Container>
      </Wrapper>
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (!this.state.isPressed && this.props.state.progress > prevProps.state.progress) {
      // Going up
      this.setState({ isPressed: true });
    }

    if (this.state.isPressed && this.props.state.progress < prevProps.state.progress) {
      // Going down
      this.setState({ isPressed: false });
    }
  }
}
