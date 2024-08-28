/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';
import { CharacterClassDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';
import { IDLookupTable } from '../../../redux/gameSlice';
import {
  AbilityState,
  basicAttack1ID,
  basicAttack2ID,
  strongAbilityID,
  ultimateAbilityID,
  weakAbilityID
} from '../../../redux/abilitySlice';
import { AbilityDisplayDef } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { ScenarioRoundState } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { ProfileModel } from '../../../redux/profileSlice';
import { PerkDefGQL, ScenarioDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { getCharacterClassStringIDForNumericID } from '../../../helpers/characterHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import {
  StringIDGeneralAbilities,
  StringIDGeneralAttacks,
  getStringTableValue
} from '../../../helpers/stringTableHelpers';
import { AbilityType, getKeybindInfoForAbility } from '../../../helpers/abilityhelpers';
import { Overlay, hideOverlay } from '../../../redux/navigationSlice';
import { Round } from '../../../redux/matchSlice';

const Container = 'MenuModal-AbilityInfo-Container';
const Section = 'MenuModal-AbilityInfo-Section';
const Title = 'MenuModal-AbilityInfo-Title';
const ItemsContainer = 'MenuModal-AbilityInfo-ItemsContainer';
const Item = 'MenuModal-AbilityInfo-Item';
const KeybindBox = 'MenuModal-AbilityInfo-KeybindBox';
const KeybindText = 'MenuModal-AbilityInfo-KeybindText';
const IconContainer = 'MenuModal-AbilityInfo-IconContainer';
const AbilityIcon = 'MenuModal-AbilityInfo-AbilityIcon';
const RuneModIcon = 'MenuModal-AbilityInfo-RuneModIcon';
const Name = 'MenuModal-AbilityInfo-Name';

const Description = 'MenuModal-AbilityInfo-Description';
const StringIDAbilityInfoRuneMods = 'AbilityInfoRuneMods';

interface ReactProps {}

interface InjectedProps {
  abilities: AbilityState;
  abilityDisplayDefs: IDLookupTable<AbilityDisplayDef>;
  characterClassDefs: IDLookupTable<CharacterClassDef>;
  scenarioRoundState: ScenarioRoundState;
  profile: ProfileModel;
  usingGamepadInMainMenu: boolean;
  selectedRuneMods: Dictionary<PerkDefGQL[]>;
  inMatchClassID: number;
  stringTable: Dictionary<StringTableEntryDef>;
  scenarioDefs: Dictionary<ScenarioDefGQL>;
  currentRound: Round;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityInfo extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): React.ReactNode {
    const displayDefIDs = this.getAbilityDisplayDefIDs();
    if (!displayDefIDs) {
      return null;
    }

    return (
      <div className={Container} onClick={this.hide.bind(this)}>
        <div className={`${Section} attacks`}>
          <div className={Title}>{getStringTableValue(StringIDGeneralAttacks, this.props.stringTable)}</div>
          <div className={ItemsContainer}>
            {this.renderAbility(AbilityType.Primary, displayDefIDs[basicAttack1ID])}
            {this.renderAbility(AbilityType.Secondary, displayDefIDs[basicAttack2ID])}
          </div>
        </div>
        <div className={`${Section} abilities`}>
          <div className={Title}>{getStringTableValue(StringIDGeneralAbilities, this.props.stringTable)}</div>
          <div className={ItemsContainer}>
            {this.renderAbility(AbilityType.Weak, displayDefIDs[weakAbilityID])}
            {this.renderAbility(AbilityType.Strong, displayDefIDs[strongAbilityID])}
            {this.renderAbility(AbilityType.Ultimate, displayDefIDs[ultimateAbilityID])}
          </div>
        </div>
        {this.renderRuneModContainer()}
      </div>
    );
  }

  private hide() {
    this.props.dispatch(hideOverlay(Overlay.MainMenu));
  }

  private renderRuneModContainer(): React.ReactNode {
    const scenarioDef = this.props.scenarioDefs[this.props.currentRound?.scenarioID];
    if (scenarioDef && !scenarioDef.applyChampionUpgrades) {
      return null;
    }

    // if not in a scenario, show
    // if in a scenario, check the scenario def to see if we're doing champ upgrades
    return (
      <div className={`${Section} runeMods`}>
        <div className={Title}>{getStringTableValue(StringIDAbilityInfoRuneMods, this.props.stringTable)}</div>
        <div className={ItemsContainer}>{this.renderRuneMods()}</div>
      </div>
    );
  }

  private renderRuneMods(): React.ReactNode[] {
    const runeMods = this.getRuneMods();
    if (!runeMods) {
      return null;
    }

    return runeMods.map((runeMod, index) => this.renderRuneMod(runeMod, index));
  }

  private renderRuneMod(runeMod: PerkDefGQL, index: Number): React.ReactNode {
    if (!runeMod) {
      return null;
    }

    return (
      <div className={`${Item} runeMod`} key={`RuneMod${index}`}>
        <div className={IconContainer}>
          <img className={RuneModIcon} src={runeMod.iconURL} />
        </div>
        <div className={Name}>{runeMod.name}</div>
        <div className={Description}>{runeMod.description}</div>
      </div>
    );
  }

  private renderAbility(type: AbilityType, displayDefID: number): React.ReactNode {
    const keybindInfo = getKeybindInfoForAbility(type, this.props.usingGamepadInMainMenu);
    const display = this.props.abilityDisplayDefs[displayDefID];
    if (!display || !keybindInfo) {
      return null;
    }
    return (
      <div className={Item} key={type}>
        <div className={IconContainer}>
          <div className={KeybindBox}>
            {keybindInfo.iconClass ? (
              <span className={`${KeybindText} ${keybindInfo.iconClass}`} />
            ) : (
              <span className={KeybindText}>{keybindInfo.name}</span>
            )}
          </div>
          <div className={`${AbilityIcon} ${display.iconClass}`} />
        </div>
        <div className={Name}>{display.name}</div>
        <div className={Description}>{display.description}</div>
      </div>
    );
  }

  private getRuneMods(): PerkDefGQL[] {
    const selectedChampion = this.props.inMatchClassID
      ? getCharacterClassStringIDForNumericID(this.props.characterClassDefs, this.props.inMatchClassID)
      : this.props.profile.defaultChampionID;
    return this.props.selectedRuneMods[selectedChampion];
  }

  private getAbilityDisplayDefIDs(): number[] {
    // during a live game, use the display ids reported by the server
    switch (this.props.scenarioRoundState) {
      case ScenarioRoundState.Backfill:
      case ScenarioRoundState.BackfillLocked:
      case ScenarioRoundState.Countdown:
      case ScenarioRoundState.Running:
      case ScenarioRoundState.Epilogue:
      case ScenarioRoundState.WaitingForConnections:
        return [
          this.props.abilities[basicAttack1ID].displayDefID,
          this.props.abilities[basicAttack2ID].displayDefID,
          this.props.abilities[weakAbilityID].displayDefID,
          this.props.abilities[strongAbilityID].displayDefID,
          this.props.abilities[ultimateAbilityID].displayDefID
        ];
    }

    // when not in a match, use the start display ids for the selected champion
    for (const id in this.props.characterClassDefs) {
      const def = this.props.characterClassDefs[id];
      if (def.stringID === this.props.profile.defaultChampionID) {
        return def.startAbilityDisplayIDs;
      }
    }

    return null;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepadInMainMenu } = state.baseGame;
  const { abilityDisplayDefs, characterClassDefs } = state.game;
  const { scenarioRoundState, classID } = state.player;
  const { selectedRuneMods } = state.profile;
  const { stringTable } = state.stringTable;
  const { scenarioDefs } = state.scenarios;
  const { currentRound } = state.match;

  return {
    ...ownProps,
    abilityDisplayDefs,
    abilities: state.abilities,
    selectedRuneMods: selectedRuneMods,
    characterClassDefs,
    profile: state.profile,
    inMatchClassID: classID,
    scenarioRoundState,
    usingGamepadInMainMenu,
    stringTable,
    scenarioDefs,
    currentRound
  };
}

export const AbilityInfo = connect(mapStateToProps)(AAbilityInfo);
