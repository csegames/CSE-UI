/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../../redux/store';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { GameDefsState } from '../../redux/gameDefsSlice';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import Escapable from '../Escapable';
import { hideModal, showModal } from '../../redux/modalsSlice';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralCancel,
  StringIDGeneralConfirmation,
  StringIDGeneralNotEnoughGold,
  StringIDGeneralReassign,
  StringIDGeneralReset
} from '../../helpers/stringTableHelpers';
import { StatDef } from '../../dataSources/manifest/statManifest';
import { PlayerEntityStateModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { getFactionData } from '../../gameData/factionData';
import { MoneyDisplay } from '../../../shared/components/MoneyDisplay';
import { FactionButton } from '../FactionButton';
import { CurrencyID, getCurrency } from '../../helpers/itemHelpers';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ProgressionTrackDelta } from '@csegames/library/dist/_baseGame/clientFunctions/ProgressionFunctions';
import { FactionNumberSelector } from '../FactionNumberSelector';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { TooltipSource } from '../TooltipSource';
import { StatLoadoutDef } from '../../dataSources/manifest/statLoadoutManifest';
import { ComingSoon } from '../ComingSoon';
import { FactionDivider } from '../FactionDivider';

// CSS classes
const Root = 'HUD-CharacterResetModal-Root';
const ResetAbilitiesSection = 'HUD-CharacterResetModal-ResetAbilitiesSection';
const ResetAttributesSection = 'HUD-CharacterResetModal-ResetAttributesSection';
const SectionIconContainer = 'HUD-CharacterResetModal-SectionIconContainer';
const SectionIcon = 'HUD-CharacterResetModal-SectionIcon';
const SectionTitle = 'HUD-CharacterResetModal-SectionTitle';
const SectionDescription = 'HUD-CharacterResetModal-SectionDescription';
const PointsHeader = 'HUD-CharacterResetModal-PointsHeader';
const PointsHeaderLabel = 'HUD-CharacterResetModal-PointsHeaderLabel';
const PointsResetButton = 'HUD-CharacterResetModal-PointsResetButton';
const SpecsRow = 'HUD-CharacterResetModal-SpecsRow';
const SpecDetails = 'HUD-CharacterResetModal-SpecDetails';
const SpecIconContainer = 'HUD-CharacterResetModal-SpecIconContainer';
const SpecIcon = 'HUD-CharacterResetModal-SpecIcon';
const SpecName = 'HUD-CharacterResetModal-SpecName';
const SpecPoints = 'HUD-CharacterResetModal-SpecPoints';
const LevelBorder = 'HUD-CharacterResetModal-LevelBorder';
const LevelLabel = 'HUD-CharacterResetModal-LevelLabel';
const RespecButton = 'HUD-CharacterResetModal-RespecButton';
const FeeBlock = 'HUD-CharacterResetModal-FeeBlock';
const FeeDivider = 'HUD-CharacterResetModal-FeeDivider';
const FeeRow = 'HUD-CharacterResetModal-FeeRow';
const FeeRowLabel = 'HUD-CharacterResetModal-FeeRowLabel';
const ConfirmationModalMoney = 'HUD-CharacterResetModal-ConfirmationModalMoney';
const StatsList = 'HUD-CharacterResetModal-StatsList';
const StatCell = 'HUD-CharacterResetModal-StatCell';
const StatSelector = 'HUD-CharacterResetModal-StatSelector';
const StatNameLabel = 'HUD-CharacterResetModal-StatNameLabel';
const TooltipContent = 'HUD-CharacterResetModal-TooltipContent';
const TooltipTitle = 'HUD-CharacterResetModal-TooltipTitle';
const TooltipMessage = 'HUD-CharacterResetModal-TooltipMessage';

