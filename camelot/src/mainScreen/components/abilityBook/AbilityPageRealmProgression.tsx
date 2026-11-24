/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import RVRPipFullTDDURL from '../../../images/abilitybook/rvr-pip-full-tdd.png';
import RVRPipFullVikingURL from '../../../images/abilitybook/rvr-pip-full-viking.png';
import RVRPipFullArthurianURL from '../../../images/abilitybook/rvr-pip-full-arthurian.png';

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../../redux/store';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralLevelShort
} from '../../helpers/stringTableHelpers';
import { AbilityWithActivation } from '../../redux/abilitiesSlice';
import { AbilityGroup } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { ProgressState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { AbilityBookHeader } from './AbilityBookHeader';
import { AbilityBookTrainingBar } from './AbilityBookTrainingBar';
import { GameDefsState } from '../../redux/gameDefsSlice';
import { ProgressionTrackDelta } from '@csegames/library/dist/_baseGame/clientFunctions/ProgressionFunctions';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import {
  ProgressionPoolDef,
  ProgressionPoolUnlockDef,
  ProgressionTierValueDef,
  ProgressionTrackDef
} from '../../dataSources/manifest/progressionTrackManifest';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { AbilityBookNameBanner } from './AbilityBookNameBanner';
import { FactionScrollArea } from '../FactionScrollArea';
import { getFactionData } from '../../gameData/factionData';
import { AbilityDisplayDef } from '../../dataSources/manifest/abilityDisplayManifest';
import { StatusDef } from '../../dataSources/manifest/statusManifest';
import { TooltipSource } from '../TooltipSource';
import { FactionDivider } from '../FactionDivider';
import { FormattedTextDiv } from '../../../shared/components/FormattedTextDiv';
import Draggable from '../Draggable';
import DraggableHandle, { DropHandlerDraggableData } from '../DraggableHandle';
import { DropTypeAbilityButton } from '../abilityBars/AbilityButtonShared';
import {
  findRealmProgressionTrack,
  getAbilityByDisplayDefID,
  getAvailableRealmProgressionPoints,
  getPoolUnlockTrackID,
  playStagedLevelChangeSound,
  StringIDAbilityBookRealmProgression
} from '../../helpers/abilityBookHelpers';
import { AbilityBarSlotDropTargetData } from '../abilityBars/AbilityBarSlot';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { Faction } from '@csegames/library/dist/camelotunchained/graphql/schema';

const STAGED_GLOW_DROP_SHADOW = '0 0 0.35vmin';

const RVRPipFullByFactionID: Record<string, string> = {
  [Faction.TDD]: RVRPipFullTDDURL,
  [Faction.Viking]: RVRPipFullVikingURL,
  [Faction.Arthurian]: RVRPipFullArthurianURL
};

// CSS classes
const Root = 'HUD-AbilityPageRealmProgression-Root';
const TracksRow = 'HUD-AbilityPageRealmProgression-TracksRow';
const TrackColumn = 'HUD-AbilityPageRealmProgression-TrackColumn';
const CategoryScrollArea = 'HUD-AbilityPageRealmProgression-CategoryScrollArea';
const CategoryContent = 'HUD-AbilityPageRealmProgression-CategoryContent';
const PoolContainer = 'HUD-AbilityPageRealmProgression-PoolContainer';
const PoolDivider = 'HUD-AbilityPageRealmProgression-PoolDivider';
const UnlockContainer = 'HUD-AbilityPageRealmProgression-UnlockContainer';
const UnlockIconContainer = 'HUD-AbilityPageRealmProgression-UnlockIconContainer';
const UnlockIcon = 'HUD-AbilityPageRealmProgression-UnlockIcon';
const UnlockDetails = 'HUD-AbilityPageRealmProgression-UnlockDetails';
const UnlockTitle = 'HUD-AbilityPageRealmProgression-UnlockTitle';
const UnlockPips = 'HUD-AbilityPageRealmProgression-UnlockPips';
const UnlockPipContainer = 'HUD-AbilityPageRealmProgression-UnlockPipContainer';
const UnlockPipBackground = 'HUD-AbilityPageRealmProgression-UnlockPipBackground';
const UnlockPipForeground = 'HUD-AbilityPageRealmProgression-UnlockPipForeground';
const UnlockPipCost = 'HUD-AbilityPageRealmProgression-UnlockPipCost';
const TooltipRoot = 'HUD-AbilityPageRealmProgression-TooltipRoot';
const TooltipPips = 'HUD-AbilityPageRealmProgression-TooltipPips';
const TooltipPipContainer = 'HUD-AbilityPageRealmProgression-TooltipPipContainer';
const TooltipPip = 'HUD-AbilityPageRealmProgression-TooltipPip';
const TooltipCategoryLabel = 'HUD-AbilityPageRealmProgression-TooltipCategoryLabel';
const TooltipNameLabel = 'HUD-AbilityPageRealmProgression-TooltipNameLabel';
const TooltipDescriptionLabel = 'HUD-AbilityPageRealmProgression-TooltipDescriptionLabel';
const TooltipValueContainer = 'HUD-AbilityPageRealmProgression-TooltipValueContainer';
const TooltipValueLabel = 'HUD-AbilityPageRealmProgression-TooltipValueLabel';
const AbilitiesListEntryDraggable = 'HUD-AbilityPageRealmProgression-AbilitiesListEntryDraggable';
const AbilitiesListEntryDraggableHandle = 'HUD-AbilityPageRealmProgression-AbilitiesListEntryDraggableHandle';
const AbilitiesListEntryIcon = 'HUD-AbilityPageRealmProgression-AbilitiesListEntryIcon';
const AbilitiesListEntryIconDraggable = 'HUD-AbilityPageRealmProgression-AbilitiesListEntryIconDraggable';

// String IDs
const StringIDAbilityBookAvailablePoints = 'AbilityBookAvailablePoints';
const StringIDAbilityBookRealmProgressionCategoryPrefix = 'AbilityBookRealmProgressionCategory_';

interface State {
  // Key: ProgressionState ids, value: pending change of level/pips.
  pendingChanges: Record<string, number>;
}

interface ReactProps {}

interface InjectedProps {
  uiFactionID: string;
  stringTable: Record<string, StringTableEntryDef>;
  defs: GameDefsState;
  realmTrack: ProgressionTrackDef | undefined;
  groups: Dictionary<AbilityGroup>;
  abilities: Record<number, AbilityWithActivation>;
  abilityIDsByDisplayDefID: Record<number, number>;
  progression: Record<string, ProgressState>;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AAbilityPageRealmProgression extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      pendingChanges: {}
    };
  }

  render(): React.ReactNode {
    const availablePoints = this.getAvailablePoints();

    return (
      <div className={Root}>
        <AbilityBookHeader title={getStringTableValue(StringIDAbilityBookRealmProgression, this.props.stringTable)} />
        <div className={TracksRow}>
          {this.props.realmTrack
            ? Object.entries(this.props.realmTrack.poolsByCategory).map(([id, pools]) =>
                this.renderCategoryColumn(id, pools, availablePoints)
              )
            : null}
        </div>
        <AbilityBookTrainingBar
          availableTemplate={getStringTableValue(StringIDAbilityBookAvailablePoints, this.props.stringTable)}
          availablePoints={availablePoints}
          stagedPoints={this.getStagedPointsTotal()}
          onReset={this.onResetClicked.bind(this)}
          onTrain={this.onTrainClicked.bind(this)}
        />
      </div>
    );
  }

  private renderCategoryColumn(
    categoryID: string,
    pools: ProgressionPoolDef[],
    availablePoints: number
  ): React.ReactNode {
    const displayLevel = this.getLevelForPools(pools);

    return (
      <FactionBorder
        key={categoryID}
        className={TrackColumn}
        type={BorderType.Primary}
        background={BorderBackground.PatternLarge}
      >
        <AbilityBookNameBanner
          name={getStringTableValue(
            `${StringIDAbilityBookRealmProgressionCategoryPrefix}${categoryID}`,
            this.props.stringTable
          )}
          details={getTokenizedStringTableValue(StringIDGeneralLevelShort, this.props.stringTable, {
            LEVEL: displayLevel.toFixed()
          })}
        />
        <FactionScrollArea
          className={CategoryScrollArea}
          contentClassName={CategoryContent}
          soundEventScrolled={SoundEvents.PLAY_UI_SFX_CC_SCROLL_SELECT}
        >
          {pools.map(this.renderCategoryPool.bind(this, categoryID, availablePoints))}
        </FactionScrollArea>
      </FactionBorder>
    );
  }

  private renderCategoryPool(
    categoryID: string,
    availablePoints: number,
    def: ProgressionPoolDef,
    index: number,
    allDefs: ProgressionPoolDef[]
  ): React.ReactNode {
    return (
      <div className={PoolContainer} key={index}>
        {index > 0 ? <div className={PoolDivider} /> : null}
        {def.unlocks.map(this.renderPoolUnlock.bind(this, categoryID, availablePoints))}
      </div>
    );
  }

  private renderPoolUnlock(
    categoryID: string,
    availablePoints: number,
    def: ProgressionPoolUnlockDef,
    index: number
  ): React.ReactNode {
    const statusDef = def.isStatus ? this.props.defs.statusesByStringID[def.unlockID] : undefined;
    const abilityDisplayDef = def.isStatus ? undefined : this.props.defs.abilityDisplayDefsByStringID[def.unlockID];
    const data = statusDef ?? abilityDisplayDef;
    if (!data) {
      return null;
    }

    const highestAffordableLevel = this.getHighestAffordableLevelForUnlock(def, availablePoints);

    return (
      <div className={UnlockContainer} key={index}>
        {statusDef
          ? this.renderStatusIcon(def, statusDef, categoryID)
          : this.renderAbilityIcon(def, abilityDisplayDef!, categoryID)}
        <div className={UnlockDetails}>
          <div className={UnlockTitle}>{data.name}</div>
          <div className={UnlockPips}>
            {def.costByTier.map(this.renderUnlockPip.bind(this, def, highestAffordableLevel))}
          </div>
        </div>
      </div>
    );
  }

  private renderAbilityIcon(
    unlockDef: ProgressionPoolUnlockDef,
    abilityDisplayDef: AbilityDisplayDef,
    categoryID: string
  ): React.ReactNode {
    const isPending = this.state.pendingChanges[unlockDef.unlockID] !== undefined;
    const isLocked = this.getUnlockLevel(unlockDef.unlockID) === 0;

    // If the ability is unlocked, this should return a valid ability record.
    const ability = getAbilityByDisplayDefID(
      abilityDisplayDef.numericID,
      this.props.abilities,
      this.props.abilityIDsByDisplayDefID
    );
    const draggableId = `AbilityBook${ability?.id}`;

    return (
      <TooltipSource
        tooltipID={unlockDef.unlockID}
        positionType={'source'}
        content={this.renderUnlockTooltip.bind(
          this,
          unlockDef,
          abilityDisplayDef.name,
          abilityDisplayDef.description,
          categoryID
        )}
      >
        <FactionBorder
          className={`${UnlockIconContainer}${isLocked ? ' locked' : ''}`}
          style={isPending ? this.getStagedGlowStyle(isLocked) : undefined}
          type={BorderType.Secondary}
        >
          {isLocked ? (
            <img className={UnlockIcon} src={abilityDisplayDef.iconURL} />
          ) : (
            <Draggable
              className={AbilitiesListEntryDraggable}
              draggableID={draggableId}
              draggingRender={() => <img className={AbilitiesListEntryIconDraggable} src={abilityDisplayDef.iconURL} />}
            >
              <DraggableHandle
                className={AbilitiesListEntryDraggableHandle}
                draggableID={draggableId}
                dropHandler={this.onAbilityDropped.bind(this)}
                dragStartHandler={this.onAbilityDragStarted.bind(this)}
                dropType={DropTypeAbilityButton}
              >
                <img className={AbilitiesListEntryIcon} src={abilityDisplayDef.iconURL} />
              </DraggableHandle>
            </Draggable>
          )}
        </FactionBorder>
      </TooltipSource>
    );
  }

  private onAbilityDropped(data: AbilityBarSlotDropTargetData, { currentDraggableID }: DropHandlerDraggableData): void {
    // Do nothing if we didn't drop onto an ability slot.
    if (!data) {
      clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_BAD_DROP);
      return;
    }

    const group = this.props.groups[data.groupID];

    // Not allowed to muck up system bars, and possibly some others.
    if (group.isSystem || !group.canReplace) {
      clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_BAD_DROP);
      return;
    }

    // Nothing else is in the way, so let's set the ability!
    const abilityId = +currentDraggableID.slice(11);
    clientAPI.setAbility(data.groupID, data.slotIndex, abilityId);
    clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_RELEASE);
  }

  private onAbilityDragStarted(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_SELECT);
  }

  private renderStatusIcon(
    unlockDef: ProgressionPoolUnlockDef,
    statusDef: StatusDef,
    categoryID: string
  ): React.ReactNode {
    const isPending = this.state.pendingChanges[unlockDef.unlockID] !== undefined;
    const isLocked = this.getUnlockLevel(unlockDef.unlockID) === 0;

    return (
      <TooltipSource
        tooltipID={unlockDef.unlockID}
        positionType={'source'}
        content={this.renderUnlockTooltip.bind(this, unlockDef, statusDef.name, statusDef.description, categoryID)}
      >
        <FactionBorder
          className={`${UnlockIconContainer}${isLocked ? ' locked' : ''}`}
          style={isPending ? this.getStagedGlowStyle(isLocked) : undefined}
          type={BorderType.Secondary}
        >
          <img className={UnlockIcon} src={statusDef.iconURL} />
        </FactionBorder>
      </TooltipSource>
    );
  }

  private renderUnlockTooltip(
    unlockDef: ProgressionPoolUnlockDef,
    name: string,
    description: string,
    categoryID: string
  ): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    const currentUnlockLevel = this.getUnlockLevel(unlockDef.unlockID);

    return (
      <div className={TooltipRoot}>
        <div className={TooltipPips}>
          {unlockDef.costByTier.map((cost, index) => {
            const pipLevel = index + 1;
            const isPipUnlocked = currentUnlockLevel >= pipLevel;
            return (
              <div className={TooltipPipContainer} key={index}>
                <img className={TooltipPip} src={factionData.unitFrameResourcePipBackground} />
                <img
                  className={UnlockPipForeground}
                  src={isPipUnlocked ? RVRPipFullByFactionID[this.props.uiFactionID] : undefined}
                />
              </div>
            );
          })}
        </div>
        <div className={TooltipCategoryLabel}>
          {getStringTableValue(
            `${StringIDAbilityBookRealmProgressionCategoryPrefix}${categoryID}`,
            this.props.stringTable
          )}
        </div>
        <div className={TooltipNameLabel}>{name}</div>
        <div className={TooltipDescriptionLabel}>{description}</div>
        <FactionDivider />
        {unlockDef.tierValues.map(this.renderTierValueRow.bind(this, currentUnlockLevel))}
        <FactionDivider />
      </div>
    );
  }

  private renderTierValueRow(
    currentUnlockLevel: number,
    valueDef: ProgressionTierValueDef,
    index: number
  ): React.ReactNode {
    const isNegative = (valueDef.values[0] ?? 0) < 0;
    const isUnlocked = currentUnlockLevel > 0;
    const UnlockedClassName = `${TooltipValueLabel}${isNegative ? ' negative' : ' positive'}`;
    const LockedClassName = `${TooltipValueLabel} locked`;
    const LockStatusClassName = isUnlocked ? UnlockedClassName : LockedClassName;
    const CurrentValueClassName = `${UnlockedClassName} current`;

    // Start with a +/- in the appropriate locked/unlocked color.
    let text = `<s3>${isNegative ? '-' : '+'}</s3>`;
    // An opening paren, always in the locked color.
    text += `<s1>(</s1>`;
    // For each tier, list the associated value.
    for (let i = 0; i < valueDef.values.length; ++i) {
      if (i > 0) {
        // If this is not the first value, precede it with a separator.
        text += '<s1> | </s1>';
      }
      const tag = currentUnlockLevel === i + 1 ? 's2' : 's1';
      const formattedValue = Number(Math.abs(valueDef.values[i]).toFixed(valueDef.decimals)).toString();
      text += `<${tag}>${formattedValue}</${tag}>`;
    }

    // After all the numbers, put a closing ), always in the locked color.
    text += `<s1>)</s1> `;
    // Finally, include the name of the value being modified.
    text += getStringTableValue(valueDef.descriptionKey, this.props.stringTable);

    return (
      <div className={TooltipValueContainer} key={index}>
        <FormattedTextDiv
          text={text}
          textClasses={[TooltipValueLabel, LockedClassName, CurrentValueClassName, LockStatusClassName]}
        />
      </div>
    );
  }

  private renderUnlockPip(
    def: ProgressionPoolUnlockDef,
    highestAffordableLevel: number,
    cost: number,
    index: number
  ): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    const currentUnlockLevel = this.getUnlockLevel(def.unlockID);
    const pipLevel = index + 1;
    const isPipUnlocked = currentUnlockLevel >= pipLevel;
    const isPending =
      pipLevel > currentUnlockLevel && pipLevel <= currentUnlockLevel + (this.state.pendingChanges[def.unlockID] ?? 0);
    const isLocked = currentUnlockLevel === 0;
    const isTooExpensive = !isPipUnlocked && pipLevel > highestAffordableLevel;

    return (
      <div
        className={`${UnlockPipContainer}${isTooExpensive ? ' tooExpensive' : ''}${isLocked ? ' locked' : ''}`}
        style={isPending ? this.getStagedGlowStyle(true) : undefined}
        onClick={this.onPipClicked.bind(this, def, index)}
      >
        <img className={UnlockPipBackground} src={factionData.unitFrameResourcePipBackground} />
        <div className={UnlockPipCost}>{cost}</div>
        <img
          className={UnlockPipForeground}
          src={isPending || isPipUnlocked ? RVRPipFullByFactionID[this.props.uiFactionID] : undefined}
        />
      </div>
    );
  }

  private getStagedGlowStyle(isGrayscale: boolean): React.CSSProperties {
    const factionData = getFactionData(this.props.uiFactionID);
    const glow = `drop-shadow(${STAGED_GLOW_DROP_SHADOW} ${factionData.selectionGlowColor})`;
    return { filter: isGrayscale ? `grayscale(1) ${glow}` : glow };
  }

  private onPipClicked(def: ProgressionPoolUnlockDef, index: number): void {
    const currentUnlockLevel = this.getUnlockLevel(def.unlockID);
    const pipLevel = index + 1;
    const pendingChanges = { ...this.state.pendingChanges };

    if (currentUnlockLevel >= pipLevel) {
      // If this pip is already committed, clear any pending pips for this unlock.
      delete pendingChanges[def.unlockID];
    } else {
      // Clicking a staged pip unstages it along with every staged pip above it.
      const stagedLevel = currentUnlockLevel + (pendingChanges[def.unlockID] ?? 0);
      const newLevel =
        pipLevel <= stagedLevel
          ? pipLevel - 1
          : Math.min(this.getHighestAffordableLevelForUnlock(def, this.getAvailablePoints()), pipLevel);
      const newDelta = newLevel - currentUnlockLevel;

      if (newDelta === 0) {
        delete pendingChanges[def.unlockID];
      } else {
        pendingChanges[def.unlockID] = newDelta;
      }
    }
    const stagedLevelChange = (pendingChanges[def.unlockID] ?? 0) - (this.state.pendingChanges[def.unlockID] ?? 0);
    playStagedLevelChangeSound(stagedLevelChange);
    this.setState({ pendingChanges });
  }

  private getHighestAffordableLevelForUnlock(def: ProgressionPoolUnlockDef, availablePoints: number): number {
    // This unlock's own staged points count as available, since restaging it would refund them first.
    let pointsLeft = availablePoints + this.getPointsPendingForUnlock(def);
    let level = this.getUnlockLevel(def.unlockID);
    while (level < def.costByTier.length && pointsLeft >= def.costByTier[level]) {
      pointsLeft -= def.costByTier[level];
      ++level;
    }
    return level;
  }

  private getPointsPendingForUnlock(def: ProgressionPoolUnlockDef): number {
    const currentTierIndex = this.getUnlockLevel(def.unlockID) - 1;
    const pendingTiers = this.state.pendingChanges[def.unlockID] ?? 0;
    let pointsPending = 0;
    for (let i = currentTierIndex + 1; i <= currentTierIndex + pendingTiers; ++i) {
      pointsPending += def.costByTier[i];
    }
    return pointsPending;
  }

  private getLevelForPools(pools: ProgressionPoolDef[]): number {
    return pools.reduce<number>((soFarPools: number, poolDef: ProgressionPoolDef) => {
      return (
        soFarPools +
        poolDef.unlocks.reduce<number>((soFarUnlocks: number, unlockDef: ProgressionPoolUnlockDef) => {
          return soFarUnlocks + this.getUnlockLevel(unlockDef.unlockID);
        }, 0)
      );
    }, 0);
  }

  private getStagedPointsTotal(): number {
    return Object.keys(this.state.pendingChanges).reduce<number>((soFar: number, unlockID: string) => {
      const def = this.findPoolUnlockDefForID(unlockID);
      return soFar + (def ? this.getPointsPendingForUnlock(def) : 0);
    }, 0);
  }

  private findPoolUnlockDefForID(unlockID: string): ProgressionPoolUnlockDef | undefined {
    // Have to dig through all pools looking for unlocks.  Very ugly and costly.
    const categories = Object.values(this.props.realmTrack?.poolsByCategory ?? {});
    for (let i = 0; i < categories.length; ++i) {
      const category = categories[i];
      for (let j = 0; j < category.length; ++j) {
        const progressionPoolDef = category[j];
        for (let k = 0; k < progressionPoolDef.unlocks.length; ++k) {
          const unlockDef = progressionPoolDef.unlocks[k];
          if (unlockDef.unlockID === unlockID) {
            return unlockDef;
          }
        }
      }
    }
  }

  private getAvailablePoints(): number {
    return (
      getAvailableRealmProgressionPoints(this.props.realmTrack, this.props.progression) - this.getStagedPointsTotal()
    );
  }

  private onTrainClicked(): void {
    // Send an API call to apply the changes.
    const deltas: ProgressionTrackDelta[] = Object.entries(this.state.pendingChanges)
      .filter(([, levels]) => levels > 0)
      .map(([unlockID, levels]) => ({ trackID: this.buildTrackID(unlockID), delta: levels }));
    clientAPI.playGameSound(SoundEvents.PLAY_UI_REALM_PROGRESSION_TRAIN);
    clientAPI.applySpecAllocation(deltas);
    // Update local state.
    this.setState({ pendingChanges: {} });
  }

  private onResetClicked(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_REALM_PROGRESSION_RESET);
    // If any pending changes, revert them.
    this.setState({ pendingChanges: {} });
  }

  private buildTrackID(unlockID: string): string {
    return getPoolUnlockTrackID(this.props.realmTrack?.id ?? '', unlockID);
  }

  private getUnlockLevel(unlockID: string): number {
    return this.props.progression[this.buildTrackID(unlockID)]?.level ?? 0;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  const { groups, abilities, abilityIDsByDisplayDefID } = state.abilities;
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    defs: state.gameDefs,
    realmTrack: findRealmProgressionTrack(
      state.gameDefs.classesByNumericID[state.entities.self.classID],
      state.gameDefs.progressionTracks
    ),
    groups,
    abilities,
    abilityIDsByDisplayDefID,
    uiFactionID: state.hud.uiFactionID,
    progression: state.entities.self.progression
  };
};

export const AbilityPageRealmProgression = connect(mapStateToProps)(AAbilityPageRealmProgression);
