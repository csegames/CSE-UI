/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { formatDurationSeconds } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { KeybindIDs, getActiveBindForKey } from '../../../redux/keybindsSlice';
import { RootState } from '../../../redux/store';
import { Binding, Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { CharacterRaceDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';
import { game } from '@csegames/library/dist/_baseGame';
import { hordetest } from '@csegames/library/dist/hordetest';
import { ScenarioRoundState } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { Dispatch } from 'redux';
import { Button } from '../../shared/Button';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../helpers/stringTableHelpers';

const Container = 'Respawn-Container';
const DeadTextWrapper = 'Respawn-DeadTextWrapper';
const DeadText = 'Respawn-DeadText';
const KilledByContainer = 'Respawn-KilledByContainer';
const KilledByIcon = 'Respawn-KilledByIcon';
const DeathStatContainer = 'Respawn-DeathStatContainer';
const DeathStatLabel = 'Respawn-DeathStatLabel';
const DeathStatValue = 'Respawn-DeathStatValue';
const HeartsParent = 'Respawn-HeartsParent';
const DashLine = 'Respawn-DashLine';
const Heart = 'Respawn-Heart';
const RespawnButton = 'Respawn-RespawnButton';
const FlexSpacer = 'Respawn-FlexSpacer';
const SpectateNextPlayerWrap = 'Respawn-SpectateNextPlayerWrap';
const SpectateNextPlayerIcon = 'Respawn-SpectateNextPlayerIcon';

const SpectateHintText = 'Respawn-SpectateHintText';

const StringIDHUDSkipEpilogue = 'HUDSkipEpilogue';
const StringIDHUDRespawnYouDied = 'HUDRespawnYouDied';
const StringIDHUDRespawnKilledBy = 'HUDRespawnKilledBy';
const StringIDHUDRespawnLasted = 'HUDRespawnLasted';
const StringIDHUDRespawnSpectatePrevious = 'HUDRespawnSpectatePrevious';
const StringIDHUDRespawnSpectateNext = 'HUDRespawnSpectateNext';
const StringIDHUDRespawnLeaveMatch = 'HUDRespawnLeaveMatch';
const StringIDHUDRespawnRevive = 'HUDRespawnRevive';
const StringIDHUDRespawnLivesLeft = 'HUDRespawnLivesLeft';
const StringIDHUDRespawnOneLifeLeft = 'HUDRespawnOneLifeLeft';

interface InjectedProps {
  dispatch?: Dispatch;
  keybindToRevive: Keybind;
  keybindToCycleNextObserver: Keybind;
  keybindToCyclePrevObserver: Keybind;
  usingGamepad: boolean;
  isAlive: boolean;
  currentDeaths: number;
  maxDeaths: number;
  killersRaceDef: CharacterRaceDef;
  killersName: string;
  survivedTime: number;
  scenarioRoundState: ScenarioRoundState;
  scenarioID: string;
  stringTable: Dictionary<StringTableEntryDef>;
}

interface ReactProps {
  onLeaveMatch: () => void;
  onSkipEpilogue: () => void;
}

type Props = ReactProps & InjectedProps;

class ARespawn extends React.Component<Props, {}> {
  private controllerSelectEVH: ListenerHandle;

  constructor(props: Props) {
    super(props);
  }

  public render(): JSX.Element {
    const hearts = Array.from(Array(this.props.maxDeaths));
    const livesLeft = this.props.maxDeaths - this.props.currentDeaths;
    const haveKnownKiller = !!this.props.killersRaceDef;
    const survivedTimeFormatted = formatDurationSeconds(this.props.survivedTime);
    const killedByIconSrc = this.props.killersRaceDef ? this.props.killersRaceDef.thumbnailURL : '';
    const showLeaveMatch = this.shouldLeaveMatch();

    const prevKeybind = getActiveBindForKey(this.props.usingGamepad, this.props.keybindToCyclePrevObserver);
    const nextKeybind = getActiveBindForKey(this.props.usingGamepad, this.props.keybindToCycleNextObserver);
    const selectKeybind = getActiveBindForKey(this.props.usingGamepad, this.props.keybindToRevive);

    return (
      <div className={Container}>
        <div className={DeadTextWrapper}>
          <div className={DeadText}>{getStringTableValue(StringIDHUDRespawnYouDied, this.props.stringTable)}</div>
        </div>
        {haveKnownKiller && (
          <div className={KilledByContainer}>
            {killedByIconSrc ? <img className={KilledByIcon} src={killedByIconSrc} /> : null}
            <div className={`${DeathStatContainer} with-icon`}>
              <div className={`${DeathStatLabel} highlight`}>
                {getStringTableValue(StringIDHUDRespawnKilledBy, this.props.stringTable)}
              </div>
              <div className={DeathStatValue}>{this.getKillersName()}</div>
            </div>
          </div>
        )}
        <div className={DeathStatContainer}>
          <div className={DeathStatLabel}>{getStringTableValue(StringIDHUDRespawnLasted, this.props.stringTable)}</div>
          <div className={DeathStatValue}>{survivedTimeFormatted}</div>
        </div>
        <div className={DeathStatContainer}>
          {this.showLivesLeft(livesLeft)}
          <div className={HeartsParent}>
            {hearts.map((_, i) => {
              const isLife = i + 1 <= livesLeft;
              const lifeClass = isLife ? 'life' : '';
              return <div className={`${Heart} ${lifeClass} fs-icon-misc-heart`} key={i} />;
            })}
            <div className={DashLine} />
          </div>
        </div>
        {this.showRespawnButton(showLeaveMatch, selectKeybind)}
        <div className={FlexSpacer} />
        {this.showLeaveMatchButton(showLeaveMatch, selectKeybind)}
        <div className={SpectateNextPlayerWrap}>
          {!prevKeybind ? null : prevKeybind.iconClass ? (
            <div className={`${SpectateNextPlayerIcon} ${prevKeybind.iconClass}`} />
          ) : (
            <div className={SpectateNextPlayerIcon}>{prevKeybind.name}</div>
          )}

          <div className={SpectateHintText}>
            {getStringTableValue(StringIDHUDRespawnSpectatePrevious, this.props.stringTable)}
          </div>
        </div>

        <div className={SpectateNextPlayerWrap}>
          {!nextKeybind ? null : nextKeybind.iconClass ? (
            <div className={`${SpectateNextPlayerIcon} ${nextKeybind.iconClass}`} />
          ) : (
            <div className={SpectateNextPlayerIcon}>{nextKeybind.name}</div>
          )}

          <div className={SpectateHintText}>
            {getStringTableValue(StringIDHUDRespawnSpectateNext, this.props.stringTable)}
          </div>
        </div>
      </div>
    );
  }

  private showLeaveMatchButton(showLeaveMatch: boolean, selectKeybind: Binding): JSX.Element {
    if (!showLeaveMatch) {
      return;
    }

    if (this.props.scenarioRoundState == ScenarioRoundState.Epilogue) {
      return (
        <Button
          type={'primary'}
          disabled={false}
          styles={`${RespawnButton} skipEpilogue`}
          onClick={this.onSkipEpilogue}
          text={
            <div className={`skipEpilogue`}>
              {selectKeybind && <span className={selectKeybind.iconClass} />}
              {getStringTableValue(StringIDHUDSkipEpilogue, this.props.stringTable)}
            </div>
          }
        />
      );
    }

    return (
      <Button
        type={'blue-outline'}
        disabled={false}
        styles={`${RespawnButton}  leave`}
        onClick={this.onLeaveMatch}
        text={
          <div className={'leave'}>
            {selectKeybind && <span className={selectKeybind.iconClass} />}
            {getStringTableValue(StringIDHUDRespawnLeaveMatch, this.props.stringTable)}
          </div>
        }
      />
    );
  }

  private showRespawnButton(showLeaveMatch: boolean, selectKeybind: Binding): JSX.Element {
    if (showLeaveMatch) {
      return;
    }

    return (
      <Button
        type={'primary'}
        disabled={false}
        styles={`${RespawnButton}  ${this.props.usingGamepad ? 'highlight' : ''}`}
        onClick={this.onRespawn}
        text={
          <div className={`${this.props.usingGamepad ? 'highlight' : ''}`}>
            {selectKeybind && selectKeybind.iconClass && <span className={selectKeybind.iconClass} />}
            {getStringTableValue(StringIDHUDRespawnRevive, this.props.stringTable)}
          </div>
        }
      />
    );
  }

  public componentDidMount() {
    if (this.props.usingGamepad) {
      this.connectControllerSelectButton();
    } else {
      game.releaseMouseCapture();
    }
  }

  public componentDidUpdate(prevProps: Props) {
    // we're showing the revive ui, but did the we swap to/from using the gamepad?
    if (!prevProps.usingGamepad && this.props.usingGamepad) {
      this.connectControllerSelectButton();
    }

    if (prevProps.usingGamepad && !this.props.usingGamepad) {
      this.setWaitingForSelect(false);
      this.controllerSelectEVH.close();
    }
  }

  private connectControllerSelectButton() {
    this.setWaitingForSelect(true);

    if (this.shouldLeaveMatch()) {
      if (this.props.scenarioRoundState == ScenarioRoundState.Epilogue) {
        this.controllerSelectEVH = game.onControllerSelect(this.onSkipEpilogue);
      } else {
        this.controllerSelectEVH = game.onControllerSelect(this.onLeaveMatch);
      }
    } else {
      this.controllerSelectEVH = game.onControllerSelect(this.onRespawn);
    }
  }

  public componentWillUnmount() {
    if (this.controllerSelectEVH) {
      this.controllerSelectEVH.close();
    }

    if (this.props.usingGamepad) {
      this.setWaitingForSelect(false);
    }
  }

  private shouldLeaveMatch(): boolean {
    return this.props.currentDeaths >= this.props.maxDeaths && this.props.maxDeaths !== 0;
  }

  private onRespawn = () => {
    hordetest.game.selfPlayerState.respawn('-1');
  };

  private onLeaveMatch = () => {
    this.props.onLeaveMatch();
  };

  private onSkipEpilogue = () => {
    this.props.onSkipEpilogue();
  };

  private setWaitingForSelect = (isWaitingForSelect: boolean) => {
    game.setWaitingForSelect(isWaitingForSelect);
  };

  private showLivesLeft(livesLeft: number): JSX.Element {
    if (this.props.maxDeaths > 0) {
      const stringID = livesLeft !== 1 ? StringIDHUDRespawnLivesLeft : StringIDHUDRespawnOneLifeLeft;
      const tokens = { COUNT: livesLeft.toString() };
      return (
        <div className={DeathStatLabel}>{getTokenizedStringTableValue(stringID, this.props.stringTable, tokens)}</div>
      );
    }
  }

  private getKillersName(): string {
    if (this.props.killersName) {
      return this.props.killersName;
    }

    if (this.props.killersRaceDef) {
      return this.props.killersRaceDef.name;
    }

    return '';
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps) {
  const keybindsState = state.keybinds;

  const keybindToRevive = keybindsState[KeybindIDs.UISelect];
  const keybindToCycleNextObserver = keybindsState[KeybindIDs.PlayerObserverCamForwardCycle];
  const keybindToCyclePrevObserver = keybindsState[KeybindIDs.PlayerObserverCamPrevCycle];
  const usingGamepad = state.baseGame.usingGamepad;
  const { stringTable } = state.stringTable;

  return {
    keybindToRevive: keybindToRevive,
    keybindToCycleNextObserver: keybindToCycleNextObserver,
    keybindToCyclePrevObserver: keybindToCyclePrevObserver,
    usingGamepad: usingGamepad,
    isAlive: state.player.isAlive,
    currentDeaths: state.player.currentDeaths ? state.player.currentDeaths : 0,
    maxDeaths: state.player.maxDeaths ? state.player.maxDeaths : 0,
    killersRaceDef: state.game.characterRaceDefs[state.player.killersRace],
    killersName: state.player.killersName,
    survivedTime: state.player.survivedTime ? state.player.survivedTime : 0,
    scenarioRoundState: state.player.scenarioRoundState,
    scenarioID: state.player.scenarioID,
    stringTable: stringTable,
    ...ownProps
  };
}

export const Respawn = connect(mapStateToProps)(ARespawn);
