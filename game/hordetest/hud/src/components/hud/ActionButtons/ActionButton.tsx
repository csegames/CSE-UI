/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { Champions } from '../../context/ChampionInfoContext';

const ActionButtonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Colus;
`;

const Button = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 75px;
  background-color: rgba(0, 0, 0, 0.5);
  transform: skewX(-10deg);
  outline: 1px solid rgba(252, 244, 255, 0.3);
  outline-offset: -5px;

  &.disabled {
    box-shadow: inset 0 0 0 5px #AF000D;
  }

  &.activeAnim {
  }

  &.cooldownFinishedAnim {
    animation: cooldownFinished 1s;
  }

  &.knight {
    background-color: rgba(228, 180, 47, 0.85);
  }

  &.berserker {
    background-color: rgba(63, 211, 255, 0.85);
  }

  &.amazon {
    background-color: rgba(227, 112, 39, 0.85);
  }

  &.celt {
    background-color: rgba(62, 221, 185, 0.85);
  }

  &.cooldown {
    background-color: rgba(0, 0, 0, 0.7);
  }

  &.NotEnoughResource {
    background-color: rgba(255, 206, 82, 0.5);
    box-shadow: inset 0 0 0 5px rgba(255, 206, 82, 1);
  }

  &.BlockedByStatus {
    background-color: rgba(255, 0, 0, 0.5);
  }

  @keyframes cooldownFinished {
    0% {
      filter: brightness(100%);
    }
    50% {
      filter: brightness(300%);
    }
    100% {
      filter: brightness(100%);
    }
  }
`;

const ActionIcon = styled.span`
  font-size: 60px;
  color: white;
  transform: skewX(10deg);

  &.disabled {
    opacity: 0.8;
  }

  &.cooldown {
    color: #777e84;
  }
`;

const KeybindBox = styled.div`
  position: absolute;
  bottom: 0;
  left: -5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 17px;
  transform: skewX(-10deg);
  background-color: rgba(0, 0, 0, 0.7);
`;

const KeybindText = styled.span`
  color: white;
  font-family: Exo;
  font-weight: bold;
  font-size: 14px;
`;

const CooldownOverlay = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  border-top: 2px solid rgba(255, 255, 255, 0.8);

  &.BlockedByStatus {
    background-color: rgba(255, 0, 0, 0.6);
  }
`;

const CooldownText = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Colus;
  color: white;
  font-size: 30px;
  transform: skewX(10deg);
  -webkit-text-stroke-width: 8px;
  -webkit-text-stroke-color: black;
`;

const DisabledSlash = styled.img`
  position: absolute;
  top: -20%;
  right: 0;
  left: -20%;
  bottom: 0;
  width: 140%;
  height: 140%;
  object-fit: contain;
  transform: rotate(-5deg)
`;

export interface Props {
  actionIconClass: string;
  keybindText: string;
  keybindIconClass?: string;
  abilityID?: number;
  className?: string;
  cooldownTimer?: CurrentMax & { progress: number };
  isOnCooldown?: boolean;
  showActiveAnim?: boolean;
  disabled?: boolean;
  abilityDisabledReason?: AbilityButtonErrorFlag;
}

export interface State {
  shouldPlayCooldownFinishAnimation: boolean;
}

export class ActionButton extends React.Component<Props, State> {
  private cooldownFinishedAnimationTimeout: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      shouldPlayCooldownFinishAnimation: false,
    };
  }

  public render() {
    const { cooldownTimer } = this.props;
    const isOnCooldown = typeof this.props.cooldownTimer !== 'undefined' && this.props.cooldownTimer.current !== 0;
    const cooldownClass = isOnCooldown ? 'cooldown' : '';
    const disabledClass = this.props.disabled ? 'disabled' : '';
    const activeAnimClass = this.props.showActiveAnim && !this.props.disabled ? 'activeAnim' : '';
    const cooldownAnimClass = this.state.shouldPlayCooldownFinishAnimation ? 'cooldownFinishedAnim' : '';
    const disabledReasonClass = this.getDisabledReasonClass();
    return (
      <ActionButtonContainer className={this.props.className}>
        <Button
          className={`${disabledClass} ${activeAnimClass} ${this.getChampionClass()} ${cooldownClass} ${disabledReasonClass} ${cooldownAnimClass}`}>
          <ActionIcon className={`${this.props.actionIconClass} ${disabledClass} ${cooldownClass}`} />
          {isOnCooldown &&
            <CooldownOverlay
              className={disabledReasonClass}
              style={{ height: `${cooldownTimer.progress <= 100 ? cooldownTimer.progress : 100}%`}}
            />
          }
          {this.props.disabled && <DisabledSlash src={this.getDisabledSlashIcon()} />}
          {isOnCooldown && <CooldownText>{cooldownTimer.current}</CooldownText>}
        </Button>
        <KeybindBox>
          {this.props.keybindIconClass ?
            <KeybindText className={this.props.keybindIconClass}></KeybindText> :
            <KeybindText>{this.props.keybindText}</KeybindText>
          }
        </KeybindBox>
      </ActionButtonContainer>
    );
  }

  public componentDidUpdate(prevProps: Props) {
    const currentOnCooldown = typeof this.props.cooldownTimer !== 'undefined' && this.props.cooldownTimer.current !== 0;
    const prevOnCooldown = typeof prevProps.cooldownTimer !== 'undefined' && prevProps.cooldownTimer.current !== 0;
    if (prevOnCooldown && !currentOnCooldown) {
      this.playCooldownFinishedAnimation();
    }
  }

  public componentWillUnmount() {
    if (this.cooldownFinishedAnimationTimeout) {
      window.clearTimeout(this.cooldownFinishedAnimationTimeout);
    }
  }

  private getMyChampion = () => {
    const myChampion = hordetest.game.classes.find(c => c.id === cloneDeep(hordetest.game.selfPlayerState).classID);
    if (!myChampion) return null;

    return myChampion as CharacterClassDef;
  }

  private getChampionClass = () => {
    const myChampion = this.getMyChampion();
    if (!myChampion) return '';

    switch (myChampion.id) {
      case Champions.Knight: {
        return 'knight';
      }
      case Champions.Berserker: {
        return 'berserker'
      }
      case Champions.Celt: {
        return 'celt';
      }
      case Champions.Amazon: {
        return 'amazon';
      }
      default: '';
    }
  }

  private getDisabledReasonClass = () => {
    if (typeof this.props.abilityDisabledReason === 'undefined') return '';

    if (this.props.abilityDisabledReason & AbilityButtonErrorFlag.NotEnoughResource) {
      return 'NotEnoughResource';
    }

    if (this.props.abilityDisabledReason & AbilityButtonErrorFlag.BlockedByStatus) {
      return 'BlockedByStatus';
    }

    return '';
  }

  private getDisabledSlashIcon = () => {
    if (this.props.abilityDisabledReason & AbilityButtonErrorFlag.NotEnoughResource) {
      return 'images/hud/actionbutton/disabled-resource.svg';
    }

    return 'images/hud/actionbutton/disabled.svg';
  }

  private playCooldownFinishedAnimation = () => {
    if (this.cooldownFinishedAnimationTimeout) {
      window.clearTimeout(this.cooldownFinishedAnimationTimeout);
    }

    this.setState({ shouldPlayCooldownFinishAnimation: true });

    this.cooldownFinishedAnimationTimeout = window.setTimeout(() => {
      this.setState({ shouldPlayCooldownFinishAnimation: false });
      this.cooldownFinishedAnimationTimeout = null;
    }, 1000);
  }
}
