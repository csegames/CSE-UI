/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const ActionButtonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.5);
  transform: skewX(-10deg);
`;

const ActionIcon = styled.span`
  font-size: 40px;
  color: #c9c5bc;
  transform: skewX(10deg);
`;

const KeybindBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.7);
`;

const KeybindText = styled.span`
  color: white;
  font-weight: bold;
  font-size: 15px;
`;

const CooldownOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left:0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CooldownText = styled.div`
  color: white;
  font-size: 25px;
  transform: skewX(10deg);
`;

export interface Props {
  actionIconClass: string;
  keybindText: string;
  abilityID?: number;
  className?: string;
}

export interface State {
  cooldownTimer: number;
}

export class ActionButton extends React.Component<Props, State> {
  private abilityStateHandle: EventHandle;
  constructor(props: Props) {
    super(props);
    this.state = {
      cooldownTimer: 0,
    };
  }

  public render() {
    return (
      <ActionButtonContainer className={this.props.className}>
        <Button>
          <ActionIcon className={this.props.actionIconClass} />
          {this.state.cooldownTimer !== 0 &&
            <CooldownOverlay>
              <CooldownText>{this.state.cooldownTimer}</CooldownText>
            </CooldownOverlay>
          }
        </Button>

        <KeybindBox>
          <KeybindText>{this.props.keybindText}</KeybindText>
        </KeybindBox>
      </ActionButtonContainer>
    );
  }

  public componentDidMount() {
    if (this.props.abilityID) {
      // Do initial check
      this.checkStartCountdown();

      // Check on updated
      this.abilityStateHandle = hordetest.game.abilityStates[this.props.abilityID].onUpdated(() => {
        this.checkStartCountdown();
      });
    }
  }

  public componentWillUnmount() {
    this.abilityStateHandle.clear();
  }

  private checkStartCountdown = () => {
    const ability = hordetest.game.abilityStates[this.props.abilityID];
    if (ability.status & AbilityButtonState.Cooldown) {
      this.startCountdown(ability.timing)
    }
  }

  private startCountdown = (cooldown: Timing) => {
    if (cooldown && this.state.cooldownTimer === 0) {
      this.setState({ cooldownTimer: Math.round(this.getTimingEnd(cooldown) / 1000) });
      window.setTimeout(this.decrementCountdown, 1000);
    }
  }

  private decrementCountdown = () => {
    if (!this.state.cooldownTimer) return;
    this.setState({ cooldownTimer: this.state.cooldownTimer - 1 });
    window.setTimeout(this.decrementCountdown, 1000);
  }

  private getTimingEnd = (timing: DeepImmutableObject<Timing>) => {
    const timingEnd = ((timing.start + timing.duration) - game.worldTime) * 1000;
    return timingEnd;
  }
}
