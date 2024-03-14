/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { Dispatch } from 'redux';
import { TimerBar } from './TimerBar';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { IDLookupTable } from '../../../../redux/gameSlice';
import {
  Ability,
  MessageType,
  strongAbilityID,
  ultimateAbilityID,
  weakAbilityID
} from '../../../../redux/abilitySlice';
import { ArrayMap, Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Status } from '@csegames/library/dist/hordetest/game/types/Status';
import { StatusDef } from '@csegames/library/dist/_baseGame/types/StatusDef';
import { AbilityErrorFlags, AbilityStateFlags } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { DeepImmutableObject } from '@csegames/library/dist/_baseGame/types/DeepImmutable';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { GameOption } from '@csegames/library/dist/_baseGame/types/Options';
import { GameOptionIDs } from '../../../../redux/gameOptionsSlice';

const Container = 'UrgentMessage-Container';

const Message = 'UrgentMessage-Message';

const StringIDHUDOnCooldown = 'HUDOnCooldown';
const StringIDHUDOutOfResource = 'HUDOutOfResource';
const StringIDHUDBlockedByStatus = 'HUDBlockedByStatus';

interface ComponentProps {}

interface InjectedProps {
  dispatch?: Dispatch;

  playerStatuses: ArrayMap<Status>;
  resourceName: string;
  statusDefs: IDLookupTable<StatusDef>;
  strongAbility: Ability;
  ultimateAbility: Ability;
  weakAbility: Ability;
  stringTable: Dictionary<StringTableEntryDef>;
  gameOptions: Dictionary<GameOption>;
}

type Props = ComponentProps & InjectedProps;

interface State {
  playAnimation: boolean;
  message: string;
  messageType: MessageType;
  blockingStatus: Status;
}

class AUrgentMessage extends React.Component<Props, State> {
  private timerTimeout: number;
  private animateTimeout: number;

  constructor(props: Props) {
    super(props);

    this.state = {
      playAnimation: false,
      message: '',
      messageType: MessageType.None,
      blockingStatus: {
        id: 0,
        duration: 0,
        startTime: 0
      }
    };
  }

  public componentDidUpdate(prevProps: Props): void {
    if (prevProps.weakAbility.lastActivated != this.props.weakAbility.lastActivated) {
      this.handleAbilityActivated(this.props.weakAbility);
    }

    if (prevProps.strongAbility.lastActivated != this.props.strongAbility.lastActivated) {
      this.handleAbilityActivated(this.props.strongAbility);
    }

    if (prevProps.ultimateAbility.lastActivated != this.props.ultimateAbility.lastActivated) {
      this.handleAbilityActivated(this.props.ultimateAbility);
    }
  }

  public render() {
    const animateClass: string = this.state.playAnimation ? 'animate' : '';
    return (
      <div id='UrgentMessageContainer' className={`${Container} ${animateClass}`}>
        {this.renderMessage()}
      </div>
    );
  }

  private renderMessage = () => {
    switch (this.state.messageType) {
      case MessageType.BlockedByStatus:
        return (
          <>
            <div className={`${Message} ${MessageType[MessageType.BlockedByStatus]}`}>{this.state.message}</div>
            {this.timerBar()}
          </>
        );
      case MessageType.NotEnoughResource:
        return <div className={`${Message} ${MessageType[MessageType.NotEnoughResource]}`}>{this.state.message}</div>;
      case MessageType.OnCooldown:
        return <div className={`${Message} ${MessageType[MessageType.OnCooldown]}`}>{this.state.message}</div>;
      default:
        return;
    }
  };

  private timerBar(): JSX.Element {
    if (!this.state.blockingStatus || !this.state.blockingStatus.id) {
      return null;
    }

    return <TimerBar duration={this.state.blockingStatus.duration} startTime={this.state.blockingStatus.startTime} />;
  }

  private handleAbilityActivated(ability: Ability): void {
    if (ability.state & AbilityStateFlags.Cooldown) {
      this.setMessage(
        MessageType.OnCooldown,
        getStringTableValue(StringIDHUDOnCooldown, this.props.stringTable),
        3000,
        null
      );
    } else if (ability.errors & AbilityErrorFlags.BlockedByStatus) {
      this.showBlockedByStatusMessage();
    } else if (ability.errors & AbilityErrorFlags.NotEnoughResource) {
      this.setMessage(
        MessageType.NotEnoughResource,
        getTokenizedStringTableValue(StringIDHUDOutOfResource, this.props.stringTable, {
          RESOURCE: this.props.resourceName
        }),
        3000,
        null
      );
    }
  }

