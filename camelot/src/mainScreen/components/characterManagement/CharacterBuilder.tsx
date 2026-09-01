/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { AddDispatch, RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { ClassDef } from '../../dataSources/manifest/classManifest';
import { RaceDef } from '../../dataSources/manifest/raceManifest';
import { BodyTypeDef } from '../../dataSources/manifest/bodyTypeManifest';
import {
  CharacterCreationState,
  selectBodyType,
  selectClass,
  selectRace,
  selectStatLoadout,
  setAvailableStatPoints,
  setStatsPoints
} from '../../redux/charactersSlice';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralComingSoon,
  StringIDGeneralConfirm,
  StringIDGeneralWarning
} from '../../helpers/stringTableHelpers';
import {
  getSelectableBodyTypes,
  getSelectableClasses,
  getSelectableRaces
} from '../../helpers/characterManagementHelpers';
import { FactionBorderSelectable } from '../FactionBorderSelectable';
import { getRaceData } from '../../gameData/raceData';
import { FactionDivider } from '../FactionDivider';
import { StatDef } from '../../dataSources/manifest/statManifest';
import { FormattedTextDiv } from '../../../shared/components/FormattedTextDiv';
import { FactionNumberSelector } from '../FactionNumberSelector';
import { BorderBackground } from '../FactionBorder';
import TooltipSource from '../TooltipSource';
import { StatLoadoutDef } from '../../dataSources/manifest/statLoadoutManifest';
import { hideModal, showModal } from '../../redux/modalsSlice';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';

// String IDs
const StringIDCharacterManagementHeaderRace = 'CharacterManagementHeaderRace';
const StringIDCharacterManagementHeaderClass = 'CharacterManagementHeaderClass';
const StringIDCharacterManagementHeaderStats = 'CharacterManagementHeaderStats';
const StringIDCharacterManagementPointsAvailable = 'CharacterManagementPointsAvailable';
const StringIDCharacterManagementStatsInstructions = 'CharacterManagementStatsInstructions';
const StringIDCharacterManagementStatsWarningMessage = 'CharacterManagementStatsWarningMessage';

// CSS classes
const Root = 'HUD-CharacterBuilder-Root';
const SectionTitle = 'HUD-CharacterBuilder-SectionTitle';
const SectionDivider = 'HUD-CharacterBuilder-SectionDivider';
const SelectableRow = 'HUD-CharacterBuilder-SelectableRow';
const RaceButton = 'HUD-CharacterBuilder-RaceButton';
const BodyTypeButton = 'HUD-CharacterBuilder-BodyTypeButton';
const ClassButton = 'HUD-CharacterBuilder-ClassButton';
const SpecButton = 'HUD-CharacterBuilder-SpecButton';
const ButtonImage = 'HUD-CharacterBuilder-ButtonImage';
const BodyTypeButtonLabel = 'HUD-CharacterBuilder-BodyTypeButtonLabel';
const SpecButtonLabel = 'HUD-CharacterBuilder-SpecButtonLabel';
const RemainingStatPointsLabel = 'HUD-CharacterBuilder-RemainingStatPointsLabel';
const RemainingStatPointsValue = 'HUD-CharacterBuilder-RemainingStatPointsValue';
const StatsList = 'HUD-CharacterBuilder-StatsList';
const StatCell = 'HUD-CharacterBuilder-StatCell';
const StatSelector = 'HUD-CharacterBuilder-StatSelector';
const StatNameLabel = 'HUD-CharacterBuilder-StatNameLabel';
const StatsInstructionsLabel = 'HUD-CharacterBuilder-StatsInstructionsLabel';
const TooltipContent = 'HUD-CharacterBuilder-TooltipContent';
const TooltipTitle = 'HUD-CharacterBuilder-TooltipTitle';
const TooltipMessage = 'HUD-CharacterBuilder-TooltipMessage';
const TooltipComingSoon = 'HUD-CharacterBuilder-TooltipComingSoon';

