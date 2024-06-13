import { CharacterClassDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';
import { Status } from '@csegames/library/dist/hordetest/game/types/Status';
import { StatusDef } from '@csegames/library/dist/_baseGame/types/StatusDef';
import { game } from '@csegames/library/dist/_baseGame';
import { CurrentMax } from '@csegames/library/dist/_baseGame/types/CurrentMax';
import { DeepImmutableObject } from '@csegames/library/dist/_baseGame/types/DeepImmutable';
import { Binding, Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { ArrayMap, Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import * as React from 'react';
import { connect } from 'react-redux';
import { IDLookupTable } from '../../../../redux/gameSlice';
import { RootState } from '../../../../redux/store';
import {
  ActionButtonContainer,
  ActionIcon,
  Button,
  CooldownText,
  DisabledSlash,
  KeybindBox,
  KeybindText,
  CountBox,
  CountText
} from './ActionButtonElements';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import {
  AbilityDisplayDef,
  AbilityErrorFlags,
  AbilityStateFlags,
  AbilityStatus
} from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { AbilityState } from '../../../../redux/abilitySlice';
import { TimeRange } from '@csegames/library/dist/_baseGame/types/TimeRange';
import { ChampionInfoState } from '../../../../redux/championInfoSlice';
import {
  EntityResource,
  findEntityResourceByNumericID
} from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { GameOption } from '@csegames/library/dist/_baseGame/types/Options';
import { GameOptionIDs } from '../../../../redux/gameOptionsSlice';

interface ReactProps {
  type: string;
  abilityIndex: keyof AbilityState;
}

interface InjectedProps {
  classID: number;
  champions: ChampionInfoState;
  characterClassDefs: IDLookupTable<CharacterClassDef>;
  abilityDisplayDefs: IDLookupTable<AbilityDisplayDef>;
  ability: AbilityStatus;
  statuses: ArrayMap<Status>;
  statusDefs: IDLookupTable<StatusDef>;
  worldTime: number;
  usingGamepad: boolean;
  resources: ArrayMap<EntityResource>;
  gameOptions: Dictionary<GameOption>;
}

type Props = ReactProps & InjectedProps;

interface State {}

class AActionButton extends React.Component<Partial<Props>, State> {
  private abilityCooldownTimer: CurrentMax | null;
  private blockingStatusTimer: CurrentMax | null;

  private cooldownFinishedAnimationTimeout: number;
  private shouldPlayCooldownFinishAnimation: boolean;

  constructor(props: Props) {
    super(props);
  }

  public componentDidUpdate(prevProps: Props) {
    const wasOnCooldown = !!(prevProps.ability.state & AbilityStateFlags.Cooldown);
    const prevBlockedOrOnCooldown = wasOnCooldown || !!this.blockingStatusTimer;

    this.blockingStatusTimer = this.createBlockingStatusTimer();
    this.abilityCooldownTimer = this.isOnCooldown() ? this.createTimer(this.props.ability.timing) : null;

    const currentOnCooldown = !!this.abilityCooldownTimer && this.abilityCooldownTimer.current !== 0;
    const currentBlocked = !!this.blockingStatusTimer && this.blockingStatusTimer.current !== 0;

    if (prevBlockedOrOnCooldown && !currentOnCooldown && !currentBlocked) {
      const optPlayCooldownSFX = this.props.gameOptions[GameOptionIDs.PlayAbilityCooldownOverSFX];
      if (optPlayCooldownSFX && optPlayCooldownSFX.value && wasOnCooldown && !this.isOnCooldown()) {
        game.playGameSound(SoundEvents.PLAY_UI_ABILITY_COOLDOWN_OVER);
      }

      this.playCooldownFinishedAnimation();
    }
  }

  public componentWillUnmount() {
    if (this.cooldownFinishedAnimationTimeout) {
      window.clearTimeout(this.cooldownFinishedAnimationTimeout);
    }
  }

  public render() {
    return (
      <div id={`ActionButtonContainer_${this.props.type}`} className={ActionButtonContainer}>
        <div
          id={`AbilityButton_${this.props.type}`}
          className={`${this.getButtonClassList()}`}
          style={this.getButtonClassStyle()}
        >
          <span id={`AbilityActionIcon_${this.props.type}`} className={`${this.getActionIconClassList()}`} />
          {this.getDisabledSlash()}
          {this.getCooldownText()}
          {this.getCountDiv()}
        </div>
        <div id={`KeybindBox_${this.props.type}`} className={KeybindBox}>
          {this.getKeybindText()}
        </div>
      </div>
    );
  }

  private getDisabledSlash(): JSX.Element {
    if (this.isDisabled()) {
      return <img className={DisabledSlash} src={this.getDisabledSlashIcon()} />;
    }
    return null;
  }

  private getCooldownText(): JSX.Element {
    if (this.isDisabled() && this.blockingStatusTimer) {
      return (
        <div
          className={this.getDisabledReasonClass()}
          style={{
            backgroundPosition: `100% ${
              (100 - this.getCooldownOverlayHeight(this.blockingStatusTimer)) * 0.01 * 6.95
            }vmin`
          }}
        >
          {Math.ceil(this.blockingStatusTimer.current)}
        </div>
      );
    } else if (this.isOnCooldown() && this.abilityCooldownTimer) {
      return (
        <div
          className={this.getDisabledReasonClass()}
          style={{
            backgroundPosition: ` ${100}% ${
              (100 - this.getCooldownOverlayHeight(this.abilityCooldownTimer)) * 0.01 * 6.95
            }vmin`
          }}
        >
          {Math.ceil(this.abilityCooldownTimer.current)}
        </div>
      );
    }

    return null;
  }

  private getCountDiv(): JSX.Element {
    const displayID = this.props.ability?.displayDefID;
    const entityResourceID = this.props.abilityDisplayDefs[displayID]?.entityResourceID ?? 0;
    let displayCount: string = null;

    if (entityResourceID > 0) {
      const resource = findEntityResourceByNumericID(this.props.resources, entityResourceID);
      if (resource) {
        displayCount = resource.current.toFixed(0);
      }
    } else {
      const summonCount: number = this.props.ability.summonCount || 0;

      if (summonCount > 0) {
        displayCount = summonCount.toFixed(0);
      }
    }

    if (displayCount != null) {
      return (
        <div className={CountBox}>
          <span className={`${CountText}`} style={{ color: `${this.getRGBAColor()}` }}>
            {displayCount}
          </span>
        </div>
      );
    }

    return null;
  }

  private getKeybindText(): JSX.Element {
    const keybind = this.getKeybind();

    return keybind.iconClass ? (
      <span className={`${KeybindText} ${keybind.iconClass}`} />
    ) : (
      <span className={KeybindText}>{keybind.name}</span>
    );
  }

  private getButtonClassStyle(): React.CSSProperties {
    if (
      this.props.ability.state & AbilityStateFlags.Cooldown ||
      this.isNotEnoughResource() ||
      this.props.ability.errors & AbilityErrorFlags.BlockedByStatus
    ) {
      return null;
    }

    return { backgroundColor: `${this.getRGBAColor()}` };
  }

  private getButtonClassList(): string {
    let classList: string = `${Button} `;

    if (this.isDisabled()) {
      classList += 'disabled ';
    }

    if (this.props.ability.state & AbilityStateFlags.Cooldown) {
      classList += 'cooldown ';
    } else if (this.isNotEnoughResource()) {
      classList += 'NotEnoughResource ';
    } else if (this.props.ability.errors & AbilityErrorFlags.BlockedByStatus) {
      classList += 'BlockedByStatus ';
    }

    if (this.shouldPlayCooldownFinishAnimation) {
      classList += 'cooldownFinishedAnim ';
    }

    return classList;
  }

  private getActionIconClassList(): string {
    const displayID = this.props.ability?.displayDefID;
    const iconClass = displayID ? this.props.abilityDisplayDefs[displayID]?.iconClass : null;

    let classList: string = `${ActionIcon} ${iconClass} `;

    if (this.props.ability.state & AbilityStateFlags.Unusable) {
      classList += 'disabled ';
    }

    if (this.props.ability.state & AbilityStateFlags.Cooldown) {
      classList += 'cooldown ';
    }

    return classList;
  }

  private getDisabledReasonClass(): string {
    let classList: string = `${CooldownText}`;
    if (this.isNotEnoughResource()) {
      return `${classList} NotEnoughResource `;
    }

    if (this.props.ability.errors & AbilityErrorFlags.BlockedByStatus) {
      return `${classList} BlockedByStatus `;
    }

    return classList;
  }

  private isDisabled(): boolean {
    if (this.props.ability.state & AbilityStateFlags.Running) {
      return false;
    }

    return !!(this.props.ability.state & AbilityStateFlags.Unusable);
  }

  private isNotEnoughResource(): boolean {
    return !!(this.props.ability.errors & AbilityErrorFlags.NotEnoughResource);
  }

  private isOnCooldown(): boolean {
    return !!(this.props.ability.state & AbilityStateFlags.Cooldown);
  }

  private getDisabledSlashIcon = () => {
    if (this.props.ability.errors & AbilityErrorFlags.NotEnoughResource) {
      return 'images/hud/actionbutton/disabled-resource.svg';
    }

    return 'images/hud/actionbutton/disabled.svg';
  };

  private getKeybind(): DeepImmutableObject<Binding> {
    // @TODO figure out a way to leverage the dictionary the binding is a part of.
    const keybind: DeepImmutableObject<Keybind> = Object.values(game.keybinds).find((k) => {
      return k.description === `Ability ${this.props.abilityIndex - 1} (${this.props.type})`;
    });

    return this.props.usingGamepad ? keybind.binds[1] : keybind.binds[0];
  }

  private createBlockingStatusTimer(): CurrentMax | null {
    let blockingStatus: Status;

    const statuses: Status[] = Object.values(this.props.statuses);
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

    if (blockingStatus == undefined) {
      return null;
    }

    if (blockingStatus.duration === Infinity || isNaN(blockingStatus.duration)) {
      return null;
    }

    return this.createTimer({ start: blockingStatus.startTime, duration: blockingStatus.duration });
  }

  private createTimer(timing: TimeRange): CurrentMax | null {
    if (!timing || timing.start <= 0 || timing.duration <= 0) {
      return null;
    }

    // calculate time remaining
    const current = timing.duration + (timing.start - game.worldTime);
    if (current <= 0) {
      return null;
    }

    return {
      current,
      max: timing.duration
    };
  }

  private getCooldownOverlayHeight(cooldownTimer: CurrentMax): number {
    const remaining = cooldownTimer.current / cooldownTimer.max;

    return remaining * 100;
  }

  private playCooldownFinishedAnimation = () => {
    if (this.cooldownFinishedAnimationTimeout) {
      window.clearTimeout(this.cooldownFinishedAnimationTimeout);
    }

    this.shouldPlayCooldownFinishAnimation = true;

    this.cooldownFinishedAnimationTimeout = window.setTimeout(() => {
      this.shouldPlayCooldownFinishAnimation = false;
      this.cooldownFinishedAnimationTimeout = null;
    }, 1000);
  };

  private getRGBAColor(): string {
    const classDef = this.props.characterClassDefs[this.props.classID];
    const championInfo = this.props.champions.championIDToChampion[classDef?.stringID || ''];
    if (championInfo?.uIColor) {
      const r = championInfo?.uIColor >> 16;
      const g = (championInfo?.uIColor >> 8) & 0xff;
      const b = championInfo?.uIColor & 0xff;

      return 'rgba(' + r + ', ' + g + ', ' + b + ', 0.85)';
    }

    return null;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { abilityDisplayDefs, characterClassDefs, statusDefs } = state.game;
  const { worldTime, usingGamepad } = state.baseGame;
  const { classID, statuses, resources } = state.player;
  const { gameOptions } = state.gameOptions;

  return {
    classID,
    champions: state.championInfo,
    abilityDisplayDefs,
    characterClassDefs,
    ability: state.abilities[ownProps.abilityIndex],
    statuses,
    statusDefs,
    worldTime,
    usingGamepad,
    resources,
    gameOptions,
    ...ownProps
  };
}

export const ActionButton = connect(mapStateToProps)(AActionButton);