  private setMessage(type: MessageType, msg: string, duration: number, blockingStatus: Status): void {
    this.setState({
      message: msg,
      messageType: type,
      blockingStatus: blockingStatus
    });

    if (this.timerTimeout) {
      window.clearTimeout(this.timerTimeout);
    }

    this.timerTimeout = window.setTimeout(
      () => {
        this.setState({ messageType: MessageType.None });
        this.timerTimeout = null;
      },
      duration ? duration : 3000
    );

    this.animateMessage(type);
  }

  private animateMessage = (type: MessageType) => {
    if (this.animateTimeout) {
      return;
    }

    this.setState({ playAnimation: true });

    const optPlaySFX = this.props.gameOptions[GameOptionIDs.PlayAbilityDisabledSFX];
    if (optPlaySFX && optPlaySFX.value) {
      switch (type) {
        case MessageType.OnCooldown:
          game.playGameSound(SoundEvents.PLAY_UI_ABILITY_COOLDOWN);
          break;
        case MessageType.NotEnoughResource:
          game.playGameSound(SoundEvents.PLAY_UI_ABILITY_OUT_OF_RESOURCE);
          break;
        case MessageType.BlockedByStatus:
          game.playGameSound(SoundEvents.PLAY_UI_ABILITY_DISABLED);
          break;
      }
    }

    this.animateTimeout = window.setTimeout(() => {
      this.setState({ playAnimation: false });
      this.animateTimeout = null;
    }, 300);
  };

  private showBlockedByStatusMessage = () => {
    let blockingStatus: Status;

    const statuses: Status[] = Object.values(this.props.playerStatuses);

    for (let i: number = 0; i < statuses.length; i++) {
      if (statuses[i].duration == Infinity) {
        continue;
      }

      const statusDef: DeepImmutableObject<StatusDef> = this.props.statusDefs[statuses[i].id];

      if (!statusDef || !(statusDef as any).blocksAbilities) {
        continue;
      }

      if (blockingStatus == undefined) {
        blockingStatus = statuses[i];
        continue;
      }

      //only replace blockingStatus value if the next value has a longer remaining duration.
      const blockingStatusDurationRemaining = blockingStatus.startTime + blockingStatus.duration - game.worldTime;
      const currentStatusDurationRemaining = statuses[i].startTime + statuses[i].duration - game.worldTime;

      if (currentStatusDurationRemaining > blockingStatusDurationRemaining) {
        blockingStatus = statuses[i];
      }
    }

    if (!blockingStatus) {
      // We should always have a blocking status, if we don't default to a basic message and show it for a second
      this.setMessage(
        MessageType.BlockedByStatus,
        getStringTableValue(StringIDHUDBlockedByStatus, this.props.stringTable),
        1000,
        blockingStatus
      );
      return;
    }

    const blockingStatusDef = this.props.statusDefs[blockingStatus.id];
    const messageDuration = blockingStatus.duration - (game.worldTime - blockingStatus.startTime);

    this.setMessage(
      MessageType.BlockedByStatus,
      blockingStatusDef.displayInfoName,
      messageDuration * 1000,
      blockingStatus
    );
  };
}

function mapStateToProps(state: RootState): Props {
  const characterRaceDefs = state.game.characterRaceDefs;
  const playerRace = state.player.race;
  const playerRaceDef = characterRaceDefs[playerRace];
  const { stringTable } = state.stringTable;
  const { gameOptions } = state.gameOptions;

  let resourceName = '';
  if (playerRaceDef !== undefined) {
    resourceName = playerRaceDef.resourceName;
  }

  return {
    playerStatuses: state.player.statuses,
    resourceName,
    statusDefs: state.game.statusDefs,
    strongAbility: state.abilities[strongAbilityID],
    ultimateAbility: state.abilities[ultimateAbilityID],
    weakAbility: state.abilities[weakAbilityID],
    stringTable: stringTable,
    gameOptions: gameOptions
  };
}

export const UrgentMessage = connect(mapStateToProps)(AUrgentMessage);
