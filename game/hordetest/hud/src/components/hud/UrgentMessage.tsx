/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  text-transform: uppercase;
  font-family: Exo;
  font-weight: bold;
  font-size: 23px;
  color: #ffce52;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;

  &.visible {
    opacity: 1;
  }

  &.animate {
    animation: shake 0.3s;
  }

  @keyframes shake  {
    33% {
      transform: translateX(-8px);
    }

    66% {
      transform: translateX(8px);
    }

    100% {
      transform: translateX(0);
    }
  }
`;

export interface Props {
}

export interface State {
  isVisible: boolean;
  playAnimation: boolean;
  message: string;
}

export class UrgentMessage extends React.Component<Props, State> {
  private weakEVH: EventHandle;
  private strongEVH: EventHandle;
  private ultimateEVH: EventHandle;
  private timerTimeout: number;
  private animateTimeout: number;
  private resourceName: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: false,
      playAnimation: false,
      message: '',
    };
  }

  public render() {
    const animateClass = this.state.playAnimation ? 'animate' : '';
    const visibilityClass = this.state.isVisible ? 'visible' : '';
    return (
      <Container className={`${animateClass} ${visibilityClass}`}>{this.state.message}</Container>
    );
  }

  public componentDidMount() {
    this.initializeResourceName();
    this.initializeActivatedListeners();
  }

  public componentDidUpdate() {
    if (!this.weakEVH || !this.strongEVH || !this.ultimateEVH) {
      // An activated listener has not been initialized yet
      this.initializeActivatedListeners();
      return;
    }

    if (!this.resourceName) {
      // A resource name has not been initialized yet
      this.initializeResourceName();
      return;
    }
  }

  public componentWillUnmount() {
    if (this.weakEVH) {
      this.weakEVH.clear();
    }

    if (this.strongEVH) {
      this.strongEVH.clear();
    }

    if (this.ultimateEVH) {
      this.ultimateEVH.clear();
    }
  }

  private initializeResourceName = () => {
    if (this.resourceName || !hordetest.game.races) return;
    const race = hordetest.game.races.find(r => r.id === hordetest.game.selfPlayerState.race);
    if (race) {
      this.resourceName = race.resourceName;
    }
  }

  private initializeActivatedListeners = () => {
    const weakAbility = hordetest.game.abilityStates[hordetest.game.abilityBarState.weak.id];
    if (weakAbility && !this.weakEVH) {
      this.weakEVH = weakAbility.onActivated(() => this.onHandleAbilityActivated(weakAbility));
    }

    const strongAbility = hordetest.game.abilityStates[hordetest.game.abilityBarState.strong.id];
    if (strongAbility && !this.strongEVH) {
      this.strongEVH = strongAbility.onActivated(() => this.onHandleAbilityActivated(strongAbility));
    }

    const ultimateAbility = hordetest.game.abilityStates[hordetest.game.abilityBarState.ultimate.id];
    if (ultimateAbility && !this.ultimateEVH) {
      this.ultimateEVH = ultimateAbility.onActivated(() => this.onHandleAbilityActivated(ultimateAbility));
    }
  }

  private onHandleAbilityActivated = (ability: AbilityState) => {
    if (!(ability.status & AbilityButtonState.Unusable)) {
      if (this.state.isVisible) {
        this.setState({ isVisible: false, message: '' });
      }
      return;
    }

    if (ability.error & AbilityButtonErrorFlag.NotEnoughResource) {
      this.showNoResourceMessage();
    }
  }

  private showNoResourceMessage = () => {
    this.setState({ isVisible: true, message: `Out of ${this.resourceName}` });
    this.startTimer();
    this.animateMessage();
  }

  private startTimer = () => {
    if (this.timerTimeout) {
      window.clearTimeout(this.timerTimeout);
    }

    this.timerTimeout = window.setTimeout(() => {
      this.setState({ isVisible: false });
      this.timerTimeout = null;
    }, 3000);
  }

  private animateMessage = () => {
    if (this.animateTimeout) {
      return;
    }

    this.setState({ playAnimation: true });

    this.animateTimeout = window.setTimeout(() => {
      this.setState({ playAnimation: false });
      this.animateTimeout = null;
    }, 300);
  }
}
