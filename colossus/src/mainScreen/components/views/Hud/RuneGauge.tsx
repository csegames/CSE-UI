/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { ResourceBar } from '../../shared/ResourceBar';
import { RuneType } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { PerkDefGQL, RuneModLevelDisplayDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { IDLookupTable } from '../../../redux/gameSlice';
import { CharacterClassDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';
import { getCharacterClassStringIDForNumericID } from '../../../helpers/characterHelpers';

const Container = 'RuneGauge-Container';
const Icon = 'RuneGauge-Icon';
const RuneCountContainer = 'RuneGauge-RuneCountContainer';
const RuneCountBackground = 'RuneGauge-RuneCountBackground';
const RuneCountBorderOuter = 'RuneGauge-RuneCountBorderOrder';
const RuneCountBorderMiddle = 'RuneGauge-RuneCountBorderMiddle';
const RuneCountBorderInner = 'RuneGauge-RuneCountBorderInner';
const RuneCount = 'RuneGauge-RuneCount';
const ProgressContainer = 'RuneGauge-ProgressContainer';
const ProgressRow = 'RuneGauge-ProgressRow';
const ProgressBar = 'RuneGauge-ProgressBar';
const ProgressBarFill = 'RuneGauge-ProgressBarFill';
const Separator = 'RuneGauge-Separator';
const RuneModContainer = 'RuneGauge-RuneModContainer';
const RuneModIcon = 'RuneGauge-RuneModIcon';

interface InjectedProps {
  runeModDisplay: RuneModLevelDisplayDef[];
  collectedRunes: { [key in RuneType]: number };
  maxRunesAllowed: { [key in RuneType]: number };
  runeModLevels: number[];
  selectedRuneMods: Dictionary<PerkDefGQL[]>;
  perksByID: Dictionary<PerkDefGQL>;
  characterClassDefs: IDLookupTable<CharacterClassDef>;
  classNumericID: number;
  dispatch?: Dispatch;
}

type Props = InjectedProps;

class ARuneGauge extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <div className={Container}>
        <div className={ProgressContainer}>{this.getProgressBars()}</div>
        <div className={RuneCountContainer}>
          <div className={RuneCountBackground} />
          <div className={RuneCountBorderOuter}>
            <div className={RuneCountBorderMiddle}>
              <div className={RuneCountBorderInner} />
            </div>
          </div>
          <img className={Icon} src={this.getRuneIcon()} />
          <span className={RuneCount}>{this.props.collectedRunes[RuneType.CharacterMod]}</span>
        </div>
      </div>
    );
  }

  private getProgressBars(): JSX.Element[] {
    const selectedChampion = getCharacterClassStringIDForNumericID(
      this.props.characterClassDefs,
      this.props.classNumericID
    );
    const selectedRuneMods = selectedChampion ? this.props.selectedRuneMods[selectedChampion] : [];
    return this.props.runeModLevels.map((level, levelIndex) => {
      const runeMod = selectedRuneMods[levelIndex];
      const earned = runeMod ? this.getLevelEarned() >= runeMod.runeModLevel : false;
      const previousMax = this.props.runeModLevels[levelIndex - 1] ?? 0;
      const max = level - previousMax;
      const current = Math.min(Math.max(this.props.collectedRunes[RuneType.CharacterMod] - previousMax, 0), max);
      return (
        <div className={ProgressRow}>
          <ResourceBar
            isSquare={false}
            type='characterMod'
            current={current}
            max={max}
            hideText={true}
            containerClasses={ProgressBar}
            fillClasses={ProgressBarFill}
            key={levelIndex}
          />
          <div className={Separator} />
          {runeMod && (
            <div className={`${RuneModContainer} ${earned ? 'earned' : ''}`}>
              <img id={runeMod.id} className={`${RuneModIcon} ${earned ? 'earned' : ''}`} src={runeMod.iconURL} />
            </div>
          )}
        </div>
      );
    });
  }

  private getRuneIcon(): string {
    // return nothing if none of the data has been loaded yet.
    if (
      !this.props.runeModLevels ||
      !this.props.runeModLevels.length ||
      !this.props.runeModDisplay ||
      !this.props.runeModDisplay[0]
    ) {
      return null;
    }

    // Start by grabbing the lowest count rune icon
    let icon = this.props.runeModDisplay[0].icon;
    // Loop through the runeModDisplay counts until we have the highest value icon based on the number of
    // runes we have collected so far.
    for (let i = 0; i < this.props.runeModDisplay.length; i++) {
      if (this.props.runeModDisplay[i].runeCount <= this.props.collectedRunes[RuneType.CharacterMod]) {
        icon = this.props.runeModDisplay[i].icon;
      } else {
        break;
      }
    }
    return icon;
  }

  private getLevelEarned(): number {
    let maxLevelReached = 0;
    this.props.runeModLevels.map((level) => {
      if (this.props.collectedRunes[RuneType.CharacterMod] >= level) {
        maxLevelReached++;
      }
    });
    return maxLevelReached;
  }
}

function mapStateToProps(state: RootState) {
  const { collectedRunes, maxRunesAllowed, runeModDisplay, runeModLevels } = state.runes;
  const { characterClassDefs } = state.game;
  const { selectedRuneMods } = state.profile;
  const { perksByID } = state.store;

  return {
    runeModDisplay,
    collectedRunes,
    maxRunesAllowed,
    runeModLevels,
    selectedRuneMods: selectedRuneMods,
    perksByID: perksByID,
    characterClassDefs,
    classNumericID: state.player?.classID
  };
}

export const RuneGauge = connect(mapStateToProps)(ARuneGauge);
