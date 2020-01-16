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
  align-items: flex-end;
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2px;
  padding-bottom: 40px;
  width: calc(100% - 10px);
  height: fit-content;

  &.Deploy {
    background: linear-gradient(to bottom, rgba(221, 177, 0, 0.9) 50%, rgba(216, 174, 4, 0.7), transparent);
  }

  &.Throw {
    background: linear-gradient(to bottom, rgba(147, 39, 143, 0.9) 50%, rgba(147, 39, 143, 0.7), transparent);
  }

  &.Consume {
    background: linear-gradient(to bottom, rgba(7, 122, 185, 0.9) 50%, rgba(7, 122, 185, 0.7), transparent);
  }
`;

const BarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: calc(100% - 6px);
  padding: 3px;
  background-color: rgba(243, 243, 243, 0.2);
  margin-bottom: 5px;
  z-index: 0;
`;

const Bar = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: ${(props: { width: number } & React.HTMLProps<HTMLDivElement>) => props.width}%;
  background-color:  rgba(20, 20, 20, 0.5);
  z-index: -1;
`;

const BarText = styled.div`
  color: white;
  font-family: Lato;
  font-weight: bold;
  font-size: 14px;
  color: white;
  z-index: 1;
`;

const KeybindIcon = styled.span`
  font-size: 16px;
  margin-right: 15px;
  margin-left: 10px;
  opacity: 1;
  transition: opacity 0.2s;

  &.pressed {
    opacity: 0.7;
  }
`;

const ItemInfoContainer = styled.div`
  padding: 0 10px;
`;

const GameTypeText = styled.div`
  font-family: Lato;
  font-weight: bold;
  font-size: 10px;
  text-transform: uppercase;

  &.Deploy {
    color: #fff77f;
  }

  &.Throw {
    color: #ff7ffa;
  }

  &.Consume {
    color: #7fdcff;
  }
`;

const ItemName = styled.div`
  font-family: Lato;
  font-weight: bold;
  font-size: 18px;
  line-height: 16px;
  color: #FFF;
  margin-bottom: 5px;
`;

const ItemDescription = styled.div`
  font-family: Lato;
  font-size: 12px;
  color: #FFF;
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
    return state.keybind ? (
      <Wrapper>
        <Container className={ItemGameplayType[state.gameplayType]}>
          <BarContainer>
            <Bar width={state.progress ? state.progress * 100 : 0} />
            <BarText>
              {state.keybind ?
                (state.keybind.iconClass ?
                  <KeybindIcon className={`${pressedClassName} ${state.keybind.iconClass}`}></KeybindIcon> :
                  <KeybindIcon className={pressedClassName}>{state.keybind.name}</KeybindIcon>) : null}
              Pick up
            </BarText>
          </BarContainer>
          <ItemInfoContainer>
            <GameTypeText className={ItemGameplayType[state.gameplayType]}>
              {ItemGameplayType[state.gameplayType]}
            </GameTypeText>
            <ItemName>{state.name}</ItemName>
            <ItemDescription>{state.description}</ItemDescription>
          </ItemInfoContainer>
        </Container>
      </Wrapper>
    ) : null;
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