// String IDs
const StringIDCharacterResetModalTitle = 'CharacterResetModalTitle';
const StringIDCharacterResetModalResetAbilitiesTitle = 'CharacterResetModalResetAbilitiesTitle';
const StringIDCharacterResetModalResetAbilitiesDescription = 'CharacterResetModalResetAbilitiesDescription';
const StringIDCharacterResetModalResetAttributesTitle = 'CharacterResetModalResetAttributesTitle';
const StringIDCharacterResetModalResetAttributesDescription = 'CharacterResetModalResetAttributesDescription';
const StringIDCharacterResetModalCurrentBuild = 'CharacterResetModalCurrentBuild';
const StringIDCharacterResetModalSpentPoints = 'CharacterResetModalSpentPoints';
const StringIDCharacterResetModalPointsAvailable = 'CharacterResetModalPointsAvailable';
const StringIDCharacterResetModalConfirmAbilityReset = 'CharacterResetModalConfirmAbilityReset';
const StringIDCharacterResetModalConfirmAttributeReset = 'CharacterResetModalConfirmAttributeReset';
const StringIDCharacterResetModalThisActionIsFinal = 'CharacterResetModalThisActionIsFinal';
const StringIDCharacterResetModalNoPointsAssigned = 'CharacterResetModalNoPointsAssigned';
const StringIDCharacterResetModalNoAttributeChanges = 'CharacterResetModalNoAttributeChanges';
const StringIDCharacterResetModalUnassignedAttributes = 'CharacterResetModalUnassignedAttributes';
const StringIDCharacterResetModalAbilityResetFeeLabel = 'CharacterResetModalAbilityResetFeeLabel';
const StringIDCharacterResetModalAttributeReassignFeeLabel = 'CharacterResetModalAttributeReassignFeeLabel';
const StringIDAbilityBookTrackLevel = 'AbilityBookTrackLevel';

interface State {
  pendingStats: Record<string, number>;
  availableStatPoints: number;
}

