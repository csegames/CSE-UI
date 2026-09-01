/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CharacterClassDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';
import { Status } from '@csegames/library/dist/hordetest/game/types/Status';
import { game } from '@csegames/library/dist/_baseGame';
import { DeepImmutableObject } from '@csegames/library/dist/_baseGame/types/DeepImmutable';
import { Binding, Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { ArrayMap, Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import * as React from 'react';
import { connect } from 'react-redux';
import { IDLookupTable } from '../../../../redux/gameSlice';
import { RootState } from '../../../../redux/store';
import {
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
import { StatusDef } from '../../../../dataSources/manifest/statusManifest';
import { AbilityDisplayDef } from '../../../../dataSources/manifest/abilityDisplayManifest';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { AnimationData } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { GameOptionIDs } from '../../../../redux/gameOptionsSlice';

const ActionButtonContainer = 'ActionButtons-ActionButtonElements-ActionButtonContainer';
const Button = 'ActionButtons-ActionButtonElements-Button';
const ActionIcon = 'ActionButtons-ActionButtonElements-ActionIcon';
const CooldownText = 'ActionButtons-ActionButtonElements-CooldownText';
const DisabledSlash = 'ActionButtons-ActionButtonElements-DisabledSlash';
const KeybindBox = 'ActionButtons-ActionButtonElements-KeybindBox';
const KeybindText = 'ActionButtons-ActionButtonElements-KeybindText';
const CountBox = 'ActionButtons-ActionButtonElements-CountBox';
const CountText = 'ActionButtons-ActionButtonElements-CountText';

const CooldownAnimationDurationMS = 1000; // keep in sync with the css

type DisplayState = 'active' | 'cooldown' | 'blocked' | 'starved' | 'unusable';

interface DisabledData {
  remaining: string;
  overlayHeight: number;
}

interface ReactProps {
  type: string;
  abilityIndex: keyof AbilityState;
}

interface InjectedProps {
  classID: number;
  champions: ChampionInfoState;
  characterClassDefs: IDLookupTable<CharacterClassDef>;
  abilityDisplayDefsByNumericID: IDLookupTable<AbilityDisplayDef>;
  ability: AbilityStatus;
  statuses: ArrayMap<Status>;
  statusDefs: IDLookupTable<StatusDef>;
  usingGamepad: boolean;
  resources: ArrayMap<EntityResource>;
  gameOptions: Dictionary<GameOption>;
}

type Props = ReactProps & InjectedProps;

interface State {
  animationHandle: ListenerHandle | null;
  inCooldown: DisabledData | null;
  cssAnimationEndTime: number | undefined;
}

class AActionButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const { inCooldown: disabled } = this.state;
    const displayState = this.getDisplayState();
    const displayCount = this.getDisplayCount();
    const keybind = this.getKeybind();
    const color = this.getRGBAColor();

    return (
      <div id={`ActionButtonContainer_${this.props.type}`} className={ActionButtonContainer}>
        <div
          id={`AbilityButton_${this.props.type}`}
          className={`${Button} ${this.getButtonClassSuffix(displayState)}`}
          style={this.getButtonStyle(displayState)}
        >
          <span
            id={`AbilityActionIcon_${this.props.type}`}
            className={`${this.getActionIconClassList(displayState)}`}
          />
          {displayState == 'starved' && (
            <img className={DisabledSlash} src='images/hud/actionbutton/disabled-resource.svg' />
          )}
          {displayState == 'unusable' && <img className={DisabledSlash} src='images/hud/actionbutton/disabled.svg' />}
          {disabled && (
            <div
              className={`${CooldownText} ${this.getDisabledClassSuffix(displayState)}`}
              style={{
                backgroundPosition: `100% ${disabled.overlayHeight}vmin`
              }}
            >
              {disabled.remaining}
            </div>
          )}
          {displayCount && (
            <div className={CountBox}>
              <span className={`${CountText}`} style={{ color }}>
                {displayCount}
              </span>
            </div>
          )}
        </div>
        <div id={`KeybindBox_${this.props.type}`} className={KeybindBox}>
          {keybind.iconClass ? (
            <span className={`${KeybindText} ${keybind.iconClass}`} />
          ) : (
            <span className={KeybindText}>{keybind.name}</span>
          )}
        </div>
      </div>
    );
  }

  public componentDidUpdate() {
    if (this.shouldAnimate(this.getDisplayState()) && !this.state.animationHandle) {
      this.setState({ animationHandle: clientAPI.startAnimation(this.animate.bind(this)) });
    }
  }

  public componentWillUnmount() {
    this.state.animationHandle?.close();
  }

  private shouldAnimate(displayState: DisplayState): boolean {
    switch (displayState) {
      case 'active':
        return this.state.cssAnimationEndTime != null;
      case 'cooldown':
      case 'blocked':
        return true;
    }
    return false;
  }

  private animate(data: AnimationData, _: DOMHighResTimeStamp): void {
    const displayState = this.getDisplayState();
    let timing: TimeRange = null;
    switch (displayState) {
      case 'active':
        if (this.state.inCooldown && !this.state.cssAnimationEndTime) {
          if (this.props.gameOptions[GameOptionIDs.PlayAbilityCooldownOverSFX]?.value) {
            clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_COOLDOWN_OVER);
          }
          this.setState({ inCooldown: null, cssAnimationEndTime: data.worldTime + CooldownAnimationDurationMS });
          return;
        }
        if (this.state.cssAnimationEndTime > data.worldTime) {
          return;
        }
        this.clearState(true);
        return;
      case 'unusable':
      case 'starved':
        this.clearState(true);
        return;
      case 'cooldown':
        timing = this.props.ability.timing;
        break;
      case 'blocked':
        timing = this.getBlockedTiming()
        break;
    }

    const elapsed = data.worldTime - timing.start;
    const remaining = Math.ceil(timing.duration - elapsed).toFixed(0);
    const overlayHeight = Math.max(0, (1 - (elapsed / timing.duration)) * 6.95);

    if (this.state.cssAnimationEndTime || this.state.inCooldown?.remaining !== remaining || this.state.inCooldown.overlayHeight !== overlayHeight) {
      this.setState({cssAnimationEndTime: null, inCooldown: { remaining, overlayHeight }});
    }
  }

  private clearState(stopAnimation: boolean): void {
    if (!this.state.inCooldown && !this.state.cssAnimationEndTime && (!stopAnimation || !this.state.animationHandle)) {
      return;
    }
    const updated: State = { ...this.state, inCooldown: null, cssAnimationEndTime: null };
    if (stopAnimation) {
      this.state.animationHandle?.close();
      updated.animationHandle = null;
    }
    this.setState(updated);
  }

  private getDisplayState(): DisplayState {
    if (this.props.ability.state & AbilityStateFlags.Running) {
      return 'active';
    }
    if (this.props.ability.state & AbilityStateFlags.Unusable) {
      return 'unusable';
    }
    if (this.props.ability.state & AbilityStateFlags.Cooldown) {
      return 'cooldown';
    }
    if (this.props.ability.errors & AbilityErrorFlags.NotEnoughResource) {
      return 'starved';
    }
    if (this.props.ability.errors & AbilityErrorFlags.BlockedByStatus) {
      return 'blocked';
    }
    return 'active';
  }

  private getDisplayCount(): string {
    if (this.props.ability?.summonCount) {
      return this.props.ability.summonCount.toFixed(0);
    }

    const displayID = this.props.ability?.displayDefID;
    const entityResourceID = this.props.abilityDisplayDefsByNumericID[displayID]?.entityResourceID;
    if (!entityResourceID) {
      return null;
    }

    const resource = findEntityResourceByNumericID(this.props.resources, entityResourceID);
    return resource?.current.toFixed(0);
  }

  private getButtonStyle(displayState: DisplayState): React.CSSProperties {
    switch (displayState) {
      case 'active':
      case 'unusable':
      case 'starved':
        return { backgroundColor: `${this.getRGBAColor()}` };
    }
    return null;
  }

  private getButtonClassSuffix(displayState: DisplayState): string {
    switch (displayState) {
      case 'unusable': return 'disabled';
      case 'cooldown': return 'cooldown';
      case 'starved': return 'NotEnoughResource';
      case 'blocked': return 'BlockedByStatus';
      case 'active': return this.state.cssAnimationEndTime ? 'cooldownFinishedAnim' : null;
    }
  }

  private getDisabledClassSuffix(displayState: DisplayState): string {
    switch (displayState) {
      case 'starved': return 'NotEnoughResource';
      case 'blocked': return 'BlockedByStatus';
    }
    return null;
  }

  private getActionIconClassList(displayState: DisplayState): string {
    const displayID = this.props.ability?.displayDefID;
    const iconClass = displayID ? this.props.abilityDisplayDefsByNumericID[displayID]?.iconClass : null;

    let classList: string = `${ActionIcon} ${iconClass}`;
    switch (displayState) {
      case 'unusable':
        classList += ' disabled';
        break;
      case 'cooldown':
        classList += ' cooldown';
        break;
    }
    return classList;
  }


  private getKeybind(): DeepImmutableObject<Binding> {
    // @TODO figure out a way to leverage the dictionary the binding is a part of.
    const keybind: DeepImmutableObject<Keybind> = Object.values(game.keybinds).find((k) => {
      return k.description === `Ability ${this.props.abilityIndex - 1} (${this.props.type})`;
    });

    return this.props.usingGamepad ? keybind.binds[1] : keybind.binds[0];
  }

  private getBlockedTiming(): TimeRange | null {
    let bestEndTime: number = null;
    let bestStatus: Status = null;
    for (const status of Object.values(this.props.statuses)) 
    {
      if (status.duration == Infinity) continue;
      const statusDef = this.props.statusDefs[status.id];
      if (!statusDef || !statusDef.blocksAbilities) continue;

      const endTime = status.startTime + status.duration;
      if (!bestEndTime || bestEndTime < endTime)
      {
        bestEndTime = endTime;
        bestStatus = status;
      }
    }
    return bestStatus ? { start: bestStatus.startTime, duration: bestStatus.duration } : null;
  }

  private getRGBAColor(): string {
    const classDef = this.props.characterClassDefs[this.props.classID];
    const championInfo = this.props.champions.championIDToChampion[classDef?.stringID || ''];
    if (championInfo?.uiColor) {
      const r = championInfo?.uiColor >> 16;
      const g = (championInfo?.uiColor >> 8) & 0xff;
      const b = championInfo?.uiColor & 0xff;

      return 'rgba(' + r + ', ' + g + ', ' + b + ', 0.85)';
    }

    return null;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { abilityDisplayDefsByNumericID, characterClassDefs, statusDefsByNumericID: statusDefs } = state.game;
  const { usingGamepad } = state.baseGame;
  const { classID, statuses, resources } = state.entities.self;
  const { gameOptions } = state.gameOptions;

  return {
    classID,
    champions: state.championInfo,
    abilityDisplayDefsByNumericID,
    characterClassDefs,
    ability: state.abilities[ownProps.abilityIndex],
    statuses,
    statusDefs,
    usingGamepad,
    resources,
    gameOptions,
    ...ownProps
  };
}

export const ActionButton = connect(mapStateToProps)(AActionButton);
