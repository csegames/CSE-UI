/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { sendPlayerMessage } from '../PlayerMessage';
import { showRuneFullScreenEffect } from '../FullScreenEffects/Runes';

const ANIMATION_DURATION = 2;

const RuneContainer = styled.div`
  padding: 6px 0;
  text-align: center;
  width: 35px;
  max-width: 35px;
  margin-left: 3px;
  font-family: Exo;
  font-size: 13px;
  color: white;

  &.barrier {
    background-color: rgba(42, 82, 185, 1);
  }

  &.health {
    background-color: rgba(68, 174, 104, 1);
  }

  &.damage {
    position: relative;
    padding: 2px 5px;
    background-color: #a34603;
  }
`;

const ShineAnimation = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  animation: updateAnimation ${ANIMATION_DURATION}s linear;

  &.barrier {
    filter: brightness(150%);
    background-color: rgba(42, 82, 185, 1);
  }

  &.health {
    filter: brightness(150%);
    background-color: rgba(68, 174, 104, 1);
  }

  &.damage {
    filter: brightness(150%);
    background-color: rgba(254, 113, 0, 1);
  }

  @keyframes updateAnimation {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
`;

const RuneContent = styled.div`
  transform: skewX(10deg);
`;

const RuneIcon = styled.span`
  margin-left: 3px;
`;

export interface Props {
  runeType: RuneType;
  bonus: number;
  value: number;
}

export interface State {
  shouldPlayUpdateAnimation: boolean;
}

export class Rune extends React.Component<Props, State> {
  private updateAnimationHandle: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      shouldPlayUpdateAnimation: false,
    }
  }

  public render() {
    const runeClassName = this.getRuneClassName();
    return (
      <RuneContainer className={runeClassName}>
        {this.state.shouldPlayUpdateAnimation && <ShineAnimation className={runeClassName} />}
        <RuneContent>
          {this.props.value || 0}
          <RuneIcon className={this.getRuneIcon()}></RuneIcon>
        </RuneContent>
      </RuneContainer>
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.value && prevProps.value !== this.props.value) {
      window.setTimeout(() => sendPlayerMessage(this.getMessage(prevProps), 3000, RuneType[this.props.runeType]), 200);
      showRuneFullScreenEffect(this.props.runeType);
      this.playUpdateAnimation();
    }
  }

  public componentWillUnmount() {
    window.clearTimeout(this.updateAnimationHandle);
    this.updateAnimationHandle = null;
  }

  private playUpdateAnimation = () => {
    this.setState({ shouldPlayUpdateAnimation: true });

    this.updateAnimationHandle = window.setTimeout(() => {
      this.setState({ shouldPlayUpdateAnimation: false });
    }, ANIMATION_DURATION * 1000);
  }

  private getMessage = (prevProps: Props) => {
    switch (this.props.runeType) {
      case RuneType.Weapon: {
        return `+${this.props.bonus - prevProps.bonus}% Damage`;
      }
      case RuneType.Health: {
        const multiplier = (this.props.bonus - prevProps.bonus) / 100;
        const baseStat = this.getBaseStat();

        return `+${Math.round(baseStat * multiplier)} Health`;
      }
      case RuneType.Protection: {
        const multiplier = (this.props.bonus - prevProps.bonus) / 100;
        const baseStat = this.getBaseStat();

        return `+${Math.round(baseStat * multiplier)} Divine Barrier`;
      }
      default: {
        return '';
      }
    }
  }

  private getRuneClassName = () => {
    switch (this.props.runeType) {
      case RuneType.Weapon: {
        return 'damage';
      }
      case RuneType.Health: {
        return 'health';
      }
      case RuneType.Protection: {
        return 'barrier';
      }
      default: {
        return '';
      }
    }
  }

  private getRuneIcon = () => {
    switch (this.props.runeType) {
      case RuneType.Weapon: {
        return 'fs-icon-rune-damage';
      }
      case RuneType.Health: {
        return 'fs-icon-rune-health';
      }
      case RuneType.Protection: {
        return 'fs-icon-rune-barrier';
      }
      default: {
        return '';
      }
    }
  }

  private getBaseStat = () => {
    switch (this.props.runeType) {
      case RuneType.Health: {
        const maxHealth = hordetest.game.selfPlayerState.health[0].max;
        const multiplier = 1 + (this.props.bonus / 100);
        return maxHealth / multiplier;
      }

      case RuneType.Protection: {
        const maxProt = hordetest.game.selfPlayerState.blood.max;
        const multiplier = 1 + (this.props.bonus / 100);
        return maxProt / multiplier;
      }

      default: {
        return 0;
      }
    }
  }
}