interface ReactProps {}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  classesByStringID: Record<string, ClassDef>;
  racesByStringID: Record<string, RaceDef>;
  bodyTypesByStringID: Record<string, BodyTypeDef>;
  characterCreationState: CharacterCreationState;
  stats: Record<string, StatDef>;
  startingAttributePoints: number;
  statLoadouts: Record<string, StatLoadoutDef>;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class ACharacterBuilder extends React.Component<Props> {
  render(): React.ReactNode {
    if (!this.props.characterCreationState || this.props.startingAttributePoints === undefined) {
      return null;
    }

    const { factionID, classID, availableStatPoints } = this.props.characterCreationState;

    const selectableRaces = getSelectableRaces(factionID, this.props.racesByStringID);
    const selectableBodyTypes = getSelectableBodyTypes(this.props.bodyTypesByStringID);
    const selectableClasses = getSelectableClasses(factionID, this.props.classesByStringID);
    const middleClassIndex = Math.ceil(selectableClasses.length / 2);
    const topClasses = selectableClasses.slice(0, middleClassIndex);
    const bottomClasses = selectableClasses.slice(middleClassIndex);

    const selectableSpecIDs: string[] = this.props.classesByStringID[classID]?.statLoadoutIDs ?? [];

    const statLoadout = this.props.statLoadouts[this.props.characterCreationState.statLoadoutID];

    return (
      <div className={Root}>
        <div className={SectionTitle}>
          {getStringTableValue(StringIDCharacterManagementHeaderRace, this.props.stringTable)}
        </div>
        <div className={SelectableRow}>{selectableRaces.map(this.renderRaceButton.bind(this))}</div>
        <div className={SelectableRow}>{selectableBodyTypes.map(this.renderBodyTypeButton.bind(this))}</div>
        <FactionDivider className={SectionDivider} />
        <div className={SectionTitle}>
          {getStringTableValue(StringIDCharacterManagementHeaderClass, this.props.stringTable)}
        </div>
        <div className={SelectableRow}>{topClasses.map(this.renderClassButton.bind(this))}</div>
        <div className={SelectableRow}>{bottomClasses.map(this.renderClassButton.bind(this))}</div>
        {classID && ( // Only show spec selectors after a class is selected.
          <>
            <FactionDivider className={SectionDivider} />
            <div className={SectionTitle}>
              {getStringTableValue(StringIDCharacterManagementHeaderStats, this.props.stringTable)}
            </div>
            <div className={SelectableRow}>{selectableSpecIDs.map(this.renderSpecButton.bind(this))}</div>
            <FormattedTextDiv
              text={getTokenizedStringTableValue(StringIDCharacterManagementPointsAvailable, this.props.stringTable, {
                POINTS: String(availableStatPoints)
              })}
              className={`${RemainingStatPointsLabel}${availableStatPoints === 0 ? ' empty' : ''}`}
              textClasses={[`${RemainingStatPointsValue}${availableStatPoints === 0 ? ' empty' : ''}`]}
              nodes={[]}
            />
            <div className={StatsList}>{this.getEditableStats().map(this.renderStatCell.bind(this))}</div>
            {statLoadout?.freePoints ?? 0 > 0 ? (
              <div className={StatsInstructionsLabel}>
                {getStringTableValue(StringIDCharacterManagementStatsInstructions, this.props.stringTable)}
              </div>
            ) : null}
          </>
        )}
      </div>
    );
  }

  private getEditableStats(): StatDef[] {
    return Object.values(this.props.stats)
      .filter((stat) => stat.addPointsAtCharacterCreation)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private getRacialBonusForStat(statID: string, raceID: string): number {
    const raceDef = this.props.racesByStringID[raceID];
    return raceDef.baseStatOffsets[statID] ?? 0;
  }

  private renderStatCell(def: StatDef, index: number): React.ReactNode {
    const points = this.props.characterCreationState.statsPoints[def.id] ?? 0;

    const statLoadout = this.props.statLoadouts[this.props.characterCreationState.statLoadoutID];
    if (!statLoadout) {
      return null;
    }

    const stat = statLoadout.stats.find((s) => s.statID === def.id);
    const bonus = this.getRacialBonusForStat(def.id, this.props.characterCreationState.raceID);
    const minValue = (stat?.min ?? 10) + bonus;
    const maxValue = (stat?.max ?? 50) + bonus;

    return (
      <div className={StatCell} key={index}>
        <FactionNumberSelector
          className={StatSelector}
          value={points}
          onValueChanged={(newValue) => {
            const diff = newValue - this.props.characterCreationState.statsPoints[def.id];
            this.props.dispatch(setStatsPoints({ [def.id]: newValue }));
            this.props.dispatch(setAvailableStatPoints(this.props.characterCreationState.availableStatPoints - diff));
          }}
          minValue={minValue}
          maxValue={Math.min(maxValue, points + this.props.characterCreationState.availableStatPoints)}
          soundEventPlusClicked={SoundEvents.PLAY_UI_SFX_CC_CHOOSE_POINTS_RIGHT}
          soundEventPlusShiftClicked={SoundEvents.PLAY_UI_SFX_CC_CHOOSE_POINTS_SHIFT_RIGHT}
          soundEventMinusClicked={SoundEvents.PLAY_UI_SFX_CC_CHOOSE_POINTS_LEFT}
          soundEventMinusShiftClicked={SoundEvents.PLAY_UI_SFX_CC_CHOOSE_POINTS_SHIFT_LEFT}
        />
        <TooltipSource
          className={StatNameLabel}
          tooltipID={`Stat${def.id}`}
          maxWidth='30vmin'
          content={() => {
            return (
              <div className={TooltipContent}>
                <div className={TooltipTitle}>{getStringTableValue(def.name, this.props.stringTable)}</div>
                <div className={TooltipMessage}>{getStringTableValue(def.description, this.props.stringTable)}</div>
              </div>
            );
          }}
          positionType='mouse'
        >
          {getStringTableValue(def.name, this.props.stringTable)}
        </TooltipSource>
      </div>
    );
  }

  private renderRaceButton(def: RaceDef): React.ReactNode {
    const raceData = getRaceData(def.id);

    return (
      <TooltipSource
        key={`Race${def.id}`}
        tooltipID={`Race${def.id}`}
        maxWidth='30vmin'
        content={this.renderRaceTooltip.bind(this, def)}
        positionType='mouse'
      >
        <FactionBorderSelectable
          className={RaceButton}
          isSelected={def.id === this.props.characterCreationState.raceID}
          onSelected={() => {
            clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_CHOOSE_RACE);
            this.props.dispatch(selectRace(def.id));
            // If stats are displayed, we'll need to update those as well to account for racial bonus changes.
            if (this.props.characterCreationState.classID) {
              this.applyStatLoadout(this.props.statLoadouts[this.props.characterCreationState.statLoadoutID], def.id);
            }
          }}
        >
          <img
            className={ButtonImage}
            src={
              raceData?.portraits?.find((p) => p.bodyTypeID === this.props.characterCreationState.bodyTypeID)?.image ??
              '/images/MissingAsset.png'
            }
          />
        </FactionBorderSelectable>
      </TooltipSource>
    );
  }

  private renderRaceTooltip(def: RaceDef): React.ReactNode {
    return (
      <div className={TooltipContent}>
        <div className={TooltipTitle}>{getStringTableValue(def.name, this.props.stringTable)}</div>
        {Object.entries(def.baseStatOffsets).map(([statID, value], i) => (
          <div className={TooltipMessage} key={i}>{` +${value} ${getStringTableValue(
            this.props.stats[statID].name,
            this.props.stringTable
          )}`}</div>
        ))}
      </div>
    );
  }

  private renderBodyTypeButton(def: BodyTypeDef, index: number): React.ReactNode {
    return (
      <FactionBorderSelectable
        key={`BodyType${def.id}`}
        background={BorderBackground.PatternSmall}
        className={BodyTypeButton}
        isSelected={def.id === this.props.characterCreationState.bodyTypeID}
        onSelected={() => {
          clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_CHOOSE_GENDER);
          this.props.dispatch(selectBodyType(def.id));
        }}
      >
        <div className={BodyTypeButtonLabel}>{index + 1}</div>
      </FactionBorderSelectable>
    );
  }

  private renderClassButton(def: ClassDef): React.ReactNode {
    // When we want to show a class as "coming soon", we can put their IDs in a list like this.
    const isDisabled = ['Spectre', 'Wisp', 'Arisen'].includes(def.id);

    //const isDisabled = false;

    return (
      <TooltipSource
        key={`Class${def.id}`}
        tooltipID={`Class${def.id}`}
        maxWidth='30vmin'
        content={() => (
          <div className={TooltipContent}>
            <div className={TooltipTitle}>{getStringTableValue(def.name, this.props.stringTable)}</div>
            {isDisabled && (
              <div className={TooltipComingSoon}>
                {getStringTableValue(StringIDGeneralComingSoon, this.props.stringTable)}
              </div>
            )}
          </div>
        )}
        positionType='mouse'
      >
        <FactionBorderSelectable
          key={`Class${def.id}`}
          className={ClassButton}
          isSelected={def.id === this.props.characterCreationState.classID}
          onSelected={() => {
            clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_CHOOSE_CLASS);
            this.props.dispatch(selectClass(def.id));
            this.applyStatLoadout(
              this.props.statLoadouts[def.statLoadoutIDs[0]],
              this.props.characterCreationState.raceID
            );
          }}
          isDisabled={isDisabled}
        >
          <img className={ButtonImage} src={def.unitFrameIconImage} />
        </FactionBorderSelectable>
      </TooltipSource>
    );
  }

  private applyStatLoadout(def: StatLoadoutDef, raceID: string): void {
    // Spec is just a temporary container of stat values, so we have to load them in now.
    let points: Record<string, number> = {};
    def.stats.forEach(({ statID, min }) => {
      const bonus = this.getRacialBonusForStat(statID, raceID);
      points[statID] = min + bonus;
    });
    this.props.dispatch(selectStatLoadout(def.id));
    this.props.dispatch(setStatsPoints(points));
    this.props.dispatch(setAvailableStatPoints(def.freePoints));
  }

  private renderSpecButton(statLoadoutID: string): React.ReactNode {
    const def = this.props.statLoadouts[statLoadoutID];

    return (
      <FactionBorderSelectable
        key={`Spec${def.id}`}
        className={SpecButton}
        background={BorderBackground.PatternSmall}
        isSelected={def.id === this.props.characterCreationState.statLoadoutID}
        onSelected={() => {
          clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_CHOOSE_STATS);
          this.applyStatLoadout(def, this.props.characterCreationState.raceID);
          if (def.freePoints > 0) {
            this.props.dispatch(
              showModal({
                id: 'CustomStatsWarning',
                content: {
                  title: getStringTableValue(StringIDGeneralWarning, this.props.stringTable),
                  message: getStringTableValue(StringIDCharacterManagementStatsWarningMessage, this.props.stringTable),
                  buttons: [
                    {
                      text: getStringTableValue(StringIDGeneralConfirm, this.props.stringTable),
                      onClick: () => this.props.dispatch(hideModal())
                    }
                  ]
                },
                maxWidth: '52vmin'
              })
            );
          }
        }}
      >
        <div className={SpecButtonLabel}>{getStringTableValue(def.name, this.props.stringTable)}</div>
      </FactionBorderSelectable>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    classesByStringID: state.gameDefs.classesByStringID,
    racesByStringID: state.gameDefs.racesByStringID,
    bodyTypesByStringID: state.gameDefs.bodyTypesByStringID,
    characterCreationState: state.characters.characterCreationState,
    stats: state.gameDefs.stats,
    startingAttributePoints: state.gameDefs.settings?.startingAttributePoints,
    statLoadouts: state.gameDefs.statLoadouts
  };
};

export const CharacterBuilder = connect(mapStateToProps)(ACharacterBuilder);
