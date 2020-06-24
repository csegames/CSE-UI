/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { ActionButton } from './ActionButton';
import { StatusContext, StatusContextState } from 'context/StatusContext';
import { findBlockingStatuses, findMostBlockingStatus } from '../../../lib/statusHelpers';

export interface ComponentProps {
  type: 'weak' | 'strong' | 'ultimate';
  actionIconClass: string;
  keybindText: string;
  keybindIconClass?: string;
  abilityID?: number;
  className?: string;
}

export interface InjectedProps {
  statusContext: StatusContextState;
}

export type Props = ComponentProps & InjectedProps;

export interface State {
  cooldownTimer: CurrentMax & Timing & { progress: number };
  isReady: boolean;
  abilityDisabledReason: AbilityButtonErrorFlag;
}

class AbilityButtonWithInjectedContext extends React.Component<Props, State> {
  private abilityStateHandle: EventHandle;
  private playerStateHandle: EventHandle;
  private progressUpdateTimeout: number;
  constructor(props: Props) {
    super(props);

    const ability = this.getAbility();
    this.state = {
      cooldownTimer: { start: 0, duration: 0, current: 0, max: 0, progress: 0 },
      isReady: this.getIsReady(),
      abilityDisabledReason: ability ? ability.error : AbilityButtonErrorFlag.None,
    };
  }

  public render() {
    return (
      <ActionButton
        showActiveAnim={this.shouldShowActiveAnim()}
        disabled={!this.state.isReady}
        abilityDisabledReason={this.state.abilityDisabledReason}
        actionIconClass={this.props.actionIconClass}
        keybindText={this.props.keybindText}
        abilityID={this.props.abilityID}
        className={this.props.className}
        cooldownTimer={this.state.cooldownTimer}
        keybindIconClass={this.props.keybindIconClass}
      />
    );
  }

  public componentDidMount() {
    if (this.props.abilityID) {
      // Do initial check
      this.checkStartCountdown();

      // Check on updated

      this.abilityStateHandle = hordetest.game.abilityStates[this.props.abilityID].onUpdated(() => {
        this.checkIsReady();
        this.checkStartCountdown();
        this.checkAbilityDisabledReason();
      });

      this.playerStateHandle = hordetest.game.selfPlayerState.onUpdated(() => {
        this.checkStartCountdown();
      });
    }
  }

  public componentWillUnmount() {
    this.abilityStateHandle.clear();
    this.playerStateHandle.clear();
  }

  private shouldShowActiveAnim = () => {
    return this.state.cooldownTimer.current === 0;
  }

  private checkStartCountdown = (playerStatuses?: Status[]) => {
    const ability = this.getAbility();
    if (!ability) return;

    if (ability.status & AbilityButtonState.Cooldown) {
      if (ability.timing.start && ability.timing.duration && ability.timing.start !== this.state.cooldownTimer.start) {
        this.startCountdown(ability.timing);
      }
      return;
    }

    if (ability.error & AbilityButtonErrorFlag.BlockedByStatus) {
      const playerStatuses = cloneDeep(hordetest.game.selfPlayerState).statuses;
      const blockingStatuses = findBlockingStatuses(playerStatuses, this.props.statusContext);
      if (blockingStatuses.length === 0) {
        // If we get here, player state have not gotten an update yet. We're listening to selfPlayerState updates
        // so if we hit this case it should be resolved with the next update.
        return;
      }

      const blockingStatus = findMostBlockingStatus(blockingStatuses);
      if (blockingStatus.duration === Infinity || blockingStatus.duration === NaN) {
        return;
      }

      this.startCountdown({ start: blockingStatus.startTime, duration: blockingStatus.duration });
      return;
    }

    if (this.state.cooldownTimer.start != 0) {
      // the UI thinks we're still in cooldown, but the server said we were not 
      // we need to reset the cooldown settings
      this.startCountdown(ability.timing);
    }
  }

  private checkIsReady = () => {
    const isReady = this.getIsReady();
    if (isReady !== this.state.isReady) {
      this.setState({ isReady });
    }
  }

  private checkAbilityDisabledReason = () => {
    const ability = this.getAbility();
    if (ability.error !== this.state.abilityDisabledReason) {
      this.setState({ abilityDisabledReason: ability.error });
    }
  }

  private startCountdown = (cooldown: Timing) => {
    const cooldownClone = cloneDeep(cooldown);
    if (cooldownClone) {
      const timer = Math.ceil(this.getTimingEnd(cooldownClone));
      this.setState({
        cooldownTimer: {
          ...cooldownClone,
          current: timer,
          max: cooldownClone.duration,
          progress: this.getProgress(cooldownClone.start, cooldownClone.duration).progress,
        },
      });
      window.clearTimeout(this.progressUpdateTimeout);
      this.progressUpdateTimeout = window.setTimeout(this.updateProgress, 66);
    }
  }

  private updateProgress = () => {
    const currentProgress = this.getProgress(this.state.cooldownTimer.start, this.state.cooldownTimer.max);
    const current = Number(currentProgress.current.toFixed(0));

    this.setState((state) => {
      return {
        ...state,
        cooldownTimer: {
          ...this.state.cooldownTimer,
          current,
          progress: currentProgress.progress,
        },
      }
    });

    if (current === 0) return;
    this.progressUpdateTimeout = window.setTimeout(this.updateProgress, 66);
  }

  private getProgress = (start: number, max: number) => {
    const elapsed = game.worldTime - start;
    let current = max - elapsed;
    if (current < 0) {
      current = 0;
    }

    return {
      progress: max == 0 ? 0 : current / max * 100,
      current,
    };
  }

  private getTimingEnd = (timing: DeepImmutableObject<Timing>) => {
    if (timing.start == 0)
    {
      return 0;
    }

    const timingEnd = ((timing.start + timing.duration) - game.worldTime);
    return timingEnd;
  }

  private getIsReady = () => {
    const ability = this.getAbility();
    if (!ability) {
      return false;
    }

    if (ability.status & AbilityButtonState.Unusable) {
      return false;
    } else {
      return true;
    }
  }

  private getAbility = () => {
    if (!this.props.abilityID || !hordetest.game.abilityStates[this.props.abilityID]) return null;

    return cloneDeep(hordetest.game.abilityStates[this.props.abilityID]);
  }
}

export function AbilityButton(props: ComponentProps) {
  const statusContext = useContext(StatusContext);

  return (
    <AbilityButtonWithInjectedContext {...props} statusContext={statusContext} />
  );
}
