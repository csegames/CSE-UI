/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { HealthBarState } from '..';
import { findEntityResource } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';

const Wrapper = 'WorldSpace-ReviveInteractionBar-Wrapper';
const NameContainer = 'WorldSpace-ReviveInteractionBar-NameContainer';
const Name = 'Worldspace-ReviveInteractionBar-ReviveName';
const ReviveIcon = 'Worldspace-ReviveInteractionBar-ReviveIcon';
const Container = 'WorldSpace-ReviveInteractionBar-Container';
const BarContainer = 'WorldSpace-ReviveInteractionBar-BarContainer';
const Bar = 'WorldSpace-ReviveInteractionBar-Bar';
const BarText = 'WorldSpace-ReviveInteractionBar-BarText';
const BarTextDisabledReason = 'WorldSpace-ReviveInteractionBar-BarTextDisabledReason';
const KeybindIcon = 'WorldSpace-ReviveInteractionBar-KeybindIcon';
const DescriptionTitle = 'WorldSpace-ReviveInteractionBar-DescriptionTitle';
const Description = 'WorldSpace-ReviveInteractionBar-Description';

export interface Props {
  state: HealthBarState;
}

export interface State {
  isPressed: boolean;
}

export class ReviveInteractionBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isPressed: false };
  }

  public render() {
    const { state } = this.props;
    const disabled = this.props.state.interactionEnabled ? '' : 'disabled';
    const pressedClassName = this.state.isPressed ? 'pressed' : '';
    const reviveProgressCurrent = findEntityResource(state.resources, EntityResourceIDs.ReviveProgress);
    const progressBar = reviveProgressCurrent ? (reviveProgressCurrent.current / reviveProgressCurrent.max) * 100 : 0;
    const downTimer = this.getDownTimer(state.downedStateEndTime, state.worldTime);
    return state.bindingName ? (
      <div className={Wrapper}>
        <div className={NameContainer}>
          <span className={Name}>{state.name}</span>
          <div className={ReviveIcon}>{downTimer}</div>
        </div>
        <div className={`${Container} ${'Revive'}`}>
          <div className={`${BarContainer} ${disabled}`}>
            <div className={Bar} style={{ width: `${progressBar}%` }} />
            <div className={`${BarText} ${disabled}`}>
              {state.bindingIconClass ? (
                <span className={`${KeybindIcon} ${pressedClassName} ${disabled} ${state.bindingIconClass}`} />
              ) : (
                <span className={`${KeybindIcon} ${pressedClassName} ${disabled}`}>{state.bindingName}</span>
              )}
              {`Revive`}
              {!state.interactionEnabled && (
                <span className={BarTextDisabledReason}>{state.interactionDisabledReason}</span>
              )}
            </div>
          </div>
          <span className={DescriptionTitle}>Down Champion</span>
          <span className={Description}>Press and Hold to Revive</span>
        </div>
      </div>
    ) : null;
  }

  public componentDidUpdate(prevProps: Props) {
    const reviveProgressCurrent = findEntityResource(this.props.state.resources, EntityResourceIDs.ReviveProgress);
    const reviveProgressPrevious = findEntityResource(prevProps.state.resources, EntityResourceIDs.ReviveProgress);
    if (!this.state.isPressed && reviveProgressCurrent.current > reviveProgressPrevious.current) {
      // Going up
      this.setState({ isPressed: true });
    }

    if (this.state.isPressed && reviveProgressCurrent.current < reviveProgressPrevious.current) {
      // Going down
      this.setState({ isPressed: false });
    }
  }

  private getDownTimer(downedStateEndTime: number, worldTime: number) {
    const calculatedTime = Math.round(downedStateEndTime - worldTime);
    return Math.max(calculatedTime, 0);
  }
}
