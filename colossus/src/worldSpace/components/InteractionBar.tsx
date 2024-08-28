/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { InteractionBarState } from '.';
import { ItemGameplayType } from '@csegames/library/dist/hordetest/game/types/ItemGameplayType';

const Wrapper = 'WorldSpace-InteractionBar-Wrapper';
const Container = 'WorldSpace-InteractionBar-Container';
const BarContainer = 'WorldSpace-InteractionBar-BarContainer';
const Bar = 'WorldSpace-InteractionBar-Bar';
const BarText = 'WorldSpace-InteractionBar-BarText';
const BarTextDisabledReason = 'WorldSpace-InteractionBar-BarTextDisabledReason';
const KeybindIcon = 'WorldSpace-InteractionBar-KeybindIcon';
const ItemInfoContainer = 'WorldSpace-InteractionBar-ItemInfoContainer';
const GameTypeText = 'WorldSpace-InteractionBar-GameTypeText';
const ItemName = 'WorldSpace-InteractionBar-ItemName';

const ItemDescription = 'WorldSpace-InteractionBar-ItemDescription';

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
      isPressed: false
    };
  }

  public render() {
    const { state } = this.props;
    const disabledClassName = state.enabled == false ? 'disabled' : '';
    const pressedClassName = this.state.isPressed ? 'pressed' : '';

    return state.keybind ? (
      <div className={Wrapper}>
        <div className={`${Container} ${ItemGameplayType[state.gameplayType]}`}>
          <div className={`${BarContainer} ${disabledClassName}`}>
            <div className={Bar} style={{ width: `${state.progress ? state.progress * 100 : 0}%` }} />
            <div className={`${BarText} ${disabledClassName}`}>
              {state.keybind ? (
                state.keybind.iconClass ? (
                  <span
                    className={`${KeybindIcon} ${pressedClassName} ${state.keybind.iconClass} ${disabledClassName}`}
                  />
                ) : (
                  <span className={`${KeybindIcon} ${pressedClassName} ${disabledClassName}`}>
                    {state.keybind.name}
                  </span>
                )
              ) : null}
              {state.title}
              {!state.enabled && <span className={BarTextDisabledReason}>{state.disabledReason}</span>}
            </div>
          </div>
          <div className={ItemInfoContainer}>
            {this.getGameplayTypeDisplayText()}
            <div className={`${ItemName} ${disabledClassName}`}>{state.name}</div>
            <div className={`${ItemDescription} ${disabledClassName}`}>{state.description}</div>
          </div>
        </div>
      </div>
    ) : null;
  }

  private getGameplayTypeDisplayText(): JSX.Element {
    const { state } = this.props;
    if (state.gameplayType == ItemGameplayType.Interaction) {
      return null;
    }

    return (
      <div className={`${GameTypeText} ${ItemGameplayType[state.gameplayType]}`}>
        {ItemGameplayType[state.gameplayType]}
      </div>
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
