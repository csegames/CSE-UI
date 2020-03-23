/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { StatusContext, StatusContextState } from 'context/StatusContext';
import { TimerBar } from './TimerBar';
import { findBlockingStatuses, findMostBlockingStatus } from '../../../lib/statusHelpers';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-transform: uppercase;
  font-family: Exo;
  font-weight: bold;
  font-size: 23px;
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

const Message = styled.div`
  &.NotEnoughResource {
    color: #ffce52;
  }

  &.BlockedByStatus {
    color: red;
  }
`;

enum MessageType {
  None = 0,
  NotEnoughResource,
  BlockedByStatus,
}

export interface Props {
  statusContext: StatusContextState;
}

export interface State {
  isVisible: boolean;
  playAnimation: boolean;
  message: string;
  messageType: MessageType;
  blockingStatus: Status;
}

class UrgentMessageWithInjectedContext extends React.Component<Props, State> {
  private weakEVH: EventHandle;
  private strongEVH: EventHandle;
  private ultimateEVH: EventHandle;
  private playerStateEVH: EventHandle;
  private timerTimeout: number;
  private animateTimeout: number;
  private resourceName: string;

  private currentChampion: number = cloneDeep(hordetest.game.selfPlayerState).classID;

  constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: false,
      playAnimation: false,
      message: '',
      messageType: MessageType.None,
      blockingStatus: {
        id: 0,
        duration: 0,
        startTime: 0,
      },
    };
  }

  public render() {
    const animateClass = this.state.playAnimation ? 'animate' : '';
    const visibilityClass = this.state.isVisible ? 'visible' : '';
    return (
      <Container className={`${animateClass} ${visibilityClass}`}>
        {this.renderMessage()}
      </Container>
    );
  }

  public componentDidMount() {
      this.initializeResourceName();
      this.initializeActivatedListeners();

      this.playerStateEVH = hordetest.game.selfPlayerState.onUpdated(this.onSelfPlayerStateUpdate);
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
    this.clearAbilityEventHandlers();

    if (this.playerStateEVH) {
      this.playerStateEVH.clear();
    }
  }

  private renderMessage = () => {
    switch (this.state.messageType) {
      case MessageType.BlockedByStatus: {
        return (
          <>
            <Message className={`${MessageType[MessageType.BlockedByStatus]} ${this.state.message}`}>
              {this.state.message}
            </Message>
            <TimerBar duration={this.state.blockingStatus.duration} startTime={this.state.blockingStatus.startTime} />
          </>
        );
      }

      case MessageType.NotEnoughResource: {
        return (
          <Message className={MessageType[MessageType.NotEnoughResource]}>{this.state.message}</Message>
        );
      }

      default: {
        return null;
      }
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
      this.weakEVH = weakAbility.onActivated(() => this.onHandleAbilityActivated(weakAbility.id));
    }

    const strongAbility = hordetest.game.abilityStates[hordetest.game.abilityBarState.strong.id];
    if (strongAbility && !this.strongEVH) {
      this.strongEVH = strongAbility.onActivated(() => this.onHandleAbilityActivated(strongAbility.id));
    }

    const ultimateAbility = hordetest.game.abilityStates[hordetest.game.abilityBarState.ultimate.id];
    if (ultimateAbility && !this.ultimateEVH) {
      this.ultimateEVH = ultimateAbility.onActivated(() => this.onHandleAbilityActivated(ultimateAbility.id));
    }
  }

  private onHandleAbilityActivated = (abilityID: number) => {
    const ability = hordetest.game.abilityStates[abilityID];
    if (!(ability.status & AbilityButtonState.Unusable)) {
      if (this.state.isVisible) {
        this.setState({ isVisible: false, message: '', messageType: MessageType.None });
      }
      return;
    }

    if (ability.error & AbilityButtonErrorFlag.BlockedByStatus) {
      this.showBlockedByStatusMessage();
      return;
    }

    if (ability.error & AbilityButtonErrorFlag.NotEnoughResource) {
      this.showNoResourceMessage();
    }
  }

  private onSelfPlayerStateUpdate = () => {
    const playerStateClone = cloneDeep(hordetest.game.selfPlayerState);
    if (playerStateClone.classID !== this.currentChampion) {
      this.clearAbilityEventHandlers();
      this.resourceName = null;

      this.initializeActivatedListeners();
      this.initializeActivatedListeners();
      this.currentChampion = playerStateClone.classID;
    }
  }

  private showNoResourceMessage = () => {
    this.setState({ isVisible: true, message: `Out of ${this.resourceName}`, messageType: MessageType.NotEnoughResource });
    this.startTimer();
    this.animateMessage();
  }

  private showBlockedByStatusMessage = () => {
    const playerStateClone = cloneDeep(hordetest.game.selfPlayerState);

    // Find which status is blocking
    const blockingStatuses = findBlockingStatuses(playerStateClone.statuses, this.props.statusContext);
    const blockingStatus = findMostBlockingStatus(blockingStatuses);
    const blockingStatusDef = this.props.statusContext.statusDefs.find(def => blockingStatus.id === def.id);
    const messageDuration = blockingStatus.duration - (game.worldTime - blockingStatus.startTime);
    if (!blockingStatusDef) {
      // We should always have the statusDef for a blocking status, if we don't default to a basic message
      this.setState({
        isVisible: true,
        message: 'Blocked by status',
        messageType: MessageType.BlockedByStatus,
        blockingStatus,
      });
      this.startTimer(messageDuration * 1000);
      this.animateMessage();
      return;
    }

    this.setState({
      isVisible: true,
      message: blockingStatusDef.displayInfoName,
      messageType: MessageType.BlockedByStatus,
      blockingStatus,
    });
    this.startTimer(messageDuration * 1000);
    this.animateMessage();
  }

  private startTimer = (duration?: number) => {
    if (this.timerTimeout) {
      window.clearTimeout(this.timerTimeout);
    }

    this.timerTimeout = window.setTimeout(() => {
      this.setState({ isVisible: false, messageType: MessageType.None });
      this.timerTimeout = null;
    }, duration ? duration : 3000);
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

  private clearAbilityEventHandlers = () => {
    if (this.weakEVH) {
      this.weakEVH.clear();
      this.weakEVH = null;
    }

    if (this.strongEVH) {
      this.strongEVH.clear();
      this.strongEVH = null;
    }

    if (this.ultimateEVH) {
      this.ultimateEVH.clear();
      this.ultimateEVH = null;
    }
  }
}

export function UrgentMessage() {
  const statusContext = useContext(StatusContext);
  return (
    <UrgentMessageWithInjectedContext statusContext={statusContext} />
  );
}