interface ReactProps {}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  defs: GameDefsState;
  self: PlayerEntityStateModel;
  uiFactionID: string;
  wallet: Item[];
  abilityProgressionRespecCostPerLevel: number;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class ACharacterResetModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // Get stats from existing character.
    let pendingStats: Record<string, number> = {};
    this.getEditableStats().forEach((def: StatDef) => {
      const value = props.self.stats[def.numericID]?.value ?? 0;
      pendingStats[def.id] = value;
    });

    this.state = {
      pendingStats,
      availableStatPoints: 0
    };
  }

  render(): React.ReactNode {
    return (
      <FactionBorder
        className={Root}
        type={BorderType.FancyHeader}
        background={BorderBackground.Leather}
        cornerButtons={[
          <FactionCornerButton type={CornerButtonType.Close} onClick={this.closeSelf.bind(this)} small />
        ]}
        titleText={getStringTableValue(StringIDCharacterResetModalTitle, this.props.stringTable)}
      >
        <Escapable escapeID={`CharacterResetModal`} onEscape={this.closeSelf.bind(this)} />
        {this.renderAbilitySection()}
        {this.renderAttributeSection()}
      </FactionBorder>
    );
  }

  private renderAbilitySection(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    const classDef = this.props.defs.classesByNumericID[this.props.self.classID];
    const archetypeTracks = classDef.progressionTracks.filter((ptID) => {
      const progressionTrack = this.props.defs.progressionTracks[ptID];
      return progressionTrack.tags.some((tag) => tag.startsWith('Asset.Class.'));
    });
    const specializationTracks = classDef.progressionTracks.filter((ptID) => {
      const progressionTrack = this.props.defs.progressionTracks[ptID];
      return progressionTrack.tags.some((tag) => tag.startsWith('Asset.Specialization.'));
    });

    const totalBuildPoints = this.props.self.progression[archetypeTracks[0]]?.level ?? 0;

    const assignedPoints: number = specializationTracks.reduce<number>((soFar: number, ptID: string) => {
      const progress = this.props.self.progression[ptID];
      const trackLevel = progress?.level ?? 0;
      return soFar + trackLevel;
    }, 0);
    const respecPrice = assignedPoints * this.props.abilityProgressionRespecCostPerLevel;

    const availableGold =
      getCurrency(CurrencyID.Gold, this.props.wallet, this.props.defs.itemsByNumericID)?.unitCount ?? 0;

    const canAfford = availableGold >= respecPrice;

    const isDisabled = !canAfford || respecPrice === 0;
    const disabledTooltip = getStringTableValue(
      canAfford ? StringIDCharacterResetModalNoPointsAssigned : StringIDGeneralNotEnoughGold,
      this.props.stringTable
    );

    return (
      <FactionBorder
        className={ResetAbilitiesSection}
        type={BorderType.Primary}
        background={BorderBackground.PatternLarge}
      >
        <FactionBorder
          className={SectionIconContainer}
          type={BorderType.Secondary}
          background={BorderBackground.Darken}
        >
          <img className={SectionIcon} src={factionData.hudnavIconAbilityBookImage} />
        </FactionBorder>
        <div className={SectionTitle}>
          {getStringTableValue(StringIDCharacterResetModalResetAbilitiesTitle, this.props.stringTable)}
        </div>
        <div className={SectionDescription}>
          {getStringTableValue(StringIDCharacterResetModalResetAbilitiesDescription, this.props.stringTable)}
        </div>
        <div className={PointsHeader}>
          <div className={PointsHeaderLabel}>
            {getTokenizedStringTableValue(StringIDCharacterResetModalCurrentBuild, this.props.stringTable, {
              POINTS: totalBuildPoints.toFixed(0)
            })}
          </div>
        </div>
        <div className={SpecsRow}>{specializationTracks.map(this.renderSpecDetails.bind(this))}</div>
        <div className={FeeBlock}>
          <FactionDivider simple className={FeeDivider} />
          <div className={FeeRow}>
            <div className={FeeRowLabel}>
              {getStringTableValue(StringIDCharacterResetModalAbilityResetFeeLabel, this.props.stringTable)}
            </div>
            <MoneyDisplay amount={respecPrice} />
          </div>
          <FactionDivider simple className={FeeDivider} />
        </div>
        <FactionButton
          className={RespecButton}
          size={'m'}
          onClick={this.onResetAbilitiesClicked.bind(this, respecPrice, specializationTracks)}
          disabled={isDisabled}
          disabledTooltip={disabledTooltip}
        >
          {getStringTableValue(StringIDGeneralReset, this.props.stringTable)}
        </FactionButton>
      </FactionBorder>
    );
  }

  private onResetAbilitiesClicked(respecPrice: number, specializationTrackIDs: string[]): void {
    this.props.dispatch(
      showModal({
        id: 'ConfirmResetAbilities',
        content: {
          title: getStringTableValue(StringIDGeneralConfirmation, this.props.stringTable),
          message:
            getStringTableValue(StringIDCharacterResetModalConfirmAbilityReset, this.props.stringTable) +
            '\n' +
            getStringTableValue(StringIDCharacterResetModalThisActionIsFinal, this.props.stringTable),
          body: <MoneyDisplay sizeOverrideVmin={3.5} className={ConfirmationModalMoney} amount={respecPrice} />,
          buttons: [
            {
              text: getStringTableValue(StringIDGeneralCancel, this.props.stringTable),
              onClick: () => this.props.dispatch(hideModal())
            },
            {
              text: getStringTableValue(StringIDGeneralReset, this.props.stringTable),
              onClick: () => {
                // The API applies deltas, and automatically charges for negative deltas.
                const deltas: ProgressionTrackDelta[] = specializationTrackIDs.map((ptID: string) => {
                  const progress = this.props.self.progression[ptID];
                  const trackLevel = progress?.level ?? 0;
                  return {
                    trackID: ptID,
                    delta: -trackLevel
                  };
                });
                clientAPI.applySpecAllocation(deltas);
                this.props.dispatch(hideModal());
              }
            }
          ]
        },
        escapable: true,
        maxWidth: '50vmin'
      })
    );
  }

  private renderSpecDetails(ptID: string): React.ReactNode {
    const trackDef = this.props.defs.progressionTracks[ptID];
    const progress = this.props.self.progression[ptID];
    const level = progress?.level ?? 0;
    const displayLevel = level + 1;

    return (
      <div className={SpecDetails} key={ptID}>
        <FactionBorder
          className={SpecIconContainer}
          type={BorderType.Secondary}
          background={BorderBackground.PatternSmall}
        >
          <img className={SpecIcon} src={trackDef.iconURL} />
        </FactionBorder>
        <FactionBorder
          className={LevelBorder}
          type={BorderType.Secondary}
          background={BorderBackground.PatternSmall}
          includeTop={false}
        >
          <div className={LevelLabel}>
            {getTokenizedStringTableValue(StringIDAbilityBookTrackLevel, this.props.stringTable, {
              LEVEL: displayLevel.toFixed()
            })}
          </div>
        </FactionBorder>
        <div className={SpecName}>{getStringTableValue(trackDef.nameKey, this.props.stringTable)}</div>
        <div className={SpecPoints}>
          {getTokenizedStringTableValue(StringIDCharacterResetModalSpentPoints, this.props.stringTable, {
            POINTS: level.toFixed(0)
          })}
        </div>
      </div>
    );
  }

  private renderAttributeSection(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    // Can't Reassign if no stats have been changed.
    const hasNoChanges = Object.values(this.props.self.stats).every((stat) => {
      const statID = this.props.defs.statsByNumericID[stat.id].id;
      return this.state.pendingStats[statID] === undefined || this.state.pendingStats[statID] === stat.value;
    });
    const isDisabled = hasNoChanges || this.state.availableStatPoints > 0;

    const disabledTooltip = getStringTableValue(
      hasNoChanges ? StringIDCharacterResetModalNoAttributeChanges : StringIDCharacterResetModalUnassignedAttributes,
      this.props.stringTable
    );

    // TODO: Where does this number come from?
    const respecPrice = 5000;

    return (
      <FactionBorder
        className={ResetAttributesSection}
        type={BorderType.Primary}
        background={BorderBackground.PatternLarge}
      >
        <FactionBorder
          className={SectionIconContainer}
          type={BorderType.Secondary}
          background={BorderBackground.Darken}
        >
          <img className={SectionIcon} src={factionData.hudnavIconEquippedImage} />
        </FactionBorder>
        <div className={SectionTitle}>
          {getStringTableValue(StringIDCharacterResetModalResetAttributesTitle, this.props.stringTable)}
        </div>
        <div className={SectionDescription}>
          {getStringTableValue(StringIDCharacterResetModalResetAttributesDescription, this.props.stringTable)}
        </div>
        <div className={PointsHeader}>
          <div className={PointsHeaderLabel}>
            {getTokenizedStringTableValue(StringIDCharacterResetModalPointsAvailable, this.props.stringTable, {
              POINTS: this.state.availableStatPoints.toFixed(0)
            })}
          </div>
          <div className={PointsResetButton} onClick={this.onResetAttributesClicked.bind(this)} />
        </div>
        <div className={StatsList}>{this.getEditableStats().map(this.renderStatCell.bind(this))}</div>
        <div className={FeeBlock}>
          <FactionDivider simple className={FeeDivider} />
          <div className={FeeRow}>
            <div className={FeeRowLabel}>
              {getStringTableValue(StringIDCharacterResetModalAttributeReassignFeeLabel, this.props.stringTable)}
            </div>
            <MoneyDisplay amount={respecPrice} />
          </div>
          <FactionDivider simple className={FeeDivider} />
        </div>
        <FactionButton
          className={RespecButton}
          size={'m'}
          onClick={this.onReassignAttributesClicked.bind(this, respecPrice)}
          disabled={isDisabled}
          disabledTooltip={disabledTooltip}
        >
          {getStringTableValue(StringIDGeneralReassign, this.props.stringTable)}
        </FactionButton>
        <ComingSoon />
      </FactionBorder>
    );
  }

  private onReassignAttributesClicked(respecPrice: number): void {
    this.props.dispatch(
      showModal({
        id: 'ConfirmReassignAttributes',
        content: {
          title: getStringTableValue(StringIDGeneralConfirmation, this.props.stringTable),
          message:
            getStringTableValue(StringIDCharacterResetModalConfirmAttributeReset, this.props.stringTable) +
            '\n' +
            getStringTableValue(StringIDCharacterResetModalThisActionIsFinal, this.props.stringTable),
          body: <MoneyDisplay sizeOverrideVmin={3.5} className={ConfirmationModalMoney} amount={respecPrice} />,
          buttons: [
            {
              text: getStringTableValue(StringIDGeneralCancel, this.props.stringTable),
              onClick: () => this.props.dispatch(hideModal())
            },
            {
              text: getStringTableValue(StringIDGeneralReassign, this.props.stringTable),
              onClick: () => {
                // TODO: We don't have an API for reassigning attributes yet.
                this.props.dispatch(hideModal());
              }
            }
          ]
        },
        escapable: true,
        maxWidth: '50vmin'
      })
    );
  }

  private onResetAttributesClicked(): void {
    const statLoadout = this.getFreeSelectionLoadout();
    if (!statLoadout) {
      return;
    }
    let pendingStats: Record<string, number> = {};
    statLoadout.stats.forEach((def) => {
      const bonus = this.getRacialBonusForStat(def.statID, this.props.self.race);
      pendingStats[def.statID] = def.min + bonus;
    });

    this.setState({ availableStatPoints: statLoadout.freePoints, pendingStats });
  }

  private closeSelf(): void {
    this.props.dispatch(hideModal());
  }

  private getEditableStats(): StatDef[] {
    return Object.values(this.props.defs.stats)
      .filter((stat) => stat.addPointsAtCharacterCreation)
      .sort((a, b) =>
        getStringTableValue(a.name, this.props.stringTable).localeCompare(
          getStringTableValue(b.name, this.props.stringTable)
        )
      );
  }

  private getRacialBonusForStat(statID: string, raceID: number): number {
    const raceDef = this.props.defs.racesByNumericID[raceID];
    return raceDef.baseStatOffsets[statID] ?? 0;
  }

  private renderStatCell(def: StatDef, index: number): React.ReactNode {
    const points = this.state.pendingStats[def.id] ?? 0;

    const statLoadout = this.getFreeSelectionLoadout();
    if (!statLoadout) {
      return null;
    }

    const stat = statLoadout.stats.find((s) => s.statID === def.id);
    const bonus = this.getRacialBonusForStat(def.id, this.props.self.race);
    const minValue = (stat?.min ?? 10) + bonus;
    const maxValue = (stat?.max ?? 50) + bonus;

    return (
      <div className={StatCell} key={index}>
        <FactionNumberSelector
          className={StatSelector}
          value={points}
          onValueChanged={(newValue) => {
            const diff = newValue - this.state.pendingStats[def.id];
            this.setState({
              pendingStats: { ...this.state.pendingStats, [def.id]: newValue },
              availableStatPoints: this.state.availableStatPoints - diff
            });
          }}
          minValue={minValue}
          maxValue={Math.min(maxValue, points + this.state.availableStatPoints)}
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

  private getFreeSelectionLoadout(): StatLoadoutDef {
    const classDef = this.props.defs.classesByNumericID[this.props.self.classID];

    const loadoutID = classDef.statLoadoutIDs.find((slID: string) => {
      const loadout = this.props.defs.statLoadouts[slID];
      return loadout.freePoints > 0;
    });

    return this.props.defs.statLoadouts[loadoutID!];
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    defs: state.gameDefs,
    self: state.entities.self,
    uiFactionID: state.hud.uiFactionID,
    wallet: state.inventory.wallet,
    abilityProgressionRespecCostPerLevel: state.gameDefs.settings.abilityProgressionRespecCostPerLevel
  };
};

export const CharacterResetModal = connect(mapStateToProps)(ACharacterResetModal);
