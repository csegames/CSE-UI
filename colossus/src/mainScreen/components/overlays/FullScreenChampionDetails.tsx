/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import {
  ChampionCostumeInfo,
  ChampionGQL,
  ChampionInfo,
  PerkDefGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { CharacterClassDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';
import { AbilityDisplayDef } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dispatch } from '@reduxjs/toolkit';
import {
  getStringTableValue,
  StringIDGeneralAbilities,
  StringIDGeneralAttacks,
  StringIDGeneralBack
} from '../../helpers/stringTableHelpers';
import { Button } from '../shared/Button';
import { Overlay, hideOverlay } from '../../redux/navigationSlice';
import { AbilityType, getKeybindInfoForAbility } from '../../helpers/abilityhelpers';
import {
  basicAttack1ID,
  basicAttack2ID,
  weakAbilityID,
  strongAbilityID,
  ultimateAbilityID
} from '../../redux/abilitySlice';
import { IDLookupTable } from '../../redux/gameSlice';
import { getWornCostumeForChampion } from '../../helpers/characterHelpers';

const Container = 'ChampionProfile-ChampionDetails-Container';
const Background = 'ChampionProfile-ChampionDetails-Background';
const ChampionBioContainer = 'ChampionProfile-ChampionDetails-ChampionBioContainer';
const ChampionName = 'ChampionProfile-ChampionDetails-ChampionName';
const ChampionDescription = 'ChampionProfile-ChampionDetails-ChampionDescription';
const BackButton = 'ChampionProfile-ChampionDetails-BackButton';
const AbilitiesContainer = 'ChampionProfile-ChampionDetails-AbilitiesContainer';
const AbilitiesHeader = 'ChampionProfile-ChampionDetails-AbilitiesHeader';
const AbilityContainer = 'ChampionProfile-ChampionDetails-AbilityContainer';
const AbilityIconContainer = 'ChampionProfile-ChampionDetails-AbilityIconContainer';
const AbilityIcon = 'ChampionProfile-ChampionDetails-AbilityIcon';
const AbilityName = 'ChampionProfile-ChampionDetails-AbilityName';
const AbilityDescription = 'ChampionProfile-ChampionDetails-AbilityDescription';
const AbilityKeybindBox = 'ChampionProfile-ChampionDetails-AbilityKeybindBox';
const AbilityTextContainer = 'ChampionProfile-ChampionDetails-AbilityTextContainer';
const AbilityKeybindText = 'ChampionProfile-ChampionDetails-AbilityKeybindText';

interface ReactProps {}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  stringTable: Dictionary<StringTableEntryDef>;
  characterClassDefs: IDLookupTable<CharacterClassDef>;
  abilityDisplayDefs: IDLookupTable<AbilityDisplayDef>;
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionGQL[];
  perksByID: Dictionary<PerkDefGQL>;
  usingGamepadInMainMenu: boolean;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFullScreenChampionDetails extends React.Component<Props> {
  public render(): JSX.Element {
    const displayDefIDs = this.getAbilityDisplayDefIDs();
    const costume = getWornCostumeForChampion(
      this.props.championCostumes,
      this.props.champions,
      this.props.perksByID,
      this.props.selectedChampion.id
    );

    return (
      <div className={Container}>
        <div className={Background} style={{ backgroundImage: `url(${costume?.championSelectedFlareImageURL})` }} />
        <div className={ChampionBioContainer}>
          <div className={ChampionName}>{this.props.selectedChampion.name}</div>
          <div className={ChampionDescription}>{this.props.selectedChampion.description}</div>
          <Button
            type={'blue'}
            text={getStringTableValue(StringIDGeneralBack, this.props.stringTable).toUpperCase()}
            styles={BackButton}
            onClick={this.onBackClick.bind(this)}
            disabled={false}
          />
        </div>
        <div className={AbilitiesContainer}>
          <div className={AbilitiesHeader}>{getStringTableValue(StringIDGeneralAttacks, this.props.stringTable)}</div>
          {this.renderAbility(AbilityType.Primary, displayDefIDs, basicAttack1ID)}
          {this.renderAbility(AbilityType.Secondary, displayDefIDs, basicAttack2ID)}
        </div>
        <div className={AbilitiesContainer}>
          <div className={AbilitiesHeader}>{getStringTableValue(StringIDGeneralAbilities, this.props.stringTable)}</div>
          {this.renderAbility(AbilityType.Weak, displayDefIDs, weakAbilityID)}
          {this.renderAbility(AbilityType.Strong, displayDefIDs, strongAbilityID)}
          {this.renderAbility(AbilityType.Ultimate, displayDefIDs, ultimateAbilityID)}
        </div>
      </div>
    );
  }

  private renderAbility(type: AbilityType, abilityDisplayIDs: number[], abilityID: number): React.ReactNode {
    if (!abilityDisplayIDs) {
      return null;
    }

    const keybindInfo = getKeybindInfoForAbility(type, this.props.usingGamepadInMainMenu);
    const display = this.props.abilityDisplayDefs[abilityDisplayIDs[abilityID]];
    if (!display || !keybindInfo) {
      return null;
    }
    return (
      <div className={AbilityContainer} key={type}>
        <div className={AbilityIconContainer}>
          <div className={AbilityKeybindBox}>
            {keybindInfo.iconClass ? (
              <span className={`${AbilityKeybindText} ${keybindInfo.iconClass}`} />
            ) : (
              <span className={AbilityKeybindText}>{keybindInfo.name}</span>
            )}
          </div>
          <div className={`${AbilityIcon} ${display.iconClass}`} />
        </div>
        <div className={AbilityTextContainer}>
          <div className={AbilityName}>{display.name}</div>
          <div className={AbilityDescription}>{display.description}</div>
        </div>
      </div>
    );
  }

  private getAbilityDisplayDefIDs(): number[] {
    for (const id in this.props.characterClassDefs) {
      const def = this.props.characterClassDefs[id];
      if (def.stringID === this.props.selectedChampion.id) {
        return def.startAbilityDisplayIDs;
      }
    }

    return null;
  }

  private onBackClick(): void {
    this.props.dispatch(hideOverlay(Overlay.ChampionDetails));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { selectedChampion, championCostumes } = state.championInfo;
  const { stringTable } = state.stringTable;
  const { abilityDisplayDefs, characterClassDefs } = state.game;
  const { usingGamepadInMainMenu } = state.baseGame;
  const { champions } = state.profile;
  const { perksByID } = state.store;

  return {
    ...ownProps,
    selectedChampion,
    stringTable,
    characterClassDefs,
    abilityDisplayDefs,
    championCostumes,
    champions,
    perksByID,
    usingGamepadInMainMenu
  };
}

export const FullScreenChampionDetails = connect(mapStateToProps)(AFullScreenChampionDetails);
